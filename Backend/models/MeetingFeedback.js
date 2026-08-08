// models/MeetingFeedback.js
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const MeetingFeedbackSchema = new mongoose.Schema(
  {
    meeting_id: {
      type: ObjectId,
      ref: "Meeting",
      required: true,
      unique: true,
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
    summary: {
      type: String,
      trim: true,
      default: "",
    },
    strengths: {
      type: String,
      trim: true,
      default: "",
    },
    improvements: {
      type: String,
      trim: true,
      default: "",
    },
    action_items: {
      type: String,
      trim: true,
      default: "",
    },
    decision: {
      type: String,
      enum: ["approved", "request_changes", "reject", "pending"],
      default: "pending",
    },
    reviewer_comments: {
      type: String, // Feedback for founder
      trim: true,
      maxlength: 2000,
      required: true,
    },
    internal_notes: {
      type: String, // Admin eyes only
      trim: true,
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
MeetingFeedbackSchema.index({ startup_id: 1 });

module.exports = mongoose.model("MeetingFeedback", MeetingFeedbackSchema);
