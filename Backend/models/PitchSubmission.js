/**
 * @file PitchSubmission.js
 * @description Schema for pitch deck submissions from startups to investors.
 */

const mongoose = require("mongoose");

const pitchSubmissionSchema = new mongoose.Schema(
  {
    startup_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Startup",
      required: true,
      index: true,
    },
    investor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    funding_requirement: {
      type: String,
      required: true,
      trim: true,
    },
    valuation: {
      type: String,
      trim: true,
    },
    startup_stage: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["draft", "submitted", "viewed", "accepted", "rejected"],
      default: "draft",
    },
  },
  { timestamps: { createdAt: "submitted_at", updatedAt: "updated_at" } },
);

// One active submission per startup-investor pair (excluding rejected/archived if needed, but for now unique index)
pitchSubmissionSchema.index(
  { startup_id: 1, investor_id: 1 },
  { unique: true }
);

module.exports = mongoose.model("PitchSubmission", pitchSubmissionSchema);
