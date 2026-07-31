/**
 * @file CustomerFeedback.js
 * @description Defines the Mongoose schema and model for storing customer feedback for startups.
 * @architecture Serves as a data model to collect and analyze user feedback, linking startups to their customers' insights and ratings.
 */
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const CustomerFeedbackSchema = new mongoose.Schema({
  startup_id: {
    type: ObjectId,
    ref: "Startup",
    required: true,
  },

  student_id: {
    type: ObjectId,
    ref: "User",
    required: true,
  },

  customer_name: {
    type: String,
    maxlength: 100,
    default: "Anonymous",
  },

  customer_type: {
    type: String,
    enum: [
      "Early Adopter",
      "Regular User",
      "Beta Tester",
      "Enterprise",
      "Other",
    ],
    required: true,
  },

  feedback_source: {
    type: String,
    enum: [
      "Direct Interview",
      "Survey",
      "Email",
      "Social Media",
      "Support Ticket",
      "Other",
    ],
    required: true,
  },

  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },

  feedback_summary: {
    type: String,
    maxlength: 2000,
    required: true,
  },

  improvement_notes: {
    type: String,
    maxlength: 1000,
    default: "",
  },

  is_important: {
    type: Boolean,
    default: false,
  },

  created_at: {
    type: Date,
    default: Date.now,
  },

  updated_at: {
    type: Date,
    default: Date.now,
  },
});

CustomerFeedbackSchema.index({ startup_id: 1 });
CustomerFeedbackSchema.index({ student_id: 1 });
CustomerFeedbackSchema.index({ rating: 1 });

/**
 * @module CustomerFeedback
 * @description Exports the CustomerFeedback Mongoose model.
 */
module.exports = mongoose.model("CustomerFeedback", CustomerFeedbackSchema);
