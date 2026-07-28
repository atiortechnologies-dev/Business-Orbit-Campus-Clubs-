const asyncHandler = require("../middlewares/asyncHandler");
const LaunchEvidenceFile = require("../models/LaunchEvidenceFile");
const LaunchInsights = require("../models/LaunchInsights");
const LaunchPitchDocument = require("../models/LaunchPitchDocument");
const LaunchStage = require("../models/LaunchStage");
const LaunchSubmission = require("../models/LaunchSubmission");
const LaunchVerification = require("../models/LaunchVerification");
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

// ========= SCREEN 2: LAUNCH SUBMISSION =========

const saveLaunchDraft = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const draftData = req.validatedData;
  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  let submission = await LaunchSubmission.findOne({ startup_id: startup._id });

  if (!submission) {
    submission = new LaunchSubmission({
      startup_id: startup._id,
      student_id: userId,
      ...draftData,
      draft_status: "Draft",
    });
  } else {
    Object.assign(submission, draftData);
  }

  await submission.save();

  res.status(201).json({
    success: true,
    message: "Draft saved",
    data: { submission_id: submission.submission_id },
  });
});

const getLaunchSubmission = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  const submission = await LaunchSubmission.findOne({
    startup_id: startup._id,
  }).lean();

  if (!submission) {
    return res
      .status(404)
      .json({ success: false, message: "No submission found" });
  }

  res.status(200).json({ success: true, data: submission });
});

const updateLaunchSubmission = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const updateData = req.validatedData;
  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  const submission = await LaunchSubmission.findOneAndUpdate(
    { startup_id: startup._id, draft_status: "Draft" },
    updateData,
    { new: true },
  );

  if (!submission) {
    return res
      .status(404)
      .json({ success: false, message: "Submission not found or locked" });
  }

  res.status(200).json({ success: true, message: "Updated", data: submission });
});

const submitLaunchDetails = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const submitData = req.validatedData;
  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  const submission = await LaunchSubmission.findOneAndUpdate(
    { startup_id: startup._id },
    {
      ...submitData,
      draft_status: "Submitted",
      submitted_at: new Date(),
    },
    { new: true, upsert: true },
  );

  res.status(200).json({
    success: true,
    message: "Launch details submitted",
    data: { submission_id: submission.submission_id },
  });
});

// ========= SCREEN 3: PITCH DECK UPLOAD =========

const getPitchDeck = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  const documents = await LaunchPitchDocument.find({
    startup_id: startup._id,
  }).lean();

  res.status(200).json({ success: true, data: documents });
});

const uploadPitchDeck = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const { document_type } = req.body;
  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  const document = new LaunchPitchDocument({
    startup_id: startup._id,
    student_id: userId,
    document_type,
    file_name: req.file?.originalname || "document",
    file_url: `/uploads/${Date.now()}-${req.file?.originalname || "document"}`,
    file_size: req.file?.size || 0,
    mime_type: req.file?.mimetype,
    upload_status: "Draft",
    uploaded_at: new Date(),
  });

  await document.save();

  res.status(201).json({
    success: true,
    message: "Document uploaded",
    data: { document_id: document.document_id },
  });
});

const deletePitchDocument = asyncHandler(async (req, res) => {
  const { documentId } = req.params;
  const { id: userId } = req.user;

  await LaunchPitchDocument.deleteOne({
    document_id: documentId,
    student_id: userId,
  });

  res.status(200).json({ success: true, message: "Document deleted" });
});

const submitPitchDeck = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  await LaunchPitchDocument.updateMany(
    { startup_id: startup._id },
    { upload_status: "Submitted" },
  );

  res.status(200).json({ success: true, message: "Pitch deck submitted" });
});

// ========= SCREEN 4: LAUNCH INSIGHTS =========

const getLaunchInsights = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  const insights = await LaunchInsights.findOne({
    startup_id: startup._id,
  }).lean();

  if (!insights) {
    return res
      .status(404)
      .json({ success: false, message: "No insights found" });
  }

  res.status(200).json({ success: true, data: insights });
});

const saveLaunchInsights = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const insightsData = req.validatedData;
  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  let insights = await LaunchInsights.findOne({ startup_id: startup._id });

  if (!insights) {
    insights = new LaunchInsights({
      startup_id: startup._id,
      student_id: userId,
      ...insightsData,
      submission_status: "Draft",
    });
  } else {
    Object.assign(insights, insightsData);
  }

  await insights.save();

  res
    .status(200)
    .json({ success: true, message: "Insights saved", data: insights });
});

const uploadLaunchEvidence = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const { evidence_type, file_url } = req.body;
  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  const evidence = new LaunchEvidenceFile({
    startup_id: startup._id,
    student_id: userId,
    evidence_type,
    file_url,
  });

  await evidence.save();

  res.status(201).json({
    success: true,
    message: "Evidence uploaded",
    data: { file_id: evidence.file_id },
  });
});

const deleteLaunchEvidence = asyncHandler(async (req, res) => {
  const { fileId } = req.params;
  const { id: userId } = req.user;

  await LaunchEvidenceFile.deleteOne({
    file_id: fileId,
    student_id: userId,
  });

  res.status(200).json({ success: true, message: "Evidence deleted" });
});

const submitLaunchInsights = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  const insights = await LaunchInsights.findOneAndUpdate(
    { startup_id: startup._id },
    { submission_status: "Submitted", submitted_at: new Date() },
    { new: true },
  );

  // Create verification
  const verification = new LaunchVerification({
    startup_id: startup._id,
    student_id: userId,
    status: "Pending Review",
  });
  await verification.save();

  res.status(200).json({
    success: true,
    message: "Launch insights submitted",
    data: { insights_id: insights.insights_id },
  });
});

const getLaunchEvidence = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  const evidence = await LaunchEvidenceFile.find({
    startup_id: startup._id,
  }).lean();

  res.status(200).json({ success: true, data: evidence });
});

module.exports = {
  getLaunchOverview,
  getLaunchChecklist,
  startLaunchStage,
  saveLaunchDraft,
  getLaunchSubmission,
  updateLaunchSubmission,
  submitLaunchDetails,
  getPitchDeck,
  uploadPitchDeck,
  deletePitchDocument,
  submitPitchDeck,
  getLaunchInsights,
  saveLaunchInsights,
  uploadLaunchEvidence,
  deleteLaunchEvidence,
  submitLaunchInsights,
  getLaunchEvidence,
};
