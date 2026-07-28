/**
 * @file studentIncubation.routes.js
 * @description API routes for Student Incubation Dashboard, Timeline, Documents, Updates, and Acceptance Workflow.
 * @architecture Enforces authentication and student role checking before routing to student incubation controllers.
 */

const express = require("express");
const router = express.Router();
const { validateRequest } = require("../middlewares/validateRequest");
const {
  uploadDocumentSchema,
  acceptOfferSchema,
} = require("../middlewares/validators/incubationValidators");
const {
  getIncubationDashboard,
  getApplicationTimeline,
  getApplicationDocuments,
  uploadAdditionalDocument,
  getIncubationUpdates,
  getAcceptanceInfo,
  acceptOffer,
  getAdmissionDocuments,
  getOnboardingInfo,
} = require("../controllers/studentIncubation.controller");

// @route   GET /api/student/incubation/dashboard
// @desc    Get student incubation dashboard summary
// @access  Private / Student
router.get("/dashboard", getIncubationDashboard);

// @route   GET /api/student/incubation/timeline/:applicationId
// @desc    Get application review timeline
// @access  Private / Student
router.get("/timeline/:applicationId", getApplicationTimeline);

// @route   GET /api/student/incubation/documents/:applicationId
// @desc    Get application documents
// @access  Private / Student
router.get("/documents/:applicationId", getApplicationDocuments);

// @route   POST /api/student/incubation/upload-document
// @desc    Upload requested document
// @access  Private / Student
router.post(
  "/upload-document",
  validateRequest(uploadDocumentSchema, "body"),
  uploadAdditionalDocument,
);

// @route   GET /api/student/incubation/updates
// @desc    Get status updates and announcements
// @access  Private / Student
router.get("/updates", getIncubationUpdates);

// @route   GET /api/student/incubation/acceptance
// @desc    Get offer details and compliance docs for accepted application
// @access  Private / Student
router.get("/acceptance", getAcceptanceInfo);

// @route   POST /api/student/incubation/accept-offer
// @desc    Accept offer and activate admission
// @access  Private / Student
router.post(
  "/accept-offer",
  validateRequest(acceptOfferSchema, "body"),
  acceptOffer,
);

// @route   GET /api/student/incubation/admission-documents
// @desc    Get downloadable admission compliance docs
// @access  Private / Student
router.get("/admission-documents", getAdmissionDocuments);

// @route   GET /api/student/incubation/onboarding
// @desc    Get onboarding orientation guide
// @access  Private / Student
router.get("/onboarding", getOnboardingInfo);

module.exports = router;
