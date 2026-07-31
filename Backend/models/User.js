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
    avatar_url: {
      type: String,
      trim: true,
    },
    designation: {
      type: String,
      trim: true,
    },
    password_hash: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: [
        "student",
        "mentor",
        "investor",
        "incubator",
        "company",
        "admin",
        "super_admin",
      ],
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

userSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    const session = this.getOptions().session;
    await cascadeService.deleteUserDependencies(doc._id, session);
  }
});

userSchema.post(
  "deleteOne",
  { document: true, query: false },
  async function () {
    const session = this.$session();
    await cascadeService.deleteUserDependencies(this._id, session);
  },
);

userSchema.pre(
  "deleteOne",
  { document: false, query: true },
  async function () {
    const doc = await this.model
      .findOne(this.getFilter())
      .session(this.getOptions().session);
    if (doc) {
      this._cascadeUserId = doc._id;
    }
  },
);

userSchema.post(
  "deleteOne",
  { document: false, query: true },
  async function () {
    if (this._cascadeUserId) {
      const session = this.getOptions().session;
      await cascadeService.deleteUserDependencies(this._cascadeUserId, session);
    }
  },
);

module.exports = mongoose.model("User", userSchema);
