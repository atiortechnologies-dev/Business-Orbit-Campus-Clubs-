/**
 * @file ChapterEvent.js
 * @description Mongoose schema for events organized by a Chapter.
 * @architecture Belongs to a Chapter.
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chapterEventSchema = new Schema(
  {
    chapter_id: {
      type: Schema.Types.ObjectId,
      ref: "Chapter",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ["NETWORKING", "EDUCATION", "SOCIAL", "PITCH_NIGHT"],
      required: true,
    },
    event_date: { type: Date, required: true },
    location_venue: { type: String, trim: true, required: true },
    max_capacity: { type: Number, required: true, min: 1 },
    total_registrations: { type: Number, default: 0, min: 0 },
    // PENDING → ACTIVE → COMPLETED / CANCELLED
    status: {
      type: String,
      enum: ["PENDING", "ACTIVE", "COMPLETED", "CANCELLED"],
      default: "PENDING",
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

// Pre-hook to handle cascading deletes if needed or other logic
chapterEventSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function () {
    await mongoose
      .model("EventRegistration")
      .deleteMany({ event_id: this._id });
  },
);

module.exports = mongoose.model("ChapterEvent", chapterEventSchema);
