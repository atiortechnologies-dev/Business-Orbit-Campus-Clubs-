const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const TractionReviewMeetingSchema = new mongoose.Schema(
  {
    meeting_id: {
      type: String,
      unique: true,
      default: () => `MEET-${Date.now()}`,
    },

    submission_id: {
      type: ObjectId,
      ref: "ProductSubmission",
      required: true,
    },

    startup_id: {
      type: ObjectId,
      ref: "Startup",
      required: true,
    },

    student_id: {
      type: ObjectId,
      ref: "User",
      required: true,
    },

    reviewer_id: {
      type: ObjectId,
      ref: "User",
      default: null,
    },

    meeting_date: Date,
    meeting_time: String,
    meeting_platform: {
      type: String,
      enum: ["Google Meet", "Zoom", "Microsoft Teams", "Other"],
      default: "Google Meet",
    },
    meeting_link: String,
    meeting_agenda: {
      type: String,
      maxlength: 1000,
      default: "",
    },

    // Meeting status
    meeting_status: {
      type: String,
      enum: ["Scheduled", "Completed", "Cancelled", "Rescheduled"],
      default: "Scheduled",
    },

    attendance_status: {
      type: String,
      enum: ["Pending", "Attended", "Absent"],
      default: "Pending",
    },

    meeting_notes: {
      type: String,
      maxlength: 2000,
      default: "",
    },

    created_at: {
      type: Date,
      default: Date.now,
    },

    updated_at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

TractionReviewMeetingSchema.index({ startup_id: 1 });
TractionReviewMeetingSchema.index({ submission_id: 1 });

module.exports = mongoose.model(
  "TractionReviewMeeting",
  TractionReviewMeetingSchema,
);
