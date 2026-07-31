/**
 * @file studentFreelancing.controller.js
 * @description Controller for student interactions with freelancing opportunities.
 * @architecture Handles business logic for listing, searching, filtering, and saving opportunities for students.
 */

const asyncHandler = require("../middlewares/asyncHandler");
const Opportunity = require("../models/Opportunity");
const SavedOpportunity = require("../models/SavedOpportunity");
const User = require("../models/User");
const CompanyProfile = require("../models/CompanyProfile");
const Application = require("../models/Application");
const ApplicantStatus = require("../models/ApplicantStatus");
const ApplicationDocument = require("../models/ApplicationDocument");
const ApplicationInterview = require("../models/ApplicationInterview");

/**
 * Helper function to get a list of active company IDs
 * This ensures students only see opportunities from approved/active companies.
 * @returns {Promise<Array>} Array of active company User ObjectIds
 */
const getActiveCompanyIds = async () => {
  const activeCompanies = await User.find({
    role: "company",
    account_status: "active",
  }).select("_id");
  return activeCompanies.map((c) => c._id);
};

/**
 * @desc    Get all open/active freelancing opportunities
 * @route   GET /api/student/freelancing/opportunities
 * @access  Private (Student)
 */
exports.listOpportunities = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;

  const activeCompanyIds = await getActiveCompanyIds();

  const query = {
    status: { $in: ["open", "active"] },
    company_id: { $in: activeCompanyIds },
  };

  const total = await Opportunity.countDocuments(query);
  const opportunities = await Opportunity.find(query)
    .populate("company_id", "full_name email")
    .sort({ created_at: -1 })
    .skip(startIndex)
    .limit(limit)
    .lean();

  res.status(200).json({
    success: true,
    count: opportunities.length,
    pagination: {
      total,
      page,
      limit,
    },
    data: opportunities,
  });
});

/**
 * @desc    Search freelancing opportunities by keyword
 * @route   GET /api/student/freelancing/opportunities/search
 * @access  Private (Student)
 */
exports.searchOpportunities = asyncHandler(async (req, res) => {
  const { keyword } = req.query;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;

  if (!keyword) {
    return res.status(400).json({
      success: false,
      message: "Please provide a keyword to search",
    });
  }

  const activeCompanyIds = await getActiveCompanyIds();

  const query = {
    status: { $in: ["open", "active"] },
    company_id: { $in: activeCompanyIds },
    $text: { $search: keyword },
  };

  const total = await Opportunity.countDocuments(query);
  const opportunities = await Opportunity.find(query, {
    score: { $meta: "textScore" },
  })
    .populate("company_id", "full_name email")
    .sort({ score: { $meta: "textScore" } })
    .skip(startIndex)
    .limit(limit)
    .lean();

  res.status(200).json({
    success: true,
    count: opportunities.length,
    pagination: {
      total,
      page,
      limit,
    },
    data: opportunities,
  });
});

/**
 * @desc    Filter freelancing opportunities
 * @route   POST /api/student/freelancing/opportunities/filter
 * @access  Private (Student)
 */
exports.filterOpportunities = asyncHandler(async (req, res) => {
  const { type, work_mode, industry, experience_level, sort } = req.body;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;

  const activeCompanyIds = await getActiveCompanyIds();

  const query = {
    status: { $in: ["open", "active"] },
    company_id: { $in: activeCompanyIds },
  };

  if (type) {
    query.type = type;
  }
  if (work_mode) {
    query.work_mode = work_mode;
  }
  if (industry) {
    query.industry = { $regex: new RegExp(industry, "i") };
  }
  if (experience_level) {
    query.experience_level = { $regex: new RegExp(experience_level, "i") };
  }

  let sortObj = { created_at: -1 };
  if (sort === "deadline") {
    sortObj = { application_deadline: 1 };
  } else if (sort === "relevance") {
    // If text search was included, but we don't have text search in the filter POST body by PRD.
    // Fallback to latest
    sortObj = { created_at: -1 };
  }

  const total = await Opportunity.countDocuments(query);
  const opportunities = await Opportunity.find(query)
    .populate("company_id", "full_name email")
    .sort(sortObj)
    .skip(startIndex)
    .limit(limit)
    .lean();

  res.status(200).json({
    success: true,
    count: opportunities.length,
    pagination: {
      total,
      page,
      limit,
    },
    data: opportunities,
  });
});

