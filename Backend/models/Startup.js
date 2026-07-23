/**
 * @file Startup.js
 * @description Schema for Startup entities created by students.

 * @architecture Defines the data structure and MongoDB schema for this entity within the Mongoose ODM layer. */
const mongoose = require("mongoose");

const startupSchema = new mongoose.Schema(
  {
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    startup_name: {
      type: String,
      required: true,
      trim: true,
    },
    current_stage: {
      type: Number,
      default: 1,
    },
    progress_percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    // name: {
    //   type: String,
    //   required: true,
    //   trim: true,
    // },
    // stage: {
    //   type: String,
    //   required: true,
    //   trim: true,
    // },
    category: {
      type: String,
      // required: true,
      trim: true,
    },
    idea: {
      type: String,
      // required: true,
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

startupSchema.index({ startup_name: "text" });

const cascadeService = require("../services/cascadeService");

startupSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await cascadeService.deleteStartupDependencies(doc._id);
  }
});

startupSchema.post("deleteOne", { document: true, query: false }, async function () {
  await cascadeService.deleteStartupDependencies(this._id);
});

module.exports = mongoose.model("Startup", startupSchema);
