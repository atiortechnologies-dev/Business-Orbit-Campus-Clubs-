/**
 * @file startup.routes.js
 * @description Serves endpoints for fetching startup progress details and timeline stages.
 * @architecture Designed exclusively for student access.
 */

const express = require("express");
const router = express.Router();

const { protect, requireRole, requireVerified } = require("../middlewares/authMiddleware");
const {
  getProgress,
  getStages,
} = require("../controllers/startupProgress.controller");

router.use(protect, requireVerified, requireRole("student"));

// GET api/startup/progress
router.get("/progress", getProgress);

// GET api/startup/stages
router.get("/stages", getStages);

/**
 * @module startupRouter
 * @description Express router for startup progress and stages endpoints.
 */
module.exports = router;
