const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const TractionReviewSchema = new mongoose.Schema(
  {
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

    // Status
    review_status: {
      type: String,
      enum: [
        "Submitted",
        "Under Review",
        "Changes Requested",
        "Approved",
        "Rejected",
      ],
      default: "Submitted",
    },

    review_notes: {
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

TractionReviewSchema.index({ submission_id: 1 });
TractionReviewSchema.index({ startup_id: 1 });

module.exports = mongoose.model("TractionReview", TractionReviewSchema);
