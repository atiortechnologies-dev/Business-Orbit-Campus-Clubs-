/**
 * @file InvestorProfile.js
 * @description Defines the schema for Investor-specific profile data (investment thesis, portfolio, focus areas).
 * @architecture Extends the base User system through a separate collection/reference, enabling clean separation of role-specific attributes.
 */

const mongoose = require("mongoose");

const investorProfileSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    //^ Fields captured at Registration
    organization: { type: String, required: true, trim: true }, // Organization / Fund name
    designation: { type: String, trim: true, default: "" }, // PRD requirement
    investment_focus: { type: String, required: true, trim: true },
    investment_stage: { type: String, required: true, trim: true },
    profile_url: { type: String, trim: true, default: "" }, // website
    
    //^ Notification Preferences (PRD requirement)
    notification_preferences: {
      email_notifications: { type: Boolean, default: true },
      message_notifications: { type: Boolean, default: true },
      startup_updates: { type: Boolean, default: true },
      opportunity_notifications: { type: Boolean, default: true }
    },

    //^ Fields captured at onboarding
    profile_photo: { type: String, default: "" },
    bio: { type: String, trim: true, default: "" },
    skills: { type: [String], default: [] },
    linkedin_url: { type: String, trim: true, default: "" },
    portfolio_url: { type: String, trim: true, default: "" },

    investor_type: {
      type: String,
      enum: ["Angel", "VC", "Corporate"],
      default: null,
    },
    investment_sectors: { type: [String], default: [] },
    preferred_startup_stages: { type: [String], default: [] },
    investment_range: { type: String, trim: true, default: "" },
    funding_range: { type: String, trim: true, default: "" },
    location: { type: String, trim: true, default: "" },
    portfolio_details: { type: String, trim: true, default: "" },

    profile_status: {
      type: String,
      enum: ["incomplete", "completed"],
      default: "incomplete",
    },
    account_status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    profile_completed_at: { type: Date, default: null },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

module.exports = mongoose.model("InvestorProfile", investorProfileSchema);
