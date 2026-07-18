/**
 * @file ContactEnquiry.js
 * @description Defines the schema for storing user inquiries submitted through the contact form.
 * @architecture Provides a persistent storage mechanism for incoming communications, acting as a simple CRM layer.
 */

const mongoose = require("mongoose");

const contactEnquirySchema = new mongoose.Schema(
  {
    companyName: { type: String, required: true, trim: true },
    contactPerson: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      match: [/.+@.+\..+/, "Please enter a valid email"],
    },
    phone: { type: String, trim: true },
    message: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("ContactEnquiry", contactEnquirySchema);
