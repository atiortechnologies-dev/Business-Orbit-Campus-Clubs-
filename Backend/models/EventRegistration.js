/**
 * @file EventRegistration.js
 * @description Mongoose schema for users registering for a ChapterEvent.
 */

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventRegistrationSchema = new Schema(
  {
    event_id: {
      type: Schema.Types.ObjectId,
      ref: "ChapterEvent",
      required: true,
      index: true,
    },
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["REGISTERED", "ATTENDED", "CANCELLED"],
      default: "REGISTERED",
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

// Prevent duplicate registrations
eventRegistrationSchema.index({ event_id: 1, user_id: 1 }, { unique: true });

module.exports = mongoose.model("EventRegistration", eventRegistrationSchema);
