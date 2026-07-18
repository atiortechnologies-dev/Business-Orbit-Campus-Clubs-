/**
 * @file MentorAssignment.js
 * @description Schema representing an active mentorship assignment between a mentor and a startup/student.

 * @architecture Defines the data structure and MongoDB schema for this entity within the Mongoose ODM layer. */
const mongoose = require("mongoose");

const mentorAssignmentSchema = new mongoose.Schema(
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
      enum: ["active", "completed", "terminated"],
      default: "active",
      index: true,
    },
  },
  { timestamps: { createdAt: "assigned_at", updatedAt: "updated_at" } },
);

module.exports = mongoose.model("MentorAssignment", mentorAssignmentSchema);
