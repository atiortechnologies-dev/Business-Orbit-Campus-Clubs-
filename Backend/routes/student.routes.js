/**
 * @file student.routes.js
 * @description API routes for student/startup functionalities. Currently holds placeholders for future implementation.
 * @architecture Defines endpoints accessible by users with the student role.
 */

const express = require("express");
const router = express.Router();

/**
 * ============================================================================
 * 🚧 TODO: PRODUCTION_BLOCKER - STUDENT MODULE NOT YET IMPLEMENTED 🚧
 * ============================================================================
 * The following routes belong to the Student/Startup module, which was excluded
 * from the recent sprint (which focused purely on the Mentor Dashboard).
 *
 * Specifically, the endpoint to CREATE a mentorship request must be implemented
 * here before this application reaches production, otherwise students will
 * have no way to request mentors.
 * ============================================================================
 */

// @route   POST /api/student/mentors/:mentorId/request
// @desc    Submit a mentorship request to a mentor (Creates a MentorRequest)
// @access  Private (Student)
router.post("/mentors/:mentorId/request", (req, res) => {
  // TODO: Implement logic to validate student startup, create MentorRequest, and send notification.
  return res.status(501).json({
    success: false,
    message:
      "501 Not Implemented: The endpoint to request a mentor has not been built yet. This is a known production blocker.",
  });
});

module.exports = router;
