/**
 * @file startup.controller.js
 * @description Provides detailed information about startups for authorized mentors.
 * @architecture Controller layer for read-only access to startup profiles by assigned mentors.
 */

const asyncHandler = require("../middlewares/asyncHandler");
const Startup = require("../models/Startup");
const MentorAssignment = require("../models/MentorAssignment");

/**
 * @desc    Get detailed information about a specific startup
 * @route   GET /api/mentor/startups/{startupId}
 * @access  Private (Mentor)
 */
exports.getStartupDetails = asyncHandler(async (req, res) => {
  const { startupId } = req.params;
  const mentorId = req.user._id;

  // Verify that the mentor has access to this startup
  const assignment = await MentorAssignment.findOne({
    mentor_id: mentorId,
    startup_id: startupId,
    status: "active",
  });

  if (!assignment) {
    return res.status(403).json({
      message:
        "Unauthorized: You do not have access to view this startup's details.",
    });
  }

  const startup = await Startup.findById(startupId).lean();

  if (!startup) {
    return res.status(404).json({ message: "Startup not found." });
  }

  res.status(200).json({
    id: startup._id,
    name: startup.name,
    stage: startup.stage,
    category: startup.category,
    idea: startup.idea,
    progress: startup.progress,
    pitchDeckUrl: startup.pitch_deck, // URL to the uploaded pitch deck asset
    mvpDetails: startup.mvp_details,
    financials: startup.financials,
    cohort: startup.cohort,
    createdAt: startup.created_at,
  });
});
