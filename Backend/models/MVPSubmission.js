/**
 * @file MVPSubmission.js
 * @description Mongoose model for capturing details of a startup's MVP submission including code, designs, and pitch deck.
 * @architecture Defines the core data structure for MVP submissions, interacting with review and meeting models to drive the MVP stage of the platform.
 */
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const MVPSubmissionSchema = new mongoose.Schema(
  {
    startup_id: {
      type: ObjectId,
      ref: "Startup",
      required: true,
      unique: true, // One active submission per startup
    },
    student_id: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      maxlength: 3000,
    },
    github_url: {
      type: String,
      default: "",
    },
    live_url: {
      type: String,
      default: "",
    },
    figma_url: {
      type: String,
      default: "",
    },
    documentation_url: {
      type: String,
      default: "",
    },
    pitch_deck_url: {
      type: String,
      default: "",
    },
    demo_video_url: {
      type: String,
      default: "",
    },
    additional_files: [
      {
        file_name: String,
        file_url: String,
        file_type: String,
        uploaded_at: Date,
      },
    ],
    // Additional Info
    notes: {
      type: String,
      maxlength: 1000,
      default: "",
    },
    // Status Management
    submission_status: {
      type: String,
      enum: [
        "Draft",
        "Submitted",
        "Under Review",
        "Approved",
        "Changes Requested",
        "Rejected",
      ],
      default: "Draft",
    },
    submitted_at: Date,
    assigned_reviewer: {
      type: ObjectId,
      ref: "User", // temporary
      default: null,
    },
    review_assigned_at: Date,
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

MVPSubmissionSchema.index({ student_id: 1 });
MVPSubmissionSchema.index({ submission_status: 1 });

/**
 * @module MVPSubmission
 * @description Exports the MVPSubmission Mongoose model.
 */
module.exports = mongoose.model("MVPSubmission", MVPSubmissionSchema);
