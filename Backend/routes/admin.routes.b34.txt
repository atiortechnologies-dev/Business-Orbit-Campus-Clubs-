/**
 * @file admin.routes.js
 * @description Maps administrative HTTP endpoints to their respective controller functions.
 * @architecture Groups all highly privileged routes together, making it trivial to apply admin-only authorization middlewares globally to this router.
 */

const express = require("express");
const { protect, requireRole } = require("../middlewares/authMiddleware");
const {
  getFaqsAdmin,
  createFaq,
  updateFaq,
  deleteFaq,
  getStatisticsAdmin,
  createStatistic,
  updateStatistic,
  deleteStatistic,
  getPartnerLogosAdmin,
  createPartnerLogo,
  updatePartnerLogo,
  deletePartnerLogo,
  getSuccessStoriesAdmin,
  createSuccessStory,
  updateSuccessStory,
  deleteSuccessStory,
  getFeaturedStartupsAdmin,
  createFeaturedStartup,
  updateFeaturedStartup,
  deleteFeaturedStartup,
  getUsers,
  deleteUser,
  listChapterChangeRequests,
  getChapterChangeRequest,
  approveChapterChangeRequest,
  rejectChapterChangeRequest,
  bulkApproveChapterChangeRequests,
} = require("../controllers/admin.controller");

const router = express.Router();

// Apply JWT authentication and role-based access control
router.use(protect);
router.use(requireRole(["admin", "super_admin"]));

// FAQ Routes
router.get("/faqs", getFaqsAdmin);
router.post("/faqs", createFaq);
router.put("/faqs/:id", updateFaq);
router.delete("/faqs/:id", deleteFaq);

// Statistic Routes
router.get("/statistics", getStatisticsAdmin);
router.post("/statistics", createStatistic);
router.put("/statistics/:id", updateStatistic);
router.delete("/statistics/:id", deleteStatistic);

// PartnerLogo Routes
router.get("/partner-logos", getPartnerLogosAdmin);
router.post("/partner-logos", createPartnerLogo);
router.put("/partner-logos/:id", updatePartnerLogo);
router.delete("/partner-logos/:id", deletePartnerLogo);

// SuccessStory Routes
router.get("/success-stories", getSuccessStoriesAdmin);
router.post("/success-stories", createSuccessStory);
router.put("/success-stories/:id", updateSuccessStory);
router.delete("/success-stories/:id", deleteSuccessStory);

// FeaturedStartup Routes
router.get("/featured-startups", getFeaturedStartupsAdmin);
router.post("/featured-startups", createFeaturedStartup);
router.put("/featured-startups/:id", updateFeaturedStartup);

// Opportunity Moderation Routes
const opportunityRoutes = require("./admin/opportunity.routes");
router.use("/opportunities", opportunityRoutes);

// Chapter Governance Routes
const chapterGovernanceRoutes = require("./admin/chapter.routes");
router.use("/chapters", chapterGovernanceRoutes);

// Review Queue Routes
const adminReviewRoutes = require("./admin/review.routes");
router.use("/reviews", adminReviewRoutes);

// Meeting Routes
const adminMeetingRoutes = require("./admin/meeting.routes");
router.use("/meetings", adminMeetingRoutes);

router.delete("/featured-startups/:id", deleteFeaturedStartup);

// User Verification Routes
const verificationRoutes = require("./admin/verification.routes");
router.use("/users/verification", verificationRoutes);

// User Management Routes
router.get("/users", getUsers);
router.delete("/users/:id", deleteUser);

// Chapter Change Request Routes
router.get("/chapter-change-requests", listChapterChangeRequests);
router.get("/chapter-change-requests/:id", getChapterChangeRequest);
router.post("/chapter-change-requests/bulk-approve", bulkApproveChapterChangeRequests);
router.put("/chapter-change-requests/:id/approve", approveChapterChangeRequest);
router.put("/chapter-change-requests/:id/reject", rejectChapterChangeRequest);

module.exports = router;
