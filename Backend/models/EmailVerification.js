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
