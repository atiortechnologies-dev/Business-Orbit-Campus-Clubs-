/**
 * @file student.routes.js
 * @description API routes for student/startup functionalities. Currently holds placeholders for future implementation.
 * @architecture Defines endpoints accessible by users with the student role.
 */

const express = require("express");
const router = express.Router();

const { requireAuth, authorizeRoles } = require("../middlewares/requireAuth");
const { validateRequest } = require("../middlewares/validateRequest");
const { requestMentorSchema } = require("../utils/validators");
const { requestMentor } = require("../controllers/student.controller");

// @route   POST /api/student/mentors/:mentorId/request
// @desc    Submit a mentorship request to a mentor (Creates a MentorRequest)
// @access  Private (Student)
router.post(
  "/mentors/:mentorId/request",
  requireAuth,
  authorizeRoles("student"),
  validateRequest(requestMentorSchema, "body"),
  requestMentor,
);

module.exports = router;
