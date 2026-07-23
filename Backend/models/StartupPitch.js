/**
 * @file StartupPitch.js
 * @description Schema for pitch decks submitted by startups to investors.
 */

const mongoose = require("mongoose");

const startupPitchSchema = new mongoose.Schema(
  {
    startup_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Startup",
      required: true,
      index: true,
    },
    founder_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    industry: {
      type: String,
      required: true,
    },
    funding_stage: {
      type: String,
      required: true,
    },
    funding_amount: {
      type: String,
      required: true,
    },
    deck_file: {
      type: String,
      required: true, // URL to PDF/PPT
    },
    status: {
      type: String,
      enum: ["active", "hidden"],
      default: "active",
    },
    market_size: {
      type: String,
      trim: true,
    },
    revenue: {
      type: String,
      trim: true,
    },
    team_size: {
      type: Number,
    },
    key_highlights: {
      type: [String],
      default: [],
    },
  },
  { timestamps: { createdAt: "submitted_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("StartupPitch", startupPitchSchema);
