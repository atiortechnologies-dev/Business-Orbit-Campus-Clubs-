/**
 * @file MVPChecklist.js
 * @description Mongoose model for tracking a startup's Minimum Viable Product (MVP) checklist progress.
 * @architecture Serves as the data schema for MVP checklists in the MongoDB database, used by the checklist controller to monitor startup progress.
 */
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const MVPChecklistSchema = new mongoose.Schema(
  {
    startup_id: {
      type: ObjectId,
      ref: "Startup",
      required: true,
      unique: true,
    },
    student_id: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        name: {
          type: String,
          enum: [
            "Select Product Type",
            "Plan MVP",
            "Build MVP",
            "Request Atior Support",
            "Submit MVP",
          ],
        },
        is_completed: {
          type: Boolean,
          default: false,
        },
        completed_at: Date,
      },
    ],
    progress_percentage: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

/**
 * @module MVPChecklist
 * @description Exports the MVPChecklist Mongoose model.
 */
module.exports = mongoose.model("MVPChecklist", MVPChecklistSchema);
