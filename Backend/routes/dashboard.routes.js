/**
 * @file dashboard.routes.js
 * @description Exposes endpoint for retrieving student dashboard summary data.
 * @architecture A minimal router restricted to the 'student' role.
 */

const express = require("express");
const router = express.Router();

const { protect, requireRole } = require("../middlewares/authMiddleware");
const {
  getDashboard,
  getStudentProfile,
  updateProfile,
  getStartup,
  updateStartup,
} = require("../controllers/dashboard.controller");
const { validateRequest } = require("../middlewares/validateRequest");
const {
  updateProfileSchema,
  updateStartupSchema,
} = require("../utils/validators");

router.use(protect, requireRole("student"));

router.get("/dashboard", getDashboard);

router.get("/profile", getStudentProfile);
router.put("/profile", validateRequest(updateProfileSchema), updateProfile);
router.get("/startup", getStartup);
router.put("/startup", validateRequest(updateStartupSchema), updateStartup);

/**
 * @module dashboardRouter
 * @description Express router for student dashboard endpoints.
 */
module.exports = router;
