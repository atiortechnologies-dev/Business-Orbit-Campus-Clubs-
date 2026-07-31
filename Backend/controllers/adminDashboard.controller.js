const asyncHandler = require("../middlewares/asyncHandler");
const Announcement = require("../models/Announcement");
const CompanyProfile = require("../models/CompanyProfile");
const IncubatorProfile = require("../models/IncubatorProfile");
const InvestorProfile = require("../models/InvestorProfile");
const MentorProfile = require("../models/MentorProfile");
const StudentProfile = require("../models/StudentProfile");
const User = require("../models/User");

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

module.exports = {
  getAnnouncements,
  createAnnouncement,
  getVerificationUsers,
  getUserVerificationDetail,
  handleVerificationDecision,
};
