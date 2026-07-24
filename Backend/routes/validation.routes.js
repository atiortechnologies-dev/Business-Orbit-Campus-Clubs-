const express = require("express");
const router = express.Router();

const { protect, requireRole } = require("../middlewares/authMiddleware");
const validationController = require("../controllers/validation.controller");
const { validateRequest } = require("../middlewares/validateRequest");
const {
  createSurveySchema,
  updateSurveySchema,
} = require("../utils/validators");

// All validation requires student role and authentication
router.use(protect, requireRole("student"));

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

module.exports = router;
