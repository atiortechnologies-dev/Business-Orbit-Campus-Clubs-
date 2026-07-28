/**
 * @file activityLog.controller.js
 * @description Manages operations specific to activity logs.
 * @architecture Controller layer for activity log workflows.
 */

const ActivityLog = require("../models/ActivityLog");
const asyncHandler = require("../middlewares/asyncHandler");

/**
 * @desc    Get user activity logs
 * @route   GET /api/student/activity-log
 * @access  Private (Student)
 */
const getActivityLogs = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;

  const total = await ActivityLog.countDocuments({ user_id: userId });
  const activityLogs = await ActivityLog.find({ user_id: userId })
    .sort({ created_at: -1 })
    .skip(startIndex)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: activityLogs.length,
    pagination: {
      total,
      page,
      limit,
    },
    data: activityLogs,
  });
});

module.exports = {
  getActivityLogs,
};
