/**
 * @file incubationApplication.controller.js
 * @description Controllers for submitting, viewing, updating, and withdrawing Student Incubation applications.
 * @architecture Enforces business logic rules (stage requirements, duplicate application prevention, edit locking).
 */

const mongoose = require("mongoose");
const IncubationApplication = require("../models/IncubationApplication");
const ApplicationDocument = require("../models/ApplicationDocument");
const ApplicationTimeline = require("../models/ApplicationTimeline");
const IncubatorProfile = require("../models/IncubatorProfile");
const Startup = require("../models/Startup");
const ActivityLog = require("../models/ActivityLog");
const Notification = require("../models/Notification");
const asyncHandler = require("../middlewares/asyncHandler");

/**
 * @route   POST /api/incubation/apply
 * @desc    Submit a new application for incubation
 * @access  Private / Student
 */
const applyForIncubation = asyncHandler(async (req, res) => {
  const studentId = req.user._id || req.user.id;
  const {
    incubator_id,
    startup_info,
    business_details = {},
    team_info = [],
    supporting_documents,
    declaration_accepted,
    terms_accepted,
  } = req.body || req.validatedData;

  // 1. Check if incubator exists and is approved
  const incubator = await IncubatorProfile.findById(incubator_id);
  if (!incubator || !incubator.is_approved) {
    return res.status(404).json({
      success: false,
      message: "Target incubator not found or not approved for applications.",
    });
  }

  // 2. Verify student has a registered startup and meets stage eligibility
  const startup = await Startup.findOne({ student_id: studentId });
  if (!startup) {
    return res.status(400).json({
      success: false,
      message:
        "You must register a startup in Orbit before applying for incubation.",
    });
  }

  // 3. Prevent duplicate active applications to the same incubator
  const existingApp = await IncubationApplication.findOne({
    student_id: studentId,
    incubator_id,
    application_status: {
      $in: [
        "Submitted",
        "Under Screening",
        "Under Review",
        "Interview Scheduled",
      ],
    },
  });

  if (existingApp) {
    return res.status(400).json({
      success: false,
      message: `You already have an active application (${existingApp.application_status}) with this incubator.`,
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 4. Create the application record
    const [application] = await IncubationApplication.create(
      [
        {
          student_id: studentId,
          startup_id: startup._id,
          incubator_id,
          application_status: "Submitted",
          current_stage: "Submitted",
          startup_info,
          business_details,
          team_info,
          supporting_documents,
          declaration_accepted,
          terms_accepted,
        },
      ],
      { session },
    );

    // 5. Store uploaded documents in ApplicationDocument collection
    const docEntries = [];
    if (supporting_documents.pitch_deck) {
      docEntries.push({
        application_id: application._id,
        document_type: "Pitch Deck",
        file_name: "pitch_deck.pdf",
        file_url: supporting_documents.pitch_deck,
      });
    }
    if (supporting_documents.business_plan) {
      docEntries.push({
        application_id: application._id,
        document_type: "Business Plan",
        file_name: "business_plan.pdf",
        file_url: supporting_documents.business_plan,
      });
    }
    if (supporting_documents.mvp_link) {
      docEntries.push({
        application_id: application._id,
        document_type: "MVP Link",
        file_name: "mvp_link",
        file_url: supporting_documents.mvp_link,
      });
    }
    if (docEntries.length > 0) {
      await ApplicationDocument.insertMany(docEntries, { session });
    }

    // 6. Create initial timeline entry
    await ApplicationTimeline.create(
      [
        {
          application_id: application._id,
          status: "Submitted",
          remarks: "Application submitted successfully by student.",
          updated_by: studentId,
        },
      ],
      { session },
    );

    // 7. Activity Log and Notifications
    await ActivityLog.create(
      [
        {
          user_id: studentId,
          action: "SUBMIT_INCUBATION_APPLICATION",
          entity_type: "IncubationApplication",
          entity_id: application._id,
          description: `Submitted application to ${incubator.incubator_name || incubator.organization}.`,
        },
      ],
      { session },
    );

    await Notification.create(
      [
        {
          recipient_id: studentId,
          title: "Incubation Application Submitted",
          message: `Your application to ${incubator.incubator_name || incubator.organization} was received and is under screening.`,
          type: "success",
        },
      ],
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({
      success: true,
      message: "Incubation application submitted successfully.",
      data: application,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});

/**
 * @route   GET /api/incubation/application/:id
 * @desc    Get detailed application by ID along with timeline and documents
 * @access  Private / Student or Incubator
 */
const getApplicationById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id || req.user.id;

  const application = await IncubationApplication.findById(id)
    .populate("incubator_id", "incubator_name organization city logo")
    .populate("startup_id", "startup_name current_stage")
    .populate("student_id", "full_name email");

  if (!application) {
    return res.status(404).json({
      success: false,
      message: "Incubation application not found.",
    });
  }

  // Authorization: must be owner student, target incubator owner, or admin
  const isOwnerStudent =
    application.student_id._id.toString() === userId.toString() ||
    application.student_id.toString() === userId.toString();
  const isIncubatorOwner =
    application.incubator_id &&
    application.incubator_id.user_id &&
    application.incubator_id.user_id.toString() === userId.toString();
  const isAdmin = req.user.role === "admin" || req.user.role === "superadmin";

  if (!isOwnerStudent && !isIncubatorOwner && !isAdmin) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized to view this incubation application.",
    });
  }

  const timeline = await ApplicationTimeline.find({ application_id: id }).sort({
    updated_at: 1,
  });
  const documents = await ApplicationDocument.find({ application_id: id });

  res.status(200).json({
    success: true,
    data: {
      ...application.toObject(),
      timeline,
      documents,
    },
  });
});

/**
 * @route   PUT /api/incubation/application/:id
 * @desc    Update application details (ONLY when status is 'Submitted')
 * @access  Private / Student
 */
const updateApplication = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const studentId = req.user._id || req.user.id;

  const application = await IncubationApplication.findById(id);
  if (!application) {
    return res.status(404).json({
      success: false,
      message: "Incubation application not found.",
    });
  }

  if (application.student_id.toString() !== studentId.toString()) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized to modify this application.",
    });
  }

  // Edit locking: prevent edits once screening/review has begun
  if (application.application_status !== "Submitted") {
    return res.status(400).json({
      success: false,
      message: `Application cannot be modified while in '${application.application_status}' status.`,
    });
  }

  const updates = req.body || req.validatedData;
  if (updates.startup_info)
    application.startup_info = {
      ...application.startup_info,
      ...updates.startup_info,
    };
  if (updates.business_details)
    application.business_details = {
      ...application.business_details,
      ...updates.business_details,
    };
  if (updates.team_info) application.team_info = updates.team_info;
  if (updates.supporting_documents)
    application.supporting_documents = {
      ...application.supporting_documents,
      ...updates.supporting_documents,
    };

  await application.save();

  res.status(200).json({
    success: true,
    message: "Application updated successfully.",
    data: application,
  });
});

