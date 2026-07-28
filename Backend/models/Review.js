/**
 * @file Review.js
 * @description Mongoose schema for reviewer feedback on stage submissions.
 * @architecture Links a StageSubmission to a reviewer, holding the decision and qualitative feedback.
 */

const mongoose = require("mongoose");

const ReviewSchema = mongoose.Schema(
  {
    submission_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StageSubmission",
      required: true,
    },
    reviewer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    decision: {
      type: String,
      enum: ["approved", "rejected"],
      required: true,
    },
    feedback: {
      type: String,
      trim: true,
      default: null,
    },
    improvement_suggestions: {
      type: String,
      trim: true,
      default: null,
    },
    reviewed_at: {
      type: Date,
      default: null,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

/**
 * @module Review
 */
module.exports = mongoose.model("Review", ReviewSchema);
