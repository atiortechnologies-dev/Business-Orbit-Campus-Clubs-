/**
 * @file LaunchSubmission.js
 * @description Defines the Mongoose schema and model for startup launch application submissions.
 * @architecture Captures and stores comprehensive general, product, and social information required for evaluating a startup launch.
 */
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const LaunchSubmissionSchema = new mongoose.Schema(
  {
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

    // ========== GENERAL INFORMATION ==========
    startup_name: {
      type: String,
      maxlength: 200,
      default: "",
    },

    product_name: {
      type: String,
      maxlength: 200,
      default: "",
    },

    launch_date: Date,

    industry: {
      type: String,
      maxlength: 100,
      default: "",
    },

    team_size: Number,

    funding_status: {
      type: String,
      enum: ["Bootstrapped", "Funded", "Seeking Investment", "Other"],
      default: "Bootstrapped",
    },

    // ========== PRODUCT LINKS ==========
    website_url: String,
    product_url: String,
    app_store_url: String,
    demo_video_url: String,

    // ========== DESCRIPTION ==========
    description: {
      type: String,
      maxlength: 3000,
      default: "",
    },

    notes: {
      type: String,
      maxlength: 2000,
      default: "",
    },

    // ========== SOCIAL PRESENCE ==========
    social: {
      linkedin: String,
      instagram: String,
      twitter: String,
      youtube: String,
    },

    // Status
    draft_status: {
      type: String,
      enum: ["Draft", "Submitted"],
      default: "Draft",
    },

    submitted_at: Date,

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

LaunchSubmissionSchema.index({ startup_id: 1 });
LaunchSubmissionSchema.index({ student_id: 1 });

/**
 * @module LaunchSubmission
 * @description Exports the LaunchSubmission Mongoose model.
 */
module.exports = mongoose.model("LaunchSubmission", LaunchSubmissionSchema);
