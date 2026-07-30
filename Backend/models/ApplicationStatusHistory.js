/**
 * @file ApplicationStatusHistory.js
 * @description Schema for tracking the timeline and status changes of a freelancing application.
 * @architecture Provides an audit trail and timestamped history of application progress.
 */

const mongoose = require("mongoose");

const applicationStatusHistorySchema = new mongoose.Schema(
  {
    application_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
      index: true,
    },
    status: {
      type: String,
      required: true,
      enum: ["draft", "submitted", "viewed", "shortlisted", "interview", "selected", "rejected", "withdrawn"],
    },
    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    remarks: {
      type: String,
      default: "",
    },
  },
  { timestamps: { createdAt: "updated_at", updatedAt: false } }
);

module.exports = mongoose.model("ApplicationStatusHistory", applicationStatusHistorySchema);
