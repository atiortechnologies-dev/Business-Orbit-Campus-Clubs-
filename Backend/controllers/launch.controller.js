/**
 * @file launch.controller.js
 * @description Controller for managing startup launch and graduation processes.
 * @architecture Handles launch stages, draft submissions, pitch decks, insights, verification, and graduation milestones, interacting with various Launch models.
 */
const asyncHandler = require("../middlewares/asyncHandler");
const LaunchEvidenceFile = require("../models/LaunchEvidenceFile");
const LaunchInsights = require("../models/LaunchInsights");
const LaunchPitchDocument = require("../models/LaunchPitchDocument");
const LaunchStage = require("../models/LaunchStage");
const LaunchSubmission = require("../models/LaunchSubmission");
const LaunchVerification = require("../models/LaunchVerification");
const StartupGraduation = require("../models/StartupGraduation");
const StartupStage = require("../models/StartupStage");
const { getOrCreateStartup } = require("../utils/startupJourney");

// ========= SCREEN 1: LAUNCH OVERVIEW =========

/**
 * @desc    Get launch stage overview
 * @route   GET /api/student/launch/overview
 * @access  Private/Student
 */
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

/**
 * @desc    Get launch checklist status
 * @route   GET /api/student/launch/checklist
 * @access  Private/Student
 */
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

/**
 * @desc    Start the launch stage
 * @route   POST /api/student/launch/start
 * @access  Private/Student
 */
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

/**
 * @desc    Save launch submission draft
 * @route   POST /api/student/launch/draft
 * @access  Private/Student
 */
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

/**
 * @desc    Get launch submission details
 * @route   GET /api/student/launch/submission
 * @access  Private/Student
 */
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

/**
 * @desc    Update launch submission draft
 * @route   PUT /api/student/launch/submission
 * @access  Private/Student
 */
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

/**
 * @desc    Submit final launch details
 * @route   POST /api/student/launch/submit
 * @access  Private/Student
 */
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

/**
 * @desc    Get uploaded pitch decks
 * @route   GET /api/student/launch/pitch-deck
 * @access  Private/Student
 */
const getPitchDeck = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  const documents = await LaunchPitchDocument.find({
    startup_id: startup._id,
  }).lean();

  res.status(200).json({ success: true, data: documents });
});

/**
 * @desc    Upload a pitch deck document
 * @route   POST /api/student/launch/pitch-deck
 * @access  Private/Student
 */
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

/**
 * @desc    Delete a pitch document
 * @route   DELETE /api/student/launch/pitch-deck/:documentId
 * @access  Private/Student
 */
const deletePitchDocument = asyncHandler(async (req, res) => {
  const { documentId } = req.params;
  const { id: userId } = req.user;

  await LaunchPitchDocument.deleteOne({
    document_id: documentId,
    student_id: userId,
  });

  res.status(200).json({ success: true, message: "Document deleted" });
});

/**
 * @desc    Submit all pitch deck documents
 * @route   POST /api/student/launch/pitch-deck/submit
 * @access  Private/Student
 */
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

/**
 * @desc    Get launch insights
 * @route   GET /api/student/launch/insights
 * @access  Private/Student
 */
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

/**
 * @desc    Save launch insights draft
 * @route   POST /api/student/launch/insights/draft
 * @access  Private/Student
 */
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

/**
 * @desc    Upload launch evidence
 * @route   POST /api/student/launch/evidence
 * @access  Private/Student
 */
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

/**
 * @desc    Delete launch evidence
 * @route   DELETE /api/student/launch/evidence/:fileId
 * @access  Private/Student
 */
const deleteLaunchEvidence = asyncHandler(async (req, res) => {
  const { fileId } = req.params;
  const { id: userId } = req.user;

  await LaunchEvidenceFile.deleteOne({
    file_id: fileId,
    student_id: userId,
  });

  res.status(200).json({ success: true, message: "Evidence deleted" });
});

/**
 * @desc    Submit launch insights
 * @route   POST /api/student/launch/insights/submit
 * @access  Private/Student
 */
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

/**
 * @desc    Get launch evidence files
 * @route   GET /api/student/launch/evidence
 * @access  Private/Student
 */
const getLaunchEvidence = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  const evidence = await LaunchEvidenceFile.find({
    startup_id: startup._id,
  }).lean();

  res.status(200).json({ success: true, data: evidence });
});

// ========= SCREEN 5: LAUNCH VERIFICATION =========

