const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const ValidationEvidenceSchema = new mongoose.Schema(
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
    file_name: {
      type: String,
      required: true,
      trim: true,
    },
    file_url: {
      type: String,
      required: true,
    },
    file_type: {
      type: String,
      enum: [
        "survey_results",
        "interview_notes",
        "photo",
        "video",
        "research_document",
        "pdf",
        "spreadsheet",
        "other",
      ],
      default: "other",
    },
    file_size: {
      type: Number,
      required: true, // in bytes
    },
    mime_type: {
      type: String,
      default: "",
    },
    upload_status: {
      type: String,
      enum: ["pending", "uploaded", "failed"],
      default: "uploaded",
    },
  },
  { timestamps: { createdAt: "uploaded_at", updatedAt: "updated_at" } },
);

// Prevent duplicate uploads of the same file
ValidationEvidenceSchema.index(
  { startup_id: 1, file_name: 1 },
  { unique: true },
);
ValidationEvidenceSchema.index({ student_id: 1 });

module.exports = mongoose.model("ValidationEvidence", ValidationEvidenceSchema);
