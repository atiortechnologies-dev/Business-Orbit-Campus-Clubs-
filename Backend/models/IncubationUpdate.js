/**
 * @file IncubationUpdate.js
 * @description Schema for incubator announcements and application updates.
 * @architecture Tracks status changes, meeting invitations, and general incubator announcements.
 */

const mongoose = require("mongoose");

const incubationUpdateSchema = new mongoose.Schema(
  {
    application_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IncubationApplication",
      required: false,
      index: true,
    },
    incubator_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IncubatorProfile",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } },
);

module.exports = mongoose.model("IncubationUpdate", incubationUpdateSchema);
