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
 * @route   POST /api/submissions
 * @access  Private (Student)
 */
const submitIdea = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const { title, description } = req.validatedData;

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
    // Reuse an existing draft for this stage if one exists, otherwise create fresh.
    let submission = await StageSubmission.findOne({
      stage_id: activeStage._id,
      status: "draft",
    }).session(session);

    const attachment_url = submission?.attachment_url || "";

    if (submission) {
      submission.title = title;
      submission.description = description;
      submission.attachment_url = attachment_url;
    } else {
      submission = new StageSubmission({
        startup_id: startup._id,
        stage_id: activeStage._id,
        title,
        description,
        attachment_url,
      });
    }

    submission.status = "pending_review";
    submission.submitted_at = new Date();
    // By leaving reviewer_id undefined/null, this submission explicitly falls into the "Unassigned" global queue.
    // Admins can later claim and assign reviewers via a separate assignment endpoint.

    await submission.save({ session });

    activeStage.status = "submitted";
    await activeStage.save({ session });

    // Notification creation for (reviewer)

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
 * @route   POST /api/submissions/draft
 * @access  Private (Student)
 */
const saveDraft = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const { title, description } = req.validatedData;

  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);
  const activeStage = await getActiveStage(startup._id);

  if (!activeStage) {
    return res.status(409).json({
      success: false,
      message: "No active stage to save a draft against",
    });
  }

  // Can't touch a draft if this stage already has something under
  // review/approved — same edit-lock rule as submitIdea.
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
    status: "draft",
  });
  const attachment_url = draft?.attachment_url || "";

  if (draft) {
    if (title !== undefined) draft.title = title;
    if (description !== undefined) draft.description = description;
    if (attachment_url !== undefined) draft.attachment_url = attachment_url;
  } else {
    draft = new StageSubmission({
      startup_id: startup._id,
      stage_id: activeStage._id,
      title: title || "Untitled draft",
      description: description || "",
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
 * @desc    Get the submission status for the active stage
 * @route   GET /api/submissions/status
 * @access  Private (Student)
 */
const getSubmissionStatus = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;

  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);
  const activeStage = await getActiveStage(startup._id);

  if (!activeStage) {
    return res.status(404).json({ success: false, message: "No active stage" });
  }

  const submission = await StageSubmission.findOne({
    stage_id: activeStage._id,
  }).sort({ createdAt: -1 });
  if (!submission) {
    return res.status(404).json({
      success: false,
      message: "No submission found for the current stage",
    });
  }

  const nextSteps =
    submission.status === "draft"
      ? "Finish and submit your idea for review."
      : submission.status === "pending_review"
        ? "Wait for your review meeting to be scheduled."
        : submission.status === "approved"
          ? "Your next stage has been unlocked."
          : "Review the feedback and resubmit.";

  return res.status(200).json({
    success: true,
    data: {
      submissionId: submission._id,
      submissionDate: submission.submitted_at,
      currentStatus: submission.status,
      expectedReviewTimelineDays: 7, // temporary
      nextSteps,
    },
  });
});

module.exports = { submitIdea, saveDraft, getSubmissionStatus };
