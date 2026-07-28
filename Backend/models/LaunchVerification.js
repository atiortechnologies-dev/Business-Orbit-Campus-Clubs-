const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const LaunchVerificationSchema = new mongoose.Schema(
  {
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

    status: {
      type: String,
      enum: ["Pending Review", "Under Review", "Changes Requested", "Approved"],
      default: "Pending Review",
    },

    review_notes: {
      type: String,
      maxlength: 2000,
      default: "",
    },

    requested_changes: {
      type: String,
      maxlength: 2000,
      default: "",
    },

    verified_at: Date,

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

LaunchVerificationSchema.index({ startup_id: 1 });
LaunchVerificationSchema.index({ status: 1 });

module.exports = mongoose.model("LaunchVerification", LaunchVerificationSchema);
