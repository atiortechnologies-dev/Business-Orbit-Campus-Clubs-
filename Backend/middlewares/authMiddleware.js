/**
 * @file authMiddleware.js
 * @description Single source of truth for authentication and role authorization.
 */

const User = require("../models/User");
const { verifyToken, verifyRefreshToken } = require("../utils/token");
const asyncHandler = require("./asyncHandler");

/**
 * Standard user shape attached to req.user across the entire backend
 */
const formatUserContext = (user) => ({
  _id: user._id,
  id: user._id.toString(),
  role: user.role,
  email: user.email,
  full_name: user.full_name,
  account_status: user.account_status,
  email_verified: user.email_verified,
});

/**
 * Core authentication middleware
 */
const requireAuth = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.accessToken;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, no token provided",
    });
  }

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Not authorized, invalid or expired token",
      error: err.message,
    });
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "The user belonging to this token no longer exists.",
    });
  }

  req.user = formatUserContext(user);
  next();
});

/**
 * Role-based authorization middleware (single role check)
 */
const requireRole = (role) => (req, res, next) => {
  if (!req.user || req.user.role !== role) {
    return res.status(403).json({
      success: false,
      message: `This endpoint is only available to ${role} accounts`,
    });
  }
  next();
};

/**
 * Account active status check
 */
const requireActiveAccount = (req, res, next) => {
  if (req.user?.account_status !== "active") {
    return res.status(403).json({
      success: false,
      message: "Your account is pending approval or inactive. Access denied.",
    });
  }
  next();
};

/**
 * Refresh token validation middleware
 */
const verifyRefreshTokenMiddleware = asyncHandler(async (req, res, next) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: "Refresh token is required",
    });
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token",
      error: err.message,
    });
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "User not found",
    });
  }

  req.user = formatUserContext(user);
  next();
});

module.exports = {
  requireAuth, // Backwards-compatible alias for requireAuth
  requireRole,
  requireActiveAccount,
  verifyRefreshTokenMiddleware,
};
