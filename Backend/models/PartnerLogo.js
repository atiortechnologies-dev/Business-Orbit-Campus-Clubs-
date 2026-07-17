/**
 * @file PartnerLogo.js
 * @description Defines the schema for managing partner logos and their metadata for display on the landing page.
 * @architecture Manages dynamic visual assets as data, allowing administrators to update partners without code deployments.
 */

const mongoose = require('mongoose');

const partnerLogoSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  logoUrl: { type: String, required: true, trim: true },
  category: { 
    type: String, 
    required: true, 
    enum: ['College', 'Technology Partner', 'Incubator', 'Startup Partner', 'Business Partner']
  }
}, { timestamps: true });

module.exports = mongoose.model('PartnerLogo', partnerLogoSchema);
