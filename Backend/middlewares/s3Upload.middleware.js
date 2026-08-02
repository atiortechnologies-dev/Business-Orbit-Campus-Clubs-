/**
 * @file s3Upload.middleware.js
 * @description Middleware for handling image uploads using multer.
 * @architecture Integrates with AWS S3 in production or local disk in development to store uploaded images.
 */
const multer = require("multer");
const multerS3 = require("multer-s3");
const { S3Client } = require("@aws-sdk/client-s3");
const path = require("path");
const fs = require("fs");

let s3Client;
if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  s3Client = new S3Client({
    region: process.env.AWS_REGION || "us-east-1",
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });
}

// Fallback upload dir if S3 is not configured
const uploadDir = path.join(__dirname, "../../assets/uploads");
if (!s3Client && !fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/**
 * @desc    Multer middleware instance configured for image uploads
 * @route   N/A
 * @access  Internal
 */
const s3ImageUpload = multer({
  storage: s3Client
    ? multerS3({
        s3: s3Client,
        bucket: process.env.AWS_S3_BUCKET || "default-bucket",
        acl: "public-read",
        contentType: multerS3.AUTO_CONTENT_TYPE,
        key: function (req, file, cb) {
          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
          cb(
            null,
            "images/" +
              file.fieldname +
              "-" +
              uniqueSuffix +
              path.extname(file.originalname),
          );
        },
      })
    : multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, uploadDir);
        },
        filename: function (req, file, cb) {
          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
          cb(
            null,
            file.fieldname +
              "-" +
              uniqueSuffix +
              path.extname(file.originalname),
          );
        },
      }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max file size
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only images (JPG, PNG, GIF, WEBP) are allowed.",
        ),
        false,
      );
    }
  },
});

module.exports = s3ImageUpload;
