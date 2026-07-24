const express = require("express");
const router = express.Router();

const { protect, requireRole } = require("../middlewares/authMiddleware");
const validationController = require("../controllers/validation.controller");

// All validation requires student role and authentication
router.use(protect, requireRole("student"));

// ================= VALIDATION OVERVIEW =================
router.get("/overview", validationController.getValidationOverview);

// ================= VALIDATION STATUS & METRICS =================
router.get("/status", validationController.getValidationStatus);
router.get("/checklist", validationController.getValidationChecklist);

module.exports = router;
