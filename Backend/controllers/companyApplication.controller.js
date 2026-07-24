/**
 * @file companyApplication.controller.js
 * @description Handles logic for company applicant management.
 */

const asyncHandler = require("../middlewares/asyncHandler");
const Opportunity = require("../models/Opportunity");
const Application = require("../models/Application");
const ApplicantStatus = require("../models/ApplicantStatus");
const RecruiterNote = require("../models/RecruiterNote");
const ApplicationInterview = require("../models/ApplicationInterview");
const Notification = require("../models/Notification");
const StudentProfile = require("../models/StudentProfile");
const Startup = require("../models/Startup");
const mongoose = require("mongoose");

// Helper to verify opportunity access
const verifyOpportunityAccess = async (opportunityId, companyId) => {
  const opportunity = await Opportunity.findById(opportunityId);
  if (!opportunity) return { error: "Opportunity not found", status: 404 };
  if (!opportunity.company_id.equals(companyId)) {
    return { error: "Unauthorized access to this opportunity", status: 403 };
  }
  return { opportunity };
};

/**
 * @desc    Get all applicants for an opportunity with pagination, search, and deep profile data
 * @route   GET /api/company/opportunities/:id/applicants
 */
exports.getApplicants = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { error, status } = await verifyOpportunityAccess(id, req.user._id);
  if (error) return res.status(status).json({ message: error });

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;
  const search = req.query.search;

  // Find applications, populating basic student data
  let applications = await Application.find({ opportunity_id: id })
    .populate({
      path: "student_id",
      select: "full_name email",
      match: search ? { full_name: { $regex: search, $options: "i" } } : {},
    })
    .sort({ applied_at: -1 })
    .skip(skip)
    .limit(limit);

  // Filter out where match failed (student_id is null)
  applications = search
    ? applications.filter((app) => app.student_id !== null)
    : applications;

  // Extract student IDs for deep population
  const studentIds = applications
    .map((app) => (app.student_id ? app.student_id._id : null))
    .filter(Boolean);

  // Fetch Student Profiles (College, Degree, Skills) and Startups in bulk
  const studentProfiles = await StudentProfile.find({
    user_id: { $in: studentIds },
  });
  const startups = await Startup.find({ student_id: { $in: studentIds } });

  // Map the data into the final response
  const enhancedApplications = applications.map((app) => {
    const profile = studentProfiles.find((p) =>
      p.user_id.equals(app.student_id._id),
    );
    const startup = startups.find((s) =>
      s.student_id.equals(app.student_id._id),
    );
    return {
      ...app.toObject(),
      student_profile: profile || null,
      startup: startup || null,
    };
  });

  const total = await Application.countDocuments({ opportunity_id: id });

  res.status(200).json({
    success: true,
    data: enhancedApplications,
    pagination: { total, page, pages: Math.ceil(total / limit) },
  });
});

/**
 * @desc    Get application stats for an opportunity
 * @route   GET /api/company/opportunities/:id/stats
 */
exports.getStats = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { error, status } = await verifyOpportunityAccess(id, req.user._id);
  if (error) return res.status(status).json({ message: error });

  const stats = await Application.aggregate([
    { $match: { opportunity_id: new mongoose.Types.ObjectId(id) } },
    {
      $group: {
        _id: "$application_status",
        count: { $sum: 1 },
      },
    },
  ]);

  const formattedStats = {
    total: 0,
    applied: 0,
    shortlisted: 0,
    rejected: 0,
    interviewing: 0,
    hired: 0,
  };

  stats.forEach((stat) => {
    formattedStats[stat._id] = stat.count;
    formattedStats.total += stat.count;
  });

  res.status(200).json({ success: true, data: formattedStats });
});

/**
 * @desc    Filter applications across company's opportunities with pagination and deep relationships
 * @route   POST /api/company/applications/filter
 */
