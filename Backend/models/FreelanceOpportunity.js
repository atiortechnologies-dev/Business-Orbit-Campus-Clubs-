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
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    budget: { type: String, trim: true },
    skills_required: { type: [String], default: [] },
    duration: { type: String, trim: true },
    status: { type: String, enum: ["open", "in_progress", "completed", "cancelled"], default: "open", index: true },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("FreelanceOpportunity", freelanceOpportunitySchema);
