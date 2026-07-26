const asyncHandler = require("../middlewares/asyncHandler");
const CustomerFeedback = require("../models/CustomerFeedback");
const ProductSubmission = require("../models/ProductSubmission");
const StartupStage = require("../models/StartupStage");
const TractionMetrics = require("../models/TractionMetrics");
const TractionReview = require("../models/TractionReview");
const { getOrCreateStartup } = require("../utils/startupJourney");

// ========= SCREEN 1: STAGE INITIALIZATION =========

const getStage4Overview = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const startup = getOrCreateStartup(userId, `${userId}'s Startup`);

  // verify stage4 unlocked
  const stage4 = await StartupStage.findOne({
    startup_id: startup._id,
    stage_number: 4,
  }).lean();

  if (!stage4 || stage4.status === "Locked") {
    return res.status(403).json({
      success: false,
      message: "Stage 4 is not yet unlocked. Complete earlier stages first.",
    });
  }

  res.status(200).json({
    success: true,
    data: {
      stage: {
        number: 4,
        name: "Traction & Growth",
        status: stage4.status,
        started_at: stage4.started_at,
      },
      objectives: [
        "Track user acquisition metrics",
        "Collect customer feedback",
        "Iterate and improve product",
        "Demonstrate market traction",
      ],
      timeline: "6-12 months",
    },
  });
});

const getStage4Progress = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  const metrics = await TractionMetrics.findOne({
    startup_id: startup._id,
  }).lean();
  const feedback = await CustomerFeedback.find({
    startup_id: startup._id,
  }).lean();
  const submission = await ProductSubmission.findOne({
    startup_id: startup._id,
  }).lean();
  const review = await TractionReview.findOne({
    startup_id: startup._id,
  }).lean();

  res.status(200).json({
    success: true,
    data: {
      metrics_saved: !!metrics && metrics.status === "Submitted",
      feedback_collected: feedback.length > 0,
      product_submitted:
        !!submission && submission.submission_status !== "Draft",
      review_completed: !!review && review.review_status === "Approved",
      progress_percentage:
        [!!metrics, feedback.length > 0, !!submission, !!review].filter(Boolean)
          .length * 25,
    },
  });
});

const startStage4 = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  const stage4 = await StartupStage.findOneAndUpdate(
    { startup_id: startup._id, stage_number: 4 },
    { status: "active", started_at: new Date() },
    { new: true, upsert: true },
  );

  res.status(200).json({
    success: true,
    message: "Stage 4 started successfully",
    data: { stage: 4, status: stage4.status },
  });
});

const getStage4Checklist = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      items: [
        { name: "Track user metrics", is_completed: false },
        { name: "Collect customer feedback", is_completed: false },
        { name: "Submit improved product", is_completed: false },
        { name: "Complete traction review", is_completed: false },
      ],
    },
  });
});

module.exports = {
  getStage4Overview,
  getStage4Progress,
  startStage4,
  getStage4Checklist,
};
