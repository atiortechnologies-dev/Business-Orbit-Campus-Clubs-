const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { getCloudinarySignature } = require("../models/upload.controller");

router.post("/cloudinary-signature", protect, getCloudinarySignature);

module.exports = router;
