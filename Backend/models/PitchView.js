/**
 * @file PitchView.js
 * @description Tracks when an investor views a pitch deck.
 */

const mongoose = require("mongoose");

const pitchViewSchema = new mongoose.Schema(
  {
    investor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    pitch_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StartupPitch",
      required: true,
    },
  },
  { timestamps: { createdAt: "viewed_at", updatedAt: false } }
);

module.exports = mongoose.model("PitchView", pitchViewSchema);
