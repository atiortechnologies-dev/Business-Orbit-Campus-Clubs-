/**
 * @file ApplicantStatus.js
 * @description Immutable audit log for application status transitions.
 * @architecture Separates status tracking from core application data for clean history.
 */

const mongoose = require("mongoose");

const applicantStatusSchema = new mongoose.Schema(
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
    },
    updated_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

module.exports = mongoose.model("ApplicantStatus", applicantStatusSchema);
