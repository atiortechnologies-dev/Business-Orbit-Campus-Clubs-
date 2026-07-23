/**
 * @file mentor.routes.js
 * @description API routes for mentor functionalities including dashboard, requests, chats, and meetings.
 * @architecture Defines the endpoints for the mentor module, delegating business logic to controllers.
 */

const express = require("express");
const router = express.Router();

const { validateRequest } = require("../middlewares/validateRequest");
const { upload, uploadImage } = require("../utils/uploadService");
const {
  scheduleMeetingSchema,
  sendMessageSchema,
  addMeetingNotesSchema,
  searchChatsQuerySchema,
  updateMentorProfileSchema,
} = require("../middlewares/validators/mentorValidators");

const {
  getDashboardSummary,
  getRecentRequests,
  getUpcomingMeetings,
  getRecentConversations,
} = require("../controllers/mentorDashboard.controller");

const {
  getMentorProfile,
  updateMentorProfile,
  uploadProfilePhoto,
} = require("../controllers/mentorProfile.controller");

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
  getMeetingById,
  addMeetingNotes,
  completeMeeting,
} = require("../controllers/mentorMeeting.controller");

const { getStartupDetails } = require("../controllers/startup.controller");

// Dashboard
router.get("/dashboard", getDashboardSummary);
router.get("/requests/recent", getRecentRequests);
router.get("/meetings/upcoming", getUpcomingMeetings);
router.get("/chats/recent", getRecentConversations);

// Profile
router.get("/profile", getMentorProfile);
router.put(
  "/profile",
  validateRequest(updateMentorProfileSchema, "body"),
  updateMentorProfile,
);
router.post("/profile/photo", uploadImage.single("file"), uploadProfilePhoto);

// Requests & Profiles
// Note (Extra): MentorAssignment and MentorRequest workflows were added to securely track the lifecycle of mentorships before meetings occur.
router.get("/requests", getAllPendingRequests);
router.get("/student/:studentId/profile", viewStudentProfile);
router.patch("/requests/:requestId/accept", acceptRequest);
router.patch("/requests/:requestId/decline", declineRequest);

// Chat
// Note (Deviation): Generic /api/messages routes were moved to /api/mentor/chats for tighter role-based access control.
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
router.get("/meetings/:id", getMeetingById);
router.post(
  "/meetings/:id/notes",
  validateRequest(addMeetingNotesSchema, "body"),
  addMeetingNotes,
);
router.put("/meetings/:id/complete", completeMeeting);

// Startups
router.get("/startups/:startupId", getStartupDetails);

module.exports = router;
