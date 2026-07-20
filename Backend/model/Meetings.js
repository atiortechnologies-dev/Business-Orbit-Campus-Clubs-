const mongoose = require("mongoose");

const MeetingSchema = mongoose.Schema(
  {
    startup_id: {
      type: ObjectId,
      ref: "Startup",
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
      required: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled", "reschedule_requested"],
      default: "scheduled",
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

module.exports = mongoose.model("Meetings", MeetingSchema);
