/**
 * @file PlatformSetting.js
 * @description Mongoose model for storing global platform configurations and settings.
 * @architecture Acts as the central settings schema for the admin portal, allowing dynamic configuration of features like registration and maintenance mode.
 */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const platformSettingSchema = new Schema(
  {
    platform_name: { type: String, default: "BOCC Admin Portal" },
    logo_url: { type: String },
    support_email: { type: String },
    timezone: { type: String },
    allow_new_registrations: { type: Boolean, default: true },
    require_email_verification: { type: Boolean, default: true },
    maintenance_mode: { type: Boolean, default: false },
    public_profiles_visible: { type: Boolean, default: true },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
);

/**
 * @module PlatformSetting
 * @description Exports the PlatformSetting Mongoose model.
 */
module.exports = mongoose.model("PlatformSetting", platformSettingSchema);
