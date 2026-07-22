const express = require("express");
const router = express.Router();

const {
  registerSchema,
  sendOtpSchema,
  verifyOtpSchema,
  loginSchema,
  refreshTokenSchema,
} = require("../utils/validators");
const { validateRequest } = require("../middlewares/validateRequest");
const authController = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");

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

// POST /api/auth/login
router.post("/login", validateRequest(loginSchema), authController.loginUser);

// POST /api/auth/refresh-token
router.post(
  "/refresh-token",
  validateRequest(refreshTokenSchema),
  authController.refreshAccessToken,
);

// GET /api/auth/me
router.get("/me", protect, authController.getMe);

module.exports = router;
