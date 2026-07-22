/**
 * @file CompanyProfile.js
 * @description Defines the schema for Company-specific profile data (industry, size, job postings).
 * @architecture Extends the base User system through a separate collection/reference, enabling clean separation of role-specific attributes.
 */

const mongoose = require("mongoose");

const companyProfileSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    //^ Fields captured at Registration
    company_name: { type: String, required: true, trim: true },
    industry: { type: String, required: true, trim: true },
    company_size: { type: String, required: true, trim: true },
    website: { type: String, required: true, trim: true },
    contact_person: { type: String, required: true, trim: true },

    //^ Fields captured at onboarding
    profile_photo: { type: String, default: "" },
    bio: { type: String, trim: true, default: "" },
    skills: { type: [String], default: [] },
    linkedin_url: { type: String, trim: true, default: "" },
    portfolio_url: { type: String, trim: true, default: "" },

    hiring_domains: { type: [String], default: [] },

    profile_status: {
      type: String,
      enum: ["incomplete", "completed"],
      default: "incomplete",
    },
    profile_completed_at: { type: Date, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

module.exports = mongoose.model("CompanyProfile", companyProfileSchema);
