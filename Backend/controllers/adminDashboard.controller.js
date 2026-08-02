/* eslint-disable no-useless-assignment */
const asyncHandler = require("../middlewares/asyncHandler");
const Announcement = require("../models/Announcement");
const CompanyProfile = require("../models/CompanyProfile");
const IncubatorProfile = require("../models/IncubatorProfile");
const InvestorProfile = require("../models/InvestorProfile");
const Meeting = require("../models/Meeting");
const MentorProfile = require("../models/MentorProfile");
const StageSubmission = require("../models/StageSubmission");
const Startup = require("../models/Startup");
const StartupStage = require("../models/StartupStage");
const StudentProfile = require("../models/StudentProfile");
const User = require("../models/User");

// --- Overview ---

/**
 * @desc    Get system-wide overview statistics for the admin dashboard
 * @route   GET /api/admin/overview
 * @access  Private (Admin only)
 */
const getOverview = asyncHandler(async (req, res) => {
  // Basic Stats
  const totalUsers = await User.countDocuments();
  const activeStartups = await Startup.countDocuments();
  
  const pendingUserVerifications = await User.countDocuments({
    account_status: { $in: ["pending_verification", "pending_approval"] },
  });
  const pendingStageSubmissions = await StageSubmission.countDocuments({
    status: "pending_review",
  });
  const pendingVerifications = pendingUserVerifications + pendingStageSubmissions;

  // Mocking Investor Capital for now
  const investorCapital = "$0";

  // User Distribution
  const userRolesCount = await User.aggregate([
    { $group: { _id: "$role", count: { $sum: 1 } } }
  ]);
  
  // Transform to match frontend expectations:
  const roleMapping = {
    student: "Students",
    mentor: "Mentors",
    investor: "Investors",
    incubator: "Incubators",
    company: "Companies",
    admin: "Admins",
  };
  
  const userDistribution = userRolesCount
    .filter(r => roleMapping[r._id] && r._id !== "admin")
    .map(r => ({
      label: roleMapping[r._id],
      pct: totalUsers > 0 ? Math.round((r.count / totalUsers) * 100) : 0,
      count: r.count
    }));

  // Funnel Views (Startup Stages)
  // Stage 1 = Idea, 2 = Validation, 3 = MVP, 4 = Traction, 5 = Launch
  const startupStagesCount = await Startup.aggregate([
    { $group: { _id: "$current_stage", count: { $sum: 1 } } }
  ]);
  
  const stageMapping = {
    1: "Idea",
    2: "Validation",
    3: "MVP",
    4: "Traction",
    5: "Launch"
  };

  const funnelViews = {
    Daily: [
      { label: "Idea", value: 0 },
      { label: "Validation", value: 0 },
      { label: "MVP", value: 0 },
      { label: "Traction", value: 0 },
      { label: "Launch", value: 0 },
    ],
    Monthly: [
      { label: "Idea", value: 0 },
      { label: "Validation", value: 0 },
      { label: "MVP", value: 0 },
      { label: "Traction", value: 0 },
      { label: "Launch", value: 0 },
    ]
  };

  startupStagesCount.forEach(st => {
    const stageName = stageMapping[st._id];
    if (stageName) {
      const idx = funnelViews.Daily.findIndex(fv => fv.label === stageName);
      if (idx !== -1) {
        funnelViews.Daily[idx].value = st.count;
        funnelViews.Monthly[idx].value = st.count; // For now, mirror daily
      }
    }
  });

  // Upcoming Cycles (Meetings)
  const upcomingMeetings = await Meeting.find({
    status: "scheduled",
    meeting_date: { $gte: new Date() }
  })
    .populate("startup_id", "startup_name")
    .populate("reviewer_id", "full_name")
    .sort({ meeting_date: 1 })
    .limit(2);

  const formattedMeetings = upcomingMeetings.map(m => ({
    title: `${m.agenda || "Review Sync"} — ${m.startup_id?.startup_name || "Startup"}`,
    time: m.meeting_date
  }));

  // Critical Actions
  const criticalActions = [];
  if (pendingUserVerifications > 0) {
    criticalActions.push({
      id: "ca1",
      iconType: "AlertTriangle",
      tone: "error",
      title: "Identity Verification Needed",
      detail: `${pendingUserVerifications} user(s) flagged for review`,
      reviewHref: "/admin/verification",
    });
  }
  if (pendingStageSubmissions > 0) {
    criticalActions.push({
      id: "ca2",
      iconType: "FileText",
      tone: "warning",
      title: "Stage Submissions Pending",
      detail: `${pendingStageSubmissions} startup(s) waiting for stage approval`,
      reviewHref: "/admin/verification",
    });
  }
  
  if (criticalActions.length === 0) {
    criticalActions.push({
      id: "ca3",
      iconType: "UserPlus",
      tone: "info",
      title: "All Clear",
      detail: "No critical actions pending at the moment",
    });
  }

  // Activity Stream (Mocked for now as per plan)
  const activityStream = [
    { iconType: "RefreshCw", text: "Dashboard data synced", time: "Just now" },
  ];

  return res.status(200).json({
    success: true,
    data: {
      totalUsers,
      activeStartups,
      pendingVerifications,
      investorCapital,
      userDistribution,
      funnelViews,
      upcomingCycle: formattedMeetings,
      criticalActions,
      activityStream
    }
  });
});

