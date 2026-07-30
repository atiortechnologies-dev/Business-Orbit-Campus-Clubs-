/**
 * @file adminAuth.js
 * @description Middleware to verify the request originates from a user with administrative privileges.
 * @architecture Provides a reusable security checkpoint for protecting sensitive routes at the routing layer.
 */

/**
 * Admin Authentication Middleware
 * Secures CMS endpoints using an x-api-key header for MVP.
 */
const adminAuth = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];

  if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized: Invalid or missing Admin API Key",
    });
  }

  next();
};

module.exports = { adminAuth };
