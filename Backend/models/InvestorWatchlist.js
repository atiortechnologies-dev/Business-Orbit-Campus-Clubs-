/**
 * @file InvestorWatchlist.js
 * @description Startups saved by investors.
 */

const mongoose = require("mongoose");

const investorWatchlistSchema = new mongoose.Schema(
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
  },
  { timestamps: { createdAt: "added_at", updatedAt: false } }
);

// Prevent duplicates
investorWatchlistSchema.index({ investor_id: 1, startup_id: 1 }, { unique: true });

module.exports = mongoose.model("InvestorWatchlist", investorWatchlistSchema);
