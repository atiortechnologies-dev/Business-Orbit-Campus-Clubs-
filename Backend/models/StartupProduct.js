/**
 * @file StartupProduct.js
 * @description Mongoose model for defining the core product offering (Digital or Physical) of a startup.
 * @architecture Serves as the base data schema for a startup's main product definition within the database.
 */
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const StartupProductSchema = new mongoose.Schema(
  {
    startup_id: {
      type: ObjectId,
      ref: "Startup",
      required: true,
      // unique: true,
    },
    student_id: {
      type: ObjectId,
      ref: "User",
      required: true,
    },
    product_type: {
      type: String,
      enum: ["Digital", "Physical"],
      required: true,
    },
    product_description: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },
    selected_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

StartupProductSchema.index({ startup_id: 1 });

/**
 * @module StartupProduct
 * @description Exports the StartupProduct Mongoose model.
 */
module.exports = mongoose.model("StartupProduct", StartupProductSchema);
