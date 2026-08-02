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
  // Access token now arrives as an httpOnly cookie (set by login/register/
  // verify-otp/refresh-token) instead of an Authorization header + localStorage.
  const token = req.cookies?.accessToken;

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, no token provided" });
  }

  let decoded;
  try {
    decoded = verifyToken(token);
  } catch (err) {
    console.log("401 Unauthorized from protect.");
    return res.status(401).json({
      success: false,
      message: "Not authorized, invalid or expired token",
      error: err.message,
    });
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    console.log("401 Unauthorized from protect.");
    return res.status(401).json({
      success: false,
      message: "Not authorized, user no longer exists",
    });
  }

  // Check if token version is valid (guards against revoked sessions)
  if (decoded.token_version !== user.token_version) {
    console.log("401 Unauthorized: Token version mismatch in protect.");
    return res.status(401).json({
      success: false,
      message: "Not authorized, session has been revoked",
    });
  }

  req.user = {
    _id: user._id,
    id: user._id.toString(),
    role: user.role,
    email: user.email,
    full_name: user.full_name,
    account_status: user.account_status,
    email_verified: user.email_verified,
  };

  if (
    req.originalUrl &&
    !req.originalUrl.startsWith("/api/onboarding") &&
    !req.originalUrl.startsWith("/api/auth") &&
    !req.originalUrl.startsWith("/api/uploads")
  ) {
    if (user.account_status === "pending_verification") {
      return res.status(403).json({
        success: false,
        message: "Please verify your email address to access this feature.",
      });
    }
    if (user.account_status === "rejected") {
      return res.status(403).json({
        success: false,
        message: "Your account application has been rejected.",
      });
    }
  }

  next();
});

/**
 * @desc    Middleware factory to enforce role-based access restrictions
 * @param   {string} role - The allowed user role (e.g., 'student', 'admin')
 */
const requireRole = (roleOrRoles) => (req, res, next) => {
  const allowedRoles = Array.isArray(roleOrRoles) ? roleOrRoles : [roleOrRoles];

  if (!req.user || !allowedRoles.includes(req.user.role)) {
    console.log("403 Forbidden from requireRole. req.user.role:", req.user?.role, "allowedRoles:", allowedRoles);
    return res.status(403).json({
      success: false,
      message: `This endpoint is only available to ${allowedRoles.join(", ")} accounts`,
    });
  }
  next();
};

/**
 * @desc    Middleware to validate a refresh token and inject basic user context
 */
const verifyRefreshTokenMiddleware = asyncHandler(async (req, res, next) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    return res
      .status(401)
      .json({ success: false, message: "Refresh token is required" });
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (err) {
    console.log("401 Unauthorized from protect.");
    return res.status(401).json({
      success: false,
      message: "Invalid or expired refresh token",
      error: err.message,
    });
  }

  const user = await User.findById(decoded.id);
  if (!user) {
    console.log("401 Unauthorized from protect.");
    return res.status(401).json({
      success: false,
      message: "User not found",
    });
  }

  if (decoded.token_version !== user.token_version) {
    console.log("401 Unauthorized: Token version mismatch in verifyRefreshTokenMiddleware.");
    return res.status(401).json({
      success: false,
      message: "Refresh token has been revoked",
    });
  }

  req.user = {
    _id: user._id,
    id: user._id.toString(),
    role: user.role,
    email: user.email,
  };
  next();
});

/**
 * @desc    Middleware to ensure the user has completed email verification and is active
 */
const requireVerified = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Not authenticated" });
  }

  // Block pending verification (unverified email) and rejected accounts.
  // We allow "pending_approval" for admins to review them, and some read-only access.
  if (req.user.account_status === "pending_verification") {
    return res.status(403).json({
      success: false,
      message: "Please verify your email address to access this feature.",
    });
  }

  if (req.user.account_status === "rejected") {
    return res.status(403).json({
      success: false,
      message: "Your account application has been rejected.",
    });
  }

  next();
};

module.exports = {
  protect,
  requireRole,
  requireVerified,
  verifyRefreshTokenMiddleware,
};
