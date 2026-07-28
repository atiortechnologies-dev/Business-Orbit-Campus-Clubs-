/**
 * @file AdmissionDocument.js
 * @description Schema for downloadable acceptance documents (Acceptance Letter, Agreement, Orientation Schedule).
 * @architecture Attached to an IncubationAdmission record for student access after acceptance.
 */

const mongoose = require("mongoose");

const admissionDocumentSchema = new mongoose.Schema(
  {
    admission_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IncubationAdmission",
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
  { timestamps: { createdAt: "created_at", updatedAt: false } },
);

module.exports = mongoose.model("AdmissionDocument", admissionDocumentSchema);
