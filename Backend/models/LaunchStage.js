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

module.exports = mongoose.model("LaunchStage", LaunchStageSchema);
