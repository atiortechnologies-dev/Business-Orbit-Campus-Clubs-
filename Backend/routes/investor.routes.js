/**
 * @file investor.routes.js
 * @description Routes for Investor Startup Discovery.
 */

const express = require("express");
const router = express.Router();
const investorDiscoveryController = require("../controllers/investorDiscovery.controller");
const investorChatController = require("../controllers/investorChat.controller");
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
router.get("/watchlist", investorDiscoveryController.getWatchlist);
router.post("/watchlist", investorDiscoveryController.addToWatchlist);
router.delete(
  "/watchlist/:startupId",
  investorDiscoveryController.removeFromWatchlist,
);
router.get("/watchlist/statistics", investorDiscoveryController.getWatchlistStatistics);

// Actions
router.post("/notes", investorDiscoveryController.addNote);
router.post("/request-meeting", investorDiscoveryController.requestMeeting);
// Conversations & Messages
router.post("/conversations", investorDiscoveryController.startConversation);
router.get("/conversations", investorChatController.getConversations);
router.get("/conversations/:conversationId", investorChatController.getConversationById);
router.get("/conversations/:conversationId/messages", investorChatController.getConversationMessages);
router.post("/conversations/:conversationId/messages", investorChatController.sendConversationMessage);
router.put("/conversations/:conversationId/read", investorChatController.markConversationRead);

// Startup Discovery & Profile
router.get("/startups/search", investorDiscoveryController.searchStartups);
router.get("/startups", investorDiscoveryController.getStartups);
router.get("/startups/:startupId", investorDiscoveryController.getStartupById);
router.post("/startups/filter", investorDiscoveryController.filterStartups);
router.get("/startups/:startupId/profile", investorDiscoveryController.getStartupProfile);
router.get("/startups/:startupId/pitch-deck", investorDiscoveryController.getStartupPitchDeck);

// Notifications & Activity Logs
router.get("/notifications", investorDiscoveryController.getNotifications);
router.put("/notifications/:notificationId/read", investorDiscoveryController.markNotificationRead);
router.get("/activity-log", investorDiscoveryController.getActivityLogs);

module.exports = router;
