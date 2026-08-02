const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const MVPReviewSchema = new mongoose.Schema(
  {
    submission_id: {
      type: ObjectId,
      ref: "MVPSubmission",
      required: true,
      unique: true,
    },

    startup_id: {
      type: ObjectId,
      ref: "Startup",
      required: true,
    },

    student_id: {
      type: ObjectId,
      ref: "User",
      required: true,
    },

    reviewer_id: {
      type: ObjectId,
      ref: "User",
      default: null,
    },

    // Review Details
    decision: {
      type: String,
      enum: ["Approved", "Changes Requested", "Rejected", "Pending"],
      default: "Pending",
    },

    reviewer_comments: {
      type: String,
      maxlength: 2000,
      default: "",
    },

    strengths: {
      type: String,
      maxlength: 1000,
      default: "",
    },

    areas_to_improve: {
      type: String,
      maxlength: 1000,
      default: "",
    },

    recommendations: {
      type: String,
      maxlength: 1500,
      default: "",
    },

    technical_score: {
      type: Number,
      min: 1,
      max: 10,
      default: null,
    },

    design_score: {
      type: Number,
      min: 1,
      max: 10,
      default: null,
    },

    functionality_score: {
      type: Number,
      min: 1,
      max: 10,
      default: null,
    },

    // Timestamps
    created_at: {
      type: Date,
      default: Date.now,
    },

    updated_at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

MVPReviewSchema.index({ startup_id: 1 });

module.exports = mongoose.model("MVPReview", MVPReviewSchema);
