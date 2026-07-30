/**
 * @file ActivityLog.js
 * @description Schema for tracking system activities (audit logs)
 */
const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    action: {
      type: String,
      required: true,
      trim: true,
    },
    entity_type: {
      type: String, // e.g., 'IncubatorApplication', 'MentorMeeting'
      required: true,
      trim: true,
    },
    entity_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

module.exports = mongoose.model("ActivityLog", activityLogSchema);
