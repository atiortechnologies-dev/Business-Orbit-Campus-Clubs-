const express = require("express");
const router = express.Router();

const reviewController = require("../controllers/reviewController");
const { protect, requireRole } = require("../middlewares/authMiddleware");

router.get(
  "/result",
  protect,
  requireRole("student"),
  reviewController.getReviewResult,
);

module.exports = router;
