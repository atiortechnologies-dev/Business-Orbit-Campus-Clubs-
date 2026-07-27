/**
 * @file Opportunity.js
 * @description Schema for job/internship opportunities posted by Companies.
 * @architecture Enforces relations to the Company (User) and manages the posting lifecycle.
 */

const mongoose = require("mongoose");

const opportunitySchema = new mongoose.Schema(
  {
    company_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // ⚡ Performance: Fast lookups for a company's postings
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["Job", "Internship", "Freelance", "Part-time", "Project", "Other"],
      required: true,
    },
    work_mode: {
      type: String,
      enum: ["Remote", "Hybrid", "On-site"],
    },
    industry: {
      type: String,
      trim: true,
    },
    experience_level: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    required_skills: {
      type: [String],
      default: [],
    },
    location: {
      type: String,
      trim: true,
    },
    salary_stipend: {
      type: String,
      trim: true,
    },
    salary_range: {
      type: String,
      trim: true,
    },
    application_deadline: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["draft", "open", "active", "closed"],
      default: "open",
      index: true, // ⚡ Performance: Fast filtering by active status
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

// ⚡ Performance: Text index for global search features
opportunitySchema.index({ title: "text", description: "text" });

module.exports = mongoose.model("Opportunity", opportunitySchema);
