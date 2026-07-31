/**
 * @file PitchDocument.js
 * @description Schema for documents attached to a PitchSubmission.
 */

const mongoose = require("mongoose");

const pitchDocumentSchema = new mongoose.Schema(
  {
    submission_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PitchSubmission",
      required: true,
      index: true,
    },
    document_type: {
      type: String,
      enum: ["pitch_deck", "executive_summary", "additional_document"],
      required: true,
    },
    file_name: {
      type: String,
      required: true,
    },
    file_url: {
      type: String,
      required: true,
    },
  },
  { timestamps: { createdAt: "uploaded_at", updatedAt: "updated_at" } },
);

module.exports = mongoose.model("PitchDocument", pitchDocumentSchema);
