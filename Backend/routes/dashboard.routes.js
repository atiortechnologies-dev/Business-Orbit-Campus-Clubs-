/**
 * @file dashboard.routes.js
 * @description Exposes endpoint for retrieving student dashboard summary data.
 * @architecture A minimal router restricted to the 'student' role.
 */

const express = require("express");
const router = express.Router();

const { protect, requireRole } = require("../middlewares/authMiddleware");
const { getDashboard } = require("../controllers/dashboard.controller");

router.get("/dashboard", protect, requireRole("student"), getDashboard);

/**
 * @module dashboardRouter
 * @description Express router for student dashboard endpoints.
 */
module.exports = router;
