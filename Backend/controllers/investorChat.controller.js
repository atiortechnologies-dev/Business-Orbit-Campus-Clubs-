/**
 * @file investorChat.controller.js
 * @description Handles chat functionalities between investors and startups.
 */

const mongoose = require("mongoose");
const asyncHandler = require("../middlewares/asyncHandler");
const InvestorChatRoom = require("../models/InvestorChatRoom");
const InvestorMessage = require("../models/InvestorMessage");
const Notification = require("../models/Notification");
const Startup = require("../models/Startup");

// ==========================================
// STUDENT -> INVESTOR
// ==========================================

/**
 * @desc    Start or retrieve a conversation with an investor
 * @route   POST /api/chat/investors/:investorId
 */
exports.startInvestorChat = asyncHandler(async (req, res) => {
  const { investorId } = req.params;
  const { startup_id } = req.body; // Since a student could have multiple startups, they should specify which one
  
  if (!startup_id) {
    return res.status(400).json({ success: false, message: "startup_id is required" });
  }

  let chatRoom = await InvestorChatRoom.findOne({ investor_id: investorId, startup_id });
  
  if (!chatRoom) {
    chatRoom = await InvestorChatRoom.create({
      investor_id: investorId,
      startup_id
    });
  }

  res.status(200).json({ success: true, data: chatRoom });
});

/**
 * @desc    Get all active conversations with investors
 * @route   GET /api/chat/investors
 */
exports.getInvestorChats = asyncHandler(async (req, res) => {
  const { startup_id } = req.query; // Filter by startup

  if (!startup_id) {
    return res.status(400).json({ success: false, message: "startup_id query parameter is required" });
  }

  const chatRooms = await InvestorChatRoom.find({ startup_id })
    .populate("investor_id", "full_name email");

  res.status(200).json({ success: true, data: chatRooms });
});

/**
 * @desc    Send a message to an investor
 * @route   POST /api/chat/investors/:investorId/messages
 */
exports.sendInvestorMessage = asyncHandler(async (req, res) => {
  const { investorId } = req.params;
  const { startup_id, message, attachment_url } = req.body;
  const senderId = req.user._id;

  if (!startup_id || !message) {
    return res.status(400).json({ success: false, message: "startup_id and message are required" });
  }

  const chatRoom = await InvestorChatRoom.findOne({ investor_id: investorId, startup_id });
  if (!chatRoom) {
    return res.status(404).json({ success: false, message: "Chat room not found" });
  }

  const newMessage = await InvestorMessage.create({
    chat_id: chatRoom._id,
    sender_id: senderId,
    message,
    attachment_url: attachment_url || ""
  });

  res.status(201).json({ success: true, data: newMessage });
});

/**
 * @desc    Get messages with an investor
 * @route   GET /api/chat/investors/:investorId/messages
 */
exports.getInvestorMessages = asyncHandler(async (req, res) => {
  const { investorId } = req.params;
  const { startup_id } = req.query;

  if (!startup_id) {
    return res.status(400).json({ success: false, message: "startup_id query parameter is required" });
  }

  const chatRoom = await InvestorChatRoom.findOne({ investor_id: investorId, startup_id });
  if (!chatRoom) {
    return res.status(404).json({ success: false, message: "Chat room not found" });
  }

  const messages = await InvestorMessage.find({ chat_id: chatRoom._id }).sort({ created_at: 1 });
  res.status(200).json({ success: true, data: messages });
});

// ==========================================
// INVESTOR -> STARTUP
// ==========================================

/**
 * @desc    Start or retrieve a conversation with a startup
 * @route   POST /api/chat/startups/:startupId
 */
exports.startStartupChat = asyncHandler(async (req, res) => {
  const { startupId } = req.params;
  const investorId = req.user._id;
  
  let chatRoom = await InvestorChatRoom.findOne({ investor_id: investorId, startup_id: startupId });
  
  if (!chatRoom) {
    chatRoom = await InvestorChatRoom.create({
      investor_id: investorId,
      startup_id: startupId
    });
  }

  res.status(200).json({ success: true, data: chatRoom });
});

/**
 * @desc    Get all active conversations with startups
 * @route   GET /api/chat/startups
 */
exports.getStartupChats = asyncHandler(async (req, res) => {
  const investorId = req.user._id;

  const chatRooms = await InvestorChatRoom.find({ investor_id: investorId })
    .populate("startup_id", "startup_name category");

  res.status(200).json({ success: true, data: chatRooms });
});

/**
 * @desc    Send a message to a startup
 * @route   POST /api/chat/startups/:startupId/messages
 */
exports.sendStartupMessage = asyncHandler(async (req, res) => {
  const { startupId } = req.params;
  const { message, attachment_url } = req.body;
  const investorId = req.user._id;

  if (!message) {
    return res.status(400).json({ success: false, message: "message is required" });
  }

  const chatRoom = await InvestorChatRoom.findOne({ investor_id: investorId, startup_id: startupId });
  if (!chatRoom) {
    return res.status(404).json({ success: false, message: "Chat room not found" });
  }

  const newMessage = await InvestorMessage.create({
    chat_id: chatRoom._id,
    sender_id: investorId,
    message,
    attachment_url: attachment_url || ""
  });

  res.status(201).json({ success: true, data: newMessage });
});

/**
 * @desc    Get messages with a startup
 * @route   GET /api/chat/startups/:startupId/messages
 */
exports.getStartupMessages = asyncHandler(async (req, res) => {
  const { startupId } = req.params;
  const investorId = req.user._id;

  const chatRoom = await InvestorChatRoom.findOne({ investor_id: investorId, startup_id: startupId });
  if (!chatRoom) {
    return res.status(404).json({ success: false, message: "Chat room not found" });
  }

  const messages = await InvestorMessage.find({ chat_id: chatRoom._id }).sort({ created_at: 1 });
  res.status(200).json({ success: true, data: messages });
});
