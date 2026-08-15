/* eslint-disable no-useless-assignment */
const asyncHandler = require("../middlewares/asyncHandler");
const Announcement = require("../models/Announcement");
const CompanyProfile = require("../models/CompanyProfile");
const IncubatorProfile = require("../models/IncubatorProfile");
const InvestorProfile = require("../models/InvestorProfile");
const Meeting = require("../models/Meeting");
const Chapter = require("../models/Chapter");
const MentorProfile = require("../models/MentorProfile");
const StageSubmission = require("../models/StageSubmission");
const Startup = require("../models/Startup");
const StartupStage = require("../models/StartupStage");
const StudentProfile = require("../models/StudentProfile");
const User = require("../models/User");
const { sendAdminMeetingReminder } = require("../utils/email");
const MeetingFeedback = require("../models/MeetingFeedback");

// -- Dashboard Screen --

/**
 * Helper to parse amounts from strings like "$500K — $2.5M", "$100k", or "500000"
 */
const parseCapitalString = (str) => {
  if (!str) return 0;
  const matches = str.match(/(?:[$€£]?\s*(\d+(?:\.\d+)?)\s*([kKmMbB])?)/g);
  if (!matches) return 0;

  let maxVal = 0;
  matches.forEach((m) => {
    const numMatch = m.match(/(\d+(?:\.\d+)?)\s*([kKmMbB])?/);
    if (numMatch) {
      let val = parseFloat(numMatch[1]);
      const unit = (numMatch[2] || "").toUpperCase();
      if (unit === "K") val *= 1_000;
      else if (unit === "M") val *= 1_000_000;
      else if (unit === "B") val *= 1_000_000_000;
      if (val > maxVal) maxVal = val;
    }
  });
  return maxVal;
};

