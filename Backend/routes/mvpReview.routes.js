/**
 * @file mvpReview.routes.js
 * @description Routes for MVP review and meeting management.
 * @architecture Exposes endpoints for students to view MVP review feedback and manage review meetings.
 */
const express = require("express");
/**
 * @desc    MVP Review routing module
 * @route   /api/mvp-review
 * @access  Private (Student)
 */
const router = express.Router();
const {
  getReviewMeeting,
  requestMeetingReschedule,
} = require("../controllers/validation.controller");
const { getReviewFeedback } = require("../controllers/mvpReview.controller");
const { protect, requireRole } = require("../middlewares/authMiddleware");

router.use(protect, requireRole("student"));

router.get("/mvp/meeting", getReviewMeeting);
router.post("/mvp/reschedule", requestMeetingReschedule);
router.get("/mvp/review", getReviewFeedback);

module.exports = router;
