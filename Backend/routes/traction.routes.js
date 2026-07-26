const express = require("express");
const router = express.Router();
const { requireRole, protect } = require("../middlewares/authMiddleware");
const tractionController = require("../controllers/traction.controller");
const { validateRequest } = require("../middlewares/validateRequest");
const {
  submitMetricsSchema,
  updateMetricsSchema,
  submitFeedbackSchema,
  updateFeedbackSchema,
  submitProductSchema,
  updateProductSchema,
} = require("../utils/validators");

// All validation requires student role and authentication
router.use(protect, requireRole("student"));

// SCREEN 1: INITIALIZATION

router.get("/stages/traction", tractionController.getStage4Overview);
router.get("/stages/traction/progress", tractionController.getStage4Progress);
router.post("/stages/traction/start", tractionController.startStage4);
router.get("/stages/traction/checklist", tractionController.getStage4Checklist);

// SCREEN 2: USER ACQUISITION TRACKER

router.post(
  "/traction/metrics",
  validateRequest(submitMetricsSchema),
  tractionController.submitMetrics,
);
router.get("/traction/metrics", tractionController.getMetrics);
router.put(
  "/traction/metrics/:metricId",
  validateRequest(updateMetricsSchema),
  tractionController.updateMetrics,
);
router.delete("/traction/metrics/:metricId", tractionController.deleteMetrics);

// SCREEN 3: CUSTOMER FEEDBACK

router.post(
  "/traction/feedback",
  validateRequest(submitFeedbackSchema),
  tractionController.submitFeedback,
);
router.get("/traction/feedback", tractionController.getFeedback);
router.get(
  "/traction/feedback/:feedbackId",
  tractionController.getFeedbackById,
);
router.put(
  "/traction/feedback/:feedbackId",
  validateRequest(updateFeedbackSchema),
  tractionController.updateFeedback,
);
router.delete(
  "/traction/feedback/:feedbackId",
  tractionController.deleteFeedback,
);

// SCREEN 4: UPDATED PRODUCT SUBMISSION

router.post(
  "/traction/submission",
  validateRequest(submitProductSchema),
  tractionController.submitProduct,
);
router.get("/traction/submission", tractionController.getProductSubmission);
router.put(
  "/traction/submission/:submissionId",
  validateRequest(updateProductSchema),
  tractionController.updateProductSubmission,
);
// router.post(
//   "/traction/submission/upload-document",
//   tractionController.uploadDocument,
// );
router.delete(
  "/traction/submission/document/:documentId",
  tractionController.deleteDocument,
);

// SCREEN 5: TRACTION REVIEW

router.get("/traction/review", tractionController.getReview);
router.get("/traction/review/status", tractionController.getReviewStatus);
router.get("/traction/review/timeline", tractionController.getReviewTimeline);
router.get("/traction/review/comments", tractionController.getReviewComments);

module.exports = router;
