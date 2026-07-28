/**
 * @file notification.controller.js
 * @description Manages operations specific to notifications.
 * @architecture Controller layer for notification workflows.
 */

const Notification = require("../models/Notification");
const asyncHandler = require("../middlewares/asyncHandler");

/**
 * @desc    Get user notifications
 * @route   GET /api/student/notifications
 * @access  Private (Student)
 */
const getNotifications = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;

  const total = await Notification.countDocuments({ recipient_id: userId });
  const notifications = await Notification.find({ recipient_id: userId })
    .sort({ created_at: -1 })
    .skip(startIndex)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: notifications.length,
    pagination: {
      total,
      page,
      limit,
    },
    data: notifications,
  });
});

/**
 * @desc    Mark a notification as read
 * @route   PUT /api/student/notifications/:notificationId/read
 * @access  Private (Student)
 */
const markNotificationRead = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const notificationId = req.params.notificationId;

  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, recipient_id: userId },
    { read_status: true },
    { new: true }
  );

  if (!notification) {
    return res.status(404).json({
      success: false,
      message: "Notification not found",
    });
  }

  res.status(200).json({
    success: true,
    data: notification,
  });
});

module.exports = {
  getNotifications,
  markNotificationRead,
};