const getOverview = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const activeStartups = await Startup.countDocuments();

  const pendingUserVerifications = await User.countDocuments({
    account_status: { $in: ["pending_verification", "pending_approval"] },
  });
  const pendingStageSubmissions = await StageSubmission.countDocuments({
    status: "pending_review",
  });
  const pendingVerifications =
    pendingUserVerifications + pendingStageSubmissions;

  const investorProfiles = await InvestorProfile.find(
    {
      $or: [
        { investment_range: { $exists: true, $ne: "" } },
        { funding_range: { $exists: true, $ne: "" } },
      ],
    },
    "investment_range funding_range",
  ).lean();

  let totalCapitalNum = 0;
  investorProfiles.forEach((ip) => {
    const capital = parseCapitalString(ip.investment_range || ip.funding_range);
    totalCapitalNum += capital;
  });

  const formattedCapital =
    totalCapitalNum >= 1_000_000_000
      ? `$${(totalCapitalNum / 1_000_000_000).toFixed(1)}B`
      : totalCapitalNum >= 1_000_000
        ? `$${(totalCapitalNum / 1_000_000).toFixed(1)}M`
        : totalCapitalNum >= 1_000
          ? `$${(totalCapitalNum / 1_000).toFixed(1)}K`
          : totalCapitalNum > 0
            ? `$${totalCapitalNum}`
            : "$0";

  const userRolesCount = await User.aggregate([
    { $group: { _id: "$role", count: { $sum: 1 } } },
  ]);

  const roleMapping = {
    student: "Students",
    mentor: "Mentors",
    investor: "Investors",
    incubator: "Incubators",
    company: "Companies",
  };

  const userDistribution = userRolesCount
    .filter((r) => roleMapping[r._id])
    .map((r) => ({
      label: roleMapping[r._id],
      pct: totalUsers > 0 ? Math.round((r.count / totalUsers) * 100) : 0,
      count: r.count,
    }));

  const startupStagesCount = await Startup.aggregate([
    {
      $group: {
        _id: "$current_stage",
        count: { $sum: 1 },
      },
    },
  ]);

  const stageOrder = [
    { key: 1, label: "Idea" },
    { key: 2, label: "Validation" },
    { key: 3, label: "MVP" },
    { key: 4, label: "Traction" },
    { key: 5, label: "Launch" },
  ];

  const funnelValues = stageOrder.map((stage) => {
    const found = startupStagesCount.find((s) => s._id === stage.key);
    return {
      label: stage.label,
      value: found ? found.count : 0,
    };
  });

  const funnelViews = {
    Daily: funnelValues,
    Monthly: funnelValues,
  };

  const upcomingMeetings = await Meeting.find({
    status: "scheduled",
    scheduledAt: { $gte: new Date() },
  })
    .populate("startup_id", "startup_name")
    .populate("reviewer_id", "full_name")
    .sort({ scheduledAt: 1 })
    .limit(2);

  const formattedMeetings = upcomingMeetings.map((m) => ({
    title: `${m.title || "Review Meeting"} — ${m.startup_id?.startup_name || "Startup"}`,
    time: m.scheduledAt,
  }));

  const criticalActions = [];
  if (pendingUserVerifications > 0) {
    criticalActions.push({
      id: "ca1",
      iconType: "AlertTriangle",
      tone: "error",
      title: "Identity Verification Needed",
      detail: `${pendingUserVerifications} user(s) awaiting approval`,
      reviewHref: "/admin/verification",
    });
  }
  if (pendingStageSubmissions > 0) {
    criticalActions.push({
      id: "ca2",
      iconType: "FileText",
      tone: "warning",
      title: "Stage Submissions Pending",
      detail: `${pendingStageSubmissions} startup stage review(s) in queue`,
      reviewHref: "/admin/reviews",
    });
  }

  const recentUsers = await User.find()
    .sort({ created_at: -1 })
    .limit(4)
    .select("full_name created_at");

  const activityStream = recentUsers.map((u) => ({
    iconType: "UserPlus",
    text: `New registration: ${u.full_name || "User"}`,
    time: u.created_at
      ? new Date(u.created_at).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "Recently",
  }));

  return res.status(200).json({
    success: true,
    data: {
      totalUsers,
      activeStartups,
      pendingVerifications,
      investorCapital: formattedCapital,
      userDistribution,
      funnelViews,
      upcomingCycle: formattedMeetings,
      criticalActions,
      activityStream,
    },
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

    if (!startup) {
      return res
        .status(404)
        .json({ success: false, message: "Startup not found" });
    }

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

  // Fetch upcoming scheduled meetings sorted by scheduledAt
  const upcomingMeetings = await Meeting.find({ status: "scheduled" })
    .populate("startup_id", "startup_name name")
    .populate("reviewer_id", "full_name")
    .sort({ scheduledAt: 1 }) // FIXED: meeting_date -> scheduledAt
    .limit(5);

  return res.status(200).json({
    success: true,
    data: {
      startup: {
        id: startup._id,
        name: startup.startup_name || startup.name || "Startup Idea",
        founder: startup.student_id?.full_name || "N/A",
        email: startup.student_id?.email || "N/A",
        stage: startup.stage || startup.current_stage || "ideation",
      },
      reviewers: reviewers.map((r) => ({
        id: r._id,
        name: r.full_name,
        role: r.role,
      })),
      upcomingMeetings: upcomingMeetings.map((m) => {
        // Safe handling for scheduledAt vs fallback meeting_date
        const rawDate = m.scheduledAt || m.meeting_date;
        const dateObj = rawDate ? new Date(rawDate) : null;
        const isValid = dateObj && !isNaN(dateObj.getTime());

        return {
          id: m._id,
          startup:
            m.startup_id?.startup_name || m.startup_id?.name || "Unknown",
          reviewer: m.reviewer_id?.full_name || "Assigned Reviewer",
          time: isValid
            ? dateObj.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "TBD",
          date: isValid ? dateObj.toISOString().split("T")[0] : "TBD",
        };
      }),
    },
  });
});

/**
 * @desc    Schedule a new review meeting
 * @route   POST /api/admin/meetings/schedule
 * @access  Private (Admin only)
 */

