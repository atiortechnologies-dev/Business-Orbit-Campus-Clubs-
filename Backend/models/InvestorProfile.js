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
    organization: {
      type: String,
      required: true,
      trim: true,
    },
    investment_focus: {
      type: String,
      required: true,
      trim: true,
    },
    investment_stage: {
      type: String,
      required: true,
      trim: true,
    },
    profile_url: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

module.exports = mongoose.model("InvestorProfile", investorProfileSchema);
