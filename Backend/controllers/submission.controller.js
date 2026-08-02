/**
 * @file submission.controller.js
 * @description Manages the lifecycle of stage deliverables.
 * @architecture Handles state transitions and employs edit-locks when a submission is under review or approved.
 */

const mongoose = require("mongoose");
const asyncHandler = require("../middlewares/asyncHandler");
const StartupStage = require("../models/StartupStage");
const StageSubmission = require("../models/StageSubmission");
const { getOrCreateStartup } = require("../utils/startupJourney");

const getActiveStage = async (startupId) => {
  return StartupStage.findOne({ startup_id: startupId, status: "active" });
};

/**
 * @desc    Submit an idea or deliverable for the active stage
 * @route   POST /api/submissions/submit
 * @access  Private (Student)
 */
const submitIdea = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const {
    title,
    description,
    solution,
    target_audience,
    value_proposition,
    competitors,
    attachment_url: reqAttachmentUrl,
  } = req.validatedData || req.body;

  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);
  const activeStage = await getActiveStage(startup._id);

  if (!activeStage) {
    return res
      .status(409)
      .json({ success: false, message: "No active stage to submit against" });
  }

  // Duplicate/edit-lock check: a submission already pending_review or
  // approved for this stage blocks a new one entirely.
  const blockingSubmission = await StageSubmission.findOne({
    stage_id: activeStage._id,
    status: { $in: ["pending_review", "approved"] },
  });
  if (blockingSubmission) {
    return res.status(409).json({
      success: false,
      message:
        "A submission for this stage already exists and cannot be duplicated or edited while under review.",
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Reuse an existing draft OR rejected submission (revision) for this stage if one exists.
    let submission = await StageSubmission.findOne({
      stage_id: activeStage._id,
      status: { $in: ["draft", "request_changes"] },
    }).session(session);

    const attachment_url =
      reqAttachmentUrl !== undefined
        ? reqAttachmentUrl
        : submission?.attachment_url || "";

    if (submission) {
      submission.title = title;
      submission.description = description;
      submission.solution = solution || "";
      submission.target_audience = target_audience || "";
      submission.value_proposition = value_proposition || "";
      submission.competitors = competitors || "";
      submission.attachment_url = attachment_url;
      // Clear past feedback when resubmitting
      submission.request_changes = "";
    } else {
      submission = new StageSubmission({
        startup_id: startup._id,
        stage_id: activeStage._id,
        title,
        description,
        solution: solution || "",
        target_audience: target_audience || "",
        value_proposition: value_proposition || "",
        competitors: competitors || "",
        attachment_url,
      });
    }

    submission.status = "pending_review";
    submission.submitted_at = new Date();

    await submission.save({ session });

    activeStage.status = "submitted";
    await activeStage.save({ session });

    await session.commitTransaction();

    return res.status(201).json({
      success: true,
      message: "Idea submitted successfully. It's now pending review.",
      data: {
        submissionId: submission._id,
        submittedAt: submission.submitted_at,
        status: submission.status,
      },
    });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

/**
 * @desc    Save a draft of an idea or deliverable for the active stage
 * @route   PUT /api/submissions/save-draft
 * @access  Private (Student)
 */
const saveDraft = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const {
    title,
    description,
    solution,
    target_audience,
    value_proposition,
    competitors,
    attachment_url: reqAttachmentUrl,
  } = req.validatedData || req.body;

  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);
  const activeStage = await getActiveStage(startup._id);

  if (!activeStage) {
    return res.status(409).json({
      success: false,
      message: "No active stage to save a draft against",
    });
  }

  // Edit lock rule
  const blockingSubmission = await StageSubmission.findOne({
    stage_id: activeStage._id,
    status: { $in: ["pending_review", "approved"] },
  });
  if (blockingSubmission) {
    return res.status(403).json({
      success: false,
      message: "This stage's submission is under review and cannot be edited.",
    });
  }

  let draft = await StageSubmission.findOne({
    stage_id: activeStage._id,
    status: { $in: ["draft", "rejected"] },
  });

  const attachment_url =
    reqAttachmentUrl !== undefined
      ? reqAttachmentUrl
      : draft?.attachment_url || "";

  if (draft) {
    if (title !== undefined) draft.title = title;
    if (description !== undefined) draft.description = description;
    if (solution !== undefined) draft.solution = solution;
    if (target_audience !== undefined) draft.target_audience = target_audience;
    if (value_proposition !== undefined)
      draft.value_proposition = value_proposition;
    if (competitors !== undefined) draft.competitors = competitors;
    if (reqAttachmentUrl !== undefined) draft.attachment_url = reqAttachmentUrl;
  } else {
    draft = new StageSubmission({
      startup_id: startup._id,
      stage_id: activeStage._id,
      title: title || "Untitled draft",
      description: description || "",
      solution: solution || "",
      target_audience: target_audience || "",
      value_proposition: value_proposition || "",
      competitors: competitors || "",
      attachment_url: attachment_url || "",
      status: "draft",
    });
  }

  await draft.save();

  return res.status(200).json({
    success: true,
    message: "Draft saved",
    data: { submissionId: draft._id, status: draft.status },
  });
});

/**
 * @desc    Get the submission status for the current active/submitted stage
 * @route   GET /api/submissions/submission-status
 * @access  Private (Student)
 */
const getSubmissionStatus = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;

  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  const currentStage = await StartupStage.findOne({
    startup_id: startup._id,
    status: { $in: ["active", "submitted", "approved", "rejected"] },
  }).sort({ stage_number: 1 });

  if (!currentStage) {
    return res
      .status(404)
      .json({ success: false, message: "No stage found for startup" });
  }

  const submission = await StageSubmission.findOne({
    stage_id: currentStage._id,
  }).sort({ createdAt: -1 });

  return res.status(200).json({
    success: true,
    data: {
      stageStatus: currentStage.status,
      hasSubmitted: submission ? submission.status !== "draft" : false,
      submission: submission
        ? {
            id: submission._id,
            title: submission.title,
            description: submission.description,
            solution: submission.solution || "",
            target_audience: submission.target_audience || "",
            value_proposition: submission.value_proposition || "",
            competitors: submission.competitors || "",
            attachment_url: submission.attachment_url || "",
            status: submission.status,
            submitted_at: submission.submitted_at,
            request_changes: submission.request_changes || "",
          }
        : null,
    },
  });
});

module.exports = { submitIdea, saveDraft, getSubmissionStatus };
