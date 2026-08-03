/**
 * @file Chapter.js
 * @description Mongoose schema for Chapters, representing campus clubs or hubs.
 */

const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema(
  {
    chapter_name: { type: String, required: true, trim: true },
    college_name: { type: String, required: true, trim: true, index: true },
    description: { type: String, trim: true, default: "" },
    mission: { type: String, trim: true, default: "" },

    // New fields from the extended form
    chapter_type: {
      type: String,
      enum: ["University", "College", "School", "Incubator"],
      default: "University",
    },
    country: { type: String, trim: true, default: "" },
    state: { type: String, trim: true, default: "" },
    city: { type: String, trim: true, default: "" },
    address: { type: String, trim: true, default: "" },

    // Lead contact details (before full user linking)
    lead_name: { type: String, trim: true, default: "" },
    lead_email: { type: String, trim: true, default: "" },
    lead_phone: { type: String, trim: true, default: "" },

    // Existing Lead reference
    lead_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    status: {
      type: String,
      enum: ["Active", "Pending", "Inactive", "Probation"],
      default: "Pending",
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
