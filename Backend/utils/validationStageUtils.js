/**
 * @file validationStageUtils.js
 * @description Utility functions for managing the validation stage metrics and progress.
 * @architecture Provides helper methods used by controllers to calculate validation checklist completion and overall stage progress.
 */
const StartupStage = require("../models/StartupStage");
const ValidationChecklistItem = require("../models/ValidationChecklistItem");
const ValidationEvidence = require("../models/ValidationEvidence");
const ValidationReport = require("../models/ValidationReport");
const ValidationSurvey = require("../models/ValidationSurvey");

const isStage1Approved = async (startupId) => {
  try {
    const stage1 = await StartupStage.findOne({
      startup_id: startupId,
      stage_number: 1,
    });
    return stage1 && stage1.status === "approved";
  } catch (error) {
    console.error("Error checking Stage 1 approval:", error);
    return false;
  }
};

const getChecklistProgress = async (startupId) => {
  try {
    const totalItems = await ValidationChecklistItem.countDocuments({
      startup_id: startupId,
    });
    const completedItems = await ValidationChecklistItem.countDocuments({
      startup_id: startupId,
      is_completed: true,
    });

    if (totalItems === 0) return 0;

    return Math.round((completedItems / totalItems) * 100);
  } catch (error) {
    console.error("Error calculating checklist progress:", error);
    return 0;
  }
};

const getValidationProgress = async (startupId) => {
  try {
    const [surveyCount, evidenceCount, reportCount, checklistProgress] =
      await Promise.all([
        ValidationSurvey.countDocuments({
          startup_id: startupId,
          status: "completed",
        }),
        ValidationEvidence.countDocuments({
          startup_id: startupId,
          upload_status: "uploaded",
        }),
        ValidationReport.countDocuments({
          startup_id: startupId,
          status: "submitted",
        }),
        getChecklistProgress(startupId),
      ]);

    // Calculate overall progress (weighted)
    // Checklist: 40%, Surveys: 20%, Evidence: 20%, Report: 20%
    const overallProgress = Math.round(
      checklistProgress * 0.4 +
        Math.min(surveyCount * 10, 100) * 0.2 +
        Math.min(evidenceCount * 10, 100) * 0.2 +
        (reportCount > 0 ? 100 : 0) * 0.2,
    );

    return {
      surveys_completed: surveyCount,
      evidence_uploaded: evidenceCount,
      report_submitted: reportCount > 0,
      checklist_progress: checklistProgress,
      overall_progress: Math.min(overallProgress, 100),
    };
  } catch (error) {
    console.error("Error calculating validation progress:", error);
    return {
      surveys_completed: 0,
      evidence_uploaded: 0,
      report_submitted: false,
      checklist_progress: 0,
      overall_progress: 0,
    };
  }
};

const getValidationMetrics = async (startupId) => {
  try {
    const [surveys, evidence, report] = await Promise.all([
      ValidationSurvey.find({ startup_id: startupId }).lean(),
      ValidationEvidence.find({
        startup_id: startupId,
        upload_status: "uploaded",
      }).lean(),
      ValidationReport.findOne({ startup_id: startupId }).lean(),
    ]);

    const totalResponses = surveys.reduce(
      (sum, survey) => sum + (survey.responses_count || 0),
      0,
    );
    const totalInterviews = surveys.reduce(
      (sum, survey) => sum + (survey.interviews_count || 0),
      0,
    );

    return {
      surveys_count: surveys.length,
      total_responses: totalResponses,
      total_interviews: totalInterviews,
      evidence_files: evidence.length,
      problem_validated: report?.problem_validated || false,
      market_size_estimate: report?.market_size_estimate || "",
    };
  } catch (error) {
    console.error("Error calculating validation metrics:", error);
    return {
      surveys_count: 0,
      total_responses: 0,
      total_interviews: 0,
      evidence_files: 0,
      problem_validated: false,
      market_size_estimate: "",
    };
  }
};

const updateChecklistItem = async (startupId, itemName, isCompleted = true) => {
  try {
    const result = await ValidationChecklistItem.findOneAndUpdate(
      { startup_id: startupId, item_name: itemName },
      {
        is_completed: isCompleted,
        completed_at: isCompleted ? new Date() : null,
      },
      { new: true },
    );

    return result;
  } catch (error) {
    console.error("Error updating checklist item:", error);
    throw error;
  }
};

/**
 * @desc    Utility functions for validation stage tracking
 * @route   N/A
 * @access  Internal
 */
module.exports = {
  isStage1Approved,
  getChecklistProgress,
  getValidationProgress,
  getValidationMetrics,
  updateChecklistItem,
};
