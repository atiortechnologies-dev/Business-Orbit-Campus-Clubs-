/**
 * Goal: Defines the base schema for all users in the system.
 * Architecture relevance: Serves as the core data model for authentication. It stores common
 * credentials and role information, and links to role-specific profile documents.
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
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      unique: true,
      sparse: true, // sparse allows null/undefined to not conflict with unique
    },
    password_hash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["student", "mentor", "investor", "incubator", "company", "admin"],
      required: true,
    },
    account_status: {
      type: String,
      enum: ["Pending Verification", "Approved", "Rejected"],
      default: "Pending Verification",
    },
    email_verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  },
);

const User = mongoose.model("User", userSchema);

module.exports = User;