/**
 * @route   POST /api/incubation/withdraw
 * @desc    Withdraw an active incubation application
 * @access  Private / Student
 */
const withdrawApplication = asyncHandler(async (req, res) => {
  const { application_id } = req.body || req.validatedData || {};
  const studentId = req.user._id || req.user.id;

  if (!application_id) {
    return res
      .status(400)
      .json({ success: false, message: "Application ID is required." });
  }

  const application = await IncubationApplication.findById(application_id);
  if (!application) {
    return res
      .status(404)
      .json({ success: false, message: "Application not found." });
  }

  if (application.student_id.toString() !== studentId.toString()) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized to withdraw this application.",
    });
  }

  if (
    ["Rejected", "Withdrawn", "Accepted"].includes(
      application.application_status,
    )
  ) {
    return res.status(400).json({
      success: false,
      message: `Cannot withdraw application that is already '${application.application_status}'.`,
    });
  }

  application.application_status = "Withdrawn";
  application.current_stage = "Withdrawn";
  await application.save();

  await ApplicationTimeline.create({
    application_id: application._id,
    status: "Withdrawn",
    remarks: "Application voluntarily withdrawn by student.",
    updated_by: studentId,
  });

  res.status(200).json({
    success: true,
    message: "Application withdrawn successfully.",
    data: application,
  });
});

module.exports = {
  applyForIncubation,
  getApplicationById,
  updateApplication,
  withdrawApplication,
};
