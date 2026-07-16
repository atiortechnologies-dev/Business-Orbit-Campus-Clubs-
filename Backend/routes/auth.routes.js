/**
 * Goal: Defines authentication and user management endpoints.
 * Architecture relevance: Acts as the routing layer for auth requests (register, login, etc.).
 * It maps HTTP requests to the corresponding controller functions and applies validation middlewares.
 */
const router = require("express").Router();
const {
  register,
  checkEmail,
  sendOtp,
} = require("../controllers/auth.controller");
const {
  validateRegister,
  validateCheckEmail,
  validateSendOtp,
} = require("../middleware/validate.middleware");

// @route   POST /api/auth/register
// @desc    Register a new user
router.post("/register", validateRegister, register);

// @route   GET /api/auth/check-email
// @desc    Check if email is available
router.get("/check-email", validateCheckEmail, checkEmail);

// @route   POST /api/auth/send-otp
// @desc    Send verification OTP
router.post("/send-otp", validateSendOtp, sendOtp);

module.exports = router;
