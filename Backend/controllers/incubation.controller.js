/**
 * @file incubation.controller.js
 * @description Manages incubation verification and startup progress through stages.
 * @architecture Handles startup incubation verification flow and tracking stage progress, interacting with IncubationVerification and StartupStage models.
 */
const asyncHandler = require("../middlewares/asyncHandler");
const IncubationVerification = require("../models/IncubationVerification");
const StartupStage = require("../models/StartupStage");
const { getOrCreateStartup } = require("../utils/startupJourney");

//  ========== Incubation Verification Submission ==========

// POST /api/student/incubation-verification ( Submit incubation verification details )
/**
 * @desc    Submit incubation verification details
 * @route   POST /api/student/incubation-verification
 * @access  Private/Student
 */
const submitIncubationVerification = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const incubationData = req.validatedData;

  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  const existing = await IncubationVerification.findOne({
    startup_id: startup._id,
    verification_statuc: { $in: ["Submitted", "Under Review"] },
  });

  if (existing) {
    return res.status(409).json({
      success: false,
      message: "You already have an active verification under review",
    });
  }

  // Create verification
  const verification = new IncubationVerification({
    student_id: userId,
    startup_id: startup._id,
    incubator_name: incubationData.incubator_name,
    cohort_name: incubationData.cohort_name,
    joining_date: incubationData.joining_date,
    start_date: incubationData.start_date,
    expected_completion_date: incubationData.expected_completion_date,
    program_type: incubationData.program_type,
    notes: incubationData.notes || "",
    verification_status: "Submitted",
    submitted_at: new Date(),
  });

  await verification.save();

  res.status(201).json({
    success: true,
    message: "Incubation verification submitted successfully",
    data: {
      verification_id: verification.verification_id,
      status: verification.verification_status,
      submitted_at: verification.submitted_at,
    },
  });
});

// GET /api/student/incubation-verification ( get incubation verification details )
/**
 * @desc    Get incubation verification details
 * @route   GET /api/student/incubation-verification
 * @access  Private/Student
 */
const getIncubationVerification = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;

  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  const verification = await IncubationVerification.findOne({
    startup_id: startup._id,
  }).lean();

  if (!verification) {
    return res.status(404).json({
      success: false,
      message: "No verification found",
    });
  }

  res.status(200).json({
    success: true,
    data: verification,
  });
});

// PUT /api/student/incubation-verification/{id} ( update verification draft only )
/**
 * @desc    Update verification draft only
 * @route   PUT /api/student/incubation-verification/:verificationId
 * @access  Private/Student
 */
const updateIncubationverification = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const { verificationId } = req.params;
  const updateData = req.validatedData;

  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  const verification = await IncubationVerification.findOne({
    verification_id: verificationId,
    startup_id: startup._id,
    student_id: userId,
  });

  if (!verification) {
    return res.status(404).json({
      success: false,
      message: "Verification not found",
    });
  }

  // Can only update if Draft or Documents Requested
  if (
    !["Draft", "Documents Requested"].includes(verification.verification_status)
  ) {
    return res.status(409).json({
      success: false,
      message: `Cannot update verification with status: ${verification.verification_status}`,
    });
  }

  // Update fields
  Object.assign(verification, updateData);
  verification.updated_at = new Date();
  await verification.save();

  res.status(200).json({
    success: true,
    message: "Verification updated successfully",
    data: verification,
  });
});

// POST /api/student/incubation-verification/upload ( leaving for now )

// ========== SCREEN 2: REVIEW STATUS ( Verification Under Review ) ==========

// GET /api/student/incubation-verification/status
/**
 * @desc    Get verification review status
 * @route   GET /api/student/incubation-verification/status
 * @access  Private/Student
 */
const getVerificationStatus = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;

  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  const verification = await IncubationVerification.findOne({
    startup_id: startup._id,
  }).lean();

  if (!verification) {
    return res.status(404).json({
      success: false,
      message: "No verification found",
    });
  }

  res.status(200).json({
    success: true,
    data: {
      verification_id: verification.verification_id,
      status: verification.verification_status,
      incubator_name: verification.incubator_name,
      submitted_at: verification.submitted_at,
      reviewed_at: verification.reviewed_at,
      assigned_reviewer: verification.assigned_reviewer,
      reviewer_comments: verification.reviewer_comments,
      documents_count: verification.documents.length,
    },
  });
});

// GET /api/student/incubation-verification/timeline
/**
 * @desc    Get verification timeline
 * @route   GET /api/student/incubation-verification/timeline
 * @access  Private/Student
 */
const getVerificationTimeline = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;

  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  const verification = await IncubationVerification.findOne({
    startup_id: startup._id,
  }).lean();

  if (!verification) {
    return res.status(404).json({
      success: false,
      message: "No verification found",
    });
  }

  res.status(200).json({
    success: true,
    data: {
      submitted: verification.submitted_at,
      under_review:
        verification.verification_status === "Under Review" ? new Date() : null,
      reviewed: verification.reviewed_at,
      estimated_completion: verification.submitted_at
        ? new Date(
            verification.submitted_at.getTime() + 7 * 24 * 60 * 60 * 1000,
          )
        : null,
      status: verification.verification_status,
    },
  });
});

// GET /api/student/incubation-verification/documents
/**
 * @desc    Get verification documents
 * @route   GET /api/student/incubation-verification/documents
 * @access  Private/Student
 */
const getVerificationDocuments = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;

  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  const verification = await IncubationVerification.findOne({
    startup_id: startup._id,
  }).lean();

  if (!verification) {
    return res.status(404).json({
      success: false,
      message: "No verification found",
    });
  }

  res.status(200).json({
    success: true,
    data: {
      documents: verification.documents,
      count: verification.documents.length,
    },
  });
});

