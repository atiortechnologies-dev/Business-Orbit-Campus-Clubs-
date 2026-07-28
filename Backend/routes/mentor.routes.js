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
  toggleVisibility,
} = require("../controllers/mentorProfile.controller");

const {
  getAllPendingRequests,
  viewStudentProfile,
  acceptRequest,
  declineRequest,
} = require("../controllers/mentorRequest.controller");

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
router.post("/profile/photo", upload.single("file"), uploadProfilePhoto);
router.patch("/profile/visibility", toggleVisibility);

// Requests & Profiles
// Note (Extra): MentorAssignment and MentorRequest workflows were added to securely track the lifecycle of mentorships before meetings occur.
router.get("/requests", getAllPendingRequests);
router.get("/student/:studentId/profile", viewStudentProfile);
router.patch("/requests/:requestId/accept", acceptRequest);
router.patch("/requests/:requestId/decline", declineRequest);

// Chat functionality has been moved to /api/chat (Unified Chat API)

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
