const asyncHandler = require("../middlewares/asyncHandler");
const LaunchInsights = require("../models/LaunchInsights");
const LaunchPitchDocument = require("../models/LaunchPitchDocument");
const LaunchStage = require("../models/LaunchStage");
const LaunchSubmission = require("../models/LaunchSubmission");
const StartupStage = require("../models/StartupStage");
const { getOrCreateStartup } = require("../utils/startupJourney");

// ========= SCREEN 1: LAUNCH OVERVIEW =========

const getLaunchOverview = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  // Verify Stage 5 unlocked
  const stage5 = await StartupStage.findOne({
    startup_id: startup._id,
    stage_number: 5,
  }).lean();

  if (!stage5 || stage5.status === "locked") {
    return res.status(403).json({
      success: false,
      message: "Stage 5 is not yet unlocked. Complete Stage 4 first.",
    });
  }

  res.status(200).json({
    success: true,
    data: {
      stage: {
        number: 5,
        name: "Launch & Graduation",
        status: stage5.status,
      },
      objectives: [
        "Submit final launch details",
        "Upload pitch deck and documents",
        "Collect launch evidence",
        "Complete graduation",
      ],
      checklist: {
        submission: false,
        pitch_deck: false,
        launch_evidence: false,
        verification: false,
      },
    },
  });
});

const getLaunchChecklist = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  const submission = await LaunchSubmission.findOne({
    startup_id: startup._id,
  }).lean();
  const pitchDoc = await LaunchPitchDocument.findOne({
    startup_id: startup._id,
  }).lean();
  const insights = await LaunchInsights.findOne({
    startup_id: startup._id,
  }).lean();

  res.status(200).json({
    success: true,
    data: {
      items: [
        {
          name: "Submit launch details",
          is_completed: !!submission && submission.draft_status === "Submitted",
        },
        { name: "Upload pitch deck", is_completed: !!pitchDoc },
        {
          name: "Submit launch evidence",
          is_completed:
            !!insights && insights.submission_status === "Submitted",
        },
        { name: "Complete verification", is_completed: false },
      ],
    },
  });
});

const startLaunchStage = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  const launchStage = await LaunchStage.findOneAndUpdate(
    { startup_id: startup._id },
    {
      student_id: userId,
      stage_status: "In Progress",
      started_at: new Date(),
    },
    { new: true, upsert: true },
  );

  res.status(200).json({
    success: true,
    message: "Launch stage started",
    data: { launch_id: launchStage.launch_id },
  });
});

module.exports = {
  getLaunchOverview,
  getLaunchChecklist,
  startLaunchStage,
};
