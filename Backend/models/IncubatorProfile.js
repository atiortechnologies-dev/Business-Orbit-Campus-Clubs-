/**
 * @file IncubatorProfile.js
 * @description Defines the schema for Incubator-specific profile data (programs, cohorts, funding capabilities).
 * @architecture Extends the base User system through a separate collection/reference, enabling clean separation of role-specific attributes.
 */

const mongoose = require("mongoose");

const incubatorProfileSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    //^ Fields captured at Registration
    incubator_name: { type: String, required: true, trim: true },
    organization: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    website: { type: String, trim: true, default: "" },

    //^ Fields captured at onboarding
    profile_photo: { type: String, default: "" },
    bio: { type: String, trim: true, default: "" },
    skills: { type: [String], default: [] },
    linkedin_url: { type: String, trim: true, default: "" },
    portfolio_url: { type: String, trim: true, default: "" },

    organization_type: { type: String, trim: true, default: "" },
    supported_startup_domains: { type: [String], default: [] },
    services_offered: { type: [String], default: [] },
    contact_person: { type: String, trim: true, default: "" },

    profile_status: {
      type: String,
      enum: ["incomplete", "completed"],
      default: "incomplete",
    },
    profile_completed_at: { type: Date, default: null },

    //^ Discovery module fields (PRD alignment)
    description: { type: String, trim: true, default: "" },
    industry_focus: { type: [String], default: [] },
    supported_stages: {
      type: [String],
      default: ["Stage 1", "Stage 2", "Stage 3", "Stage 4", "Stage 5"],
    },
    application_deadline: { type: Date, default: null },
    location: { type: String, trim: true, default: "" },
    logo: { type: String, trim: true, default: "" },
    is_approved: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

module.exports = mongoose.model("IncubatorProfile", incubatorProfileSchema);
