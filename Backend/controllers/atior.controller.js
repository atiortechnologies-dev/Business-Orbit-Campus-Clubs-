const asyncHandler = require("../middlewares/asyncHandler");
const AtiorAssistanceRequest = require("../models/AtiorAssistanceRequest");
const { getOrCreateStartup } = require("../utils/startupJourney");

// POST /api/student/assistance/request
const submitAssistanceRequest = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const validatedData = req.validatedData;

  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  // Check if already has active request
  const existingRequest = await AtiorAssistanceRequest.findOne({
    startup_id: startup._id,
    request_status: { $in: ["Pending", "Reviewed", "In Progress"] },
  });

  if (existingRequest) {
    return res.status(409).json({
      success: false,
      message:
        "You already have an active assistance request. Please wait for a response.",
    });
  }

  // Create new request
  const assistanceRequest = new AtiorAssistanceRequest({
    student_id: userId,
    startup_id: startup._id,
    assistance_type: validatedData.assistance_type,
    project_description: validatedData.project_description,
    technologies: validatedData.technologies,
    timeline: validatedData.timeline,
    budget: validatedData.budget || null,
    additional_notes: validatedData.additional_notes || "",
    request_status: "Pending",
  });

  await assistanceRequest.save();

  res.status(201).json({
    success: true,
    message:
      "Assistance request submitted successfully. Atior team will review and respond within 24-48 hours.",
    data: {
      request_id: assistanceRequest.request_id,
      status: assistanceRequest.request_status,
      created_at: assistanceRequest.created_at,
    },
  });
});

// GET /api/student/assistance/status
const getAssistanceStatus = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;

  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  const request = await AtiorAssistanceRequest.findOne({
    startup_id: startup._id,
  })
    .sort({ created_at: -1 })
    .lean();

  if (!request) {
    return res.status(404).json({
      success: false,
      message: "No assistance request found",
    });
  }

  res.status(200).json({
    success: true,
    data: {
      request_id: request.request_id,
      assistance_type: request.assistance_type,
      request_status: request.request_status,
      timeline: request.timeline,
      technologies: request.technologies,
      created_at: request.created_at,
      assigned_to: request.assigned_to,
      assigned_at: request.assigned_at,
      atior_response: request.atior_response,
      atior_contact_email: request.atior_contact_email,
      atior_response_date: request.atior_response_date,
    },
  });
});

// PUT /api/student/assistance/:requestId
const updateAssistanceRequest = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const { requestId } = req.params;
  const updateData = req.validatedData;

  const request = await AtiorAssistanceRequest.findOne({
    request_id: requestId,
    student_id: userId,
  });

  if (!request) {
    return res.status(404).json({
      success: false,
      message: "Request not found",
    });
  }

  // Can only update if Pending or Reviewed
  if (!["Pending", "Reviewed"].includes(request.request_status)) {
    return res.status(409).json({
      success: false,
      message: `Cannot update request with status: ${request.request_status}`,
    });
  }

  // Update fields
  Object.assign(request, updateData);
  request.updated_at = new Date();
  await request.save();

  res.status(200).json({
    success: true,
    message: "Assistance request updated successfully",
    data: request,
  });
});

module.exports = {
  submitAssistanceRequest,
  getAssistanceStatus,
  updateAssistanceRequest,
};
