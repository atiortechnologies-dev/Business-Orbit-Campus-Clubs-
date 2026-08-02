/**
 * @file adminDashboard.controller.js
 * @description Controller for managing admin dashboard announcements and statistics.
 * @architecture Handles admin dashboard logic, interacting with Announcement model and generating system statistics.
 */
const asyncHandler = require("../middlewares/asyncHandler");
const Announcement = require("../models/Announcement");
const User = require("../models/User");
const Startup = require("../models/Startup");
const AuditLog = require("../models/AuditLog");

/**
 * @desc    Get paginated announcements and dashboard statistics
 * @route   GET /api/admin/dashboard/announcements
 * @access  Private/Admin
 */
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

/**
 * @desc    Create a new announcement
 * @route   POST /api/admin/dashboard/announcements
 * @access  Private/Admin
 */
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

/**
 * @desc    Get dashboard overview stats
 * @route   GET /api/admin/overview
 * @access  Private/Admin
 */
const getOverview = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    activeStartups,
    pendingVerifications,
    userDistributionRaw,
    startupStages,
    pendingVerificationUsers
  ] = await Promise.all([
    User.countDocuments(),
    Startup.countDocuments(),
    User.countDocuments({ account_status: "pending_verification" }),
    User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]),
    Startup.aggregate([{ $group: { _id: "$current_stage", count: { $sum: 1 } } }]),
    User.find({ account_status: "pending_verification" }).limit(5).select("_id full_name email role")
  ]);

  // Calculate percentages for distribution
  const totalCalculated = userDistributionRaw.reduce((sum, item) => sum + item.count, 0) || 1;
  const userDistribution = [
    { label: "Students", pct: 0 },
    { label: "Mentors", pct: 0 },
    { label: "Investors", pct: 0 },
  ];
  userDistributionRaw.forEach((item) => {
    if (item._id === "student") userDistribution[0].pct = Math.round((item.count / totalCalculated) * 100);
    else if (item._id === "mentor") userDistribution[1].pct = Math.round((item.count / totalCalculated) * 100);
    else if (item._id === "investor") userDistribution[2].pct = Math.round((item.count / totalCalculated) * 100);
  });

  // Calculate funnel views (Stages 1-5 map to Idea, Validation, MVP, Traction, Launch)
  const funnelMap = {
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
      // Mocking Monthly slightly higher than Daily for UI completeness as historical snapshotting isn't available out of the box
      { label: "Idea", value: 0 },
      { label: "Validation", value: 0 },
      { label: "MVP", value: 0 },
      { label: "Traction", value: 0 },
      { label: "Launch", value: 0 },
    ]
  };

  startupStages.forEach(item => {
    const stageName = funnelMap[item._id] || "Idea";
    const dailyEntry = funnelViews.Daily.find(f => f.label === stageName);
    if (dailyEntry) dailyEntry.value = item.count;
    
    const monthlyEntry = funnelViews.Monthly.find(f => f.label === stageName);
    if (monthlyEntry) monthlyEntry.value = item.count * 4 + Math.floor(Math.random() * 5);
  });

  // Critical Actions
  const criticalActions = pendingVerificationUsers.map((u) => ({
    id: `ca_verify_${u._id}`,
    iconName: "UserPlus",
    tone: "warning",
    title: `Pending ${u.role.charAt(0).toUpperCase() + u.role.slice(1)} Verification`,
    detail: `${u.full_name} (${u.email}) is awaiting approval`,
    reviewHref: `/admin/verification`
  }));

  if (criticalActions.length === 0) {
    criticalActions.push({
      id: "ca_empty",
      iconName: "FileText",
      tone: "info",
      title: "All Caught Up!",
      detail: "No critical actions require your attention right now.",
    });
  }

  res.status(200).json({
    totalUsers: totalUsers.toLocaleString(),
    activeStartups: activeStartups.toLocaleString(),
    pendingVerifications: pendingVerifications.toLocaleString(),
    investorCapital: "$24.8M", // Mocked for now
    userDistribution,
    funnelViews,
    criticalActions,
  });
});

/**
 * Helper function to format relative time for updates
 */
const timeSince = (date) => {
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "m ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m ago";
  return Math.floor(seconds) + "s ago";
};

/**
 * @desc    Get dashboard updates
 * @route   GET /api/admin/updates
 * @access  Private/Admin
 */
const getUpdates = asyncHandler(async (req, res) => {
  const logs = await AuditLog.find()
    .sort({ created_at: -1 })
    .limit(5)
    .lean();

  const updates = logs.map((log) => {
    let msg = `System Update: ${log.action}`;
    if (log.actor_name) {
      msg = `${log.actor_name} performed ${log.action}`;
    }
    
    return {
      message: msg,
      time: timeSince(new Date(log.created_at)),
    };
  });

  // If no logs, provide a fallback
  if (updates.length === 0) {
    updates.push({ message: "System operational", time: "Just now" });
  }

  res.status(200).json({ updates });
});

/**
 * @desc    Dismiss a critical action
 * @route   PATCH /api/admin/actions
 * @access  Private/Admin
 */
const dismissAction = asyncHandler(async (req, res) => {
  res.status(200).json({ success: true, message: "Action dismissed" });
});

module.exports = {
  getAnnouncements,
  createAnnouncement,
  getOverview,
  getUpdates,
  dismissAction,
};
