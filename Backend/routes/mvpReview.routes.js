const express = require("express");
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
