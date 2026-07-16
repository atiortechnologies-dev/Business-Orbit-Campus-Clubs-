/**
 * Goal: Defines the schema for the Incubator role profile.
 * Architecture relevance: Extends the base user data by storing incubator-specific attributes.
 * It is linked to the main User document to separate generic auth data from domain-specific data.
 */
const mongoose = require("mongoose");

const incubatorProfileSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    incubator_name: { type: String, required: true, trim: true },
    organization: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    website: { type: String, trim: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("IncubatorProfile", incubatorProfileSchema);
