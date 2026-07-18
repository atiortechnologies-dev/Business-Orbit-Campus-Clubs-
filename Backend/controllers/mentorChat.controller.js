/**
 * @file mentorChat.controller.js
 * @description Handles mentor chat functionalities including searching, sending, and marking messages read.
 * @architecture Controller layer isolating the real-time and RESTful chat business logic between mentors and startups.
 */

const asyncHandler = require("../middlewares/asyncHandler");
const ChatRoom = require("../models/ChatRoom");
const Message = require("../models/Message");
const MentorAssignment = require("../models/MentorAssignment");
const User = require("../models/User");
const Startup = require("../models/Startup");
const { getHydratedChatRooms } = require("../services/chatRoomService");
const { ASSIGNMENT_STATUS } = require("../constants/statusConstants");

/**
 * @desc    Verify mentor access to startup chat
 * @helper
 */
const verifyMentorAccess = async (mentorId, startupId) => {
  const assignment = await MentorAssignment.findOne({
    mentor_id: mentorId,
    startup_id: startupId,
    status: ASSIGNMENT_STATUS.ACTIVE,
  });
  if (!assignment) {
    const error = new Error(
      "Unauthorized: Mentor is not actively assigned to this startup.",
    );
    error.statusCode = 403;
    throw error;
  }
};

/**
 * @desc    Get all chat rooms for the mentor
 * @route   GET /api/mentor/chats
 * @access  Private (Mentor)
 */
exports.getChatRooms = asyncHandler(async (req, res) => {
  const mentorId = req.user._id;

  const chatRooms = await getHydratedChatRooms(mentorId);

  res.status(200).json(chatRooms);
});

/**
 * @desc    Search Conversations
 * @route   GET /api/mentor/chats/search?q=
 * @access  Private (Mentor)
 */
exports.searchChats = asyncHandler(async (req, res) => {
  const mentorId = req.user._id;
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ message: "Search query is required." });
  }

  // 1. Perform Text Search on User and Startup collections to gather matching IDs.
  // This utilizes MongoDB Text Indexes and prevents ReDoS vulnerabilities associated with unstructured RegEx matching.
  const [users, startups] = await Promise.all([
    User.find({ $text: { $search: q }, role: "student" }).select("_id"),
    Startup.find({ $text: { $search: q } }).select("_id"),
  ]);

  const userIds = users.map((u) => u._id);
  const startupIds = startups.map((s) => s._id);

  if (userIds.length === 0 && startupIds.length === 0) {
    return res.status(200).json([]);
  }

  // 2. Fetch ChatRooms matching the mentor and any of the found student/startup IDs
  const chatRooms = await ChatRoom.find({
    mentor_id: mentorId,
    $or: [
      { student_id: { $in: userIds } },
      { startup_id: { $in: startupIds } },
    ],
  })
    .populate("student_id", "full_name")
    .populate("startup_id", "name")
    .lean();

  const formattedRooms = chatRooms.map((room) => ({
    chatId: room._id,
    studentId: room.student_id?._id,
    startupId: room.startup_id?._id,
    studentName: room.student_id?.full_name,
    startupName: room.startup_id?.name,
  }));

  res.status(200).json(formattedRooms);
});

/**
 * @desc    Load complete conversation messages
 * @route   GET /api/mentor/chats/{chatId}
 * @access  Private (Mentor)
 */
exports.getChatMessages = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const mentorId = req.user._id;

  const chatRoom = await ChatRoom.findOne({ _id: chatId, mentor_id: mentorId });
  if (!chatRoom) {
    return res
      .status(404)
      .json({ message: "Chat room not found or unauthorized." });
  }

  const messages = await Message.find({ chat_id: chatId })
    .sort({ created_at: 1 })
    .lean();

  res.status(200).json({ messages });
});

/**
 * @desc    Send a message
 * @route   POST /api/mentor/chats/{chatId}/messages
 * @access  Private (Mentor)
 */
exports.sendMessage = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const { message } = req.body;
  const mentorId = req.user._id;

  if (!message || message.trim() === "") {
    return res
      .status(400)
      .json({ message: "Message content cannot be empty." });
  }

  const chatRoom = await ChatRoom.findOne({ _id: chatId, mentor_id: mentorId });
  if (!chatRoom) {
    return res
      .status(404)
      .json({ message: "Chat room not found or unauthorized." });
  }

  await verifyMentorAccess(mentorId, chatRoom.startup_id);

  const newMessage = await Message.create({
    chat_id: chatId,
    sender_id: mentorId,
    message: message.trim(),
  });

  res.status(201).json(newMessage);
});

/**
 * @desc    Upload an attachment
 * @route   POST /api/mentor/chats/{chatId}/attachments
 * @access  Private (Mentor)
 */
exports.uploadAttachment = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const mentorId = req.user._id;

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  const chatRoom = await ChatRoom.findOne({ _id: chatId, mentor_id: mentorId });
  if (!chatRoom) {
    return res
      .status(404)
      .json({ message: "Chat room not found or unauthorized." });
  }

  await verifyMentorAccess(mentorId, chatRoom.startup_id);

  // Generate public URL based on the file path (assumes assets/ is statically served)
  const attachmentUrl = `/assets/uploads/${req.file.filename}`;

  const newMessage = await Message.create({
    chat_id: chatId,
    sender_id: mentorId,
    message: req.body.message || "", // Optional caption
    attachment: attachmentUrl,
  });

  res.status(201).json(newMessage);
});

/**
 * @desc    Mark messages as read
 * @route   PATCH /api/mentor/chats/{chatId}/read
 * @access  Private (Mentor)
 */
exports.markMessagesRead = asyncHandler(async (req, res) => {
  const { chatId } = req.params;
  const mentorId = req.user._id;

  const chatRoom = await ChatRoom.findOne({ _id: chatId, mentor_id: mentorId });
  if (!chatRoom) {
    return res
      .status(404)
      .json({ message: "Chat room not found or unauthorized." });
  }

  await Message.updateMany(
    { chat_id: chatId, sender_id: { $ne: mentorId }, is_read: false },
    { $set: { is_read: true } },
  );

  res.status(200).json({ message: "Messages marked as read." });
});
