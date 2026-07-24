/**
 * @file InvestorMessage.js
 * @description Schema for individual messages within an investor-founder chat room.
 * @architecture Ensures separation of investor communications from standard mentor chats.
 */

const mongoose = require("mongoose");

const investorMessageSchema = new mongoose.Schema(
  {
    chat_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "InvestorChatRoom",
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
      required: true,
    },
    is_read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

module.exports = mongoose.model("InvestorMessage", investorMessageSchema);
