/**
 * @file validation.controller.js
 * @description Manages Stage 2 (Validation) of the startup journey.
 * @architecture Handles validation overview, surveys, evidence uploads, reports, review meetings, and results.
 */
const asyncHandler = require("../middlewares/asyncHandler");
const MeetingFeedback = require("../models/MeetingFeedback");
const ReviewMeeting = require("../models/ReviewMeeting");
const StageSubmission = require("../models/StageSubmission");
const StartupStage = require("../models/StartupStage");
const ValidationChecklistItem = require("../models/ValidationChecklistItem");
const ValidationEvidence = require("../models/ValidationEvidence");
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

/**
 * @desc    Get validation stage overview
 * @route   GET /api/student/validation/overview
 * @access  Private/Student
 */
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

/**
 * @desc    Get validation status and metrics
 * @route   GET /api/student/validation/status
 * @access  Private/Student
 */
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

/**
 * @desc    Get validation checklist
 * @route   GET /api/student/validation/checklist
 * @access  Private/Student
 */
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

/**
 * @desc    List validation surveys
 * @route   GET /api/student/validation/surveys
 * @access  Private/Student
 */
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

/**
 * @desc    Create a validation survey
 * @route   POST /api/student/validation/surveys
 * @access  Private/Student
 */
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
/**
 * @desc    Update a validation survey
 * @route   PUT /api/student/validation/surveys/:id
 * @access  Private/Student
 */
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
/**
 * @desc    Delete a validation survey
 * @route   DELETE /api/student/validation/surveys/:id
 * @access  Private/Student
 */
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

// ================= EVIDENCE UPLOAD =================

// POST /api/student/validation/evidence
/**
 * @desc    Upload validation evidence
 * @route   POST /api/student/validation/evidence
 * @access  Private/Student
 */
const uploadEvidence = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const { file_name, file_url, file_type, file_size } = req.validatedData;

  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  // Check for duplicates
  const existing = await ValidationEvidence.findOne({
    startup_id: startup._id,
    file_name,
  });

  if (existing) {
    return res.status(409).json({
      success: false,
      message:
        "A file with this name already exists. Please rename and try again.",
    });
  }

  const evidence = new ValidationEvidence({
    startup_id: startup._id,
    student_id: userId,
    file_name,
    file_url,
    file_type: file_type || "other",
    file_size,
    upload_status: "uploaded",
  });

  await evidence.save();

  // Update checklist
  await updateChecklistItem(startup._id, "Upload evidence", true);

  res.status(201).json({
    success: true,
    message: "Evidence uploaded successfully",
    data: evidence,
  });
});

// GET /api/student/validation/evidence
/**
 * @desc    List validation evidence
 * @route   GET /api/student/validation/evidence
 * @access  Private/Student
 */
const listEvidence = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;

  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  const evidence = await ValidationEvidence.find({
    startup_id: startup._id,
    upload_status: "uploaded",
  })
    .select("-__v")
    .lean();

  res.status(200).json({
    success: true,
    data: evidence,
    count: evidence.length,
  });
});

// DELETE /api/student/validation/evidence/:evidenceId
/**
 * @desc    Delete validation evidence
 * @route   DELETE /api/student/validation/evidence/:evidenceId
 * @access  Private/Student
 */
const deleteEvidence = asyncHandler(async (req, res) => {
  const { evidenceId } = req.params;
  const { id: userId } = req.user;

  const evidence = await ValidationEvidence.findById(evidenceId);
  if (!evidence) {
    return res.status(404).json({
      success: false,
      message: "Evidence not found",
    });
  }

  // Verify ownership
  if (evidence.student_id.toString() !== userId) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to delete this evidence",
    });
  }

  await ValidationEvidence.deleteOne({ _id: evidenceId });

  res.status(200).json({
    success: true,
    message: "Evidence deleted successfully",
  });
});

// ================= VALIDATION REPORT =================

// GET /api/student/validation/report
/**
 * @desc    Get validation report
 * @route   GET /api/student/validation/report
 * @access  Private/Student
 */
const getValidationReport = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;

  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  let report = await ValidationReport.findOne({ startup_id: startup._id });

  if (!report) {
    // Create empty report
    report = new ValidationReport({
      startup_id: startup._id,
      student_id: userId,
      title: "",
      summary: "",
      status: "draft",
    });
    await report.save();
  }

  res.status(200).json({
    success: true,
    data: report,
  });
});

