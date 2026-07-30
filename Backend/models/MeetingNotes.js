/**
 * @file MeetingNotes.js
 * @description Schema for meeting notes between a mentor and startup.
 */
const mongoose = require("mongoose");

const meetingNotesSchema = new mongoose.Schema(
  {
    meeting_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MentorMeeting",
      required: true,
      unique: true,
    },
    mentor_notes: {
      type: String,
      required: true,
      trim: true,
    },
    recommendations: {
      type: String,
      trim: true,
    },
    outcome: {
      type: String,
      trim: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

module.exports = mongoose.model("MeetingNotes", meetingNotesSchema);