// -- Announcement Screen ---

const getAnnouncements = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, priority, search } = req.query;
  const skip = (page - 1) * limit;

  const filter = {};
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (search) filter.title = new RegExp(search, "i");

  const announcements = await Announcement.find(filter)
    .populate("author_id", "full_name email")
    .sort({ created_at: -1 })
    .skip(skip)
    .limit(Number(limit))
    .lean();

  const total = await Announcement.countDocuments(filter);

  const stats = {
    total_views_today: 0,
    published_today: 0,
    scheduled: 0,
    drafts: 0,
  };

  stats.published_today = await Announcement.countDocuments({
    status: "Published",
    published_at: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
  });
  stats.scheduled = await Announcement.countDocuments({ status: "Scheduled" });
  stats.drafts = await Announcement.countDocuments({ status: "Draft" });

  res.status(200).json({
    success: true,
    data: announcements,
    stats,
    pagination: {
      current_page: Number(page),
      total_pages: Math.ceil(total / limit),
      total_records: total,
    },
  });
});

const createAnnouncement = asyncHandler(async (req, res) => {
  const { title, short_summary, body_content, target_audience, priority } =
    req.validatedData;

  const announcement = new Announcement({
    title,
    short_summary,
    body_content,
    target_audience,
    priority,
    author_id: req.user.id,
    status: "Published",
  });

  await announcement.save();

  res.status(201).json({
    success: true,
    message: "Announcement created as draft",
    data: { announcement_id: announcement.announcement_id },
  });
});

//  --- users verification ---

const PROFILE_MODELS = {
  student: StudentProfile,
  mentor: MentorProfile,
  investor: InvestorProfile,
  incubator: IncubatorProfile,
  company: CompanyProfile,
};

/**
 * @desc    Get all pending/unapproved users for verification queue
 * @route   GET /api/admin/users/verification
 * @access  Private (Admin only)
 */
const getVerificationUsers = asyncHandler(async (req, res) => {
  // Fetch all users awaiting review (pending email verification or pending admin approval)
  const users = await User.find({
    account_status: { $in: ["pending_verification", "pending_approval"] },
  })
    .select("full_name email phone role account_status created_at")
    .sort({ created_at: -1 });

  const formattedUsers = users.map((u) => {
    let statusLabel = "Pending";
    if (u.account_status === "pending_approval") statusLabel = "Under Review";

    return {
      id: u._id,
      username: u.full_name || u.email.split("@")[0],
      fullName: u.full_name,
      email: u.email,
      role: u.role.charAt(0).toUpperCase() + u.role.slice(1),
      phone: u.phone || "N/A",
      regDate: u.created_at ? u.created_at.toISOString().split("T")[0] : "N/A",
      status: statusLabel,
      account_status: u.account_status,
    };
  });

  return res.status(200).json({
    success: true,
    data: formattedUsers,
  });
});

