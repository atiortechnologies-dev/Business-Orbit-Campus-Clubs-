/**
 * @file atior.routes.js
 * @description Routes for ATIOR assistance requests.
 * @architecture Defines endpoints for students to request and manage ATIOR assistance, delegating to the atior controller.
 */
const express = require("express");
const { protect, requireRole } = require("../middlewares/authMiddleware");
const { validateRequest } = require("../middlewares/validateRequest");
const {
  assistanceRequestSchema,
  updateAssistanceRequestSchema,
} = require("../utils/validators");
const {
  submitAssistanceRequest,
  getAssistanceStatus,
  updateAssistanceRequest,
} = require("../controllers/atior.controller");
/**
 * @desc    ATIOR assistance routing module
 * @route   /api/atior
 * @access  Private (Student)
 */
const router = express.Router();

router.use(protect, requireRole("student"));

// Submit assistance request
router.post(
  "/assistance/request",
  validateRequest(assistanceRequestSchema),
  submitAssistanceRequest,
);

// Get assistance status
router.get("/assistance/status", getAssistanceStatus);

// Update assistance request
router.put(
  "/assistance/:requestId",
  validateRequest(updateAssistanceRequestSchema),
  updateAssistanceRequest,
);

module.exports = router;
