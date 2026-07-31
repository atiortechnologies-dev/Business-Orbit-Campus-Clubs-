/**
 * @file SavedOpportunity.js
 * @description Schema for opportunities saved by students for later reference.
 * @architecture Tracks the many-to-many relationship between students and opportunities.
 */

const mongoose = require("mongoose");

const savedOpportunitySchema = new mongoose.Schema(
  {
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    opportunity_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Opportunity",
      required: true,
      index: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

// 🛡️ Prevent a student from saving the same opportunity multiple times
savedOpportunitySchema.index(
  { student_id: 1, opportunity_id: 1 },
  { unique: true },
);

module.exports = mongoose.model("SavedOpportunity", savedOpportunitySchema);
