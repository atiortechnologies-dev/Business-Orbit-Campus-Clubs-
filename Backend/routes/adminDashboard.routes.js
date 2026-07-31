const express = require("express");
const router = express.Router();
const { protect, requireRole } = require("../middlewares/authMiddleware");
const { validateRequest } = require("../middlewares/validateRequest");
const adminDashboardController = require("../controllers/adminDashboard.controller");
const { createAnnouncementSchema } = require("../utils/validators");

router.use(protect, requireRole("admin"));

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

module.exports = router;
