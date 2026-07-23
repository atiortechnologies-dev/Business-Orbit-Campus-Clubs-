const express = require("express");
const router = express.Router();

const { protect } = require("../middlewares/authMiddleware");
const { getOnboardingStatus } = require("../controllers/onboarding.controller");

// GET /api/onboarding/status
router.get("/status", protect, getOnboardingStatus);

module.exports = router;
