const express = require("express");
const router = express.Router();

const {
  registerSchema,
  sendOtpSchema,
  verifyOtpSchema,
} = require("../utils/validators");
const { validateRequest } = require("../middlewares/validateRequest");
const authController = require("../controllers/authController");

// POST /api/auth/register
router.post(
  "/register",
  validateRequest(registerSchema),
  authController.registerUser,
);

// GET /api/auth/check-email?email=...
router.get("/check-email", authController.checkEmailAvailability);

// POST /api/auth/send-otp
router.post(
  "/send-otp",
  validateRequest(sendOtpSchema),
  authController.sendVerificationOtp,
);

// POST /api/auth/verify-otp
router.post(
  "/verify-otp",
  validateRequest(verifyOtpSchema),
  authController.verifyOTPfxn,
);

module.exports = router;
