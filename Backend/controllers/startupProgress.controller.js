/**
 * @file startupProgress.controller.js
 * @description Tracks and summarizes a startup's progression through various predefined stages.
 * @architecture Aggregates stage status, completion percentage, and merges database records with static stage definitions.
 */

const asyncHandler = require("../middlewares/asyncHandler");
const StageSubmission = require("../models/StageSubmission");
const StartupStage = require("../models/StartupStage");
const { getOrCreateStartup } = require("../utils/startupJourney");
const { STAGE_DEFINITIONS } = require("../utils/stageDefinitions");

/**
 * @desc    Get the current progress summary for the startup
 * @route   GET /api/startup/progress
 * @access  Private (Student)
 */
const getProgress = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;

  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  // Find the current working or active stage.
  // If a submission is under review, its status is "submitted", but it's still the current working stage.
  let currentStage = await StartupStage.findOne({
    startup_id: startup._id,
    status: { $in: ["active", "submitted", "rejected"] },
  }).sort({ stage_number: 1 });

  // Fallback: If all stages are approved or none match the above, grab the latest un-locked stage or Stage 1
  if (!currentStage) {
    currentStage = await StartupStage.findOne({
      startup_id: startup._id,
    }).sort({ stage_number: 1 });
  }

  let submissionStatus = "not_started";
  let reviewStatus = "not_reviewed";

  if (currentStage) {
    const latestSubmission = await StageSubmission.findOne({
      stage_id: currentStage._id,
    }).sort({ createdAt: -1 });

    if (latestSubmission) {
      submissionStatus = latestSubmission.status; // draft | pending_review | approved | rejected
      reviewStatus =
        latestSubmission.status === "approved"
          ? "approved"
          : latestSubmission.status === "rejected"
            ? "rejected"
            : latestSubmission.status === "pending_review"
              ? "under_review"
              : "not_reviewed";
    }
  }

  return res.status(200).json({
    success: true,
    data: {
      currentStage: currentStage
        ? {
            stageNumber: currentStage.stage_number,
            stageName: currentStage.stage_name,
          }
        : null,
      stageStatus: currentStage ? currentStage.status : null,
      completionPercentage: startup.progress_percentage || 0,
      submissionStatus,
      reviewStatus,
    },
  });
});

/**
 * @desc    Get all stages with details for the startup
 * @route   GET /api/startup/stages
 * @access  Private (Student)
 */
const getStages = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;

  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  const stageRows = await StartupStage.find({ startup_id: startup._id }).sort({
    stage_number: 1,
  });

  const stages = stageRows.map((row) => {
    const def = STAGE_DEFINITIONS.find(
      (d) => d.stage_number === row.stage_number,
    );
    return {
      stageNumber: row.stage_number,
      stageName: row.stage_name,
      status: row.status, // locked | active | submitted | approved | rejected
      startedAt: row.started_at,
      completedAt: row.completed_at,
      instructions: def?.instructions ?? "",
      objectives: def?.objectives ?? [],
      deliverables: def?.deliverables ?? [],
      estimatedTimelineDays: def?.estimated_timeline_days ?? null,
    };
  });

  return res.status(200).json({
    success: true,
    data: {
      startupName: startup.startup_name,
      overallProgress: startup.progress_percentage || 0,
      stages,
    },
  });
});

module.exports = { getProgress, getStages };
