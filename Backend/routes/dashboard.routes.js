const express = require("express");
const router = express.Router();

const { protect, requireRole } = require("../middlewares/authMiddleware");
const { getDashboard } = require("../controllers/dashboard.controller");

router.get("/dashboard", protect, requireRole("student"), getDashboard);

module.exports = router;
