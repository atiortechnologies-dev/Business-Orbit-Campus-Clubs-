/**
 * @file IncubationAdmission.js
 * @description Schema for active incubation admission records once an application is accepted.
 * @architecture Tracks cohort assignment, onboarding status, and assigned coordinator/mentor.
 */

const mongoose = require("mongoose");

const incubationAdmissionSchema = new mongoose.Schema(
  {
    application_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IncubationApplication",
      required: true,
      unique: true,
    },
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    startup_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Startup",
      required: true,
    },
    incubator_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "IncubatorProfile",
      required: true,
    },
    accepted_at: {
      type: Date,
      default: null,
    },
    accepted_by_student: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["Pending", "Active", "Completed", "Terminated"],
      default: "Pending",
    },
    unlocked_features: {
      workspace_access: { type: Boolean, default: false },
      mentorship_access: { type: Boolean, default: false },
      grant_eligibility: { type: Boolean, default: false },
      investor_network: { type: Boolean, default: false },
    },
    onboarding_status: {
      type: String,
      enum: ["Pending", "Completed"],
      default: "Pending",
    },
    assigned_mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    coordinator: {
      type: String,
      default: "",
      trim: true,
    },
    cohort: {
      type: String,
      default: "",
      trim: true,
    },
    program_name: {
      type: String,
      default: "",
      trim: true,
    },
    joining_date: {
      type: Date,
      default: null,
    },
    duration: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

incubationAdmissionSchema.post("findOneAndDelete", async function (doc, next) {
  if (doc) {
    const session = this.getOptions().session;
    const opts = session ? { session } : {};
    const AdmissionDocument = mongoose.model("AdmissionDocument");
    await AdmissionDocument.deleteMany({ admission_id: doc._id }, opts);
  }
  next();
});

module.exports = mongoose.model(
  "IncubationAdmission",
  incubationAdmissionSchema,
);
