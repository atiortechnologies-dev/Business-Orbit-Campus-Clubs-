/**
 * @file investor.routes.js
 * @description Routes for Investor Startup Discovery.
 */

const express = require("express");
const router = express.Router();
const investorDiscoveryController = require("../controllers/investorDiscovery.controller");
const {
  requireAuth,
  authorizeRoles,
  requireActiveAccount,
} = require("../middlewares/requireAuth");

// All routes require authentication, active account, and investor role
router.use(requireAuth, requireActiveAccount, authorizeRoles("investor"));

// Dashboard
router.get("/dashboard", investorDiscoveryController.getDashboard);
router.get("/dashboard/stats", investorDiscoveryController.getStats);
router.get("/recommendations", investorDiscoveryController.getRecommendations);

// Pitches
router.get("/pitches", investorDiscoveryController.getPitches);
router.get("/pitches/:id", investorDiscoveryController.getPitchDetails);
router.get("/pitch/:id", investorDiscoveryController.getPitchDetails); // Alias for Viewer
router.post("/pitches/filter", investorDiscoveryController.filterPitches);
router.post("/pitch/view", investorDiscoveryController.trackPitchView);

// Watchlist
router.post("/watchlist", investorDiscoveryController.addToWatchlist);
router.delete(
  "/watchlist/:id",
  investorDiscoveryController.removeFromWatchlist,
);

// Actions
router.post("/notes", investorDiscoveryController.addNote);
router.post("/request-meeting", investorDiscoveryController.requestMeeting);
router.post("/conversations", investorDiscoveryController.startConversation);

module.exports = router;
