/**
 * @file MeetingFeedback.js
 * @description Mongoose model for capturing feedback from reviewers after a startup review meeting.
 * @architecture Defines the schema for post-meeting feedback and recommendations, integrating with the review meetings in the database.
 */
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const MeetingFeedbackSchema = new mongoose.Schema(
  {
    meeting_id: {
      type: ObjectId,
      ref: "ReviewMeeting",
      required: true,
      unique: true, // One feedback per meeting
    },
    reviewer_id: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    student_id: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    startup_id: {
      type: ObjectId,
      ref: "Startup",
      required: true,
    },
    reviewer_comments: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },
    recommendations: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },
    validation_approved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

MeetingFeedbackSchema.index({ reviewer_id: 1 });
MeetingFeedbackSchema.index({ student_id: 1 });

/**
 * @module MeetingFeedback
 * @description Exports the MeetingFeedback Mongoose model.
 */
module.exports = mongoose.model("MeetingFeedback", MeetingFeedbackSchema);
