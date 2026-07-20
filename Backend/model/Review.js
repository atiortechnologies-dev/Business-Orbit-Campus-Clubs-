const mongoose = require("mongoose");

const ReviewSchema = mongoose.Schema(
  {
    submission_id: {
      type: ObjectId,
      ref: "StageSubmission",
      required: true,
    },
    reviewer_id: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    decision: {
      type: String,
      enum: ["approved", "rejected"],
      required: true,
    },
    feedback: {
      type: String,
      trime: true,
      default: null,
    },
    reviewed_at: {
      type: Date,
      default: null,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

module.exports = mongoose.model("Review", ReviewSchema);
