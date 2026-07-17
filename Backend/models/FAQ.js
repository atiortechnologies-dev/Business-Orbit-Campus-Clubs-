/**
 * @file FAQ.js
 * @description Defines the schema for Frequently Asked Questions displayed on the platform.
 * @architecture Provides a structured data layer for dynamic platform content management, distinct from user profiles.
 */

const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true, trim: true },
  answer: { type: String, required: true, trim: true },
  pageType: { 
    type: String, 
    required: true, 
    enum: ['Main Landing', 'Student', 'Mentor', 'Investor', 'Incubator', 'Company']
  }
}, { timestamps: true });

module.exports = mongoose.model('FAQ', faqSchema);
