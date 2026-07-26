/**
 * @file ApplicationDocument.js
 * @description Schema for documents attached to an incubation application.
 * @architecture Tracks uploaded files (pitch decks, business plans, additional requests) per application.
 */

const mongoose = require("mongoose");

const applicationDocumentSchema = new mongoose.Schema(
  {
    application_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IncubationApplication",
      required: true,
      index: true,
    },
    document_type: {
      type: String,
      required: true,
      trim: true,
    },
    file_name: {
      type: String,
      required: true,
      trim: true,
    },
    file_url: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: { createdAt: "uploaded_at", updatedAt: false } },
);

module.exports = mongoose.model(
  "ApplicationDocument",
  applicationDocumentSchema,
);
