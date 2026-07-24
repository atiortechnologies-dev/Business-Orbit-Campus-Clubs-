/**
 * @file chat.controller.js
 * @description Handles unified chat functionalities for both mentors and students, including searching, sending, and marking messages read.
 * @architecture Controller layer isolating the real-time and RESTful chat business logic between mentors and students.
 */

const mongoose = require("mongoose");
const asyncHandler = require("../middlewares/asyncHandler");
const ChatRoom = require("../models/ChatRoom");
const Message = require("../models/Message");
const MentorAssignment = require("../models/MentorAssignment");
const User = require("../models/User");
const Startup = require("../models/Startup");
const Notification = require("../models/Notification");
const { getHydratedChatRooms } = require("../services/chatRoomService");
const { ASSIGNMENT_STATUS } = require("../constants/statusConstants");

/**
 * @desc    Verify user access to chat room
 * @helper
 */
const verifyChatAccess = async (userId, role, chatRoom) => {
  if (role === "mentor") {
    if (chatRoom.mentor_id.toString() !== userId.toString()) {
      const error = new Error("Unauthorized: You are not part of this chat.");
      error.statusCode = 403;
      throw error;
    }
  } else if (role === "student") {
    if (chatRoom.student_id.toString() !== userId.toString()) {
      const error = new Error("Unauthorized: You are not part of this chat.");
      error.statusCode = 403;
      throw error;
    }
  } else {
    const error = new Error("Unauthorized role for chat.");
    error.statusCode = 403;
    throw error;
  }

  // Ensure there is an active MentorAssignment
  const assignment = await MentorAssignment.findOne({
    mentor_id: chatRoom.mentor_id,
    student_id: chatRoom.student_id,
    startup_id: chatRoom.startup_id,
    status: ASSIGNMENT_STATUS.ACTIVE,
  });

  if (!assignment) {
    const error = new Error("Unauthorized: Mentorship assignment is no longer active.");
    error.statusCode = 403;
    throw error;
  }
};

/**
 * @desc    Get all chat rooms for the user
 * @route   GET /api/chat/conversations
 * @access  Private (Mentor/Student)
 */
exports.getChatRooms = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  const role = req.user.role;

  const chatRooms = await getHydratedChatRooms(userId, role);

  res.status(200).json(chatRooms);
});

/**
 * @desc    Search Conversations
 * @route   GET /api/chat/conversations/search?q=
 * @access  Private (Mentor/Student)
 */
exports.searchChats = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;
  const role = req.user.role;
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ message: "Search query is required." });
  }

  // 1. Perform Text Search on User and Startup collections to gather matching IDs.
  let users = [];
  let startups = [];

  if (role === "mentor") {
    users = await User.find({ $text: { $search: q }, role: "student" }).select("_id");
    startups = await Startup.find({ $text: { $search: q } }).select("_id");
  } else if (role === "student") {
    users = await User.find({ $text: { $search: q }, role: "mentor" }).select("_id");
    // Startups search might not apply directly for student searching mentors, but let's keep it robust
  }

  const userIds = users.map((u) => u._id);
  const startupIds = startups.map((s) => s._id);

  if (userIds.length === 0 && startupIds.length === 0) {
    return res.status(200).json([]);
  }

  // 2. Fetch ChatRooms matching the user and any of the found match IDs
  const matchObj = role === "mentor" ? { mentor_id: userId } : { student_id: userId };
  const targetField = role === "mentor" ? "student_id" : "mentor_id";
  
  const searchOr = [ { [targetField]: { $in: userIds } } ];
  if (startupIds.length > 0) {
    searchOr.push({ startup_id: { $in: startupIds } });
  }

  const chatRooms = await ChatRoom.find({
    ...matchObj,
    $or: searchOr,
  })
    .populate("student_id", "full_name")
    .populate("mentor_id", "full_name")
    .populate("startup_id", "startup_name")
    .lean();

  const formattedRooms = chatRooms.map((room) => ({
    chatId: room._id,
    studentId: room.student_id?._id,
    mentorId: room.mentor_id?._id,
    startupId: room.startup_id?._id,
    participantName: role === "mentor" ? room.student_id?.full_name : room.mentor_id?.full_name,
    startupName: room.startup_id?.startup_name,
  }));

  res.status(200).json(formattedRooms);
});

