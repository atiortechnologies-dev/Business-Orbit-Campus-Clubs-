/**
 * @file chat.routes.js
 * @description Unified API routes for chat functionalities accessible by both students and mentors.
 */

const express = require("express");
const router = express.Router();
const multer = require("multer");

const { requireAuth, authorizeRoles } = require("../middlewares/requireAuth");
const { validateRequest } = require("../middlewares/validateRequest");
const { searchChatsQuerySchema, sendMessageSchema } = require("../middlewares/validators/mentorValidators");

const {
  getChatRooms,
  searchChats,
  getChatMessages,
  sendMessage,
  uploadAttachment,
  markMessagesRead,
} = require("../controllers/chat.controller");

// Setup Multer for file uploads (mock basic config)
const upload = multer({ dest: "assets/uploads/" });

// Apply authentication middleware to all routes in this module
router.use(requireAuth);

// @route   GET /api/chat/conversations
// @desc    Get all chat rooms for the user
router.get("/conversations", getChatRooms);

// @route   GET /api/chat/conversations/search?q=
// @desc    Search Conversations
router.get(
  "/conversations/search",
  validateRequest(searchChatsQuerySchema, "query"),
  searchChats
);

// @route   GET /api/chat/messages/:chatId
// @desc    Load complete conversation messages
router.get("/messages/:chatId", getChatMessages);

// @route   POST /api/chat/send/:chatId
// @desc    Send a message
router.post(
  "/send/:chatId",
  validateRequest(sendMessageSchema, "body"),
  sendMessage
);

// @route   POST /api/chat/upload/:chatId
// @desc    Upload an attachment
router.post(
  "/upload/:chatId",
  upload.single("file"),
  uploadAttachment
);

// @route   PATCH /api/chat/read/:chatId
// @desc    Mark messages as read
router.patch("/read/:chatId", markMessagesRead);

module.exports = router;
