/**
 * @file Announcement.js
 * @description Defines the Mongoose schema and model for global announcements.
 * @architecture Acts as the central data model for announcements that can be broadcasted to different user groups in the platform.
 */
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const AnnouncementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 150,
      trim: true,
    },

    short_summary: {
      type: String,
      required: true,
      maxlength: 250,
      trim: true,
    },

    body_content: {
      type: String,
      required: true,
      minlength: 50,
    },

    target_audience: {
      type: [String],
      enum: ["Students", "Mentors", "Investors", "Faculty", "All Users"],
      required: true,
    },

    priority: {
      type: String,
      enum: ["Normal", "Important", "Critical"],
      default: "Normal",
    },

    status: {
      type: String,
      enum: ["Draft", "Scheduled", "Published", "Archived"],
      default: "Draft",
    },

    author_id: {
      type: ObjectId,
      ref: "User",
      required: true,
    },

    created_at: {
      type: Date,
      default: Date.now,
    },

    updated_at: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

AnnouncementSchema.index({ status: 1, published_at: -1 });
AnnouncementSchema.index({ author_id: 1 });
AnnouncementSchema.index({ created_at: -1 });

/**
 * @module Announcement
 * @description Exports the Announcement Mongoose model.
 */
module.exports = mongoose.model("Announcement", AnnouncementSchema);
