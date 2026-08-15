const express = require("express");
const router = express.Router();

const { requireAuth, requireRole } = require("../middlewares/authMiddleware");
const { getStudentStageFeedback } = require("../controllers/review.controller");

router.get(
  "/result/:stage",
  requireAuth,
  requireRole("student"),
  getStudentStageFeedback,
);

module.exports = router;
