/**
 * @file ApplicationInterview.js
 * @description Stores interview schedules for applications.
 * @architecture Segregated from Mentor meetings for clean domain boundaries.
 */

const mongoose = require("mongoose");

const applicationInterviewSchema = new mongoose.Schema(
  {
    application_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
      index: true,
    },
    interview_date: {
      type: Date,
      required: true,
    },
    meeting_link: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled"],
      default: "scheduled",
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

module.exports = mongoose.model(
  "ApplicationInterview",
  applicationInterviewSchema,
);
