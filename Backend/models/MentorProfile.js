const mongoose = require("mongoose");

const mentorProfileSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    organization: {
      type: String,
      required: true,
      trim: true,
    },
    designation: {
      type: String,
      required: true,
      trim: true,
    },
    expertise: {
      type: String,
      required: true,
      trim: true,
    },
    years_of_experience: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

module.exports = mongoose.model("MentorProfile", mentorProfileSchema);
