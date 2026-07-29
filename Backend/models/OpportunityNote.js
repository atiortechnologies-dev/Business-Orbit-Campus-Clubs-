/**
 * @file OpportunityNote.js
 * @description Mongoose schema for notes left on an opportunity.
 * @architecture Associated with an Opportunity and an Admin/User.
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const opportunityNoteSchema = new Schema(
  {
    opportunity_id: { type: Schema.Types.ObjectId, ref: "FreelanceOpportunity", required: true, index: true },
    author_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    note_text: { type: String, required: true },
    
    // Legacy field
    content: { type: String },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("OpportunityNote", opportunityNoteSchema);
