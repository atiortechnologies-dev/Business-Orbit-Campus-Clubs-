/**
 * @file PlatformSetting.js
 * @description Mongoose schema for Platform Settings, managing global configuration toggles.
 * @architecture Enforces singleton pattern by having only one record (usually).
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const platformSettingSchema = new Schema(
  {
    platform_name: {
      type: String,
      default: "BOCC Admin Portal",
      trim: true,
    },
    logo_url: {
      type: String,
      trim: true,
    },
    support_email: {
      type: String,
      trim: true,
    },
    timezone: {
      type: String,
      trim: true,
    },
    allow_new_registrations: {
      type: Boolean,
      default: true,
    },
    require_email_verification: {
      type: Boolean,
      default: true,
    },
    maintenance_mode: {
      type: Boolean,
      default: false,
    },
    public_profiles_visible: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

module.exports = mongoose.model("PlatformSetting", platformSettingSchema);
