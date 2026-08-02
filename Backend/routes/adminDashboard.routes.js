/**
 * @file adminDashboard.routes.js
 * @description Routes for administrative dashboard operations.
 * @architecture Registers Express routes for admin features and delegates to adminDashboard controllers.
 */
const express = require("express");
/**
 * @desc    Admin dashboard routing module
 * @route   /api/admin
 * @access  Private (Admin)
 */
const router = express.Router();
const { protect, requireRole } = require("../middlewares/authMiddleware");
const { validateRequest } = require("../middlewares/validateRequest");
const {
  createAnnouncement,
  getAnnouncements,
  getOverview,
  getUpdates,
  dismissAction,
} = require("../controllers/adminDashboard.controller");
const { createAnnouncementSchema } = require("../utils/validators");

router.use(protect, requireRole(["admin", "super_admin"]));

// --- Dashboard ---
router.get("/overview", getOverview);
router.get("/updates", getUpdates);
router.patch("/actions", dismissAction);

// --- Announcement Screen ---

router.get("/announcements", getAnnouncements);
router.post(
  "/announcements",
  validateRequest(createAnnouncementSchema),
  createAnnouncement,
);

module.exports = router;
