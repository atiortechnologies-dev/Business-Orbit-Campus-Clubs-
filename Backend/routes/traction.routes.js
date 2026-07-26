const express = require("express");
const router = express.Router();
const { requireRole, protect } = require("../middlewares/authMiddleware");
const tractionController = require("../controllers/traction.controller");
// All validation requires student role and authentication
router.use(protect, requireRole("student"));

// ================= INITIALIZATION =================

router.get("/stages/traction", tractionController.getStage4Overview);
router.get("/stages/traction/progress", tractionController.getStage4Progress);
router.post("/stages/traction/start", tractionController.startStage4);
router.get("/stages/traction/checklist", tractionController.getStage4Checklist);

module.exports = router;
