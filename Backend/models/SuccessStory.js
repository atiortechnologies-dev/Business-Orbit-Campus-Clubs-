/**
 * @file SuccessStory.js
 * @description Defines the schema for user success stories and testimonials.
 * @architecture Acts as a dynamic content model for the marketing/landing pages, managed via the admin panel.
 */

const mongoose = require('mongoose');

const successStorySchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  name: { type: String, required: true, trim: true },
  organization: { type: String, required: true, trim: true },
  image: { type: String, trim: true },
  storyType: { 
    type: String, 
    required: true, 
    enum: ['Founder', 'Mentor', 'Investor', 'Incubator', 'Company']
  },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('SuccessStory', successStorySchema);
