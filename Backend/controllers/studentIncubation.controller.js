/**
 * @file studentIncubation.controller.js
 * @description Controllers for Student Incubation Dashboard, Document Management, and Acceptance Workflow.
 * @architecture Enforces role-based student access, status validation for acceptance, and feature unlocking upon admission.
 */

const mongoose = require("mongoose");
const IncubationApplication = require("../models/IncubationApplication");
const ApplicationDocument = require("../models/ApplicationDocument");
const ApplicationTimeline = require("../models/ApplicationTimeline");
const IncubationAdmission = require("../models/IncubationAdmission");
const AdmissionDocument = require("../models/AdmissionDocument");
const IncubationUpdate = require("../models/IncubationUpdate");
const ActivityLog = require("../models/ActivityLog");
const Notification = require("../models/Notification");
const asyncHandler = require("../middlewares/asyncHandler");

/**
 * @route   GET /api/student/incubation/dashboard
 * @desc    Get student incubation dashboard summary (applications, admission, updates)
 * @access  Private / Student
 */
const getIncubationDashboard = asyncHandler(async (req, res) => {
  const studentId = req.user._id || req.user.id;

  const applications = await IncubationApplication.find({
    student_id: studentId,
  })
    .populate(
      "incubator_id",
      "incubator_name organization city logo is_verified",
    )
    .populate("startup_id", "startup_name current_stage")
    .sort({ submitted_at: -1 });

  const activeAdmission = await IncubationAdmission.findOne({
    student_id: studentId,
    status: "Active",
  }).populate("incubator_id", "incubator_name organization city logo");

  const appIds = applications.map((app) => app._id);
  const recentUpdates = await IncubationUpdate.find({
    application_id: { $in: appIds },
  })
    .sort({ created_at: -1 })
    .limit(10);

  res.status(200).json({
    success: true,
    data: {
      applications,
      active_admission: activeAdmission || null,
      recent_updates: recentUpdates,
    },
  });
});

/**
 * @route   GET /api/student/incubation/timeline/:applicationId
 * @desc    Get timeline history for a specific application
 * @access  Private / Student
 */
const getApplicationTimeline = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;
  const studentId = req.user._id || req.user.id;

  const application = await IncubationApplication.findOne({
    _id: applicationId,
    student_id: studentId,
  });

  if (!application) {
    return res.status(404).json({
      success: false,
      message: "Application not found or unauthorized.",
    });
  }

  const timeline = await ApplicationTimeline.find({
    application_id: applicationId,
  }).sort({
    updated_at: 1,
  });

  res.status(200).json({
    success: true,
    data: timeline,
  });
});

/**
 * @route   GET /api/student/incubation/documents/:applicationId
 * @desc    Get uploaded supporting documents for an application
 * @access  Private / Student
 */
const getApplicationDocuments = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;
  const studentId = req.user._id || req.user.id;

  const application = await IncubationApplication.findOne({
    _id: applicationId,
    student_id: studentId,
  });

  if (!application) {
    return res.status(404).json({
      success: false,
      message: "Application not found or unauthorized.",
    });
  }

  const documents = await ApplicationDocument.find({
    application_id: applicationId,
  });

  res.status(200).json({
    success: true,
    data: documents,
  });
});

/**
 * @route   POST /api/student/incubation/upload-document
 * @desc    Upload additional document requested during review/screening
 * @access  Private / Student
 */
const uploadAdditionalDocument = asyncHandler(async (req, res) => {
  const studentId = req.user._id || req.user.id;
  const { application_id, document_type, file_name, file_url } =
    req.body || req.validatedData || {};

  if (!application_id || !document_type || !file_url) {
    return res.status(400).json({
      success: false,
      message: "Application ID, document type, and file URL are required.",
    });
  }

  const application = await IncubationApplication.findOne({
    _id: application_id,
    student_id: studentId,
  });

  if (!application) {
    return res.status(404).json({
      success: false,
      message: "Application not found or unauthorized.",
    });
  }

  const doc = await ApplicationDocument.create({
    application_id,
    document_type,
    file_name:
      file_name || `${document_type.toLowerCase().replace(/\s+/g, "_")}.pdf`,
    file_url,
  });

  await ApplicationTimeline.create({
    application_id,
    status: application.application_status,
    remarks: `Additional document (${document_type}) uploaded by student.`,
    updated_by: studentId,
  });

  res.status(201).json({
    success: true,
    message: "Document uploaded successfully.",
    data: doc,
  });
});

/**
 * @route   GET /api/student/incubation/updates
 * @desc    Get status updates and announcements for all student applications
 * @access  Private / Student
 */
const getIncubationUpdates = asyncHandler(async (req, res) => {
  const studentId = req.user._id || req.user.id;

  const applications = await IncubationApplication.find({
    student_id: studentId,
  }).select("_id");
  const appIds = applications.map((a) => a._id);

  const updates = await IncubationUpdate.find({
    application_id: { $in: appIds },
  })
    .populate("application_id", "startup_info incubator_id")
    .sort({ created_at: -1 });

  res.status(200).json({
    success: true,
    data: updates,
  });
});

/**
 * @route   GET /api/student/incubation/acceptance
 * @desc    Get acceptance details if student has an Accepted application
 * @access  Private / Student
 */
