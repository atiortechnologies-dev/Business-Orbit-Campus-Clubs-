/**
 * @file ChapterEvent.js
 * @description Mongoose schema for events organized by a Chapter.
 * @architecture Belongs to a Chapter.
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const chapterEventSchema = new Schema(
  {
    chapter_id: { type: Schema.Types.ObjectId, ref: "Chapter", required: true, index: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    event_date: { type: Date, required: true },
    location: { type: String, trim: true },
    status: { type: String, enum: ["scheduled", "completed", "cancelled"], default: "scheduled" },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("ChapterEvent", chapterEventSchema);
