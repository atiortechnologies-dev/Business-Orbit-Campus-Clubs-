/**
 * @file FreelanceOpportunity.js
 * @description Mongoose schema for Freelance Opportunities.
 * @architecture Enforces relations to the Company (User).
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const freelanceOpportunitySchema = new Schema(
  {
    company_id: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true, trim: true, minlength: 5, maxlength: 100 },
    opportunity_type: { type: String, enum: ["JOB", "INTERNSHIP", "COLLABORATION", "PROJECT"] },
    category: { type: String, trim: true },
    work_mode: { type: String, enum: ["REMOTE", "ON_SITE", "HYBRID"] },
    description: { type: String, required: true },
    responsibilities: { type: String },
    required_skills: { type: [String], default: [] },
    eligibility: { type: String, trim: true },
    duration: { type: String, trim: true },
    compensation: { type: String, trim: true },
    deadline: { type: Date },
    status: { type: String, enum: ["DRAFT", "PENDING", "CHANGES_REQUESTED", "ACTIVE", "REJECTED", "EXPIRED", "open", "in_progress", "completed", "cancelled"], default: "DRAFT", index: true },
    assigned_reviewer_id: { type: Schema.Types.ObjectId, ref: "User" },
    
    // Legacy fields kept for backward compatibility
    budget: { type: String, trim: true },
    skills_required: { type: [String], default: [] },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("FreelanceOpportunity", freelanceOpportunitySchema);
