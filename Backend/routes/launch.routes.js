const express = require("express");
const { protect, requireRole } = require("../middlewares/authMiddleware");
const router = express.Router();
const launchController = require("../controllers/launch.controller");

router.use(protect, requireRole("student"));

// SCREEN 1: LAUNCH OVERVIEW

router.get("/stages/launch", launchController.getLaunchOverview);
router.get("/stages/launch/checklist", launchController.getLaunchChecklist);
router.post("/stages/launch/start", launchController.startLaunchStage);
