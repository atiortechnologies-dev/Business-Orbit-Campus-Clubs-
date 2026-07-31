/**
 * @file mvpSubmission.routes.js
 * @description Routes for MVP submission operations.
 * @architecture Provides endpoints for students to submit, view, and update their MVP details.
 */
const express = require("express");
/**
 * @desc    MVP Submission routing module
 * @route   /api/mvp-submission
 * @access  Private (Student)
 */
const router = express.Router();

const {
  mvpSubmissionSchema,
  updateMVPSubmissionSchema,
} = require("../utils/validators");
const {
  getMVPSubmission,
  updateMVPSubmission,
  submitMVP,
} = require("../controllers/mvpSubmission.controller");
const { protect, requireRole } = require("../middlewares/authMiddleware");
const { validateRequest } = require("../middlewares/validateRequest");

router.use(protect, requireRole("student"));

router.post("/mvp/submit", validateRequest(mvpSubmissionSchema), submitMVP);

router.get("/mvp", getMVPSubmission);

router.put(
  "/mvp",
  validateRequest(updateMVPSubmissionSchema),
  updateMVPSubmission,
);

module.exports = router;
