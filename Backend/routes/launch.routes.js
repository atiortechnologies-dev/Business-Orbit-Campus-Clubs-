const express = require("express");
const { protect, requireRole } = require("../middlewares/authMiddleware");
const router = express.Router();
const launchController = require("../controllers/launch.controller");
const { validateRequest } = require("../middlewares/validateRequest");
const {
  saveLaunchDraftSchema,
  submitLaunchSchema,
  saveLaunchInsightsSchema,
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

// SCREEN 4: LAUNCH INSIGHTS

router.get("/stages/launch/insights", launchController.getLaunchInsights);
router.post(
  "/stages/launch/insights/save",
  validateRequest(saveLaunchInsightsSchema),
  launchController.saveLaunchInsights,
);
router.post(
  "/stages/launch/evidence/upload",
  launchController.uploadLaunchEvidence,
);
router.delete(
  "/stages/launch/evidence/:fileId",
  launchController.deleteLaunchEvidence,
);
router.post(
  "/stages/launch/insights/submit",
  launchController.submitLaunchInsights,
);
router.get("/stages/launch/evidence", launchController.getLaunchEvidence);

// SCREEN 5: LAUNCH VERIFICATION

router.get(
  "/stages/launch/verification",
  launchController.getLaunchVerification,
);
router.get(
  "/stages/launch/verification/status",
  launchController.getVerificationStatus,
);
router.get(
  "/stages/launch/verification/files",
  launchController.getVerificationFiles,
);

// SCREEN 6: JOURNEY COMPLETED

router.get("/stages/launch/completion", launchController.getJourneyCompletion);
router.get(
  "/stages/launch/certificate",
  launchController.getGraduationCertificate,
);
router.post("/stages/launch/alumni/join", launchController.joinAlumniNetwork);
router.post("/stages/launch/mentor/apply", launchController.applyForMentor);
router.post("/stages/launch/showcase/apply", launchController.applyForShowcase);
router.get("/stages/launch/statistics", launchController.getJourneyStatistics);

module.exports = router;
