/**
 * Goal: Defines the schema for the Company role profile.
 * Architecture relevance: Extends the base user data by storing company-specific attributes.
 * It is linked to the main User document to separate generic auth data from domain-specific data.
 */
const mongoose = require("mongoose");

const companyProfileSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    company_name: { type: String, required: true, trim: true },
    industry: { type: String, required: true, trim: true },
    company_size: { type: String, required: true, trim: true },
    website: { type: String, required: true, trim: true },
    contact_person: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("CompanyProfile", companyProfileSchema);
