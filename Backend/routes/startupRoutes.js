const express = require("express");
const router = express.Router();

const startupController = require("../controllers/startupController");
const { protect, requireRole } = require("../middlewares/authMiddleware");

router.use(protect, requireRole("student"));

router.get("/progress", startupController.getProgress);
router.get("/stages", startupController.getStages);

module.exports = router;
