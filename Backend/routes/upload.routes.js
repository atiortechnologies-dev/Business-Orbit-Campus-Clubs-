const express = require("express");
const router = express.Router();
const { requireAuth } = require("../middlewares/authMiddleware");
const { getCloudinarySignature } = require("../controllers/upload.controller");

router.post("/cloudinary-signature", requireAuth, getCloudinarySignature);

module.exports = router;
