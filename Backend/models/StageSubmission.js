/**
 * @file StageSubmission.js
 * @description Mongoose schema for tracking the deliverables submitted by a startup for a specific stage.
 * @architecture Uses a compound index on startup_id and stage_id to optimize query performance and sorting.
 */

const mongoose = require("mongoose");

const StageSubmissionSchema = mongoose.Schema(
  {
    startup_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Startup",
      required: true,
    },
    stage_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StartupStage",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    solution: {
      type: String,
      default: "",
    },
    target_audience: {
      type: String,
      default: "",
    },
    value_proposition: {
      type: String,
      default: "",
    },
    competitors: {
      type: String,
      default: "",
    },
    attachment_url: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: [
        "draft",
        "pending_review",
        "approved",
        "rejected",
        "request_changes",
      ],
      default: "draft",
    },
    request_changes: {
      type: String,
      default: "",
    },
    submitted_at: {
      type: Date,
      default: null,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

// sorts the data in ascending order ( Performance Booster )
StageSubmissionSchema.index({ startup_id: 1, stage_id: 1 });

/**
 * @module StageSubmission
 */
module.exports = mongoose.model("StageSubmission", StageSubmissionSchema);
