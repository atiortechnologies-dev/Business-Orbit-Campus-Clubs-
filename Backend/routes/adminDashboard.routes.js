const express = require("express");
const router = express.Router();
const { protect, requireRole } = require("../middlewares/authMiddleware");
const { validateRequest } = require("../middlewares/validateRequest");
const adminDashboardController = require("../controllers/adminDashboard.controller");
const { createAnnouncementSchema } = require("../utils/validators");

const auditLogRoutes = require("./admin/auditLog.routes");
const chapterRoutes = require("./admin/chapter.routes");
const opportunityRoutes = require("./admin/opportunity.routes");
const settingsRoutes = require("./admin/settings.routes");

router.use(protect, requireRole("admin"));

// --- Overview ---
router.get("/overview", adminDashboardController.getOverview);

// --- Announcement Screen ---

router.get("/announcements", adminDashboardController.getAnnouncements);
router.post(
  "/announcements",
  validateRequest(createAnnouncementSchema),
  adminDashboardController.createAnnouncement,
);

// --- users directory ---
router.get("/users/all", adminDashboardController.getAllUsers);

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

// --- newly integrated routes from backend_reetabrata ---
router.use("/audit-logs", auditLogRoutes);
router.use("/chapters", chapterRoutes);
router.use("/opportunities", opportunityRoutes);
router.use("/settings", settingsRoutes);

module.exports = router;
