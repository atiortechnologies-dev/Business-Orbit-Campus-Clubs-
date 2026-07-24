/**
 * @file authMiddleware.js
 * @description The core authentication and authorization middleware layer.
 * @architecture Intercepts requests to verify JWT access tokens, injects user context, enforces role-based access, and handles refresh tokens.
 */

const { verifyToken, verifyRefreshToken } = require("../utils/token");
const User = require("../models/User");
const asyncHandler = require("./asyncHandler");

/**
 * @desc    Middleware to verify JWT and inject user context into request
 */
const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, no token provided" });
  }

  const token = authHeader.split(" ")[1];

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
      message: "Not authorized, user no longer exists",
    });
  }

  req.user = {
    id: user._id.toString(),
    role: user.role,
    email: user.email,
    full_name: user.full_name,
    account_status: user.account_status,
    email_verified: user.email_verified,
  };
  next();
});

/**
 * @desc    Middleware factory to enforce role-based access restrictions
 * @param   {string} role - The allowed user role (e.g., 'student', 'admin')
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
 * @desc    Middleware to validate a refresh token and inject basic user context
 */
const verifyRefreshTokenMiddleware = asyncHandler(async (req, res, next) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res
      .status(400)
      .json({ success: false, message: "Refresh token is required" });
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

  req.user = {
    id: user._id.toString(),
    role: user.role,
    email: user.email,
  };
  next();
});

module.exports = {
  protect,
  requireRole,
  verifyRefreshTokenMiddleware,
};
