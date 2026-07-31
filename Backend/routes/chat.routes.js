/**
 * @file chat.routes.js
 * @description Unified API routes for chat functionalities accessible by both students and mentors.
 */

const express = require("express");
const router = express.Router();
const multer = require("multer");

const {
  requireAuth,
  requireActiveAccount,
} = require("../middlewares/requireAuth");
const { validateRequest } = require("../middlewares/validateRequest");
const {
  searchChatsQuerySchema,
  sendMessageSchema,
} = require("../middlewares/validators/mentorValidators");

const {
  getChatRooms,
  createChatRoom,
  searchChats,
  getChatMessages,
  sendMessage,
  uploadAttachment,
  markMessagesRead,
} = require("../controllers/chat.controller");

// Setup Multer for file uploads (mock basic config)
const upload = multer({ dest: "assets/uploads/" });

// Apply authentication and active account middleware to all routes in this module
router.use(requireAuth, requireActiveAccount);

// @route   GET /api/chat/conversations
// @desc    Get all chat rooms for the user
router.get("/conversations", getChatRooms);

// @route   POST /api/chat/conversations
// @desc    Create a chat room
router.post("/conversations", createChatRoom);

// @route   GET /api/chat/conversations/search?q=
// @desc    Search Conversations
router.get(
  "/conversations/search",
  validateRequest(searchChatsQuerySchema, "query"),
  searchChats,
);

// @route   GET /api/chat/conversations/:id/messages
// @desc    Load complete conversation messages
router.get("/conversations/:id/messages", getChatMessages);

// @route   POST /api/chat/conversations/:id/messages
// @desc    Send a message
router.post(
  "/conversations/:id/messages",
  validateRequest(sendMessageSchema, "body"),
  sendMessage,
);

// @route   POST /api/chat/upload/:id
// @desc    Upload an attachment
router.post("/upload/:id", upload.single("file"), uploadAttachment);

// @route   PATCH /api/chat/conversations/:id/read
// @desc    Mark messages as read
router.patch("/conversations/:id/read", markMessagesRead);

module.exports = router;
