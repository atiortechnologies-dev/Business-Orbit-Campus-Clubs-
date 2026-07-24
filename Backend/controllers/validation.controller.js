const asyncHandler = require("../middlewares/asyncHandler");
const StartupStage = require("../models/StartupStage");
const ValidationChecklistItem = require("../models/ValidationChecklistItem");
const { getOrCreateStartup } = require("../utils/startupJourney");
const {
  isStage1Approved,
  getChecklistProgress,
  getValidationProgress,
} = require("../utils/validationStageUtils");

// ================= VALIDATION OVERVIEW =================

const getValidationOverview = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;

  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  const stage1Approved = await isStage1Approved(startup._id);
  if (!stage1Approved) {
    return res.status(403).json({
      success: false,
      message:
        "You must complete and get approval for Stage 1 (Ideation) first",
    });
  }

  // Get stage 2
  const stage2 = await StartupStage.findOne({
    startup_id: startup._id,
    stage_number: 2,
  });

  // Get checklist
  const checklist = await ValidationChecklistItem.find({
    startup_id: startup._id,
  }).lean();
  const checklistProgress = await getChecklistProgress(startup._id);
  const validationProgress = await getValidationProgress(startup._id);

  res.status(200).json({
    success: true,
    data: {
      stage: {
        stage_number: 2,
        stage_name: "Validation",
        status: stage2?.status || "active",
        started_at: stage2?.started_at,
      },
      estimated_completion_time: "21 days",
      progress_percentage: validationProgress.overall_progress,
      checklist: checklist.map((item) => ({
        id: item._id,
        name: item.item_name,
        completed: item.is_completed,
        completed_at: item.completed_at,
      })),
      checklist_progress: checklistProgress,
      required_deliverables: [
        "Survey results and interview notes",
        "Evidence of customer validation",
        "Validation report with findings",
      ],
      learning_resources: [
        {
          id: 1,
          title: "How to Conduct Primary Research",
          url: "/resources/primary-research",
        },
        {
          id: 2,
          title: "Survey Design Best Practices",
          url: "/resources/survey-design",
        },
        {
          id: 3,
          title: "Customer Interview Template",
          url: "/resources/interview-template",
        },
      ],
    },
  });
});

module.exports = { getValidationOverview };
