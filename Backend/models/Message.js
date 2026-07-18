/**
 * @file Message.js
 * @description Schema for individual messages within a chat room.

 * @architecture Defines the data structure and MongoDB schema for this entity within the Mongoose ODM layer. */
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    chat_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ChatRoom",
      required: true,
      index: true,
    },
    sender_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    message: {
      type: String,
      trim: true,
    },
    attachment: {
      type: String, // URL/path for uploaded PDF, PPT, DOCX, Images
      trim: true,
    },
    is_read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

module.exports = mongoose.model("Message", messageSchema);
