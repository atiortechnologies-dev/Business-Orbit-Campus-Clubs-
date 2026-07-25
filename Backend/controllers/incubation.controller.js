const asyncHandler = require("../middlewares/asyncHandler");
const IncubationVerification = require("../models/IncubationVerification");
const { getOrCreateStartup } = require("../utils/startupJourney");

//  ========== Incubation Verification Submission ==========

// POST /api/student/incubation-verification ( Submit incubation verification details )
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

module.exports = {
  submitIncubationVerification,
  getIncubationVerification,
  updateIncubationverification,
  getVerificationStatus,
  getVerificationTimeline,
  getVerificationDocuments,
};
