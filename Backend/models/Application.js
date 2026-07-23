/**
 * @file Application.js
 * @description Schema for student applications to opportunities.
 * @architecture Links students to opportunities and enforces unique application per student.
 */

const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    opportunity_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Opportunity",
      required: true,
    },
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    application_status: {
      type: String,
      enum: ["applied", "shortlisted", "rejected", "interviewing", "hired"],
      default: "applied",
    },
    resume_url: {
      type: String,
      required: true,
    },
    cover_letter: {
      type: String,
    },
  },
  { timestamps: { createdAt: "applied_at", updatedAt: "updated_at" } }
);

// 🛡️ Correctness & Data Integrity: Prevent duplicate applications from the same student
applicationSchema.index({ opportunity_id: 1, student_id: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);
