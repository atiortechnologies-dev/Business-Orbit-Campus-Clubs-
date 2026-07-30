/**
 * @file Notification.js
 * @description Schema for system notifications
 */
const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    recipient_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String, // e.g., 'alert', 'info', 'success', 'warning'
      default: "info",
    },
    read_status: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

module.exports = mongoose.model("Notification", notificationSchema);
