/**
 * @file onboarding.routes.js
 * @description Exposes a protected endpoint to check a user's onboarding progression status.
 * @architecture Uses the protect middleware to ensure only authenticated users can check their status.
 */

const express = require("express");
const router = express.Router();

const { requireAuth } = require("../middlewares/authMiddleware");
const { getOnboardingStatus } = require("../controllers/onboarding.controller");

// GET /api/onboarding/status
router.get("/status", requireAuth, getOnboardingStatus);

module.exports = router;
