const asyncHandler = require("../middlewares/asyncHandler");
const StartupStage = require("../model/StartupStage");
const StageSubmission = require("../model/StageSubmission");
const {
  getOrCreateStartup,
  recalcProgress,
} = require("../utils/startupJourney");

const MAX_TITLE_LENGTH = 150;
const MAX_DESCRIPTION_LENGTH = 5000;

const getActiveStage = async (startupId) => {
  return StartupStage.findOne({ startup_id: startupId, status: "active" });
};

//*  POST: /api/startup/submit
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

  // Reuse an existing draft for this stage if one exists, otherwise create fresh.
  let submission = await StageSubmission.findOne({
    stage_id: activeStage._id,
    status: "draft",
  });

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
  // TODO: assign_reviewer_id once an admin/reviewer role exists on User.
  await submission.save();

  activeStage.status = "submitted";
  await activeStage.save();

  // Notification creation for (reviewer)

  return res.status(201).json({
    success: true,
    message: "Idea submitted successfully. It's now pending review.",
    data: {
      submissionId: submission._id,
      submittedAt: submission.submitted_at,
      status: submission.status,
    },
  });
});

//* PUT: /api/startup/save-draft
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

//* GET: /api/startup/submission-status
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
