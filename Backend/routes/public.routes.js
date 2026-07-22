/**
 * @file public.routes.js
 * @description Maps unauthenticated, public-facing HTTP endpoints to their respective controller functions.
 * @architecture Separates public API routes from authenticated ones, simplifying middleware application and security audits.
 */

const express = require("express");
const {
  getAuthRedirects,
  getFaqs,
  getStatistics,
  getPartnerLogos,
  getFeaturedStartups,
  getSuccessStories,
  createEnquiry,
  downloadPartnershipDeck,
} = require("../controllers/public.controller");

const router = express.Router();

router.get("/auth-redirects", getAuthRedirects);
router.get("/faqs", getFaqs);
router.get("/statistics/:pageType", getStatistics);
router.get("/partner-logos", getPartnerLogos);
router.get("/featured-startups", getFeaturedStartups);
router.get("/success-stories", getSuccessStories);
router.post("/enquiries", createEnquiry);
router.get("/documents/partnership-deck", downloadPartnershipDeck);

module.exports = router;