/**
 * @desc    Get detailed application details for a user by ID
 * @route   GET /api/admin/users/verification/:id
 * @access  Private (Admin only)
 */
const getUserVerificationDetail = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  // Fetch role-specific profile document
  const ProfileModel = PROFILE_MODELS[user.role];
  let profile = null;

  if (ProfileModel) {
    profile = await ProfileModel.findOne({ user_id: user._id });
  }

  return res.status(200).json({
    success: true,
    data: {
      user: {
        id: user._id,
        fullName: user.full_name,
        email: user.email,
        phone: user.phone || "N/A",
        role: user.role,
        account_status: user.account_status,
        created_at: user.created_at,
      },
      profile: profile || {},
    },
  });
});

/**
 * @desc    Approve, Reject, or Request Info for user verification
 * @route   POST /api/admin/users/verification/:id/decision
 * @access  Private (Admin only)
 */
const handleVerificationDecision = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { decision, remarks, requestText } = req.body;

  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  // Determine status and save internal admin remarks
  if (decision === "approve") {
    user.account_status = "active";
    if (remarks) user.profile_remarks = remarks;
    else user.profile_remarks = " ";
  } else if (decision === "reject") {
    user.account_status = "rejected";
    if (remarks) user.profile_remarks = remarks;
  } else if (decision === "request") {
    user.account_status = "pending_verification";
    // Store request feedback if provided, fallback to admin remarks
    user.profile_remarks = requestText || remarks || user.profile_remarks;
  } else {
    return res
      .status(400)
      .json({ success: false, message: "Invalid decision parameter" });
  }

  await user.save();

  return res.status(200).json({
    success: true,
    message: `User status updated to ${user.account_status}`,
    data: {
      id: user._id,
      account_status: user.account_status,
      profile_remarks: user.profile_remarks,
    },
  });
});

// --- startup verification ---

/**
 * @desc    Get all stage submissions for Review Queue + Top Stat Cards
 * @route   GET /api/admin/reviews
 * @access  Private (Admin only)
 */
const getReviewQueue = asyncHandler(async (req, res) => {
  // 1. Fetch submissions that are pending review
  const submissions = await StageSubmission.find({ status: "pending_review" })
    .populate({
      path: "startup_id",
      select:
        "startup_name chapter current_stage progress_percentage student_id",
      populate: { path: "student_id", select: "full_name email" },
    })
    .populate("stage_id", "stage_number stage_name status")
    .sort({ submitted_at: -1 });

  // 2. Compute dynamic Stat Cards metrics
  const pendingCount = await StageSubmission.countDocuments({
    status: "pending_review",
  });

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const approvedToday = await StageSubmission.countDocuments({
    status: "approved",
    updated_at: { $gte: startOfToday },
  });

  const rejectedToday = await StageSubmission.countDocuments({
    status: "rejected",
    updated_at: { $gte: startOfToday },
  });

  // Format array for the frontend table
  const formattedSubmissions = submissions.map((sub) => {
    const startup = sub.startup_id || {};
    const student = startup.student_id || {};
    const stage = sub.stage_id || {};

    return {
      id: sub._id,
      startupId: startup._id,
      name: sub.title || "Untitled Startup",
      founder: student.full_name || "N/A",
      chapter: startup.chapter || "Main Chapter",
      stage: stage.stage_name || `Stage ${startup.current_stage || 1}`,
      stageNumber: stage.stage_number || startup.current_stage || 1,
      date: sub.submitted_at
        ? sub.submitted_at.toISOString().split("T")[0]
        : sub.created_at.toISOString().split("T")[0],
      status: sub.status === "pending_review" ? "Pending" : sub.status,
    };
  });

  return res.status(200).json({
    success: true,
    data: {
      stats: {
        pendingReviews: pendingCount,
        approvedToday,
        rejectedToday,
        meetingsPending: 0,
      },
      submissions: formattedSubmissions,
    },
  });
});

/**
 * @desc    Get detailed submission + startup info for Ideation Workspace Review
 * @route   GET /api/admin/reviews/:submissionId
 * @access  Private (Admin only)
 */