exports.filterApplications = asyncHandler(async (req, res) => {
  const { status, opportunity_id, college, degree, skills } = req.body;
  const companyId = req.user._id;

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  // 1. Cross-reference filtering: if profile filters provided, query StudentProfile first
  let matchedUserIds = null;
  if (college || degree || (skills && skills.length > 0)) {
    const profileQuery = {};
    if (college) profileQuery.college = { $regex: college, $options: "i" };
    if (degree) profileQuery.degree = { $regex: degree, $options: "i" };
    if (skills && skills.length > 0) profileQuery.skills = { $in: skills };

    const matchedProfiles =
      await StudentProfile.find(profileQuery).select("user_id");
    matchedUserIds = matchedProfiles.map((p) => p.user_id);

    if (matchedUserIds.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        pagination: { total: 0, page, pages: 0 },
      });
    }
  }

  // 2. Build core Application query
  const query = {};
  if (status) query.application_status = status;
  if (matchedUserIds) query.student_id = { $in: matchedUserIds };

  if (opportunity_id) {
    const { error, status: errStatus } = await verifyOpportunityAccess(
      opportunity_id,
      companyId,
    );
    if (error) return res.status(errStatus).json({ message: error });
    query.opportunity_id = opportunity_id;
  } else {
    const opportunities = await Opportunity.find({
      company_id: companyId,
    }).select("_id");
    query.opportunity_id = { $in: opportunities.map((o) => o._id) };
  }

  // 3. Fetch base Applications
  const applications = await Application.find(query)
    .populate("student_id", "full_name email")
    .populate("opportunity_id", "title")
    .sort({ applied_at: -1 })
    .skip(skip)
    .limit(limit);

  // 4. Extract IDs and map deep data (College, Degree, Skills, Startup)
  const studentIds = applications
    .map((app) => (app.student_id ? app.student_id._id : null))
    .filter(Boolean);
  const studentProfiles = await StudentProfile.find({
    user_id: { $in: studentIds },
  });
  const startups = await Startup.find({ student_id: { $in: studentIds } });

  const enhancedApplications = applications.map((app) => {
    const profile = studentProfiles.find((p) =>
      p.user_id.equals(app.student_id._id),
    );
    const startup = startups.find((s) =>
      s.student_id.equals(app.student_id._id),
    );
    return {
      ...app.toObject(),
      student_profile: profile || null,
      startup: startup || null,
    };
  });

  const total = await Application.countDocuments(query);

  res.status(200).json({
    success: true,
    data: enhancedApplications,
    pagination: { total, page, pages: Math.ceil(total / limit) },
  });
});

/**
 * @desc    Update application status
 * @route   PUT /api/company/applications/:id/status
 */
exports.updateApplicationStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const application = await Application.findById(id).populate("opportunity_id");
  if (!application)
    return res.status(404).json({ message: "Application not found" });

  if (
    !application.opportunity_id ||
    !application.opportunity_id.company_id.equals(req.user._id)
  ) {
    return res.status(403).json({ message: "Unauthorized access" });
  }

  // Define strict chronlogical state transitions
  const allowedTransitions = {
    applied: ["shortlisted", "rejected"],
    shortlisted: ["interviewing", "rejected"],
    interviewing: ["hired", "rejected"],
    hired: [], // Terminal
    rejected: [], // Terminal
  };

  if (!allowedTransitions[application.application_status]?.includes(status)) {
    return res.status(400).json({
      message: `Invalid status transition. Cannot move from ${application.application_status} to ${status}.`,
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    application.application_status = status;
    await application.save({ session });

    await ApplicantStatus.create(
      [
        {
          application_id: application._id,
          status,
          updated_by: req.user._id,
        },
      ],
      { session },
    );

    // Create notification
    if (Notification) {
      await Notification.create(
        [
          {
            recipient_id: application.student_id,
            title: "Application Status Updated",
            message: `Your application for ${application.opportunity_id.title} has been ${status}.`,
            type: "application_update",
            related_id: application._id,
          },
        ],
        { session },
      );
    }

    await session.commitTransaction();
    res.status(200).json({ success: true, data: application });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

/**
 * @desc    Get detailed application info
 * @route   GET /api/company/applications/:id
 */
exports.getApplicationDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const application = await Application.findById(id)
    .populate("student_id")
    .populate("opportunity_id");

  if (!application)
    return res.status(404).json({ message: "Application not found" });

  if (
    !application.opportunity_id ||
    !application.opportunity_id.company_id.equals(req.user._id)
  ) {
    return res.status(403).json({ message: "Unauthorized access" });
  }

  // Fetch timeline and notes
  const timeline = await ApplicantStatus.find({ application_id: id }).sort({
    created_at: 1,
  });
  const notes = await RecruiterNote.find({ application_id: id }).sort({
    created_at: -1,
  });
  const interviews = await ApplicationInterview.find({
    application_id: id,
  }).sort({ interview_date: -1 });

  res.status(200).json({
    success: true,
    data: {
      application,
      timeline,
      notes,
      interviews,
    },
  });
});

/**
 * @desc    Add a recruiter note
 * @route   POST /api/company/applications/:id/notes
 */
exports.addRecruiterNote = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { note } = req.body;

  if (!note || note.length > 1000) {
    return res
      .status(400)
      .json({ message: "Note is required and cannot exceed 1000 characters." });
  }

  const application = await Application.findById(id).populate("opportunity_id");
  if (!application)
    return res.status(404).json({ message: "Application not found" });

  if (
    !application.opportunity_id ||
    !application.opportunity_id.company_id.equals(req.user._id)
  ) {
    return res.status(403).json({ message: "Unauthorized access" });
  }

  const newNote = await RecruiterNote.create({
    application_id: id,
    recruiter_id: req.user._id,
    note,
  });

  res.status(201).json({ success: true, data: newNote });
});

