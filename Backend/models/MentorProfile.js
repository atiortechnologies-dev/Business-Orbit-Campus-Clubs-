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

    //^ Fields captured at Registration
    organization: { type: String, required: true, trim: true },
    designation: { type: String, required: true, trim: true },
    expertise: { type: String, required: true, trim: true },
    years_of_experience: { type: String, required: true },

    //^ Fields captured at onboarding
    profile_photo: { type: String, default: "" },
    bio: { type: String, trim: true, default: "" },
    skills: { type: [String], default: [] },
    linkedin_url: { type: String, trim: true, default: "" },
    portfolio_url: { type: String, trim: true, default: "" },

    mentoring_domains: { type: [String], default: [] },
    preferred_startup_stages: { type: [String], default: [] },
    availability: { type: String, trim: true, default: "" },

    rating: { type: Number, default: 0, min: 0, max: 5 },
    total_sessions: { type: Number, default: 0 },

    profile_status: {
      type: String,
      enum: ["incomplete", "completed"],
      default: "incomplete",
    },
    is_visible: { type: Boolean, default: true },
    profile_completed_at: { type: Date, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

module.exports = mongoose.model("MentorProfile", mentorProfileSchema);