const getSubmissionDetail = asyncHandler(async (req, res) => {
  const { submissionId } = req.params;

  const submission = await StageSubmission.findById(submissionId)
    .populate({
      path: "startup_id",
      select:
        "startup_name chapter current_stage progress_percentage student_id logo description",
      populate: { path: "student_id", select: "full_name email phone" },
    })
    .populate("stage_id");

  if (!submission) {
    return res
      .status(404)
      .json({ success: false, message: "Submission not found" });
  }

  const startup = submission.startup_id;

  // Fetch all stages for the startup journey timeline
  const allStages = await StartupStage.find({ startup_id: startup._id }).sort({
    stage_number: 1,
  });

  return res.status(200).json({
    success: true,
    data: {
      submission: {
        id: submission._id,
        title: submission.title,
        description: submission.description, // Problem Statement
        solution: submission.solution, // Proposed Solution
        targetAudience: submission.target_audience,
        valueProposition: submission.value_proposition,
        competitors: submission.competitors,
        attachmentUrl: submission.attachment_url,
        status: submission.status,
        submittedAt: submission.submitted_at || submission.created_at,
      },
      startup: {
        id: startup._id,
        name: submission.title,
        founder: startup.student_id?.full_name || "N/A",
        email: startup.student_id?.email || "N/A",
        phone: startup.student_id?.phone || "N/A",
        chapter: startup.chapter || "N/A",
        currentStage: startup.current_stage,
        progressPercentage: startup.progress_percentage || 20,
      },
      journeyStages: allStages.map((stg) => ({
        stageNumber: stg.stage_number,
        label: stg.stage_name,
        status: stg.status, // 'locked' | 'active' | 'submitted' | 'approved' | 'rejected'
      })),
    },
  });
});

/**
 * @desc    Approve or Request Changes on a Stage Submission
 * @route   POST /api/admin/reviews/:submissionId/decision
 * @access  Private (Admin only)
 */
const handleSubmissionDecision = asyncHandler(async (req, res) => {
  const { submissionId } = req.params;
  const { decision, remarks, changesText } = req.body; // 'approve' | 'request_changes'

  const submission = await StageSubmission.findById(submissionId);
  if (!submission) {
    return res
      .status(404)
      .json({ success: false, message: "Submission not found" });
  }

  if (decision === "approve") {
    submission.status = "approved";
    if (remarks) submission.request_changes = remarks;
    await submission.save();
  } else if (decision === "request_changes") {
    submission.status = "request_changes";
    submission.request_changes = changesText || remarks || "";
    await submission.save();

    // Set stage back to 'active' so student can interact with it on their dashboard
    await StartupStage.findByIdAndUpdate(submission.stage_id, {
      status: "active",
    });
  } else {
    return res
      .status(400)
      .json({ success: false, message: "Invalid decision option" });
  }

  return res.status(200).json({
    success: true,
    message: `Submission ${
      decision === "approve" ? "approved" : "reverted to draft for revision"
    }`,
    data: {
      id: submission._id,
      status: submission.status,
      request_changes: submission.request_changes,
    },
  });
});

/**
 * @desc    Get pre-scheduling context (verifies idea/submission approval)
 * @route   GET /api/admin/meetings/prepare
 * @access  Private (Admin only)
 */
