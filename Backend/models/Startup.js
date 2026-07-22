/**
 * @file Startup.js
 * @description Schema for Startup entities created by students.

 * @architecture Defines the data structure and MongoDB schema for this entity within the Mongoose ODM layer. */
const mongoose = require("mongoose");

const startupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    stage: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    idea: {
      type: String,
      required: true,
      trim: true,
    },
    progress: {
      type: String,
      trim: true,
    },
    pitch_deck: {
      type: String, // URL/path to the uploaded PDF/PPT
      trim: true,
    },
    mvp_details: {
      type: String,
      trim: true,
    },
    financials: {
      type: String, // URL/path to financial documents
      trim: true,
    },
    cohort: {
      type: String,
      trim: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

startupSchema.index({ name: "text" });

module.exports = mongoose.model("Startup", startupSchema);
