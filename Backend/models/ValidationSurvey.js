/**
 * @file ValidationSurvey.js
 * @description Mongoose model for summarizing survey responses and interviews conducted during market validation.
 * @architecture Stores quantitative and qualitative survey data to support the validation report within the database.
 */
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const ValidationSurveySchema = new mongoose.Schema(
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
    survey_title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
      maxlength: 200,
    },
    responses_count: {
      type: Number,
      default: 0,
      min: 0,
    },
    interviews_count: {
      type: Number,
      default: 0,
      min: 0,
    },
    findings: {
      type: String,
      trim: true,
      maxlength: 5000,
      default: "",
    },
    status: {
      type: String,
      enum: ["draft", "completed"],
      default: "draft",
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

// Ensure one startup has many surveys but each survey is uniquely identified
ValidationSurveySchema.index({ startup_id: 1, created_at: -1 });
ValidationSurveySchema.index({ student_id: 1 });

/**
 * @module ValidationSurvey
 * @description Exports the ValidationSurvey Mongoose model.
 */
module.exports = mongoose.model("ValidationSurvey", ValidationSurveySchema);
