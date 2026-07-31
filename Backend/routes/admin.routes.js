/**
 * @file admin.routes.js
 * @description Maps administrative HTTP endpoints to their respective controller functions.
 * @architecture Groups all highly privileged routes together, making it trivial to apply admin-only authorization middlewares globally to this router.
 */

const express = require("express");
const { adminAuth } = require("../middlewares/adminAuth");
const {
  createFaq,
  updateFaq,
  deleteFaq,
  createStatistic,
  updateStatistic,
  deleteStatistic,
  createPartnerLogo,
  updatePartnerLogo,
  deletePartnerLogo,
  createSuccessStory,
  updateSuccessStory,
  deleteSuccessStory,
  createFeaturedStartup,
  updateFeaturedStartup,
  deleteFeaturedStartup,
  getUsers,
  deleteUser,
  listChapterChangeRequests,
  getChapterChangeRequest,
  approveChapterChangeRequest,
  rejectChapterChangeRequest,
} = require("../controllers/admin.controller");

const router = express.Router();

// Apply admin auth middleware to all routes in this file
router.use(adminAuth);

// FAQ Routes
router.post("/faqs", createFaq);
router.put("/faqs/:id", updateFaq);
router.delete("/faqs/:id", deleteFaq);

// Statistic Routes
router.post("/statistics", createStatistic);
router.put("/statistics/:id", updateStatistic);
router.delete("/statistics/:id", deleteStatistic);

// PartnerLogo Routes
router.post("/partner-logos", createPartnerLogo);
router.put("/partner-logos/:id", updatePartnerLogo);
router.delete("/partner-logos/:id", deletePartnerLogo);

// SuccessStory Routes
router.post("/success-stories", createSuccessStory);
router.put("/success-stories/:id", updateSuccessStory);
router.delete("/success-stories/:id", deleteSuccessStory);

// FeaturedStartup Routes
router.post("/featured-startups", createFeaturedStartup);
router.put("/featured-startups/:id", updateFeaturedStartup);

// Opportunity Moderation Routes
const opportunityRoutes = require("./admin/opportunity.routes");
router.use("/opportunities", opportunityRoutes);

// Chapter Governance Routes
const chapterGovernanceRoutes = require("./admin/chapter.routes");
router.use("/chapters", chapterGovernanceRoutes);

router.delete("/featured-startups/:id", deleteFeaturedStartup);

// User Management Routes
router.get("/users", getUsers);
router.delete("/users/:id", deleteUser);

// Chapter Change Request Routes
router.get("/chapter-change-requests", listChapterChangeRequests);
router.get("/chapter-change-requests/:id", getChapterChangeRequest);
router.put("/chapter-change-requests/:id/approve", approveChapterChangeRequest);
router.put("/chapter-change-requests/:id/reject", rejectChapterChangeRequest);

module.exports = router;