// PUT /api/student/validation/report
/**
 * @desc    Update validation report
 * @route   PUT /api/student/validation/report
 * @access  Private/Student
 */
const updateValidationReport = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const updateData = req.validatedData;

  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  let report = await ValidationReport.findOne({ startup_id: startup._id });

  if (!report) {
    report = new ValidationReport({
      startup_id: startup._id,
      student_id: userId,
      title: updateData.title || "",
      summary: updateData.summary || "",
    });
  }

  // Update fields
  Object.assign(report, updateData);
  await report.save();

  res.status(200).json({
    success: true,
    message: "Report updated successfully",
    data: report,
  });
});

// POST /api/student/validation/report/submit
/**
 * @desc    Submit validation report
 * @route   POST /api/student/validation/report/submit
 * @access  Private/Student
 */
const submitValidationReport = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const {
    title,
    summary,
    key_findings,
    problem_validated,
    market_size_estimate,
    next_steps,
  } = req.validatedData;

  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  // Check if report is already submitted
  const existingSubmission = await ValidationReport.findOne({
    startup_id: startup._id,
    status: { $in: ["submitted", "under_review", "approved"] },
  });

  if (existingSubmission) {
    return res.status(409).json({
      success: false,
      message:
        "A report has already been submitted. You cannot submit another one.",
    });
  }

  // Verify minimum requirements
  const evidenceCount = await ValidationEvidence.countDocuments({
    startup_id: startup._id,
    upload_status: "uploaded",
  });

  if (evidenceCount === 0) {
    return res.status(400).json({
      success: false,
      message: "You must upload at least one evidence file before submitting",
    });
  }

  // Get or create report
  let report = await ValidationReport.findOne({ startup_id: startup._id });
  if (!report) {
    report = new ValidationReport({
      startup_id: startup._id,
      student_id: userId,
    });
  }

  // Update report
  report.title = title;
  report.summary = summary;
  report.key_findings = key_findings || "";
  report.problem_validated = problem_validated || false;
  report.market_size_estimate = market_size_estimate || "";
  report.next_steps = next_steps || "";
  report.status = "submitted";
  report.submitted_at = new Date();

  await report.save();

  // Get Stage 2 and create submission
  const stage2 = await StartupStage.findOne({
    startup_id: startup._id,
    stage_number: 2,
  });

  if (stage2) {
    // Create or update stage submission
    let submission = await StageSubmission.findOne({ stage_id: stage2._id });

    submission.title = title;
    submission.description = summary;
    submission.status = "pending_review";
    submission.submitted_at = new Date();

    await submission.save();

    report.stage_submission_id = submission._id;
    await report.save();

    // Update stage status
    stage2.status = "submitted";
    await stage2.save();
  }

  // Update checklist
  await updateChecklistItem(startup._id, "Submit report", true);

  res.status(201).json({
    success: true,
    message: "Report submitted successfully. It's now pending review.",
    data: {
      reportId: report._id,
      submittedAt: report.submitted_at,
      status: report.status,
    },
  });
});

// ================= REVIEW MEETING =================

// GET /api/student/validation/meeting
/**
 * @desc    Get validation review meeting
 * @route   GET /api/student/validation/meeting
 * @access  Private/Student
 */
const getReviewMeeting = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;

  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  // Find the meeting for this startup
  const meeting = await ReviewMeeting.findOne({ startup_id: startup._id })
    .populate("reviewer_id", "full_name email")
    .lean();

  if (!meeting) {
    return res.status(404).json({
      success: false,
      message: "No review meeting scheduled yet",
    });
  }

  // Get feedback if meeting is completed
  const feedback = await MeetingFeedback.findOne({
    meeting_id: meeting._id,
  }).lean();

  res.status(200).json({
    success: true,
    data: {
      meeting: {
        id: meeting._id,
        meeting_date: meeting.meeting_date,
        meeting_link: meeting.meeting_link,
        status: meeting.status,
        agenda: meeting.agenda,
        student_notes: meeting.student_notes,
      },
      reviewer: {
        name: meeting.reviewer_id?.full_name,
        email: meeting.reviewer_id?.email,
      },
      feedback: feedback
        ? {
            reviewer_comments: feedback.reviewer_comments,
            recommendations: feedback.recommendations,
            validation_approved: feedback.validation_approved,
          }
        : null,
    },
  });
});

// POST /api/student/validation/meeting/reschedule
/**
 * @desc    Request meeting reschedule
 * @route   POST /api/student/validation/meeting/reschedule
 * @access  Private/Student
 */