// Stage Mapping Helper
const stageEnumMap = {
  1: "ideation",
  2: "validation",
  3: "mvp",
  4: "incubation",
  5: "traction",
  6: "launch",
};

const scheduleMeeting = asyncHandler(async (req, res) => {
  const {
    startup_id,
    reviewer_id,
    meeting_date,
    meeting_time,
    duration,
    title,
    description,
    stage,
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

  const startup = await Startup.findById(startup_id)
    .populate("student_id", "full_name email")
    .lean();

  if (!startup) {
    return res.status(404).json({
      success: false,
      message: "Startup not found",
    });
  }

  const studentName = startup.student_id?.full_name || "Student";
  const studentEmail = startup.student_id?.email;
  const startupName = startup.startup_name || startup.name || "Startup Idea";

  const activeReviewerId = reviewer_id || req.user.id || req.user._id;
  const reviewer = await User.findById(activeReviewerId).lean();
  const reviewerName =
    reviewer?.full_name || req.user?.full_name || "Assigned Mentor";

  // Combine date and time strings into a single Date object for scheduledAt
  const combinedDateTime = new Date(`${meeting_date}T${meeting_time}:00`);

  // Parse numerical duration if passed as string (e.g. "60 minutes" -> 60)
  const durationNum =
    typeof duration === "number" ? duration : parseInt(duration) || 30;

  // Resolve raw stage (could be string "ideation", or number 1, or string "1")
  const rawStage =
    stage || startup.current_stage || startup.stage || "ideation";

  // Convert number/numeric string to proper enum string, or keep as is
  const resolvedStage =
    stageEnumMap[rawStage] ||
    (typeof rawStage === "string" ? rawStage.toLowerCase() : "ideation");

  // Save meeting with valid string enum
  const meeting = new Meeting({
    startup_id,
    reviewer_id: activeReviewerId,
    stage: resolvedStage, // <--- Guaranteed to match schema enum
    title: title || `Stage Review: ${startupName}`,
    description: description || "",
    scheduledAt: combinedDateTime,
    duration: durationNum,
    status: "scheduled",
  });

  await meeting.save();

  const meetingPayload = {
    startupName,
    studentName,
    reviewerName,
    meetingDate: meeting_date,
    meetingTime: meeting_time,
    duration: meeting.duration,
    description: meeting.description,
  };

  try {
    const BCOC_ADMIN_EMAIL = "sneha@atiortechnologies.com";
    if (typeof sendAdminMeetingReminder === "function") {
      sendAdminMeetingReminder(BCOC_ADMIN_EMAIL, meetingPayload);

      if (studentEmail) {
        sendAdminMeetingReminder(studentEmail, meetingPayload);
      }
    }
  } catch (emailError) {
    console.error("Failed to send meeting emails:", emailError);
  }

  return res.status(201).json({
    success: true,
    message: "Meeting scheduled successfully and email notifications sent.",
    data: meeting,
  });
});

const getMeeting = asyncHandler(async (req, res) => {
  const meetings = await Meeting.find({})
    .populate({
      path: "startup_id",
      select: "startup_name startup_id",
      populate: {
        path: "student_id",
        select: "full_name email",
      },
    })
    .populate("reviewer_id", "full_name email")
    .sort({ scheduledAt: -1 });

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const counts = {
    today: meetings.filter((m) => {
      const date = new Date(m.schedualedAt);
      return date >= todayStart && date <= todayEnd;
    }).length,
    upcoming: meetings.filter((m) => m.status === "scheduled").length,
    completed: meetings.filter((m) => m.status === "completed").length,
    rescheduled: meetings.filter((m) => m.status === "rescheduled").length,
  };

  return res.status(200).json({
    success: true,
    counts,
    meetings,
  });
});

const getMeetingById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const meeting = await Meeting.findById(id)
    .populate({
      path: "startup_id",
      select: "startup_name chapter institution student_id",
      populate: {
        path: "student_id",
        select: "full_name email",
      },
    })
    .populate("reviewer_id", "full_name email");

  if (!meeting) {
    return res
      .status(404)
      .json({ success: false, message: "Meeting not found" });
  }

  // Fetch stage submission associated with the startup
  const submission = await StageSubmission.findOne({
    startup_id: meeting.startup_id?._id,
  });

  return res.status(200).json({
    success: true,
    data: {
      ...meeting.toObject(),
      submission: submission || null,
      attendees: [
        {
          name: meeting.startup_id?.student_id?.full_name || "Founder",
          email: meeting.startup_id?.student_id?.email,
        },
        meeting.reviewer_id
          ? {
              name: meeting.reviewer_id.full_name,
              email: meeting.reviewer_id.email,
            }
          : null,
      ].filter(Boolean),
    },
  });
});

