const express = require("express");
const router = express.Router();

const submissionController = require("../controllers/submissionController");
const { submitIdeaSchema, saveDraftSchema } = require("../utils/validators");
const { protect, requireRole } = require("../middlewares/authMiddleware");

router.use(protect, requireRole("student"));

router.post(
  "/submit",
  validateRequest(submitIdeaSchema),
  submissionController.submitIdea,
);
router.put(
  "/save-draft",
  validateRequest(saveDraftSchema),
  submissionController.saveDraft,
);
router.get("/submission-status", submissionController.getSubmissionStatus);

module.exports = router;
