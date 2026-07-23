/**
 * @file MentorMeeting.js
 * @description Schema for meetings scheduled between a mentor and a student/startup.

 * @architecture Defines the data structure and MongoDB schema for this entity within the Mongoose ODM layer. */
const mongoose = require("mongoose");

const mentorMeetingSchema = new mongoose.Schema(
  {
    mentor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    startup_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Startup",
      required: true,
      index: true,
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String, // e.g., "14:30"
      required: true,
    },
    platform: {
      type: String,
      required: true,
      trim: true, // e.g., "Google Meet", "Zoom"
    },
    agenda: {
      type: String,
      trim: true,
    },
    meeting_link: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled"],
      default: "scheduled",
      index: true,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

module.exports = mongoose.model("MentorMeeting", mentorMeetingSchema);
