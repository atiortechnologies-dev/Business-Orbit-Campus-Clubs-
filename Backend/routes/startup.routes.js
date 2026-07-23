const express = require("express");
const router = express.Router();

const { protect, requireRole } = require("../middlewares/authMiddleware");
const {
  getProgress,
  getStages,
} = require("../controllers/startupProgress.controller");

router.use(protect, requireRole("student"));

// GET api/startup/progress
router.get("/progress", getProgress);

// GET api/startup/stages
router.get("/stages", getStages);

module.exports = router;
