const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const ValidationReportSchema = new mongoose.Schema(
  {
    startup_id: {
      type: ObjectId,
      ref: "Startup",
      required: true,
      unique: true, // Only one active report per startup for Stage 2
    },
    student_id: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    stage_submission_id: {
      type: ObjectId,
      ref: "StageSubmission",
      default: null,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    summary: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    validation_metrics: {
      surveys_conducted: { type: Number, default: 0 },
      responses_collected: { type: Number, default: 0 },
      interviews_conducted: { type: Number, default: 0 },
      evidence_files: { type: Number, default: 0 },
    },
    key_findings: {
      type: String,
      trim: true,
      maxlength: 3000,
      default: "",
    },
    problem_validated: {
      type: Boolean,
      default: false,
    },
    market_size_estimate: {
      type: String,
      trim: true,
      default: "",
    },
    next_steps: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
    status: {
      type: String,
      enum: [
        "draft",
        "submitted",
        "under_review",
        "approved",
        "changes_requested",
        "rejected",
      ],
      default: "draft",
    },
    submitted_at: {
      type: Date,
      default: null,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

ValidationReportSchema.index({ student_id: 1 });
ValidationReportSchema.index({ status: 1 });

module.exports = mongoose.model("ValidationReport", ValidationReportSchema);
