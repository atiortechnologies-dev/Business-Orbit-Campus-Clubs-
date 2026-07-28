/**
 * @file Resource.js
 * @description Mongoose schema for educational and startup resources.
 * @architecture Implements text indexing on title and description for fast search functionality.
 */

const mongoose = require("mongoose");

const ResourceSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    file_url: {
      type: String,
      required: true,
    },
    download_count: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

ResourceSchema.index({ title: "text", description: "text" });

/**
 * @module Resource
 */
module.exports = mongoose.model("Resource", ResourceSchema);
