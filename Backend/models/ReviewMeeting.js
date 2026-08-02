const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const ReviewMeetingSchema = new mongoose.Schema(
  {
    stage_submission_id: {
      type: ObjectId,
      ref: "StageSubmission",
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
      required: true,
    },
    meeting_date: {
      type: Date,
      required: true,
    },
    meeting_link: {
      type: String,
      default: "",
    },
    agenda: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled", "reschedule_requested"],
      default: "scheduled",
    },
    student_notes: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
    reschedule_reason: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
    reschedule_requested_at: {
      type: Date,
      default: null,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

ReviewMeetingSchema.index({ startup_id: 1 });
ReviewMeetingSchema.index({ student_id: 1 });
ReviewMeetingSchema.index({ reviewer_id: 1 });
ReviewMeetingSchema.index({ meeting_date: 1 });

module.exports = mongoose.model("ReviewMeeting", ReviewMeetingSchema);
