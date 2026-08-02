/**
 * @file stage3.routes.js
 * @description Routes for Stage 3 MVP operations.
 * @architecture Defines endpoints for retrieving the MVP stage overview and checklist.
 */
const express = require("express");
const {
  getMVPStageOverview,
  getMVPChecklist,
} = require("../controllers/stage3Overview.controller");
const { protect, requireRole } = require("../middlewares/authMiddleware");
/**
 * @desc    Stage 3 MVP routing module
 * @route   /api/stage3
 * @access  Private (Student)
 */
const router = express.Router();

router.use(protect, requireRole("student"));

router.get("/stages/mvp", getMVPStageOverview);
router.get("/stages/mvp/checklist", getMVPChecklist);

module.exports = router;
