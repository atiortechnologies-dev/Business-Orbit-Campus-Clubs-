/**
 * @file TractionMetrics.js
 * @description Mongoose model for recording a startup's performance and growth metrics, such as users, revenue, and retention.
 * @architecture Forms the data layer for tracking startup success metrics, utilized during traction evaluations and analytics reporting.
 */
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const TractionMetricsSchema = mongoose.Schema(
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
    total_users: {
      type: Number,
      min: 0,
      default: 0,
    },
    active_users: {
      type: Number,
      min: 0,
      default: 0,
    },
    monthly_growth_rate: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    conversion_rate: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    retention_rate: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    revenue: {
      type: Number,
      min: 0,
      default: 0,
    },

    // ========== ACQUISITION CHANNELS ==========
    acquisition_channels: {
      organic: { type: Number, default: 0 },
      social_media: { type: Number, default: 0 },
      referrals: { type: Number, default: 0 },
      paid_marketing: { type: Number, default: 0 },
      events: { type: Number, default: 0 },
      other: { type: Number, default: 0 },
    },

    notes: {
      type: String,
      maxlength: 2000,
      default: "",
    },

    // Status
    status: {
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

TractionMetricsSchema.index({ startup_id: 1 });
TractionMetricsSchema.index({ student_id: 1 });

/**
 * @module TractionMetrics
 * @description Exports the TractionMetrics Mongoose model.
 */
module.exports = mongoose.model("TractionMetrics", TractionMetricsSchema);
