/**
 * @file LaunchStage.js
 * @description Defines the Mongoose schema and model for tracking the overarching launch stage of a startup.
 * @architecture Provides a high-level state machine in the database to monitor the progression of a startup's launch journey.
 */
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const LaunchStageSchema = new mongoose.Schema(
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

    stage_status: {
      type: String,
      enum: ["Not Started", "In Progress", "Completed"],
      default: "Not Started",
    },

    started_at: Date,
    completed_at: Date,

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

LaunchStageSchema.index({ startup_id: 1 });
LaunchStageSchema.index({ student_id: 1 });

/**
 * @module LaunchStage
 * @description Exports the LaunchStage Mongoose model.
 */
module.exports = mongoose.model("LaunchStage", LaunchStageSchema);
