const express = require("express");
const router = express.Router();
const { requireAuth, requireRole } = require("../middlewares/authMiddleware");
const { validateRequest } = require("../middlewares/validateRequest");
const adminDashboardController = require("../controllers/adminDashboard.controller");
const { createAnnouncementSchema } = require("../utils/validators");

router.use(requireAuth, requireRole("admin"));

// -- Dashboard Screen ---
// --- Overview ---
router.get("/overview", adminDashboardController.getOverview);

// --- Announcement Screen ---

router.get("/announcements", adminDashboardController.getAnnouncements);
router.post(
  "/announcements",
  validateRequest(createAnnouncementSchema),
  adminDashboardController.createAnnouncement,
);

// --- users verification ---

router.get(
  "/users/verification",
  adminDashboardController.getVerificationUsers,
);
router.get(
  "/users/verification/:id",
  adminDashboardController.getUserVerificationDetail,
);
router.post(
  "/users/verification/:id/decision",
  adminDashboardController.handleVerificationDecision,
);

// --- startup verification ---

router.get("/reviews", adminDashboardController.getReviewQueue);
router.get(
  "/reviews/:submissionId",
  adminDashboardController.getSubmissionDetail,
);
router.post(
  "/reviews/:submissionId/decision",
  adminDashboardController.handleSubmissionDecision,
);

router.get(
  "/meetings/prepare",
  adminDashboardController.getMeetingPrepareContext,
);
router.post("/meetings/schedule", adminDashboardController.scheduleMeeting);

router.get("/meetings", adminDashboardController.getMeeting);
router.get("/meetings/:id", adminDashboardController.getMeetingById);
router.post("/meetings/:id/cancel", adminDashboardController.cancelMeeting);
router.post(
  "/meetings/:id/reschedule",
  adminDashboardController.rescheduleMeeting,
);
router.post(
  "/meetings/:id/outcome",
  adminDashboardController.postMeetingOutcome,
);

// --- Chapters ---
router.get("/chapters", adminDashboardController.getChapters);

router.post("/chapters", adminDashboardController.createChapter);

router.get("/chapters/:id", adminDashboardController.getChapterDetails);

router.get("/startups/:id", adminDashboardController.getStartupDetails);

module.exports = router;