const cancelMeeting = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason = "Cancelled by admin" } = req.body;

  // 1. Find meeting by ID
  const meeting = await Meeting.findById(id);

  if (!meeting) {
    return res.status(404).json({
      success: false,
      message: "Meeting not found",
    });
  }

  // 2. Prevent re-cancelling already completed/cancelled meetings
  if (meeting.status === "cancelled") {
    return res.status(400).json({
      success: false,
      message: "This meeting is already cancelled",
    });
  }

  // 3. Update meeting status
  meeting.status = "cancelled";

  // Optionally log cancellation in reschedule history if provided
  if (reason) {
    meeting.rescheduleHistory.push({
      requestedBy: req.user?._id || req.user?.id,
      reason: `Cancellation Reason: ${reason}`,
      status: "rejected",
    });
  }

  await meeting.save();

  return res.status(200).json({
    success: true,
    message: "Meeting cancelled successfully",
    data: meeting,
  });
});

const rescheduleMeeting = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { reason, meeting_date, meeting_time, duration, description } =
    req.body;

  if (!meeting_date || !meeting_time) {
    return res.status(400).json({
      success: false,
      message: "Startup, meeting date, and meeting time are required",
    });
  }

  const meeting = await Meeting.findById(id);

  if (!meeting) {
    return res.status(404).json({
      success: false,
      message: "Meeting not found.",
    });
  }

  const previousDate = meeting.scheduledAt;

  meeting.rescheduleHistory.push({
    requestedBy: req.user?._id || req.user?.id,
    previousDate: previousDate,
    newDate: new Date(meeting_date),
    reason: reason.trim(),
    status: "accepted",
  });

  meeting.scheduledAt = new Date(meeting_date);
  meeting.status = "rescheduled";
  meeting.duration = duration;
  meeting.description = description;

  await meeting.save();

  return res.status(200).json({
    success: true,
    message: "Meeting rescheduled successfully.",
    data: meeting,
  });
});

