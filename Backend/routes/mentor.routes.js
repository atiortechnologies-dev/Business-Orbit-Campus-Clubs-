/**
 * @file mentor.routes.js
 * @description API routes for mentor functionalities including dashboard, requests, chats, and meetings.
 * @architecture Defines the endpoints for the mentor module, delegating business logic to controllers.
 */

const express = require("express");
const router = express.Router();

const { validateRequest } = require("../middlewares/validateRequest");
const upload = require("../utils/uploadService");
const {
  scheduleMeetingSchema,
  sendMessageSchema,
  searchChatsQuerySchema,
} = require("../middlewares/validators/mentorValidators");

const {
  getDashboardSummary,
  getRecentRequests,
  getUpcomingMeetings,
  getRecentConversations,
} = require("../controllers/mentorDashboard.controller");

const {
  getAllPendingRequests,
  viewStudentProfile,
  acceptRequest,
  declineRequest,
} = require("../controllers/mentorRequest.controller");

const {
  searchChats,
  getChatRooms,
  getChatMessages,
  sendMessage,
  uploadAttachment,
  markMessagesRead,
} = require("../controllers/mentorChat.controller");

const {
  scheduleMeeting,
  getMeetings,
} = require("../controllers/mentorMeeting.controller");

const { getStartupDetails } = require("../controllers/startup.controller");

// Dashboard
router.get("/dashboard", getDashboardSummary);
router.get("/requests/recent", getRecentRequests);
router.get("/meetings/upcoming", getUpcomingMeetings);
router.get("/chats/recent", getRecentConversations);

// Requests & Profiles
router.get("/requests", getAllPendingRequests);
router.get("/student/:studentId/profile", viewStudentProfile);
router.patch("/requests/:requestId/accept", acceptRequest);
router.patch("/requests/:requestId/decline", declineRequest);

// Chat
router.get("/chats", getChatRooms);
router.get(
  "/chats/search",
  validateRequest(searchChatsQuerySchema, "query"),
  searchChats,
);
router.get("/chats/:chatId/messages", getChatMessages);
router.post(
  "/chats/:chatId/messages",
  validateRequest(sendMessageSchema, "body"),
  sendMessage,
);
router.post(
  "/chats/:chatId/attachments",
  upload.single("file"),
  uploadAttachment,
);
router.patch("/chats/:chatId/read", markMessagesRead);

// Meetings
router.post(
  "/meetings",
  validateRequest(scheduleMeetingSchema, "body"),
  scheduleMeeting,
);
router.get("/meetings", getMeetings);

// Startups
router.get("/startups/:startupId", getStartupDetails);

module.exports = router;