/**
 * @desc    Schedule interview
 * @route   POST /api/company/applications/:id/schedule-interview
 */
exports.scheduleInterview = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { interview_date, meeting_link } = req.body;

  if (new Date(interview_date) < new Date()) {
    return res
      .status(400)
      .json({ message: "Interview date must be in the future." });
  }

  const application = await Application.findById(id).populate("opportunity_id");
  if (!application)
    return res.status(404).json({ message: "Application not found" });

  if (
    !application.opportunity_id ||
    !application.opportunity_id.company_id.equals(req.user._id)
  ) {
    return res.status(403).json({ message: "Unauthorized access" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [interview] = await ApplicationInterview.create(
      [
        {
          application_id: id,
          interview_date,
          meeting_link,
        },
      ],
      { session },
    );

    application.application_status = "interviewing";
    await application.save({ session });

    await ApplicantStatus.create(
      [
        {
          application_id: application._id,
          status: "interviewing",
          updated_by: req.user._id,
        },
      ],
      { session },
    );

    if (Notification) {
      await Notification.create(
        [
          {
            recipient_id: application.student_id,
            title: "Interview Scheduled",
            message: `An interview for ${application.opportunity_id.title} has been scheduled.`,
            type: "interview",
            related_id: interview._id,
          },
        ],
        { session },
      );
    }

    await session.commitTransaction();
    res.status(201).json({ success: true, data: interview });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

/**
 * @desc    Get application resume
 * @route   GET /api/company/applications/:id/resume
 */
exports.getResume = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const application = await Application.findById(id).populate("opportunity_id");
  if (!application)
    return res.status(404).json({ message: "Application not found" });

  if (
    !application.opportunity_id ||
    !application.opportunity_id.company_id.equals(req.user._id)
  ) {
    return res.status(403).json({ message: "Unauthorized access" });
  }

  res
    .status(200)
    .json({ success: true, data: { resume_url: application.resume_url } });
});

/**
 * @desc    Send a message to an applicant
 * @route   POST /api/company/applications/:id/message
 */
exports.contactApplicant = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { message } = req.body;

  if (!message || message.trim() === "") {
    return res.status(400).json({ message: "Message content is required" });
  }

  const application = await Application.findById(id).populate("opportunity_id");
  if (!application)
    return res.status(404).json({ message: "Application not found" });

  if (
    !application.opportunity_id ||
    !application.opportunity_id.company_id.equals(req.user._id)
  ) {
    return res.status(403).json({ message: "Unauthorized access" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Create notification directed at the applicant regarding this message
    if (Notification) {
      await Notification.create(
        [
          {
            recipient_id: application.student_id,
            title: `Message from ${req.user.full_name || "Recruiter"}`,
            message: `Recruiter message regarding your application for ${application.opportunity_id.title}:\n\n${message}`,
            type: "message",
            related_id: application._id,
          },
        ],
        { session },
      );
    }

    // In a real system, there would also be a RecruiterMessage or Email entity stored here,
    // but for now, we just guarantee the Notification creation is safe.

    await session.commitTransaction();
    res
      .status(200)
      .json({ success: true, message: "Applicant contacted successfully" });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});
