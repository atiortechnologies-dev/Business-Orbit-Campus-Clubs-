const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema(
  {
    chapter_name: { type: String, required: true, trim: true },
    college_name: { type: String, required: true, trim: true, index: true },
    description: { type: String, trim: true, default: "" },
    mission: { type: String, trim: true, default: "" },
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },

    // Chapter Statistics
    total_members: { type: Number, default: 0, min: 0 },
    active_startups: { type: Number, default: 0, min: 0 },
    mentors_count: { type: Number, default: 0, min: 0 },
    events_conducted: { type: Number, default: 0, min: 0 },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

module.exports = mongoose.model("Chapter", chapterSchema);