/**
 * @desc    Get details of a specific opportunity
 * @route   GET /api/student/freelancing/opportunities/:opportunityId
 * @route   GET /api/student/freelancing/opportunities/:opportunityId/details
 * @access  Private (Student)
 */
exports.getOpportunityDetails = asyncHandler(async (req, res) => {
  const { opportunityId } = req.params;
  const studentId = req.user._id;

  const activeCompanyIds = await getActiveCompanyIds();

  const opportunity = await Opportunity.findOne({
    _id: opportunityId,
    status: { $in: ["open", "active"] },
    company_id: { $in: activeCompanyIds },
  })
    .populate("company_id", "full_name email")
    .lean();

  if (!opportunity) {
    return res.status(404).json({
      success: false,
      message: "Opportunity not found or no longer active",
    });
  }

  // Fetch full company profile
  const companyProfile = await CompanyProfile.findOne({
    user_id: opportunity.company_id._id,
  });

  // Check if student has saved this opportunity
  const isSaved = await SavedOpportunity.exists({
    student_id: studentId,
    opportunity_id: opportunityId,
  });

  res.status(200).json({
    success: true,
    data: {
      opportunity,
      companyProfile,
      isSaved: !!isSaved,
    },
  });
});

/**
 * @desc    Save an opportunity
 * @route   POST /api/student/freelancing/opportunities/:opportunityId/save
 * @access  Private (Student)
 */
exports.saveOpportunity = asyncHandler(async (req, res) => {
  const { opportunityId } = req.params;
  const studentId = req.user._id;

  const opportunity = await Opportunity.findById(opportunityId);
  if (!opportunity) {
    return res.status(404).json({
      success: false,
      message: "Opportunity not found",
    });
  }

  try {
    await SavedOpportunity.create({
      student_id: studentId,
      opportunity_id: opportunityId,
    });

    res.status(200).json({
      success: true,
      message: "Opportunity saved successfully",
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Opportunity is already saved",
      });
    }
    throw error;
  }
});

/**
 * @desc    Remove a saved opportunity
 * @route   DELETE /api/student/freelancing/opportunities/:opportunityId/save
 * @access  Private (Student)
 */
exports.unsaveOpportunity = asyncHandler(async (req, res) => {
  const { opportunityId } = req.params;
  const studentId = req.user._id;

  const result = await SavedOpportunity.findOneAndDelete({
    student_id: studentId,
    opportunity_id: opportunityId,
  });

  if (!result) {
    return res.status(404).json({
      success: false,
      message: "Saved opportunity not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Opportunity removed from saved list",
  });
});

/**
 * @desc    Create a draft application for an opportunity
 * @route   POST /api/student/freelancing/applications
 * @access  Private (Student)
 */
exports.createApplication = asyncHandler(async (req, res) => {
  const {
    opportunity_id,
    resume_url,
    cover_letter,
    portfolio_url,
    availability,
    joining_date,
  } = req.body;
  const studentId = req.user._id;

  if (!opportunity_id) {
    return res
      .status(400)
      .json({ success: false, message: "opportunity_id is required" });
  }

  // Check if opportunity is active
  const opportunity = await Opportunity.findOne({
    _id: opportunity_id,
    status: { $in: ["open", "active"] },
  });

  if (!opportunity) {
    return res
      .status(404)
      .json({
        success: false,
        message: "Opportunity not found or no longer active",
      });
  }

  if (
    opportunity.application_deadline &&
    new Date(opportunity.application_deadline) < new Date()
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Application deadline has passed" });
  }

  // Prevent duplicate applications
  const existingApp = await Application.findOne({
    opportunity_id,
    student_id: studentId,
  });
  if (existingApp) {
    return res
      .status(400)
      .json({
        success: false,
        message:
          "You have already applied or started an application for this opportunity",
      });
  }

  if (!resume_url) {
    return res
      .status(400)
      .json({ success: false, message: "Resume is required" });
  }

  const application = await Application.create({
    opportunity_id,
    student_id: studentId,
    application_status: "draft",
    resume_url,
    cover_letter,
    portfolio_url,
    availability,
    joining_date,
  });

  await ApplicantStatus.create({
    application_id: application._id,
    status: "draft",
    updated_by: studentId,
    remarks: "Application draft created",
  });

  res.status(201).json({ success: true, data: application });
});

/**
 * @desc    Get all applications submitted by the student
 * @route   GET /api/student/freelancing/applications
 * @access  Private (Student)
 */
exports.getApplications = asyncHandler(async (req, res) => {
  const studentId = req.user._id;
  const { status } = req.query; // Active, Interviews, Selected, Rejected, Archived, etc.

  let query = { student_id: studentId };
  if (status) {
    if (status === "Active") {
      query.application_status = {
        $in: ["draft", "submitted", "viewed", "shortlisted"],
      };
    } else if (status === "Interviews") {
      query.application_status = { $in: ["interviewing", "interview"] };
    } else if (status === "Selected") {
      query.application_status = { $in: ["selected", "hired"] };
    } else if (status === "Rejected") {
      query.application_status = "rejected";
    } else if (status === "Archived") {
      query.application_status = "withdrawn";
    } else {
      query.application_status = status.toLowerCase();
    }
  }

  const applications = await Application.find(query)
    .populate({
      path: "opportunity_id",
      select: "title company_id",
      populate: { path: "company_id", select: "full_name email" },
    })
    .sort({ updated_at: -1 });

  res
    .status(200)
    .json({ success: true, count: applications.length, data: applications });
});

/**
 * @desc    Get specific application details
 * @route   GET /api/student/freelancing/applications/:applicationId
 * @access  Private (Student)
 */
exports.getApplicationDetails = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;
  const studentId = req.user._id;

  const application = await Application.findOne({
    _id: applicationId,
    student_id: studentId,
  }).populate({
    path: "opportunity_id",
    populate: { path: "company_id", select: "full_name email" },
  });

  if (!application) {
    return res
      .status(404)
      .json({ success: false, message: "Application not found" });
  }

  const documents = await ApplicationDocument.find({
    application_id: applicationId,
  });

  res.status(200).json({ success: true, data: { application, documents } });
});

