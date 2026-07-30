const express = require("express");
const router = express.Router();
const { protect, requireRole } = require("../middlewares/authMiddleware");
const { validateRequest } = require("../middlewares/validateRequest");
const {
  createAnnouncement,
  getAnnouncements,
} = require("../controllers/adminDashboard.controller");
const { createAnnouncementSchema } = require("../utils/validators");

router.use(protect, requireRole("admin"));

// --- Announcement Screen ---

router.get("/announcements", getAnnouncements);
router.post(
  "/announcements",
  validateRequest(createAnnouncementSchema),
  createAnnouncement,
);

module.exports = router;
