/**
 * @file LaunchInsights.js
 * @description Defines the Mongoose schema and model for capturing post-launch insights and social media metrics.
 * @architecture Provides a data structure for storing qualitative and quantitative feedback regarding a startup's public launch event.
 */
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const LaunchInsightsSchema = new mongoose.Schema(
  {
    insights_id: {
      type: String,
      unique: true,
      default: () => `INSIGHTS-${Date.now()}`,
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

    // ========== LAUNCH INFORMATION ==========
    launch_date: Date,

    launch_type: {
      type: String,
      enum: ["Online", "Physical", "Hybrid"],
      default: "Online",
    },

    venue: {
      type: String,
      maxlength: 500,
      default: "",
    },

    live_product_url: String,

    // ========== SOCIAL MEDIA VERIFICATION ==========
    social_media: {
      linkedin_post: String,
      instagram_post: String,
      twitter_post: String,
      youtube_demo: String,
      website_announcement: String,
    },

    // ========== ADDITIONAL CONTEXT ==========
    achievements: {
      type: String,
      maxlength: 2000,
      default: "",
    },

    challenges: {
      type: String,
      maxlength: 2000,
      default: "",
    },

    event_notes: {
      type: String,
      maxlength: 2000,
      default: "",
    },

    special_remarks: {
      type: String,
      maxlength: 1000,
      default: "",
    },

    // Status
    submission_status: {
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

LaunchInsightsSchema.index({ startup_id: 1 });
LaunchInsightsSchema.index({ student_id: 1 });

/**
 * @module LaunchInsights
 * @description Exports the LaunchInsights Mongoose model.
 */
module.exports = mongoose.model("LaunchInsights", LaunchInsightsSchema);
