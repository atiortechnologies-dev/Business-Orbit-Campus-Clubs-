/**
 * @file studentFreelancing.routes.js
 * @description API routes for student freelancing opportunities (discovery, filter, save/unsave).
 * @architecture Defines endpoints accessible by users with the student role.
 */

const express = require("express");
const router = express.Router();
const upload = require("../utils/uploadService");

const { requireAuth, authorizeRoles } = require("../middlewares/requireAuth");
const {
  listOpportunities,
  searchOpportunities,
  filterOpportunities,
  getOpportunityDetails,
  saveOpportunity,
  unsaveOpportunity,
  createApplication,
  getApplications,
  getApplicationDetails,
  updateApplication,
  uploadResume,
  uploadDocument,
  submitApplication,
  withdrawApplication,
  getApplicationTimeline,
  getInterviews,
  getApplicationStatusSummary,
} = require("../controllers/studentFreelancing.controller");

// Apply auth and role middlewares to all routes in this file
router.use(requireAuth, authorizeRoles("student"));

// @route   GET /api/student/freelancing/opportunities
// @desc    Get all open/active freelancing opportunities
router.get("/opportunities", listOpportunities);

// @route   GET /api/student/freelancing/opportunities/search
// @desc    Search freelancing opportunities by keyword
router.get("/opportunities/search", searchOpportunities);

// @route   POST /api/student/freelancing/opportunities/filter
// @desc    Filter freelancing opportunities
router.post("/opportunities/filter", filterOpportunities);

// @route   GET /api/student/freelancing/opportunities/:opportunityId
// @desc    Get details of a specific opportunity
router.get("/opportunities/:opportunityId", getOpportunityDetails);

// @route   GET /api/student/freelancing/opportunities/:opportunityId/details
// @desc    Get details of a specific opportunity (alias)
router.get("/opportunities/:opportunityId/details", getOpportunityDetails);

// @route   POST /api/student/freelancing/opportunities/:opportunityId/save
// @desc    Save an opportunity
router.post("/opportunities/:opportunityId/save", saveOpportunity);

// @route   DELETE /api/student/freelancing/opportunities/:opportunityId/save
// @desc    Remove a saved opportunity
router.delete("/opportunities/:opportunityId/save", unsaveOpportunity);

// --- Applications Routes ---

// @route   POST /api/student/freelancing/applications
// @desc    Create a draft application
router.post("/applications", createApplication);

// @route   GET /api/student/freelancing/applications
// @desc    Get all applications
router.get("/applications", getApplications);

// @route   GET /api/student/freelancing/applications/status
// @desc    Get application status summary
router.get("/applications/status", getApplicationStatusSummary);

// @route   GET /api/student/freelancing/applications/interviews
// @desc    Get interviews
router.get("/applications/interviews", getInterviews);

// @route   GET /api/student/freelancing/applications/:applicationId
// @desc    Get application details
router.get("/applications/:applicationId", getApplicationDetails);

// @route   PUT /api/student/freelancing/applications/:applicationId
// @desc    Update a draft application
router.put("/applications/:applicationId", updateApplication);

// @route   POST /api/student/freelancing/applications/upload-resume
// @desc    Upload resume
router.post("/applications/upload-resume", upload.single("file"), uploadResume);

// @route   POST /api/student/freelancing/applications/upload-document
// @desc    Upload additional document
router.post(
  "/applications/upload-document",
  upload.single("file"),
  uploadDocument,
);

// @route   POST /api/student/freelancing/applications/:applicationId/submit
// @desc    Submit application
router.post("/applications/:applicationId/submit", submitApplication);

// @route   DELETE /api/student/freelancing/applications/:applicationId/withdraw
// @desc    Withdraw application
router.delete("/applications/:applicationId/withdraw", withdrawApplication);

// @route   GET /api/student/freelancing/applications/:applicationId/timeline
// @desc    Get application timeline
router.get("/applications/:applicationId/timeline", getApplicationTimeline);

module.exports = router;
