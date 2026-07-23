/**
 * @file InvestorNote.js
 * @description Private notes added by investors for a specific startup.
 */

const mongoose = require("mongoose");

const investorNoteSchema = new mongoose.Schema(
  {
    investor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    startup_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Startup",
      required: true,
    },
    note: {
      type: String,
      required: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: false } }
);

module.exports = mongoose.model("InvestorNote", investorNoteSchema);