/**
 * @desc    Update a draft application
 * @route   PUT /api/student/freelancing/applications/:applicationId
 * @access  Private (Student)
 */
exports.updateApplication = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;
  const studentId = req.user._id;
  const {
    resume_url,
    cover_letter,
    portfolio_url,
    availability,
    joining_date,
  } = req.body;

  let application = await Application.findOne({
    _id: applicationId,
    student_id: studentId,
  });
  if (!application) {
    return res
      .status(404)
      .json({ success: false, message: "Application not found" });
  }

  if (application.application_status !== "draft") {
    return res
      .status(400)
      .json({
        success: false,
        message: "Only draft applications can be updated",
      });
  }

  application.resume_url = resume_url || application.resume_url;
  application.cover_letter =
    cover_letter !== undefined ? cover_letter : application.cover_letter;
  application.portfolio_url =
    portfolio_url !== undefined ? portfolio_url : application.portfolio_url;
  application.availability =
    availability !== undefined ? availability : application.availability;
  application.joining_date =
    joining_date !== undefined ? joining_date : application.joining_date;

  await application.save();

  res.status(200).json({ success: true, data: application });
});

/**
 * @desc    Upload resume (returns file URL)
 * @route   POST /api/student/freelancing/applications/upload-resume
 * @access  Private (Student)
 */
exports.uploadResume = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "Please upload a resume file" });
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  res.status(200).json({ success: true, url: fileUrl });
});

/**
 * @desc    Upload additional document (creates ApplicationDocument)
 * @route   POST /api/student/freelancing/applications/upload-document
 * @access  Private (Student)
 */
exports.uploadDocument = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ success: false, message: "Please upload a document" });
  }

  const { application_id, document_type } = req.body;
  if (!application_id || !document_type) {
    return res
      .status(400)
      .json({
        success: false,
        message: "application_id and document_type are required",
      });
  }

  const studentId = req.user._id;
  const application = await Application.findOne({
    _id: application_id,
    student_id: studentId,
  });

  if (!application) {
    return res
      .status(404)
      .json({ success: false, message: "Application not found" });
  }

  if (application.application_status !== "draft") {
    return res
      .status(400)
      .json({
        success: false,
        message: "Documents can only be uploaded to draft applications",
      });
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  const doc = await ApplicationDocument.create({
    application_id,
    document_type,
    file_name: req.file.originalname,
    file_url: fileUrl,
  });

  res.status(200).json({ success: true, data: doc });
});

/**
 * @desc    Submit application
 * @route   POST /api/student/freelancing/applications/:applicationId/submit
 * @access  Private (Student)
 */
