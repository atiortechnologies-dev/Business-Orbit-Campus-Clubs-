/**
 * @file student.routes.js
 * @description API routes for student/startup functionalities. Currently holds placeholders for future implementation.
 * @architecture Defines endpoints accessible by users with the student role.
 */

const express = require("express");
const router = express.Router();

const { validateRequest } = require("../middlewares/validateRequest");
const {
  requestMentorSchema,
  mentorReviewSchema,
} = require("../utils/validators");
const {
  requestMentor,
  getMentorshipRequestStatus,
  listMentors,
  searchMentors,
  getMentorProfileStudentView,
  getMentorReviews,
  submitMentorReview,
  getMentorAvailability,
} = require("../controllers/student.controller");
const companyOpportunityController = require("../controllers/companyOpportunity.controller");
const notificationController = require("../controllers/notification.controller");
const activityLogController = require("../controllers/activityLog.controller");
const { requireAuth, requireRole } = require("../middlewares/authMiddleware");

// @route   GET /api/student/opportunities
// @desc    Get open opportunities
// @access  Private (Student)
router.get(
  "/opportunities",
  requireAuth,
  requireRole("student"),
  companyOpportunityController.getAllOpportunities,
);
router.get(
  "/opportunities/:id",
  requireAuth,
  requireRole("student"),
  companyOpportunityController.getOpportunityById,
);

// @route   POST /api/student/mentorship/request
// @desc    Submit a mentorship request to a mentor (Creates a MentorRequest)
// @access  Private (Student)
router.post(
  "/mentorship/request",
  requireAuth,
  requireRole("student"),
  validateRequest(requestMentorSchema, "body"),
  requestMentor,
);

// Alias the old route just in case
router.post(
  "/mentors/:mentorId/request",
  requireAuth,
  requireRole("student"),
  validateRequest(requestMentorSchema, "body"),
  requestMentor,
);

// @route   GET /api/student/mentorship/request-status
// @desc    Get student's pending requests and active connections
// @access  Private (Student)
router.get(
  "/mentorship/request-status",
  requireAuth,
  requireRole("student"),
  getMentorshipRequestStatus,
);

// ==========================================
// MENTOR DIRECTORY & PROFILES
// ==========================================

// @route   GET /api/student/mentors
// @desc    List all approved mentors
// @access  Private (Student)
router.get("/mentors", requireAuth, requireRole("student"), listMentors);

// @route   POST /api/student/mentors/filter
// @desc    Search and filter mentors
// @access  Private (Student)
router.post(
  "/mentors/filter",
  requireAuth,
  requireRole("student"),
  searchMentors,
);

// @route   GET /api/student/mentors/:id
// @desc    Get full mentor profile
// @access  Private (Student)
router.get(
  "/mentors/:id",
  requireAuth,
  requireRole("student"),
  getMentorProfileStudentView,
);

// @route   GET /api/student/mentors/:id/reviews
// @desc    Get mentor reviews
// @access  Private (Student)
router.get(
  "/mentors/:id/reviews",
  requireAuth,
  requireRole("student"),
  getMentorReviews,
);

// @route   POST /api/student/mentors/:id/reviews
// @desc    Submit a mentor review
// @access  Private (Student)
router.post(
  "/mentors/:id/reviews",
  requireAuth,
  requireRole("student"),
  validateRequest(mentorReviewSchema, "body"),
  submitMentorReview,
);

// @route   GET /api/student/mentors/:id/availability
// @desc    Get mentor availability
// @access  Private (Student)
router.get(
  "/mentors/:id/availability",
  requireAuth,
  requireRole("student"),
  getMentorAvailability,
);

// ==========================================
// NOTIFICATIONS & ACTIVITY LOGS
// ==========================================

// @route   GET /api/student/notifications
// @desc    Get user notifications
// @access  Private (Student)
router.get(
  "/notifications",
  requireAuth,
  requireRole("student"),
  notificationController.getNotifications,
);

// @route   PUT /api/student/notifications/:notificationId/read
// @desc    Mark a notification as read
// @access  Private (Student)
router.put(
  "/notifications/:notificationId/read",
  requireAuth,
  requireRole("student"),
  notificationController.markNotificationRead,
);

// @route   GET /api/student/activity-log
// @desc    Get user activity logs
// @access  Private (Student)
router.get(
  "/activity-log",
  requireAuth,
  requireRole("student"),
  activityLogController.getActivityLogs,
);

module.exports = router;
