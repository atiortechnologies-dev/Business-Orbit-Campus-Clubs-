/**
 * @file submission.routes.js
 * @description Handles the startup/idea submission pipeline for students.
 * @architecture Utilizes request validation for payloads and handles idea submission, drafts, and status checks.
 */

const express = require("express");
const router = express.Router();

const { submitIdeaSchema, saveDraftSchema } = require("../utils/validators");
const { protect, requireRole, requireVerified } = require("../middlewares/authMiddleware");
const { validateRequest } = require("../middlewares/validateRequest");
const {
  submitIdea,
  saveDraft,
  getSubmissionStatus,
} = require("../controllers/submission.controller");

router.use(protect, requireVerified, requireRole("student"));

router.post("/submit", validateRequest(submitIdeaSchema), submitIdea);
router.put("/save-draft", validateRequest(saveDraftSchema), saveDraft);
router.get("/submission-status", getSubmissionStatus);

/**
 * @module submissionRouter
 * @description Express router for student submission endpoints.
 */
module.exports = router;
