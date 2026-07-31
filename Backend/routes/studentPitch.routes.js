/**
 * @file studentPitch.routes.js
 * @description Routes for students/startups to submit pitches to investors directly.
 */

const express = require("express");
const router = express.Router();

const {
  submitPitch,
  getMyPitches,
  getPitchDetailsStudent,
  withdrawPitch,
} = require("../controllers/pitchSubmission.controller");

// @route   POST /api/student/pitches
// @desc    Submit a pitch
router.post("/", submitPitch);

// @route   GET /api/student/pitches
// @desc    Get my submitted pitches
router.get("/", getMyPitches);

// @route   GET /api/student/pitches/:pitchId
// @desc    Get pitch details
router.get("/:pitchId", getPitchDetailsStudent);

// @route   DELETE /api/student/pitches/:pitchId
// @desc    Withdraw a pitch
router.delete("/:pitchId", withdrawPitch);

module.exports = router;
