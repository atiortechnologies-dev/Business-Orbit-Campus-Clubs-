const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const MVPReviewMeetingSchema = new mongoose.Schema(
  {
    submission_id: {
      type: ObjectId,
      ref: "MVPSubmission",
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

    // Meeting Details
    meeting_date: Date,
    meeting_time: String,
    meeting_link: {
      type: String,
      default: "",
    },

    agenda: {
      type: String,
      maxlength: 1000,
      default: "",
    },

    // Status
    status: {
      type: String,
      enum: ["Scheduled", "Completed", "Cancelled", "Reschedule Requested"],
      default: "Scheduled",
    },

    // Reschedule Info
    reschedule_reason: {
      type: String,
      maxlength: 500,
      default: "",
    },

    reschedule_requested_at: Date,

    // Timestamps
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

MVPReviewMeetingSchema.index({ startup_id: 1 });
MVPReviewMeetingSchema.index({ submission_id: 1 });

module.exports = mongoose.model("MVPReviewMeeting", MVPReviewMeetingSchema);
