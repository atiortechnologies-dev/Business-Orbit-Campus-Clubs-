/**
 * @file Statistic.js
 * @description Defines the schema for tracking platform metrics and statistics (e.g., total users, successful matches).
 * @architecture Centralizes analytical data storage, decoupling metrics tracking from live transactional data queries.
 */

const mongoose = require("mongoose");

const statisticSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    value: { type: String, required: true, trim: true },
    landingPage: {
      type: String,
      required: true,
      enum: ["Main Landing", "Student", "Mentor", "Investor", "Company"],
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Statistic", statisticSchema);
