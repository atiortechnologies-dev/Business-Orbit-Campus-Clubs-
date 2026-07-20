const mongoose = require("mongoose");

const StartupSchema = new mongoose.Schema(
  {
    student_id: {
      type: ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    startup_name: {
      type: String,
      required: true,
      trim: true,
    },
    current_stage: {
      type: Number,
      default: 1,
    },
    progress_percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

module.exports = mongoose.model("Startup", StartupSchema);
