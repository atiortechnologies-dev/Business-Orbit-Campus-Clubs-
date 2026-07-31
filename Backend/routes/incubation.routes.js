/**
 * @file incubation.routes.js
 * @description Routes for the incubation stage operations.
 * @architecture Handles endpoints related to incubation verification, review status, results, and stage 4 progression.
 */
const express = require("express");
const { validateRequest } = require("../middlewares/validateRequest");
const { protect, requireRole } = require("../middlewares/authMiddleware");
/**
 * @desc    Incubation routing module
 * @route   /api/incubation
 * @access  Private (Student)
 */
const router = express.Router();
const incubationController = require("../controllers/incubation.controller");
const {
  submitIncubationSchema,
  updateIncubationSchema,
} = require("../utils/validators");

router.use(protect, requireRole("student"));

// SCREEN 1: INCUBATION VERIFICATION SUBMISSION
router.post(
  "/incubation-verification",
  validateRequest(submitIncubationSchema),
  incubationController.submitIncubationVerification,
);

router.get(
  "/incubation-verification",
  incubationController.getIncubationVerification,
);

router.put(
  "/incubation-verification/:verificationId",
  validateRequest(updateIncubationSchema),
  incubationController.updateIncubationverification,
);

// leaved for now
// router.post(
//   "/incubation-verification/upload",
//   validateRequest(uploadDocumentSchema),
//   incubationController.uploadDocument
// );

// ========== SCREEN 2: REVIEW STATUS ( Verification Under Review ) ==========

router.get(
  "/incubation-verification/status",
  incubationController.getVerificationStatus,
);

router.get(
  "/incubation-verification/timeline",
  incubationController.getVerificationTimeline,
);

router.get(
  "/incubation-verification/documents",
  incubationController.getVerificationDocuments,
);

// ========== SCREEN 3: VERIFICATION APPROVED ==========

router.get(
  "/incubation-verification/result",
  incubationController.getVerificationResult,
);

router.get("/startup/progress", incubationController.getStartupProgress);

// ========== SCREEN 4: STAGE 4 – TRACTION OVERVIEW ==========

router.get("/stages/traction", incubationController.getStage4Overview);

router.get(
  "/stages/traction/checklist",
  incubationController.getStage4Checklist,
);

router.post("/stages/traction/start", incubationController.startStage4);

module.exports = router;
