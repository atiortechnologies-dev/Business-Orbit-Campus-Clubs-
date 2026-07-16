/**
 * Goal: Defines the schema for the Investor role profile.
 * Architecture relevance: Extends the base user data by storing investor-specific attributes.
 * It is linked to the main User document to separate generic auth data from domain-specific data.
 */
const mongoose = require("mongoose");

const investorProfileSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    organization: { type: String, required: true, trim: true },
    investment_focus: { type: String, required: true, trim: true },
    investment_stage: { type: String, required: true, trim: true },
    profile_url: { type: String, trim: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("InvestorProfile", investorProfileSchema);