const postMeetingOutcome = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    summary,
    strengths,
    improvements,
    actionItems,
    decision = "pending", // "approved" | "request_changes" | "reject" | "pending"
    feedbackForFounder,
    internalNotes,
  } = req.body;

  if (!feedbackForFounder || !feedbackForFounder.trim()) {
    return res.status(400).json({
      success: false,
      message: "Feedback for the founder is required.",
    });
  }

  // 1. Fetch Meeting document
  const meeting = await Meeting.findById(id).populate("startup_id");
  if (!meeting) {
    return res.status(404).json({
      success: false,
      message: "Meeting not found.",
    });
  }

  const startup = meeting.startup_id;
  const isApproved = decision === "approved";
  const isPending = decision === "pending";

  // 2. Upsert Meeting Feedback
  const feedback = await MeetingFeedback.findOneAndUpdate(
    { meeting_id: meeting._id },
    {
      meeting_id: meeting._id,
      reviewer_id: req.user?._id || req.user?.id || meeting.reviewer_id,
      student_id: startup?.student_id,
      startup_id: startup?._id,
      summary: summary || "",
      strengths: strengths || "",
      improvements: improvements || "",
      action_items: actionItems || "",
      decision: decision,
      reviewer_comments: feedbackForFounder.trim(),
      internal_notes: internalNotes || "",
      validation_approved: isApproved,
    },
    { new: true, upsert: true },
  );

  // 3. Sync StageSubmission status
  const submissionId = meeting.submission_id || meeting.submission;
  let submissionQuery = null;

  if (submissionId) {
    submissionQuery = { _id: submissionId };
  } else if (startup?._id) {
    submissionQuery = { startup_id: startup._id };
  }

  if (submissionQuery) {
    let targetStatus = "pending_review";
    if (decision === "approved") targetStatus = "approved";
    else if (decision === "reject") targetStatus = "rejected";
    else if (decision === "request_changes") targetStatus = "request_changes";
    else if (decision === "pending") targetStatus = "pending_review";

    // Format the request_changes message dynamically based on decision
    let changeNote = "";
    if (decision === "request_changes") {
      changeNote = feedbackForFounder.trim();
    } else if (decision === "reject") {
      changeNote = "Idea rejected. You can submit a new idea.";
    }

    await StageSubmission.findOneAndUpdate(
      submissionQuery,
      {
        status: targetStatus,
        request_changes: changeNote,
      },
      { sort: { updated_at: -1 } },
    );
  }

  // 4. Mark meeting as completed (only when a final decision is issued)
  if (!isPending) {
    meeting.status = "completed";
    await meeting.save();
  }

  // 5. Advance Startup Stage if approved
  if (isApproved && startup) {
    const STAGE_ORDER = [
      "ideation",
      "validation",
      "mvp",
      "incubation",
      "traction",
      "launch",
    ];
    const currentIdx = STAGE_ORDER.indexOf(meeting.stage);
    if (currentIdx >= 0 && currentIdx < STAGE_ORDER.length - 1) {
      startup.stage = STAGE_ORDER[currentIdx + 1];
      startup.current_stage = currentIdx + 2;
      await startup.save();
    }
  }

  return res.status(200).json({
    success: true,
    message: "Meeting outcome recorded successfully.",
    data: feedback,
  });
});

// ---- Chapters ----

const getChapters = asyncHandler(async (req, res) => {
  const chapters = await Chapter.find({})
    .sort({ created_at: -1 })
    .populate("lead_id", "full_name email")
    .lean();

  res.status(200).json({
    success: true,
    data: chapters,
  });
});

const getChapterDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // 1. Fetch Chapter and populate lead details if present
  const chapter = await Chapter.findById(id)
    .populate("lead_id", "full_name email")
    .lean();

  if (!chapter) {
    res.status(404);
    throw new Error("Chapter not found");
  }

  // 2. Fetch all students registered under this chapter
  const students = await StudentProfile.find({ chapter_id: id })
    .populate("user_id", "full_name email status")
    .sort({ created_at: -1 })
    .lean();

  // 3. Format students payload for the frontend DataTable
  const formattedStudents = students.map((s) => ({
    id: s._id,
    name: s.user_id?.full_name || "Unknown Student",
    email: s.user_id?.email || "",
    degree: s.degree || "—",
    graduation_year: s.graduation_year || "—",
    profile_photo: s.profile_photo || "",
    status:
      s.user_id?.status ||
      (s.profile_status === "completed" ? "Active" : "Pending"),
  }));

  // 4. Fetch all startups under this chapter with founder details populated
  const rawStartups = await Startup.find({ chapter_id: id })
    .populate("student_id", "full_name email")
    .sort({ created_at: -1 })
    .lean();

  // 5. Format startups payload for frontend DataTable
  const formattedStartups = rawStartups.map((st) => ({
    id: st._id,
    startup_name: st.startup_name || "Untitled Startup",
    founder_name: st.student_id?.full_name || "N/A",
    founder_email: st.student_id?.email || "—",
    stage:
      st.stage || (st.current_stage ? `Stage ${st.current_stage}` : "Ideation"),
    progress_percentage: st.progress_percentage || 0,
    industry: st.industry || st.category || "General",
  }));

  res.status(200).json({
    success: true,
    data: {
      chapter: {
        id: chapter._id,
        name: chapter.chapter_name || chapter.college_name,
        institution: chapter.college_name,
        status: chapter.status || "Active",
        lead_name:
          chapter.lead_id?.full_name || chapter.lead_name || "Unassigned",
        lead_email: chapter.lead_id?.email || chapter.lead_email || "—",
        description: chapter.description || "",
        mission: chapter.mission || "",
        created_at: chapter.created_at,
        stats: {
          total_members: chapter.total_members || formattedStudents.length,
          active_startups:
            formattedStartups.length || chapter.active_startups || 0,
          mentors_count: chapter.mentors_count || 0,
          events_conducted: chapter.events_conducted || 0,
        },
      },
      students: formattedStudents,
      startups: formattedStartups,
    },
  });
});

