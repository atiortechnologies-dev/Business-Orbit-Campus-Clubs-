/**
 * Goal: Defines the schema for the Mentor role profile.
 * Architecture relevance: Extends the base user data by storing mentor-specific attributes.
 * It is linked to the main User document to separate generic auth data from domain-specific data.
 */
const mongoose = require("mongoose");

const mentorProfileSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    organization: { type: String, required: true, trim: true },
    designation: { type: String, required: true, trim: true },
    expertise: { type: String, required: true, trim: true },
    years_of_experience: { type: Number, required: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("MentorProfile", mentorProfileSchema);
