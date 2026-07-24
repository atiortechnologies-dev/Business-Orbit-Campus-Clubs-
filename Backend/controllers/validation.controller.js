const asyncHandler = require("../middlewares/asyncHandler");
const StartupStage = require("../models/StartupStage");
const ValidationChecklistItem = require("../models/ValidationChecklistItem");
const ValidationReport = require("../models/ValidationReport");
const ValidationSurvey = require("../models/ValidationSurvey");
const { getOrCreateStartup } = require("../utils/startupJourney");
const {
  isStage1Approved,
  getChecklistProgress,
  getValidationProgress,
  getValidationMetrics,
  updateChecklistItem,
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

// ================= VALIDATION STATUS & METRICS =================

const getValidationStatus = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;

  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  const [progress, metrics, report] = await Promise.all([
    getValidationProgress(startup._id),
    getValidationMetrics(startup._id),
    ValidationReport.findOne({ startup_id: startup._id }).lean(),
  ]);

  res.status(200).json({
    success: true,
    data: {
      progress,
      metrics,
      report_status: report?.status || "not_started",
      report_submitted_at: report?.submitted_at,
    },
  });
});

const getValidationChecklist = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;

  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  const checklist = await ValidationChecklistItem.find({
    startup_id: startup._id,
  }).lean();
  const progress = await getChecklistProgress(startup._id);

  res.status(200).json({
    success: true,
    data: {
      items: checklist.map((item) => ({
        id: item._id,
        name: item.item_name,
        completed: item.is_completed,
        completed_at: item.completed_at,
        notes: item.notes,
      })),
      progress_percentage: progress,
    },
  });
});

// ================= SURVEY MANAGEMENT =================

const listSurveys = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);
  const surveys = await ValidationSurvey.find({ startup_id: startup._id })
    .select("-__v")
    .lean();

  res.status(200).json({
    success: true,
    data: surveys,
    count: surveys.length,
  });
});

const createSurvey = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const { survey_title, responses_count, interviews_count, findings } =
    req.validatedData;

  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  const survey = new ValidationSurvey({
    startup_id: startup._id,
    student_id: userId,
    survey_title,
    responses_count: responses_count || 0,
    interviews_count: interviews_count || 0,
    findings: findings || "",
    status: "draft",
  });

  await survey.save();

  // Update checklist if applicable
  if (responses_count > 0 || interviews_count > 0) {
    await updateChecklistItem(startup._id, "Conduct primary research", true);
  }

  res.status(201).json({
    success: true,
    message: "Survey created successfully",
    data: survey,
  });
});

// PUT /api/student/validation/surveys/:id
const updateSurvey = asyncHandler(async (req, res) => {
  const { id: surveyId } = req.params;
  const { id: userId } = req.user;
  const updateData = req.validatedData;

  const survey = await ValidationSurvey.findById(surveyId);
  if (!survey) {
    return res.status(404).json({
      success: false,
      message: "Survey not found",
    });
  }

  // Verify ownership
  if (survey.student_id.toString() !== userId) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to update this survey",
    });
  }

  // Update fields
  Object.assign(survey, updateData);
  await survey.save();

  res.status(200).json({
    success: true,
    message: "Survey updated successfully",
    data: survey,
  });
});

// DELETE /api/student/validation/surveys/:id
const deleteSurvey = asyncHandler(async (req, res) => {
  const { id: surveyId } = req.params;
  const { id: userId } = req.user;

  const survey = await ValidationSurvey.findById(surveyId);
  if (!survey) {
    return res.status(404).json({
      success: false,
      message: "Survey not found",
    });
  }

  // Verify ownership
  if (survey.student_id.toString() !== userId) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to delete this survey",
    });
  }

  await ValidationSurvey.deleteOne({ _id: surveyId });

  res.status(200).json({
    success: true,
    message: "Survey deleted successfully",
  });
});

module.exports = {
  getValidationOverview,
  getValidationStatus,
  getValidationChecklist,
  listSurveys,
  createSurvey,
  updateSurvey,
  deleteSurvey,
};
