/**
 * @file User.js
 * @description Defines the schema for the core User collection, handling authentication credentials and base user details.
 * @architecture Acts as the foundational data model upon which specialized profiles (Student, Mentor, etc.) are built or referenced.
 */

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },
    password_hash: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["student", "mentor", "investor", "incubator", "company"],
      required: true,
    },
    account_status: {
      type: String,
      enum: [
        "pending_verification",
        "pending_approval",
        "active",
        "rejected",
        "suspended",
      ],
      default: "pending_verification",
    },
    email_verified: {
      type: Boolean,
      default: false,
    },
    profile_status: {
      type: String,
      enum: ["not_started", "skipped", "completed"],
      default: "not_started",
    },
    otp_code_hash: {
      type: String,
      select: false,
    },
    otp_expires_at: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
);

userSchema.index({ full_name: "text" });

const cascadeService = require("../services/cascadeService");

// Cascade deletion is now handled explicitly in the controllers using transactions.

module.exports = mongoose.model("User", userSchema);
