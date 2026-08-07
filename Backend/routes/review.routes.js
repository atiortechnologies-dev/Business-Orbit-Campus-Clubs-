const express = require("express");
const router = express.Router();

const { protect, requireRole } = require("../middlewares/authMiddleware");
const { getStudentStageFeedback } = require("../controllers/review.controller");

router.get(
  "/result/:stage",
  protect,
  requireRole("student"),
  getStudentStageFeedback,
);

module.exports = router;