// ========== SCREEN 3: APPROVAL ==========

// GET /api/student/incubation-verification/result
/**
 * @desc    Get verification result
 * @route   GET /api/student/incubation-verification/result
 * @access  Private/Student
 */
const getVerificationResult = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;

  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  const verification = await IncubationVerification.findOne({
    startup_id: startup._id,
  })
    .populate("assigned_reviewer", "full_name email")
    .lean();

  if (!verification) {
    return res.status(404).json({
      success: false,
      message: "No verification found",
    });
  }

  if (verification.verification_status !== "Approved") {
    return res.status(200).json({
      success: true,
      data: {
        status: verification.verification_status,
        message: "Verification not yet approved",
      },
    });
  }

  res.status(200).json({
    success: true,
    data: {
      verification_id: verification.verification_id,
      status: verification.verification_status,
      incubator_name: verification.incubator_name,
      cohort_name: verification.cohort_name,
      program_type: verification.program_type,
      joining_date: verification.joining_date,
      expected_completion_date: verification.expected_completion_date,
      approved_at: verification.reviewed_at,
      approved_by: verification.assigned_reviewer,
      reviewer_comments: verification.reviewer_comments,
      next_action: "Stage 4 – Traction has been unlocked. You can now proceed.",
    },
  });
});

// GET /api/student/startup/progress
/**
 * @desc    Get startup progress
 * @route   GET /api/student/startup/progress
 * @access  Private/Student
 */
const getStartupProgress = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;

  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  // Get all stages
  const stages = await StartupStage.find({ startup_id: startup._id })
    .sort({ stage_number: 1 })
    .lean();

  // Get verification status
  const verification = await IncubationVerification.findOne({
    startup_id: startup._id,
  }).lean();

  res.status(200).json({
    success: true,
    data: {
      startup_id: startup._id,
      startup_name: startup.startup_name,
      current_stage: Math.max(...stages.map((s) => s.stage_number)),
      incubation_verified: verification?.verification_status === "Approved",
      stages: stages.map((s) => ({
        stage_number: s.stage_number,
        stage_name: s.stage_name,
        status: s.status,
        completion_percentage: s.completion_percentage || 0,
      })),
    },
  });
});

// ========== SCREEN 4: STAGE 4 ==========

// GET /api/student/stages/traction
/**
 * @desc    Get Stage 4 (Traction) overview
 * @route   GET /api/student/stages/traction
 * @access  Private/Student
 */
const getStage4Overview = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;

  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  // Check verification approved
  const verification = await IncubationVerification.findOne({
    startup_id: startup._id,
    verification_status: "Approved",
  }).lean();

  if (!verification) {
    return res.status(403).json({
      success: false,
      message: "Incubation verification must be approved first",
    });
  }

  // Get Stage 4
  const stage4 = await StartupStage.findOne({
    startup_id: startup._id,
    stage_number: 4,
  }).lean();

  res.status(200).json({
    success: true,
    data: {
      stage: {
        number: 4,
        name: "Traction & Growth",
        description: "Build momentum and demonstrate market traction",
        status: stage4?.status || "locked",
        started_at: stage4?.started_at,
      },
      learning_objectives: [
        "Acquire first customers",
        "Validate market demand",
        "Build sustainable growth",
        "Prepare for Series A",
      ],
      estimated_duration: "6-12 months",
      deliverables: [
        "Customer acquisition strategy",
        "Growth metrics dashboard",
        "Revenue model implementation",
        "Series A pitch deck",
      ],
    },
  });
});

// GET /api/student/stages/traction/checklist
/**
 * @desc    Get Stage 4 (Traction) checklist
 * @route   GET /api/student/stages/traction/checklist
 * @access  Private/Student
 */
const getStage4Checklist = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;

  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  res.status(200).json({
    success: true,
    data: {
      items: [
        { name: "Define traction goals", is_completed: false },
        { name: "Implement growth strategy", is_completed: false },
        { name: "Track key metrics", is_completed: false },
        { name: "Acquire first 100 customers", is_completed: false },
        { name: "Prepare Series A pitch", is_completed: false },
      ],
      startup: startup,
      progress_percentage: 0,
    },
  });
});

// POST /api/student/stages/traction/start
/**
 * @desc    Start Stage 4 (Traction)
 * @route   POST /api/student/stages/traction/start
 * @access  Private/Student
 */
const startStage4 = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;

  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  // Check verification
  const verification = await IncubationVerification.findOne({
    startup_id: startup._id,
    verification_status: "Approved",
  }).lean();

  if (!verification) {
    return res.status(403).json({
      success: false,
      message: "Incubation verification must be approved",
    });
  }

  // Update or create Stage 4
  const stage4 = await StartupStage.findOneAndUpdate(
    { startup_id: startup._id, stage_number: 4 },
    {
      status: "active",
      started_at: new Date(),
    },
    { new: true, upsert: true },
  );

  res.status(200).json({
    success: true,
    message: "Stage 4 started successfully",
    data: {
      stage: 4,
      status: stage4.status,
      started_at: stage4.started_at,
    },
  });
});

module.exports = {
  submitIncubationVerification,
  getIncubationVerification,
  updateIncubationverification,
  getVerificationStatus,
  getVerificationTimeline,
  getVerificationDocuments,
  getVerificationResult,
  getStartupProgress,
  getStage4Overview,
  getStage4Checklist,
  startStage4,
};
