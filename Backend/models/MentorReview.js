/**
 * @file MentorReview.js
 * @description Mongoose schema for student reviews of mentors.
 * @architecture Enforces a unique constraint per student-mentor pair, tying feedback directly to interactions.
 */

const mongoose = require("mongoose");

const mentorReviewSchema = new mongoose.Schema(
  {
    mentor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    review_text: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

// A student can only have one active review per mentor
mentorReviewSchema.index({ mentor_id: 1, student_id: 1 }, { unique: true });

module.exports = mongoose.model("MentorReview", mentorReviewSchema);
