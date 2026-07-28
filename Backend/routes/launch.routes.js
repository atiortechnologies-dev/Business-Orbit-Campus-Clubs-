const express = require("express");
const { protect, requireRole } = require("../middlewares/authMiddleware");
const router = express.Router();
const launchController = require("../controllers/launch.controller");
const { validateRequest } = require("../middlewares/validateRequest");
const {
  saveLaunchDraftSchema,
  submitLaunchSchema,
} = require("../utils/validators");

router.use(protect, requireRole("student"));

// SCREEN 1: LAUNCH OVERVIEW

router.get("/stages/launch", launchController.getLaunchOverview);
router.get("/stages/launch/checklist", launchController.getLaunchChecklist);
router.post("/stages/launch/start", launchController.startLaunchStage);

// SCREEN 2: LAUNCH SUBMISSION

router.post(
  "/stages/launch/submission/draft",
  validateRequest(saveLaunchDraftSchema),
  launchController.saveLaunchDraft,
);
router.get("/stages/launch/submission", launchController.getLaunchSubmission);
router.put(
  "/stages/launch/submission",
  validateRequest(saveLaunchDraftSchema),
  launchController.updateLaunchSubmission,
);
router.post(
  "/stages/launch/submission/submit",
  validateRequest(submitLaunchSchema),
  launchController.submitLaunchDetails,
);

// SCREEN 3: PITCH DECK UPLOAD

router.get("/stages/launch/pitch-deck", launchController.getPitchDeck);
router.post(
  "/stages/launch/pitch-deck/upload",
  launchController.uploadPitchDeck,
);
router.delete(
  "/stages/launch/pitch-deck/:documentId",
  launchController.deletePitchDocument,
);
router.post(
  "/stages/launch/pitch-deck/submit",
  launchController.submitPitchDeck,
);

module.exports = router;