const createChapter = asyncHandler(async (req, res) => {
  const {
    name,
    institution,
    type,
    country,
    state,
    city,
    address,
    lead_name,
    lead_email,
    lead_phone,
    status,
    description,
  } = req.body;

  if (!name || !institution) {
    res.status(400);
    throw new Error("Chapter Name and Institution Name are required.");
  }

  // Create new Chapter in MongoDB using all form fields
  const chapter = await Chapter.create({
    chapter_name: name.trim(),
    college_name: institution.trim(),
    chapter_type: type || "University",
    country: country ? country.trim() : "",
    state: state ? state.trim() : "",
    city: city ? city.trim() : "",
    address: address ? address.trim() : "",
    lead_name: lead_name ? lead_name.trim() : "",
    lead_email: lead_email ? lead_email.trim() : "",
    lead_phone: lead_phone ? lead_phone.trim() : "",
    status: status || "Pending",
    description: description ? description.trim() : "",
  });

  res.status(201).json({
    success: true,
    message: "Chapter created successfully",
    data: chapter,
  });
});

const STAGE_LABELS = [
  "Ideation",
  "Validation",
  "MVP",
  "Traction",
  "Launch & Pitch",
];

const getStartupDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // 1. Populate using the actual database field names: student_id and chapter_id
  const startup = await Startup.findById(id)
    .populate("student_id", "name email") // Populates founder details from User/Student model
    .populate("chapter_id", "name"); // Populates chapter details

  if (!startup) {
    return res.status(404).json({
      success: false,
      message: "Startup not found",
    });
  }

  // 2. Fetch all stage submissions for this startup
  const submissions = await StageSubmission.find({ startupId: id }).sort({
    createdAt: -1,
  });

  // 3. Map submissions to the 5 BOCC stages
  const journeyStages = STAGE_LABELS.map((label, index) => {
    const stageNumber = index + 1;

    const stageSubmission = submissions.find(
      (sub) =>
        sub.stageNumber === stageNumber ||
        sub.stageName?.toLowerCase() === label.toLowerCase(),
    );

    let status = "locked";
    let submissionId = null;

    if (stageSubmission) {
      status = stageSubmission.status;
      submissionId = stageSubmission._id;
    } else if (index === 0) {
      status = "active";
    }

    return {
      stageNumber,
      label,
      status,
      submissionId,
    };
  });

  // 4. Map DB snake_case fields to the camelCase properties expected by the frontend
  const responsePayload = {
    startup: {
      _id: startup._id,
      name: startup.startup_name || "Untitled Startup",
      founder: startup.student_id?.name || startup.student_id?.email || "N/A",
      industry: startup.industry || "General",
      chapter: startup.chapter_id?.name || startup.chapter || "N/A",
      chapterId: startup.chapter_id?._id || startup.chapter_id || null,
      status: startup.stage || "Active",
      createdAt: startup.created_at || startup.createdAt,
      progressPercentage: startup.progress_percentage,
    },
    journeyStages,
  };

  return res.status(200).json({
    success: true,
    data: responsePayload,
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
  getMeeting,
  getMeetingById,
  cancelMeeting,
  rescheduleMeeting,
  postMeetingOutcome,
  getChapters,
  getChapterDetails,
  createChapter,
  getStartupDetails,
};
