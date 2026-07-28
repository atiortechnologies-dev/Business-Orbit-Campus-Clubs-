/**
 * @file company.routes.js
 * @description Routes for company Applicant Management.
 */

const express = require("express");
const router = express.Router();
const companyApplicationController = require("../controllers/companyApplication.controller");
const companyOpportunityController = require("../controllers/companyOpportunity.controller");
const {
  requireAuth,
  authorizeRoles,
  requireActiveAccount,
} = require("../middlewares/requireAuth");
const { validateRequest } = require("../middlewares/validateRequest");
const {
  createOpportunitySchema,
  updateOpportunitySchema,
} = require("../middlewares/validators/companyValidators");

// All routes require authentication, active account, and company role
router.use(requireAuth, requireActiveAccount, authorizeRoles("company"));

// Opportunities CRUD
router.post(
  "/opportunities",
  validateRequest(createOpportunitySchema),
  companyOpportunityController.createOpportunity,
);
router.get("/opportunities", companyOpportunityController.getMyOpportunities);
router.get(
  "/opportunities/:id",
  companyOpportunityController.getOpportunityById,
);
router.put(
  "/opportunities/:id",
  validateRequest(updateOpportunitySchema),
  companyOpportunityController.updateOpportunity,
);
router.delete(
  "/opportunities/:id",
  companyOpportunityController.deleteOpportunity,
);

// Opportunity Applicants
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
