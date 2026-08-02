/**
 * @file investorPitch.routes.js
 * @description Routes for investors to manage received direct pitch submissions.
 */

const express = require("express");
const router = express.Router();

const {
  getReceivedPitches,
  getPitchDetailsInvestor,
  updatePitchStatus
} = require("../controllers/pitchSubmission.controller");

// @route   GET /api/investor/direct-pitches
// @desc    Get received pitches
router.get("/", getReceivedPitches);

// @route   GET /api/investor/direct-pitches/:pitchId
// @desc    Get pitch details
router.get("/:pitchId", getPitchDetailsInvestor);

// @route   PATCH /api/investor/direct-pitches/:pitchId/status
// @desc    Update pitch status
router.patch("/:pitchId/status", updatePitchStatus);

module.exports = router;
