/**
 * @file MentorRequest.js
 * @description Schema for mentorship requests from students to mentors.

 * @architecture Defines the data structure and MongoDB schema for this entity within the Mongoose ODM layer. */
const mongoose = require("mongoose");

const mentorRequestSchema = new mongoose.Schema(
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
    status: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      default: "pending",
      index: true,
    },
    // Note: Startup Name, Stage, and Industry are not duplicated here to maintain normalization.
    // They should be populated via the startup_id reference during retrieval.
    problem_statement: {
      type: String,
      required: true,
    },
    help_required: {
      type: String,
      required: true,
    },
    preferred_meeting_mode: {
      type: String,
      enum: ["online", "in-person", "any"],
      default: "online",
    },
    preferred_time: {
      type: String,
      required: true,
    },
    additional_notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

module.exports = mongoose.model("MentorRequest", mentorRequestSchema);
