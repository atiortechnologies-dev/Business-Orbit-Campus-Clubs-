const mongoose = require("mongoose");

const StartupStageSchema = mongoose.Schema(
  {
    startup_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Startup",
      required: true,
    },
    stage_number: {
      type: Number,
      required: true,
    },
    stage_name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["locked", "active", "submitted", "approved", "rejected"],
      default: "locked",
    },
    started_at: {
      type: Date,
      default: null,
    },
    completed_at: {
      type: Date,
      default: null,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

// one startup can have only one stage row ( duplicate stages are not allowed )
StartupStageSchema.index({ startup_id: 1, stage_number: 1 }, { unique: true });

module.exports = mongoose.model("StartupStage", StartupStageSchema);
