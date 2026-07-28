/**
 * @file ApplicationTimeline.js
 * @description Schema for tracking the timeline and status changes of an incubation application.
 * @architecture Provides an audit trail and timestamped history of application review progress.
 */

const mongoose = require("mongoose");

const applicationTimelineSchema = new mongoose.Schema(
  {
    application_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IncubationApplication",
      required: true,
      index: true,
    },
    status: {
      type: String,
      required: true,
      trim: true,
    },
    remarks: {
      type: String,
      default: "",
      trim: true,
    },
    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  { timestamps: { createdAt: "updated_at", updatedAt: false } },
);

module.exports = mongoose.model(
  "ApplicationTimeline",
  applicationTimelineSchema,
);
