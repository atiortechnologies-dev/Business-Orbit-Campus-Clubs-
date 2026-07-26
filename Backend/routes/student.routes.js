/**
 * @file student.routes.js
 * @description API routes for student/startup functionalities. Currently holds placeholders for future implementation.
 * @architecture Defines endpoints accessible by users with the student role.
 */

const express = require("express");
const router = express.Router();

const { requireAuth, authorizeRoles } = require("../middlewares/requireAuth");
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

// @route   GET /api/student/opportunities
// @desc    Get open opportunities
// @access  Private (Student)
router.get(
  "/opportunities",
  requireAuth,
  authorizeRoles("student"),
  companyOpportunityController.getAllOpportunities,
);
router.get(
  "/opportunities/:id",
  requireAuth,
  authorizeRoles("student"),
  companyOpportunityController.getOpportunityById,
);

// @route   POST /api/student/mentorship/request
// @desc    Submit a mentorship request to a mentor (Creates a MentorRequest)
// @access  Private (Student)
router.post(
  "/mentorship/request",
  requireAuth,
  authorizeRoles("student"),
  validateRequest(requestMentorSchema, "body"),
  requestMentor,
);

// Alias the old route just in case
router.post(
  "/mentors/:mentorId/request",
  requireAuth,
  authorizeRoles("student"),
  validateRequest(requestMentorSchema, "body"),
  requestMentor,
);

// @route   GET /api/student/mentorship/request-status
// @desc    Get student's pending requests and active connections
// @access  Private (Student)
router.get(
  "/mentorship/request-status",
  requireAuth,
  authorizeRoles("student"),
  getMentorshipRequestStatus,
);

// ==========================================
// MENTOR DIRECTORY & PROFILES
// ==========================================

// @route   GET /api/student/mentors
// @desc    List all approved mentors
// @access  Private (Student)
router.get("/mentors", requireAuth, authorizeRoles("student"), listMentors);

// @route   POST /api/student/mentors/filter
// @desc    Search and filter mentors
// @access  Private (Student)
router.post(
  "/mentors/filter",
  requireAuth,
  authorizeRoles("student"),
  searchMentors,
);

// @route   GET /api/student/mentors/:id
// @desc    Get full mentor profile
// @access  Private (Student)
router.get(
  "/mentors/:id",
  requireAuth,
  authorizeRoles("student"),
  getMentorProfileStudentView,
);

// @route   GET /api/student/mentors/:id/reviews
// @desc    Get mentor reviews
// @access  Private (Student)
router.get(
  "/mentors/:id/reviews",
  requireAuth,
  authorizeRoles("student"),
  getMentorReviews,
);

// @route   POST /api/student/mentors/:id/reviews
// @desc    Submit a mentor review
// @access  Private (Student)
router.post(
  "/mentors/:id/reviews",
  requireAuth,
  authorizeRoles("student"),
  validateRequest(mentorReviewSchema, "body"),
  submitMentorReview,
);

// @route   GET /api/student/mentors/:id/availability
// @desc    Get mentor availability
// @access  Private (Student)
router.get(
  "/mentors/:id/availability",
  requireAuth,
  authorizeRoles("student"),
  getMentorAvailability,
);

module.exports = router;
