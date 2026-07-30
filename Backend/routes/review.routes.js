/**
 * @file review.routes.js
 * @description Provides a straightforward router for retrieving review results.
 * @architecture Restricted to authenticated students only.
 */

const express = require("express");
const router = express.Router();

const { protect, requireRole } = require("../middlewares/authMiddleware");
const { getReviewResult } = require("../controllers/review.controller");

router.get("/result", protect, requireRole("student"), getReviewResult);

/**
 * @module reviewRouter
 * @description Express router for fetching review results.
 */
module.exports = router;
