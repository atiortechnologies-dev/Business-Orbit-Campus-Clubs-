/**
 * @file auditLog.routes.js
 * @description Routes for Audit Logging API
 */

const express = require("express");
const { getLogs, getPulse, getVolumeTrend, exportLogs } = require("../controllers/auditLog.controller");
const { protect, requireRole } = require("../middlewares/authMiddleware");

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);

// Routes accessible by ADMIN or SUPER_ADMIN
router.get("/", requireRole(["ADMIN", "SUPER_ADMIN"]), getLogs);
router.get("/pulse", requireRole(["ADMIN", "SUPER_ADMIN"]), getPulse);
router.get("/volume-trend", requireRole(["ADMIN", "SUPER_ADMIN"]), getVolumeTrend);

// Route accessible only by SUPER_ADMIN
router.get("/export", requireRole(["SUPER_ADMIN"]), exportLogs);

module.exports = router;
