const mongoose = require("mongoose");

const studentProfileSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    college: {
      type: string,
      required: true,
      trim: true,
    },
    degree: {
      type: string,
      required: true,
      trim: true,
    },
    graduation_year: {
      type: number,
      required: true,
    },
    // assigned later
    chapter_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chapter",
      default: null,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

module.exports = mongoose.model("StudentProfile", studentProfileSchema);
