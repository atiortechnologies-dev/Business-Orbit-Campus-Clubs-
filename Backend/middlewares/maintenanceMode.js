const PlatformSetting = require('../models/PlatformSetting');
const asyncHandler = require('./asyncHandler');

const maintenanceMode = asyncHandler(async (req, res, next) => {
  if (req.path.startsWith('/api/admin')) {
    return next();
  }

  const settings = await PlatformSetting.findOne().lean();
  if (settings && settings.maintenance_mode) {
    return res.status(503).json({
      success: false,
      message: 'Service Unavailable: The platform is currently in maintenance mode.',
    });
  }

  next();
});

module.exports = maintenanceMode;
