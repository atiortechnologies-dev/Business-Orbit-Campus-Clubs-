/**
 * @file FeaturedStartup.js
 * @description Defines the schema for highlighting specific startups or projects on the platform.
 * @architecture Supports the content management capabilities of the platform, letting admins feature entities dynamically.
 */

const mongoose = require('mongoose');

const featuredStartupSchema = new mongoose.Schema({
  startupName: { type: String, required: true, trim: true },
  founder: { type: String, required: true, trim: true },
  stage: { type: String, trim: true },
  industry: { type: String, trim: true },
  fundingStatus: { type: String, trim: true },
  shortDescription: { type: String, trim: true },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('FeaturedStartup', featuredStartupSchema);
