/**
 * @file maintenanceMode.js
 * @description Middleware to block API requests when the platform is in maintenance mode.
 * @architecture Intercepts incoming requests globally before they hit route handlers, except for admin routes.
 */
const PlatformSetting = require("../models/PlatformSetting");
const asyncHandler = require("./asyncHandler");

/**
 * @desc    Checks platform settings and blocks requests if maintenance mode is active
 * @route   ALL /*
 * @access  Public
 */
const maintenanceMode = asyncHandler(async (req, res, next) => {
  if (req.path.startsWith("/api/admin")) {
    return next();
  }

  const settings = await PlatformSetting.findOne().lean();
  if (settings && settings.maintenance_mode) {
    return res.status(503).json({
      success: false,
      message:
        "Service Unavailable: The platform is currently in maintenance mode.",
    });
  }

  next();
});

module.exports = maintenanceMode;
