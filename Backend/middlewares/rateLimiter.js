/**
 * @file rateLimiters.js
 * @description Centralized express-rate-limit configurations for brute-force-sensitive
 *              endpoints (login, OTP issuance/verification, password reset) plus a
 *              general baseline limiter for the rest of the API.
 * @architecture Addresses SEC-003 from the pre-deployment audit: no rate limiting existed
 *               on auth/login/otp/forgot-password, exposing the API to credential
 *               stuffing and OTP brute-forcing.
 */

const rateLimit = require("express-rate-limit");

const isTest = process.env.NODE_ENV === "test";

const jsonHandler = (req, res, _next, options) => {
  res.status(options.statusCode).json({
    success: false,
    message: options.message,
  });
};

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isTest ? 0 : 300, // 0 disables the limiter under tests
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again later.",
  handler: jsonHandler,
  skip: () => isTest,
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isTest ? 0 : 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many login attempts. Please try again in 15 minutes.",
  handler: jsonHandler,
  skip: () => isTest,
});

const otpRequestLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isTest ? 0 : 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many OTP requests. Please try again in 15 minutes.",
  handler: jsonHandler,
  skip: () => isTest,
});

const otpVerifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: isTest ? 0 : 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many attempts. Please try again in 15 minutes.",
  handler: jsonHandler,
  skip: () => isTest,
});

module.exports = {
  apiLimiter,
  loginLimiter,
  otpRequestLimiter,
  otpVerifyLimiter,
};
