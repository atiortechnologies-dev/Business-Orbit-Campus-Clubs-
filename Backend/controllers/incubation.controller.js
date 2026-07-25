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

module.exports = {
  submitIncubationVerification,
  getIncubationVerification,
  updateIncubationverification,
};