const getMeetingPrepareContext = asyncHandler(async (req, res) => {
  const { submissionId, startupId } = req.query;

  let submission = null;
  let startup = null;

  if (submissionId) {
    submission = await StageSubmission.findById(submissionId).populate({
      path: "startup_id",
      populate: { path: "student_id", select: "full_name email" },
    });

    if (!submission) {
      return res
        .status(404)
        .json({ success: false, message: "Submission not found" });
    }

    startup = submission.startup_id;

    // Strict Rule: Ideas/Submissions MUST be approved before scheduling
    if (submission.status !== "approved") {
      return res.status(403).json({
        success: false,
        message: "Meetings can only be scheduled for approved submissions.",
        submissionStatus: submission.status,
      });
    }
  } else if (startupId) {
    startup = await Startup.findById(startupId).populate(
      "student_id",
      "full_name email",
    );

    // Check if at least one submission is approved for this startup
    const approvedSub = await StageSubmission.findOne({
      startup_id: startupId,
      status: "approved",
    });

    if (!approvedSub) {
      return res.status(403).json({
        success: false,
        message:
          "No approved submissions found for this startup. Idea must be approved first.",
      });
    }
  } else {
    return res
      .status(400)
      .json({ success: false, message: "Missing submissionId or startupId" });
  }

  // Fetch available reviewers (Mentors, Admins, Incubators)
  const reviewers = await User.find({
    role: { $in: ["admin", "mentor"] },
  }).select("_id full_name role");

  // Fetch upcoming scheduled meetings for sidebar display
  const upcomingMeetings = await Meeting.find({ status: "scheduled" })
    .populate("startup_id", "startup_name")
    .populate("reviewer_id", "full_name")
    .sort({ meeting_date: 1 })
    .limit(5);

  return res.status(200).json({
    success: true,
    data: {
      startup: {
        id: startup._id,
        name: startup.startup_name,
        founder: startup.student_id?.full_name || "N/A",
        email: startup.student_id?.email || "N/A",
      },
      reviewers: reviewers.map((r) => ({
        id: r._id,
        name: r.full_name,
        role: r.role,
      })),
      upcomingMeetings: upcomingMeetings.map((m) => ({
        id: m._id,
        startup: m.startup_id?.startup_name || "Unknown",
        reviewer: m.reviewer_id?.full_name || "Assigned Reviewer",
        time: new Date(m.meeting_date).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        date: new Date(m.meeting_date).toISOString().split("T")[0],
      })),
    },
  });
});

/**
 * @desc    Schedule a new review meeting
 * @route   POST /api/admin/meetings/schedule
 * @access  Private (Admin only)
 */
const scheduleMeeting = asyncHandler(async (req, res) => {
  const {
    startup_id,
    reviewer_id,
    meeting_date,
    meeting_time,
    duration,
    platform,
    agenda,
  } = req.body;

  if (!startup_id || !meeting_date || !meeting_time) {
    return res.status(400).json({
      success: false,
      message: "Startup, meeting date, and meeting time are required",
    });
  }

  // Double check startup approval condition
  const approvedSubmission = await StageSubmission.findOne({
    startup_id,
    status: "approved",
  });

  if (!approvedSubmission) {
    return res.status(403).json({
      success: false,
      message: "Cannot schedule meeting. Startup idea has not been approved.",
    });
  }

  // Combine date and time strings into a Date object
  const combinedDateTime = new Date(`${meeting_date}T${meeting_time}:00`);

  const meeting = new Meeting({
    startup_id,
    reviewer_id: reviewer_id || req.user.id, // Fallback to current logged-in admin
    meeting_date: combinedDateTime,
    duration: duration || "60 minutes",
    platform: platform || "Google Meet",
    agenda: agenda || "",
    status: "scheduled",
  });

  await meeting.save();

  return res.status(201).json({
    success: true,
    message: "Meeting scheduled successfully",
    data: meeting,
  });
});

module.exports = {
  getOverview,
  getAnnouncements,
  createAnnouncement,
  getVerificationUsers,
  getUserVerificationDetail,
  handleVerificationDecision,
  getReviewQueue,
  getSubmissionDetail,
  handleSubmissionDecision,
  getMeetingPrepareContext,
  scheduleMeeting,
};

/**
 * @desc    Get all users (paginated)
 * @route   GET /api/admin/users/all
 * @access  Private (Admin only)
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const { role, status, page = 1, limit = 10, search } = req.query;

  const query = {};
  if (role) query.role = role;
  if (status) query.status = status;
  if (search) {
    query.$or = [
      { full_name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);
  const skip = (pageNum - 1) * limitNum;

  const total = await User.countDocuments(query);
  const users = await User.find(query)
    .sort({ created_at: -1 })
    .skip(skip)
    .limit(limitNum)
    .select('-password_hash -__v')
    .lean();

  res.status(200).json({
    success: true,
    data: {
      users,
      page: pageNum,
      limit: limitNum,
      total_records: total,
      total_pages: Math.ceil(total / limitNum),
    },
  });
});

module.exports.getAllUsers = getAllUsers;
