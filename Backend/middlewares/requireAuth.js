/**
 * @file requireAuth.js
 * @description Middleware for verifying JWT tokens and strictly authorizing user roles.
 * @architecture Security layer intercepting incoming requests to protect routes and ensure role-based access control.
 */

const User = require("../models/User");
const { verifyToken } = require("../utils/token");
const asyncHandler = require("./asyncHandler");

/**
 * Middleware to protect routes by ensuring a valid JWT is present
 * in the Authorization header. Attaches the User document to req.user.
 */
const requireAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route. Missing token.",
    });
  }

  try {
    const decoded = verifyToken(token);

    // Fetch the user from the database
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "The user belonging to this token no longer exists.",
      });
    }

    // Attach the user to the request object
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Not authorized to access this route. Invalid or expired token.",
    });
  }
});

/**
 * Middleware to strictly authorize specific roles
 * @param {...string} roles - Allowed roles (e.g., 'mentor', 'student')
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role (${req.user.role}) is not authorized to access this resource.`,
      });
    }
    next();
  };
};

module.exports = { requireAuth, authorizeRoles };
