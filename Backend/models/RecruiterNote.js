/**
 * @file RecruiterNote.js
 * @description Private notes left by company recruiters on applications.
 */

const mongoose = require("mongoose");

const recruiterNoteSchema = new mongoose.Schema(
  {
    application_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
      index: true,
    },
    recruiter_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    note: {
      type: String,
      required: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } },
);

module.exports = mongoose.model("RecruiterNote", recruiterNoteSchema);
