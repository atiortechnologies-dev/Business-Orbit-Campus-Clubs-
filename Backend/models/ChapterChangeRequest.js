/**
 * @file ChapterChangeRequest.js
 * @description Mongoose schema for tracking a student's request to change their chapter.
 * @architecture Connects a User (student) with their current and requested Chapter, managing state (pending, approved, rejected).
 */

const mongoose = require("mongoose");

const chapterChangeRequestSchema = new mongoose.Schema(
  {
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    current_chapter_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chapter",
      required: true,
    },
    requested_chapter_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chapter",
      default: null,
    },
    reason: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

/**
 * @module ChapterChangeRequest
 */
module.exports = mongoose.model(
  "ChapterChangeRequest",
  chapterChangeRequestSchema,
);
