const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const LaunchPitchDocumentSchema = new mongoose.Schema(
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

    document_type: {
      type: String,
      enum: ["Pitch Deck", "Company Profile", "One Pager", "Demo Video"],
      required: true,
    },

    file_url: String,
    file_name: String,
    file_size: Number,

    upload_status: {
      type: String,
      enum: ["Draft", "Submitted"],
      default: "Draft",
    },

    uploaded_at: Date,

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

LaunchPitchDocumentSchema.index({ startup_id: 1 });
LaunchPitchDocumentSchema.index({ document_type: 1 });

module.exports = mongoose.model(
  "LaunchPitchDocument",
  LaunchPitchDocumentSchema,
);
