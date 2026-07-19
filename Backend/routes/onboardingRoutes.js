const express = require("express");
const router = express.Router();

const onboardingController = require("../controllers/onboardingController");
const { protect } = require("../middlewares/authMiddleware");

// GET /api/onboarding/status
router.get("/status", protect, onboardingController.getOnboardingStatus);

module.exports = router;
