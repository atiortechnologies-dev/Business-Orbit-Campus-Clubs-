// models/Meeting.js
const mongoose = require("mongoose");

const MeetingSchema = new mongoose.Schema(
  {
    startup_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Startup",
      required: true,
    },
    reviewer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    stage: {
      type: String,
      enum: [
        "ideation",
        "validation",
        "mvp",
        "incubation",
        "traction",
        "launch",
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    scheduledAt: {
      type: Date,
      required: true,
    },
    duration: {
      type: Number,
      default: 30,
    },
    status: {
      type: String,
      enum: ["scheduled", "rescheduled", "completed", "cancelled"],
      default: "scheduled",
    },
    rescheduleHistory: [
      {
        requestedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        previousDate: {
          type: Date,
        },
        newDate: {
          type: Date,
        },
        reason: {
          type: String,
        },
        status: {
          type: String,
          enum: ["pending", "accepted", "rejected"],
          default: "pending",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Meeting", MeetingSchema);
