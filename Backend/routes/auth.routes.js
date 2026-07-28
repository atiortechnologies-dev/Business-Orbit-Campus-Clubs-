/**
 * @file auth.routes.js
 * @description Defines the core authentication API routes (register, login, OTP handling, password reset, token refresh).
 * @architecture Leverages the validateRequest middleware to validate incoming request bodies/queries against Joi schemas.
 */

const router = require("express").Router();
const {
  register,
  checkEmail,
  sendOtp,
  verifyOtp,
  login,
  forgotPassword,
  resetPassword,
  refreshAccessToken,
  getMe,
  getAllChapters,
} = require("../controllers/auth.controller");
const { validateRequest } = require("../middlewares/validateRequest");
const { protect } = require("../middlewares/authMiddleware");
const {
  registerSchema,
  checkEmailSchema,
  sendOtpSchema,
  verifyOtpSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  refreshTokenSchema,
} = require("../utils/validators");

router.get("/get-all-chapter", getAllChapters);

// POST /api/auth/register
router.post("/register", validateRequest(registerSchema, "body"), register);

// GET /api/auth/check-email?email=...
router.get(
  "/check-email",
  validateRequest(checkEmailSchema, "query"),
  checkEmail,
);

// POST /api/auth/send-otp
router.post("/send-otp", validateRequest(sendOtpSchema, "body"), sendOtp);

// POST /api/auth/verify-otp
router.post("/verify-otp", validateRequest(verifyOtpSchema, "body"), verifyOtp);

// POST /api/auth/login
router.post("/login", validateRequest(loginSchema, "body"), login);

// POST /api/auth/forgot-password
router.post(
  "/forgot-password",
  validateRequest(forgotPasswordSchema, "body"),
  forgotPassword,
);

// POST /api/auth/reset-password
router.post(
  "/reset-password",
  validateRequest(resetPasswordSchema, "body"),
  resetPassword,
);

// POST /api/auth/refresh-token
router.post(
  "/refresh-token",
  validateRequest(refreshTokenSchema, "body"),
  refreshAccessToken,
);

// GET /api/auth/me
router.get("/me", protect, getMe);

/**
 * @module authRouter
 * @description Express router for authentication endpoints.
 */
module.exports = router;
