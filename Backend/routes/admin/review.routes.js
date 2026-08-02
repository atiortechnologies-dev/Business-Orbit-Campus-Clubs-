/**
 * @file review.routes.js
 * @description Defines endpoints for the admin review queue and decision submission.
 * @architecture Mounted under /api/admin/reviews, inheriting admin auth middlewares.
 */

const express = require("express");
const router = express.Router();
const {
  getReviewQueue,
  getSubmissionDetail,
  submitReviewDecision,
} = require("../../controllers/admin/review.controller");

// Get the full queue of pending submissions
router.get("/", getReviewQueue);

// Get details of a specific submission
router.get("/:id", getSubmissionDetail);

// Submit a review decision (approve/reject)
router.post("/:id/decision", submitReviewDecision);

/**
 * @module adminReviewRoutes
 */
module.exports = router;
