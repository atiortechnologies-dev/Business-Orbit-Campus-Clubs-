/**
 * @file uploadService.js
 * @description Configures Multer for handling file uploads (PDF, PPT, DOCX, Images).
 * 
 * ============================================================================
 * 🔄 FUTURE REFACTORING GUIDE (SWITCHING TO CLOUD STORAGE)
 * ============================================================================
 * Currently, files are stored locally in the `assets/uploads` directory.
 * When the app moves to production, you should switch to an external provider 
 * (like AWS S3, Cloudinary, or Google Cloud Storage) to ensure scalability.
 * 
 * To switch to AWS S3:
 * 1. npm install multer-s3 @aws-sdk/client-s3
 * 2. Replace `multer.diskStorage` below with `multerS3({ s3, bucket, ... })`
 * 3. Update the controller to read `req.file.location` instead of `req.file.path`.
 * ============================================================================

 * @architecture Utility layer providing middleware for multipart/form-data parsing and file storage. */

const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure local upload directory exists
const uploadDir = path.join(__dirname, "../../assets/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure local disk storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname),
    );
  },
});

// File filter to restrict allowed types (Images, PDF, PPT, DOCX)
const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/gif",
    "application/pdf",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only JPG, PNG, GIF, PDF, PPT, and DOCX are allowed.",
      ),
      false,
    );
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB max file size
});

module.exports = upload;