/**
 * @desc    Load complete conversation messages
 * @route   GET /api/chat/messages/:chatId
 * @access  Private (Mentor/Student)
 */
exports.getChatMessages = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const userId = req.user.id || req.user._id;
  const role = req.user.role;

  const chatRoom = await ChatRoom.findOne({ _id: chatId });
  if (!chatRoom) {
    return res
      .status(404)
      .json({ message: "Chat room not found." });
  }

  await verifyChatAccess(userId, role, chatRoom);

  const messages = await Message.find({ chat_id: chatId })
    .sort({ created_at: 1 })
    .lean();

  res.status(200).json({ messages });
});

/**
 * @desc    Send a message
 * @route   POST /api/chat/send/:chatId
 * @access  Private (Mentor/Student)
 */
exports.sendMessage = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const { message } = req.body;
  const userId = req.user.id || req.user._id;
  const role = req.user.role;

  if (!message || message.trim() === "") {
    return res
      .status(400)
      .json({ message: "Message content cannot be empty." });
  }

  if (message.length > 20000) {
    return res
      .status(400)
      .json({ message: "Message is too long. Maximum allowed length is 20000 characters." });
  }

  const chatRoom = await ChatRoom.findOne({ _id: chatId });
  if (!chatRoom) {
    return res
      .status(404)
      .json({ message: "Chat room not found." });
  }

  await verifyChatAccess(userId, role, chatRoom);

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [newMessage] = await Message.create([{
      chat_id: chatId,
      sender_id: userId,
      message: message.trim(),
    }], { session });

    const recipientId = chatRoom.mentor_id.toString() === userId.toString() ? chatRoom.student_id : chatRoom.mentor_id;
    await Notification.create([{
      recipient_id: recipientId,
      title: "New Chat Message",
      message: `You have received a new message from ${req.user.full_name || "a user"}.`,
      type: "info",
    }], { session });

    await session.commitTransaction();
    res.status(201).json(newMessage);
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

/**
 * @desc    Upload an attachment
 * @route   POST /api/chat/upload/:chatId
 * @access  Private (Mentor/Student)
 */
exports.uploadAttachment = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const userId = req.user.id || req.user._id;
  const role = req.user.role;

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  const chatRoom = await ChatRoom.findOne({ _id: chatId });
  if (!chatRoom) {
    return res
      .status(404)
      .json({ message: "Chat room not found." });
  }

  await verifyChatAccess(userId, role, chatRoom);

  // Generate public URL based on the file path
  const attachmentUrl = `/assets/uploads/${req.file.filename}`;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [newMessage] = await Message.create([{
      chat_id: chatId,
      sender_id: userId,
      message: req.body.message || "",
      attachment_url: attachmentUrl,
      message_type: "file",
    }], { session });

    const recipientId = chatRoom.mentor_id.toString() === userId.toString() ? chatRoom.student_id : chatRoom.mentor_id;
    await Notification.create([{
      recipient_id: recipientId,
      title: "New File Received",
      message: `You have received a new file attachment from ${req.user.full_name || "a user"}.`,
      type: "info",
    }], { session });

    await session.commitTransaction();
    res.status(201).json(newMessage);
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

/**
 * @desc    Mark messages as read
 * @route   PATCH /api/chat/read/:chatId
 * @access  Private (Mentor/Student)
 */
exports.markMessagesRead = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const userId = req.user.id || req.user._id;
  const role = req.user.role;

  const chatRoom = await ChatRoom.findOne({ _id: chatId });
  if (!chatRoom) {
    return res
      .status(404)
      .json({ message: "Chat room not found." });
  }

  await verifyChatAccess(userId, role, chatRoom);

  await Message.updateMany(
    { chat_id: chatId, sender_id: { $ne: userId }, read_at: null },
    { $set: { read_at: new Date() } },
  );

  res.status(200).json({ message: "Messages marked as read." });
});
