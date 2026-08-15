/**
 * @file dashboard.routes.js
 * @description Exposes endpoint for retrieving student dashboard summary data.
 * @architecture A minimal router restricted to the 'student' role.
 */

const express = require("express");
const router = express.Router();

const { requireAuth, requireRole } = require("../middlewares/authMiddleware");

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

router.use(requireAuth, requireRole("student"));

router.get("/dashboard", getDashboard);

// GET /api/student/profile-details
router.get("/profile-details", getStudentProfile);
// PUT /api/student/profile-details
router.put(
  "/profile-details",
  validateRequest(updateProfileSchema),
  updateProfile,
);

router.get("/startup", getStartup);
router.put("/startup", validateRequest(updateStartupSchema), updateStartup);

/**
 * @module dashboardRouter
 * @description Express router for student dashboard endpoints.
 */
module.exports = router;
