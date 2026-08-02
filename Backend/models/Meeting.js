/**
 * @file Meeting.js
 * @description Mongoose schema for scheduling and tracking meetings between startups and reviewers.
 */

const mongoose = require("mongoose");

const MeetingSchema = mongoose.Schema(
  {
    startup_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Startup",
      required: true,
    },
    reviewer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    meeting_date: {
      type: Date,
      required: true,
    },
    duration: {
      type: String,
      default: "60 minutes",
    },
    platform: {
      type: String,
      default: "Google Meet",
    },
    agenda: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled", "reschedule_requested"],
      default: "scheduled",
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

module.exports = mongoose.model("Meeting", MeetingSchema);
