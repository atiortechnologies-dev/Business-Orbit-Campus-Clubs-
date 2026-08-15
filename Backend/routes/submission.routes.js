/**
 * @file submission.routes.js
 * @description Handles the startup/idea submission pipeline for students.
 * @architecture Utilizes request validation for payloads and handles idea submission, drafts, and status checks.
 */

const express = require("express");
const router = express.Router();

const { submitIdeaSchema, saveDraftSchema } = require("../utils/validators");
const { validateRequest } = require("../middlewares/validateRequest");
const {
  submitIdea,
  saveDraft,
  getSubmissionStatus,
} = require("../controllers/submission.controller");
const { requireAuth, requireRole } = require("../middlewares/authMiddleware");

router.use(requireAuth, requireRole("student"));

router.post("/submit", validateRequest(submitIdeaSchema), submitIdea);
router.put("/save-draft", validateRequest(saveDraftSchema), saveDraft);
router.get("/submission-status", getSubmissionStatus);

/**
 * @module submissionRouter
 * @description Express router for student submission endpoints.
 */
module.exports = router;
