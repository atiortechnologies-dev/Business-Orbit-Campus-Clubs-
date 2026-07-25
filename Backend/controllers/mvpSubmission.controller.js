const asyncHandler = require("../middlewares/asyncHandler");
const MVPChecklist = require("../models/MVPChecklist");
const MVPSubmission = require("../models/MVPSubmission");
const StageSubmission = require("../models/StageSubmission");
const StartupStage = require("../models/StartupStage");
const { getOrCreateStartup } = require("../utils/startupJourney");

// POST /api/student/mvp/submit
const submitMVP = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const mvpData = req.validatedData;

  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  // Check if already submitted
  const existingSubmission = await MVPSubmission.findOne({
    startup_id: startup._id,
    submission_status: { $in: ["Submitted", "Under Review"] },
  });

  if (existingSubmission) {
    return res.status(409).json({
      success: false,
      message: "You already have an active MVP submission under review",
    });
  }

  // Create or update submission
  let submission = await MVPSubmission.findOne({
    startup_id: startup._id,
    submission_status: "Draft",
  });

  if (!submission) {
    submission = new MVPSubmission({
      startup_id: startup._id,
      student_id: userId,
    });
  }

  // Update data
  submission.title = mvpData.title;
  submission.description = mvpData.description;
  submission.github_url = mvpData.github_url || "";
  submission.live_url = mvpData.live_url || "";
  submission.figma_url = mvpData.figma_url || "";
  submission.documentation_url = mvpData.documentation_url || "";
  submission.pitch_deck_url = mvpData.pitch_deck_url || "";
  submission.demo_video_url = mvpData.demo_video_url || "";
  submission.notes = mvpData.notes || "";
  submission.submission_status = "Submitted";
  submission.submitted_at = new Date();
  await submission.save();

  // Create StageSubmission record
  const stageSubmission = new StageSubmission({
    startup_id: startup._id,
    student_id: userId,
    stage_id: (
      await StartupStage.findOne({ startup_id: startup._id, stage_number: 3 })
    )._id,
    status: "submitted",
    description: `MVP: ${submission.title}`,
  });
  await stageSubmission.save();

  // Update Stage 3 status
  await StartupStage.findOneAndUpdate(
    { startup_id: startup._id, stage_number: 3 },
    {
      status: "submitted",
      submission_id: stageSubmission._id,
    },
  );

  // Mark checklist item
  const checklist = await MVPChecklist.findOne({ startup_id: startup._id });
  if (checklist) {
    const item = checklist.items.find((i) => i.name === "Submit MVP");
    if (item) {
      item.is_completed = true;
      item.completed_at = new Date();
      await checklist.save();
    }
  }

  res.status(201).json({
    success: true,
    message:
      "MVP submitted successfully. Your reviewer will schedule a meeting within 3-5 business days.",
    data: {
      submission_id: submission.submission_id,
      status: submission.submission_status,
      submitted_at: submission.submitted_at,
    },
  });
});

// GET /api/student/mvp
const getMVPSubmission = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;

  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  const submission = await MVPSubmission.findOne({
    startup_id: startup._id,
  }).lean();

  if (!submission) {
    return res.status(200).json({
      success: true,
      data: {
        submission_id: null,
        title: "",
        description: "",
        submission_status: "Draft",
        submitted_at: null,
      },
    });
  }

  res.status(200).json({
    success: true,
    data: submission,
  });
});

// PUT /api/student/mvp
const updateMVPSubmission = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const updateData = req.validatedData;

  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  const submission = await MVPSubmission.findOne({
    startup_id: startup._id,
    student_id: userId,
  });

  if (!submission) {
    return res.status(404).json({
      success: false,
      message: "MVP submission not found",
    });
  }

  // Can only edit if Draft
  if (submission.submission_status !== "Draft") {
    return res.status(409).json({
      success: false,
      message:
        "Cannot edit MVP after submission. Request changes from your reviewer.",
    });
  }

  // Update fields
  Object.assign(submission, updateData);
  submission.updated_at = new Date();
  await submission.save();

  res.status(200).json({
    success: true,
    message: "MVP updated successfully",
    data: submission,
  });
});

module.exports = {
  submitMVP,
  getMVPSubmission,
  updateMVPSubmission,
};
