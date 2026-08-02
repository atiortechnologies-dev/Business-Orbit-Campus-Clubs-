const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const ValidationChecklistItemSchema = new mongoose.Schema(
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
    item_name: {
      type: String,
      required: true,
      enum: [
        "Conduct primary research",
        "Design survey",
        "Validate problem statement",
        "Upload evidence",
        "Submit report",
      ],
    },
    is_completed: {
      type: Boolean,
      default: false,
    },
    completed_at: {
      type: Date,
      default: null,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

// Ensure unique checklist items per startup
ValidationChecklistItemSchema.index(
  { startup_id: 1, item_name: 1 },
  { unique: true },
);

module.exports = mongoose.model(
  "ValidationChecklistItem",
  ValidationChecklistItemSchema,
);
