/**
 * @file review.controller.js
 * @description Exposes review feedback to startups.
 * @architecture Fetches the latest review data and populates reviewer details for transparency.
 */

const asyncHandler = require("../middlewares/asyncHandler");
const { getOrCreateStartup } = require("../utils/startupJourney");
const StageSubmission = require("../models/StageSubmission");
const Review = require("../models/Review");

/**
 * @desc    Get the latest review result for the startup's stage submission
 * @route   GET /api/reviews/result
 * @access  Private (Student)
 */
const getReviewResult = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;

  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  const submissions = await StageSubmission.find({
    startup_id: startup._id,
  }).select("_id");
  const submissionIds = submissions.map((s) => s._id);

  const review = await Review.findOne({ submission_id: { $in: submissionIds } })
    .sort({ reviewed_at: -1 })
    .populate("reviewer_id", "full_name");

  if (!review) {
    return res
      .status(404)
      .json({ success: false, message: "No review available yet" });
  }

  return res.status(200).json({
    success: true,
    data: {
      decision: review.decision,
      feedback: review.feedback,
      improvementSuggestions: review.improvement_suggestions,
      approvalDate: review.decision === "approved" ? review.reviewed_at : null,
      reviewedBy: review.reviewer_id?.full_name || null,
    },
  });
});

module.exports = { getReviewResult };
