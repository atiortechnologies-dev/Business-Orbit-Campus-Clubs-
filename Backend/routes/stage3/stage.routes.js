const express = require("express");
const { protect, requireRole } = require("../../middlewares/authMiddleware");
const {
  getMVPStageOverview,
  getMVPChecklist,
} = require("../../controllers/stage3/stageOverview.controller");
const router = express.Router();

router.use(protect, requireRole("student"));

router.get("/stages/mvp", getMVPStageOverview);
router.get("/stages/mvp/checklist", getMVPChecklist);

module.exports = router;
