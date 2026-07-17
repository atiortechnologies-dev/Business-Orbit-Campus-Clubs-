/**
 * Goal: Defines authentication and user management endpoints.
 * Architecture relevance: Acts as the routing layer for auth requests (register, login, etc.).
 * Maps HTTP requests to the corresponding controller functions and applies validation middlewares.
 */
const router = require("express").Router();
const {
  register,
  checkEmail,
  sendOtp,
  login,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth.controller");
const { validateRequest } = require("../middlewares/validateRequest");
const { 
  registerSchema, 
  checkEmailSchema, 
  sendOtpSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema
} = require("../utils/validators");

// @route   POST /api/auth/register
// @desc    Register a new user
router.post("/register", validateRequest(registerSchema, "body"), register);

// @route   GET /api/auth/check-email
// @desc    Check if email is available
router.get("/check-email", validateRequest(checkEmailSchema, "query"), checkEmail);

// @route   POST /api/auth/send-otp
// @desc    Send verification OTP
router.post("/send-otp", validateRequest(sendOtpSchema, "body"), sendOtp);

// @route   POST /api/auth/login
// @desc    Authenticate user and get token
router.post("/login", validateRequest(loginSchema, "body"), login);

// @route   POST /api/auth/forgot-password
// @desc    Request password reset
router.post("/forgot-password", validateRequest(forgotPasswordSchema, "body"), forgotPassword);

// @route   POST /api/auth/reset-password
// @desc    Reset password
router.post("/reset-password", validateRequest(resetPasswordSchema, "body"), resetPassword);

module.exports = router;
