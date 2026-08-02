/**
 * @file opportunity.routes.js
 * @description Routes for admin opportunity moderation.
 * @architecture Mounted under /api/admin/opportunities
 */

const express = require("express");
const {
  getOpportunities,
  getOpportunityDetails,
  approveOpportunity,
  rejectOpportunity,
  requestChanges,
  addNote,
  bulkApprove,
} = require("../../controllers/admin/opportunity.controller");

const router = express.Router();

router.get("/", getOpportunities);
router.post("/bulk-approve", bulkApprove);
router.get("/:id", getOpportunityDetails);
router.post("/:id/approve", approveOpportunity);
router.post("/:id/reject", rejectOpportunity);
router.post("/:id/request-changes", requestChanges);
router.post("/:id/notes", addNote);

module.exports = router;