/**
 * @desc    Get launch verification details
 * @route   GET /api/student/launch/verification
 * @access  Private/Student
 */
const getLaunchVerification = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  const verification = await LaunchVerification.findOne({
    startup_id: startup._id,
  })
    .populate("reviewer_id", "full_name email")
    .lean();

  if (!verification) {
    return res
      .status(404)
      .json({ success: false, message: "No verification found" });
  }

  res.status(200).json({ success: true, data: verification });
});

/**
 * @desc    Get launch verification status
 * @route   GET /api/student/launch/verification/status
 * @access  Private/Student
 */
const getVerificationStatus = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  const verification = await LaunchVerification.findOne({
    startup_id: startup._id,
  }).lean();

  res.status(200).json({
    success: true,
    data: {
      status: verification?.status || "Pending Review",
      review_notes: verification?.review_notes,
      requested_changes: verification?.requested_changes,
    },
  });
});

/**
 * @desc    Get launch verification files
 * @route   GET /api/student/launch/verification/files
 * @access  Private/Student
 */
const getVerificationFiles = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  const submission = await LaunchSubmission.findOne({
    startup_id: startup._id,
  }).lean();
  const pitchDocs = await LaunchPitchDocument.find({
    startup_id: startup._id,
  }).lean();
  const evidence = await LaunchEvidenceFile.find({
    startup_id: startup._id,
  }).lean();

  res.status(200).json({
    success: true,
    data: { submission, pitchDocs, evidence },
  });
});

// ========= SCREEN 6: JOURNEY COMPLETED =========

/**
 * @desc    Get startup journey completion status
 * @route   GET /api/student/launch/journey
 * @access  Private/Student
 */
const getJourneyCompletion = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  const graduation = await StartupGraduation.findOne({
    startup_id: startup._id,
  }).lean();

  if (!graduation) {
    return res
      .status(404)
      .json({ success: false, message: "Graduation not completed" });
  }

  res.status(200).json({ success: true, data: graduation });
});

/**
 * @desc    Get graduation certificate
 * @route   GET /api/student/launch/certificate
 * @access  Private/Student
 */
const getGraduationCertificate = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  const graduation = await StartupGraduation.findOne({
    startup_id: startup._id,
  }).lean();

  if (!graduation || !graduation.certificate_url) {
    return res
      .status(404)
      .json({ success: false, message: "Certificate not generated" });
  }

  res.status(200).json({
    success: true,
    data: { certificate_url: graduation.certificate_url },
  });
});

/**
 * @desc    Join alumni network
 * @route   POST /api/student/launch/alumni
 * @access  Private/Student
 */
const joinAlumniNetwork = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  const graduation = await StartupGraduation.findOneAndUpdate(
    { startup_id: startup._id },
    { alumni_status: "Joined" },
    { new: true },
  );

  res.status(200).json({
    success: true,
    message: "Joined alumni network",
    data: graduation,
  });
});

/**
 * @desc    Apply for mentor status
 * @route   POST /api/student/launch/mentor
 * @access  Private/Student
 */
const applyForMentor = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  const graduation = await StartupGraduation.findOneAndUpdate(
    { startup_id: startup._id },
    { mentor_application_submitted: true },
    { new: true },
  );

  res.status(200).json({
    success: true,
    message: "Mentor application submitted",
    data: graduation,
  });
});

/**
 * @desc    Apply for showcase
 * @route   POST /api/student/launch/showcase
 * @access  Private/Student
 */
const applyForShowcase = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  const graduation = await StartupGraduation.findOneAndUpdate(
    { startup_id: startup._id },
    { showcase_application_submitted: true },
    { new: true },
  );

  res.status(200).json({
    success: true,
    message: "Showcase application submitted",
    data: graduation,
  });
});

/**
 * @desc    Get journey statistics
 * @route   GET /api/student/launch/statistics
 * @access  Private/Student
 */
const getJourneyStatistics = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  const graduation = await StartupGraduation.findOne({
    startup_id: startup._id,
  }).lean();

  res.status(200).json({
    success: true,
    data: {
      completion_percentage: 100,
      journey_duration: graduation?.total_duration || 0,
      final_rating: graduation?.final_rating || 0,
      graduation_date: graduation?.graduation_date,
    },
  });
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
  getLaunchVerification,
  getVerificationStatus,
  getVerificationFiles,
  getJourneyCompletion,
  getGraduationCertificate,
  joinAlumniNetwork,
  applyForMentor,
  applyForShowcase,
  getJourneyStatistics,
};
