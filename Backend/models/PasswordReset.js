/**
 * @file PasswordReset.js
 * @description Defines the schema for storing password reset tokens securely along with their expiration limits.
 * @architecture Follows best practices by keeping transient authentication recovery data separate from persistent user records.
 */

const mongoose = require("mongoose");

const passwordResetSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reset_token: {
      type: String,
      required: true,
    },
    expires_at: {
      type: Date,
      required: true,
    },
    used: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

module.exports = mongoose.model("PasswordReset", passwordResetSchema);
