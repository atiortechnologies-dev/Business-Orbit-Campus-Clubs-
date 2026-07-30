/**
 * @file EmailVerification.js
 * @description Defines the schema for storing temporary email verification tokens and their expiration dates.
 * @architecture Isolates short-lived, security-sensitive token data from the main User model for better security and lifecycle management.
 */

/**
 * Goal: Manages email verification tokens for users.
 * Architecture relevance: Stores generated verification tokens temporarily to validate user email addresses during the registration process.
 */
const mongoose = require("mongoose");

const emailVerificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    used: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

const EmailVerification = mongoose.model(
  "EmailVerification",
  emailVerificationSchema,
);

module.exports = EmailVerification;
