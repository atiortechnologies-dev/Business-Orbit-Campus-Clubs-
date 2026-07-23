const express = require("express");
const router = express.Router();

const { submitIdeaSchema, saveDraftSchema } = require("../utils/validators");
const { protect, requireRole } = require("../middlewares/authMiddleware");
const { validateRequest } = require("../middlewares/validateRequest");
const {
  submitIdea,
  saveDraft,
  getSubmissionStatus,
} = require("../controllers/submission.controller");

router.use(protect, requireRole("student"));

router.post("/submit", validateRequest(submitIdeaSchema), submitIdea);
router.put("/save-draft", validateRequest(saveDraftSchema), saveDraft);
router.get("/submission-status", getSubmissionStatus);

module.exports = router;
