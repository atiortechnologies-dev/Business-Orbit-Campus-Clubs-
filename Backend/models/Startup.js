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
    chapter_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chapter",
      default: null,
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
    // PRD Investor Journey fields
    logo: { type: String, default: "" },
    industry: { type: String, trim: true, default: "" },
    stage: { type: String, trim: true, default: "" },
    chapter: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
    funding_status: { type: String, trim: true, default: "" },
    visibility: { type: Boolean, default: false }, // if true, visible to investors

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
    const session = this.getOptions().session;
    await cascadeService.deleteStartupDependencies(doc._id, session);
  }
});

startupSchema.post(
  "deleteOne",
  { document: true, query: false },
  async function () {
    const session = this.$session();
    await cascadeService.deleteStartupDependencies(this._id, session);
  },
);

startupSchema.pre(
  "deleteOne",
  { document: false, query: true },
  async function () {
    const doc = await this.model
      .findOne(this.getFilter())
      .session(this.getOptions().session);
    if (doc) {
      this._cascadeStartupId = doc._id;
    }
  },
);

startupSchema.post(
  "deleteOne",
  { document: false, query: true },
  async function () {
    if (this._cascadeStartupId) {
      const session = this.getOptions().session;
      await cascadeService.deleteStartupDependencies(
        this._cascadeStartupId,
        session,
      );
    }
  },
);

module.exports = mongoose.model("Startup", startupSchema);
