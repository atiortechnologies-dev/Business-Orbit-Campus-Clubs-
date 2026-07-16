/**
 * Goal: Defines the schema for the Student role profile.
 * Architecture relevance: Extends the base user data by storing student-specific attributes.
 * It is linked to the main User document to separate generic auth data from domain-specific data.
 */
const mongoose = require("mongoose");

const studentProfileSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    college: { type: String, required: true, trim: true },
    degree: { type: String, required: true, trim: true },
    graduation_year: { type: Number, required: true },
    chapter_id: { type: mongoose.Schema.Types.ObjectId, ref: "Chapter" }, // To be linked later
  },
  { timestamps: true },
);

module.exports = mongoose.model("StudentProfile", studentProfileSchema);
