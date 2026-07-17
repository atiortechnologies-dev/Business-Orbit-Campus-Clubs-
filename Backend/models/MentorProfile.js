/**
 * @file MentorProfile.js
 * @description Defines the schema for Mentor-specific profile data (expertise, availability, industry experience).
 * @architecture Extends the base User system through a separate collection/reference, enabling clean separation of role-specific attributes.
 */

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