exports.submitApplication = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;
  const studentId = req.user._id;

  let application = await Application.findOne({
    _id: applicationId,
    student_id: studentId,
  }).populate("opportunity_id");
  if (!application) {
    return res
      .status(404)
      .json({ success: false, message: "Application not found" });
  }

  if (application.application_status !== "draft") {
    return res
      .status(400)
      .json({ success: false, message: "Application is already submitted" });
  }

  if (!application.resume_url) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Resume is required before submitting",
      });
  }

  // Check deadline again
  const opportunity = application.opportunity_id;
  if (
    opportunity &&
    opportunity.application_deadline &&
    new Date(opportunity.application_deadline) < new Date()
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Application deadline has passed" });
  }

  application.application_status = "submitted";
  await application.save();

  await ApplicantStatus.create({
    application_id: application._id,
    status: "submitted",
    updated_by: studentId,
    remarks: "Application submitted successfully",
  });

  res
    .status(200)
    .json({
      success: true,
      message: "Application submitted successfully",
      data: application,
    });
});

/**
 * @desc    Withdraw application
 * @route   DELETE /api/student/freelancing/applications/:applicationId/withdraw
 * @access  Private (Student)
 */
exports.withdrawApplication = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;
  const studentId = req.user._id;

  let application = await Application.findOne({
    _id: applicationId,
    student_id: studentId,
  });
  if (!application) {
    return res
      .status(404)
      .json({ success: false, message: "Application not found" });
  }

  if (
    ["interview", "interviewing", "selected", "hired"].includes(
      application.application_status,
    )
  ) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Cannot withdraw application after interview stage",
      });
  }

  application.application_status = "withdrawn";
  await application.save();

  await ApplicantStatus.create({
    application_id: application._id,
    status: "withdrawn",
    updated_by: studentId,
    remarks: "Student withdrew application",
  });

  res.status(200).json({ success: true, message: "Application withdrawn" });
});

/**
 * @desc    Get application status flow/timeline
 * @route   GET /api/student/freelancing/applications/:applicationId/timeline
 * @access  Private (Student)
 */
exports.getApplicationTimeline = asyncHandler(async (req, res) => {
  const { applicationId } = req.params;
  const studentId = req.user._id;

  const application = await Application.findOne({
    _id: applicationId,
    student_id: studentId,
  });
  if (!application) {
    return res
      .status(404)
      .json({ success: false, message: "Application not found" });
  }

  const timeline = await ApplicantStatus.find({ application_id: applicationId })
    .populate("updated_by", "full_name _id")
    .sort({ created_at: 1 });

  res.status(200).json({ success: true, data: { timeline } });
});

/**
 * @desc    Get interviews for student's applications
 * @route   GET /api/student/freelancing/applications/interviews
 * @access  Private (Student)
 */
exports.getInterviews = asyncHandler(async (req, res) => {
  const studentId = req.user._id;

  // Find all applications for this student
  const applications = await Application.find({ student_id: studentId }).select(
    "_id",
  );
  const appIds = applications.map((app) => app._id);

  const interviews = await ApplicationInterview.find({
    application_id: { $in: appIds },
  })
    .populate({
      path: "application_id",
      select: "opportunity_id application_status",
      populate: {
        path: "opportunity_id",
        select: "title company_id",
        populate: { path: "company_id", select: "full_name email" },
      },
    })
    .sort({ interview_date: 1 });

  res
    .status(200)
    .json({ success: true, count: interviews.length, data: { interviews } });
});

/**
 * @desc    Get all application statuses summary
 * @route   GET /api/student/freelancing/applications/status
 * @access  Private (Student)
 */
exports.getApplicationStatusSummary = asyncHandler(async (req, res) => {
  const studentId = req.user._id;

  const applications = await Application.find(
    { student_id: studentId },
    "application_status",
  );

  const statusSummary = {
    total: applications.length,
    active: 0,
    interviews: 0,
    selected: 0,
    rejected: 0,
    archived: 0,
  };

  applications.forEach((app) => {
    const stat = app.application_status;
    if (["draft", "submitted", "viewed", "shortlisted"].includes(stat))
      statusSummary.active++;
    else if (["interviewing", "interview"].includes(stat))
      statusSummary.interviews++;
    else if (["selected", "hired"].includes(stat)) statusSummary.selected++;
    else if (stat === "rejected") statusSummary.rejected++;
    else if (stat === "withdrawn") statusSummary.archived++;
  });

  res.status(200).json({ success: true, data: { counts: statusSummary } });
});
