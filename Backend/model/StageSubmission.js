const mongoose = require("mongoose");

const StageSubmissionSchema = mongoose.Schema(
  {
    startup_id: {
      type: ObjectId,
      ref: "Startup",
      required: true,
    },
    stage_id: {
      type: ObjectId,
      ref: "StartupStage",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 5000,
    },
    attachment_url: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["draft", "pending_review", "approved", "rejected"],
      default: "draft",
    },
    // assigned_reviewer_id: {
    //     type: ObjectId,
    //     ref: "User",
    //     default: null
    // },
    submitted_at: {
      type: Date,
      default: null,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

// sorts the data in ascending order ( Performance Booster )
stageSubmissionSchema.index({ startup_id: 1, stage_id: 1 });

module.exports = mongoose.model("StageSubmission", StageSubmissionSchema);
