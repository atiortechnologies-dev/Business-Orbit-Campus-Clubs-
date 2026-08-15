const express = require("express");
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
const { requireAuth, requireRole } = require("../middlewares/authMiddleware");
const router = express.Router();

router.use(requireAuth, requireRole("student"));

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
