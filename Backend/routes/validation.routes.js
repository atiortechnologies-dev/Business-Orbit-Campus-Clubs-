const express = require("express");
const router = express.Router();

const { protect, requireRole, requireVerified } = require("../middlewares/authMiddleware");
const validationController = require("../controllers/validation.controller");
const { validateRequest } = require("../middlewares/validateRequest");
const {
  createSurveySchema,
  updateSurveySchema,
  uploadEvidenceSchema,
  updateValidationReportSchema,
  submitValidationReportSchema,
  requestMeetingRescheduleSchema,
} = require("../utils/validators");

// All validation requires student role and authentication
router.use(protect, requireVerified, requireRole("student"));

// ================= VALIDATION OVERVIEW =================
router.get("/overview", validationController.getValidationOverview);

// ================= VALIDATION STATUS & METRICS =================
router.get("/status", validationController.getValidationStatus);
router.get("/checklist", validationController.getValidationChecklist);

// ================= SURVEY MANAGEMENT =================
router.get("/surveys", validationController.listSurveys);
router.post(
  "/surveys",
  validateRequest(createSurveySchema),
  validationController.createSurvey,
);
router.put(
  "/surveys/:surveyId",
  validateRequest(updateSurveySchema),
  validationController.updateSurvey,
);
router.delete("/surveys/:surveyId", validationController.deleteSurvey);

// ================= EVIDENCE UPLOAD =================
router.post(
  "/evidence",
  validateRequest(uploadEvidenceSchema),
  validationController.uploadEvidence,
);
router.get("/evidence", validationController.listEvidence);
router.delete("/evidence/:evidenceId", validationController.deleteEvidence);

// ================= VALIDATION REPORT =================
router.get("/report", validationController.getValidationReport);
router.put(
  "/report",
  validateRequest(updateValidationReportSchema),
  validationController.updateValidationReport,
);
router.post(
  "/report/submit",
  validateRequest(submitValidationReportSchema),
  validationController.submitValidationReport,
);

// ================= REVIEW MEETING =================
router.get("/meeting", validationController.getReviewMeeting);
router.post(
  "/meeting/reschedule",
  validateRequest(requestMeetingRescheduleSchema),
  validationController.requestMeetingReschedule,
);
router.get("/meeting/feedback", validationController.getMeetingFeedback);

// ================= VALIDATION RESULT SCREEN =================
router.get("/result", validationController.getValidationResult);
// router.get("/stage-progression", validationController.checkStageProgression);

module.exports = router;
