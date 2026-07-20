const express = require("express");
const router = express.Router();

const dashboardController = require("../controllers/dashboardController");
const { protect, requireRole } = require("../middlewares/authMiddleware");

router.get(
  "/dashboard",
  protect,
  requireRole("student"),
  dashboardController.getDashboard,
);

module.exports = router;
