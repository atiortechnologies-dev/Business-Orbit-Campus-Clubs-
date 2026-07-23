const express = require("express");
const router = express.Router();

const { protect, requireRole } = require("../middlewares/authMiddleware");
const { getReviewResult } = require("../controllers/review.controller");

router.get("/result", protect, requireRole("student"), getReviewResult);

module.exports = router;