const getAcceptanceInfo = asyncHandler(async (req, res) => {
  const studentId = req.user._id || req.user.id;
  const filter = {
    student_id: studentId,
    application_status: "Accepted",
  };
  if (req.query && req.query.application_id) {
    filter._id = req.query.application_id;
  }

  const application = await IncubationApplication.findOne(filter)
    .populate(
      "incubator_id",
      "incubator_name organization city logo terms_and_conditions",
    )
    .populate("startup_id", "startup_name current_stage");

  if (!application) {
    return res.status(404).json({
      success: false,
      message: "No accepted incubation offer found.",
    });
  }

  const admission = await IncubationAdmission.findOne({
    application_id: application._id,
  });
  const admissionDocs = admission
    ? await AdmissionDocument.find({ admission_id: admission._id })
    : [];

  res.status(200).json({
    success: true,
    data: {
      application,
      offer_status: application.accepted_by_student
        ? "Accepted by Student"
        : "Pending Student Acceptance",
      admission_documents: admissionDocs,
    },
  });
});

/**
 * @route   POST /api/student/incubation/accept-offer
 * @desc    Accept incubation offer and activate admission record
 * @access  Private / Student
 */
const acceptOffer = asyncHandler(async (req, res) => {
  const studentId = req.user._id || req.user.id;
  const { application_id, terms_accepted } =
    req.body || req.validatedData || {};

  if (!application_id || !terms_accepted) {
    return res.status(400).json({
      success: false,
      message:
        "Application ID and terms acceptance are required to accept the offer.",
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const application = await IncubationApplication.findOne({
      _id: application_id,
      student_id: studentId,
    }).session(session);

    if (!application) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({
        success: false,
        message: "Application not found or unauthorized.",
      });
    }

    if (application.application_status !== "Accepted") {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: `Cannot accept offer for application in status '${application.application_status}'. Status must be 'Accepted'.`,
      });
    }

    if (application.accepted_by_student) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({
        success: false,
        message: "You have already accepted this incubation offer.",
      });
    }

    // Update application record
    application.accepted_by_student = true;
    await application.save({ session });

    // Create or update admission record
    let admission = await IncubationAdmission.findOne({
      application_id: application._id,
    }).session(session);
    if (admission) {
      admission.accepted_by_student = true;
      admission.accepted_at = new Date();
      admission.joining_date = new Date();
      admission.status = "Active";
      admission.unlocked_features = {
        workspace_access: true,
        mentorship_access: true,
        grant_eligibility: true,
        investor_network: true,
      };
      await admission.save({ session });
    } else {
      const [newAdm] = await IncubationAdmission.create(
        [
          {
            student_id: studentId,
            startup_id: application.startup_id,
            incubator_id: application.incubator_id,
            application_id: application._id,
            accepted_at: new Date(),
            joining_date: new Date(),
            accepted_by_student: true,
            status: "Active",
            unlocked_features: {
              workspace_access: true,
              mentorship_access: true,
              grant_eligibility: true,
              investor_network: true,
            },
          },
        ],
        { session },
      );
      admission = newAdm;
    }

    // Timeline entry
    await ApplicationTimeline.create(
      [
        {
          application_id: application._id,
          status: "Accepted",
          remarks: "Student accepted incubation offer. Admission activated.",
          updated_by: studentId,
        },
      ],
      { session },
    );

    // Activity Log and Notification
    await ActivityLog.create(
      [
        {
          user_id: studentId,
          action: "ACCEPT_INCUBATION_OFFER",
          entity_type: "IncubationAdmission",
          entity_id: admission._id,
          description: "Accepted incubation offer and activated admission.",
        },
      ],
      { session },
    );

    await Notification.create(
      [
        {
          recipient_id: studentId,
          title: "Welcome to Incubation!",
          message:
            "You have successfully accepted the incubation offer. Your incubation dashboard features are now active.",
          type: "success",
        },
      ],
      { session },
    );

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({
      success: true,
      message: "Incubation offer accepted successfully. Admission activated.",
      data: admission,
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
});

/**
 * @route   GET /api/student/incubation/admission-documents
 * @desc    Get downloadable admission and compliance documents
 * @access  Private / Student
 */
const getAdmissionDocuments = asyncHandler(async (req, res) => {
  const studentId = req.user._id || req.user.id;

  const admission = await IncubationAdmission.findOne({
    student_id: studentId,
    status: "Active",
  });

  if (!admission) {
    return res.status(404).json({
      success: false,
      message: "No active incubation admission found.",
    });
  }

  const documents = await AdmissionDocument.find({
    admission_id: admission._id,
  });

  res.status(200).json({
    success: true,
    data: documents,
  });
});

/**
 * @route   GET /api/student/incubation/onboarding
 * @desc    Get orientation schedule, welcome guide, and mentor contacts
 * @access  Private / Student
 */
const getOnboardingInfo = asyncHandler(async (req, res) => {
  const studentId = req.user._id || req.user.id;

  const admission = await IncubationAdmission.findOne({
    student_id: studentId,
    status: "Active",
  }).populate(
    "incubator_id",
    "incubator_name organization city logo contact_email website",
  );

  if (!admission) {
    return res.status(404).json({
      success: false,
      message: "No active incubation admission found.",
    });
  }

  res.status(200).json({
    success: true,
    data: {
      admission_status: admission.status,
      admission_date: admission.admission_date,
      incubator: admission.incubator_id,
      unlocked_features: admission.unlocked_features,
      welcome_guide: {
        title: `Welcome to ${admission.incubator_id.incubator_name || admission.incubator_id.organization}`,
        orientation_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        checklist: [
          "Complete founder profile setup",
          "Review incubator guidelines and workspace rules",
          "Schedule introductory meeting with assigned lead mentor",
          "Submit initial 30-day milestone roadmap",
        ],
      },
    },
  });
});

module.exports = {
  getIncubationDashboard,
  getApplicationTimeline,
  getApplicationDocuments,
  uploadAdditionalDocument,
  getIncubationUpdates,
  getAcceptanceInfo,
  acceptOffer,
  getAdmissionDocuments,
  getOnboardingInfo,
};