const requestMeetingReschedule = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const { reschedule_reason } = req.validatedData;

  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  // Find the meeting
  const meeting = await ReviewMeeting.findOne({ startup_id: startup._id });

  if (!meeting) {
    return res.status(404).json({
      success: false,
      message: "No review meeting found",
    });
  }

  // Can only reschedule if currently scheduled
  if (meeting.status !== "scheduled") {
    return res.status(409).json({
      success: false,
      message: `Cannot reschedule a meeting with status: ${meeting.status}`,
    });
  }

  // Update meeting status and reschedule details
  meeting.status = "reschedule_requested";
  meeting.reschedule_reason = reschedule_reason || "";
  meeting.reschedule_requested_at = new Date();
  await meeting.save();

  res.status(200).json({
    success: true,
    message:
      "Reschedule request submitted. Your mentor will confirm a new time.",
    data: {
      meeting_id: meeting._id,
      status: meeting.status,
      reschedule_requested_at: meeting.reschedule_requested_at,
    },
  });
});

// GET /api/student/validation/meeting/feedback
/**
 * @desc    Get meeting feedback
 * @route   GET /api/student/validation/meeting/feedback
 * @access  Private/Student
 */
const getMeetingFeedback = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;

  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  // Find meeting
  const meeting = await ReviewMeeting.findOne({
    startup_id: startup._id,
  }).lean();

  if (!meeting) {
    return res.status(404).json({
      success: false,
      message: "No review meeting found",
    });
  }

  // Find feedback
  const feedback = await MeetingFeedback.findOne({ meeting_id: meeting._id })
    .populate("reviewer_id", "full_name email")
    .lean();

  if (!feedback) {
    return res.status(404).json({
      success: false,
      message: "No feedback available yet",
    });
  }

  res.status(200).json({
    success: true,
    data: {
      reviewer_name: feedback.reviewer_id?.full_name,
      reviewer_email: feedback.reviewer_id?.email,
      reviewer_comments: feedback.reviewer_comments,
      recommendations: feedback.recommendations,
      validation_approved: feedback.validation_approved,
      feedback_date: feedback.created_at,
    },
  });
});

// ================= VALIDATION RESULT SCREEN =================

// GET /api/student/validation/result
/**
 * @desc    Get validation result
 * @route   GET /api/student/validation/result
 * @access  Private/Student
 */
const getValidationResult = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;

  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  // Get the validation report (has the decision/status)
  const report = await ValidationReport.findOne({
    startup_id: startup._id,
  }).lean();

  if (!report) {
    return res.status(404).json({
      success: false,
      message: "No validation report found",
    });
  }

  // Get feedback from meeting
  const meeting = await ReviewMeeting.findOne({
    startup_id: startup._id,
  }).lean();
  const feedback = meeting
    ? await MeetingFeedback.findOne({ meeting_id: meeting._id }).lean()
    : null;

  // Determine decision based on report status
  let decision = "pending_review";
  if (report.status === "approved") decision = "approved";
  else if (report.status === "changes_requested")
    decision = "changes_requested";
  else if (report.status === "rejected") decision = "rejected";

  const nextActionMessages = {
    approved:
      "Stage 3 (Prototype Development) has been unlocked. You can now proceed.",
    changes_requested: "You can edit your report and resubmit for review.",
    rejected: "You can revise your validation approach and submit again.",
    pending_review:
      "Waiting for mentor review. A meeting will be scheduled soon.",
  };

  // 2. Pick the message, or fall back to the default
  const nextAction = nextActionMessages[decision] || "Waiting for review...";

  res.status(200).json({
    success: true,
    data: {
      decision, // "pending_review", "approved", "changes_requested", "rejected"
      report_status: report.status,
      submitted_at: report.submitted_at,
      approval_date: feedback?.created_at || null,

      feedback: feedback
        ? {
            reviewer_comments: feedback.reviewer_comments,
            recommendations: feedback.recommendations,
            validation_approved: feedback.validation_approved,
          }
        : null,

      report: {
        title: report.title,
        summary: report.summary,
        key_findings: report.key_findings,
        problem_validated: report.problem_validated,
        market_size_estimate: report.market_size_estimate,
        next_steps: report.next_steps,
      },

      next_action: nextAction,
    },
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
  uploadEvidence,
  listEvidence,
  deleteEvidence,
  getValidationReport,
  updateValidationReport,
  submitValidationReport,
  getReviewMeeting,
  requestMeetingReschedule,
  getMeetingFeedback,
  getValidationResult,
};
