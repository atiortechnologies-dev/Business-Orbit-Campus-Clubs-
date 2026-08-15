const cloudinary = require("cloudinary").v2;
const asyncHandler = require("../middlewares/asyncHandler");

// Configure Cloudinary SDK from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * @desc    Generate Cloudinary Pre-signed Upload Signature
 * @route   POST /api/uploads/cloudinary-signature
 * @access  Private
 */
const getCloudinarySignature = asyncHandler(async (req, res) => {
  const { folder = "profile_photos" } = req.body;
  const timestamp = Math.round(new Date().getTime() / 1000);

  const paramsToSign = {
    timestamp,
    folder,
  };

  const signature = cloudinary.utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET,
  );

  return res.status(200).json({
    success: true,
    data: {
      signature,
      timestamp,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      folder,
    },
  });
});

module.exports = { getCloudinarySignature };
