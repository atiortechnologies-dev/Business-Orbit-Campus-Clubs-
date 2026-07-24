/**
 * @file company.routes.js
 * @description Routes for company Applicant Management.
 */

const express = require("express");
const router = express.Router();
const companyApplicationController = require("../controllers/companyApplication.controller");
const { requireAuth, authorizeRoles } = require("../middlewares/requireAuth");

// All routes require authentication and company role
router.use(requireAuth, authorizeRoles("company"));

// Opportunities
router.get(
  "/opportunities/:id/applicants",
  companyApplicationController.getApplicants,
);
router.get("/opportunities/:id/stats", companyApplicationController.getStats);

// Applications
router.post(
  "/applications/filter",
  companyApplicationController.filterApplications,
);
router.get(
  "/applications/:id",
  companyApplicationController.getApplicationDetails,
);
router.put(
  "/applications/:id/status",
  companyApplicationController.updateApplicationStatus,
);
router.post(
  "/applications/:id/notes",
  companyApplicationController.addRecruiterNote,
);
router.post(
  "/applications/:id/schedule-interview",
  companyApplicationController.scheduleInterview,
);
router.get("/applications/:id/resume", companyApplicationController.getResume);
router.post(
  "/applications/:id/message",
  companyApplicationController.contactApplicant,
);

module.exports = router;
