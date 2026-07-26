/**
 * @file InvestorChatRoom.js
 * @description Schema representing a chat room between an investor and a founder.
 */
const mongoose = require("mongoose");

const investorChatRoomSchema = new mongoose.Schema(
  {
    investor_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    startup_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Startup",
      required: true,
      index: true,
    },
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } },
);

// Ensure only one chat room per investor-startup combo
investorChatRoomSchema.index(
  { investor_id: 1, startup_id: 1 },
  { unique: true },
);

module.exports = mongoose.model("InvestorChatRoom", investorChatRoomSchema);
