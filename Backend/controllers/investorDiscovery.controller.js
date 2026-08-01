/**
 * @file investorDiscovery.controller.js
 * @description Investor Startup Discovery logic
 */

const asyncHandler = require("../middlewares/asyncHandler");
const StartupPitch = require("../models/StartupPitch");
const InvestorWatchlist = require("../models/InvestorWatchlist");
const InvestorNote = require("../models/InvestorNote");
const PitchView = require("../models/PitchView");
const Startup = require("../models/Startup");
const Meeting = require("../models/Meeting"); // Reusing for startup meetings
const InvestorChatRoom = require("../models/InvestorChatRoom");
const InvestorMessage = require("../models/InvestorMessage");
const Notification = require("../models/Notification");
const ActivityLog = require("../models/ActivityLog");
const mongoose = require("mongoose");

/**
 * @desc    Get dashboard summary
 * @route   GET /api/investor/dashboard
 */
exports.getDashboard = asyncHandler(async (req, res) => {
  const investorId = req.user._id;

  const recentPitches = await StartupPitch.find({ status: "active" })
    .sort({ submitted_at: -1 })
    .limit(5)
    .populate("startup_id", "startup_name category");

  const watchlist = await InvestorWatchlist.find({ investor_id: investorId })
    .sort({ added_at: -1 })
    .limit(5)
    .populate("startup_id", "startup_name category");

  res.status(200).json({
    success: true,
    data: {
      recentPitches,
      watchlist,
    },
  });
});

/**
 * @desc    Get dashboard stats
 * @route   GET /api/investor/dashboard/stats
 */
exports.getStats = asyncHandler(async (req, res) => {
  const investorId = req.user._id;

  const totalPitches = await StartupPitch.countDocuments({ status: "active" });
  const watchlistCount = await InvestorWatchlist.countDocuments({
    investor_id: investorId,
  });
  const reviewedCount = await PitchView.countDocuments({
    investor_id: investorId,
  });
  const activeConversations = await InvestorChatRoom.countDocuments({
    investor_id: investorId,
  });

  res.status(200).json({
    success: true,
    data: {
      totalPitches,
      watchlistCount,
      reviewedCount,
      activeConversations,
    },
  });
});

/**
 * @desc    Get recommendations
 * @route   GET /api/investor/recommendations
 */
exports.getRecommendations = asyncHandler(async (req, res) => {
  // Simple logic: return latest 5 active pitches (Can be expanded with AI matching later)
  const recommendations = await StartupPitch.find({ status: "active" })
    .sort({ submitted_at: -1 })
    .limit(5)
    .populate("startup_id", "startup_name category");

  res.status(200).json({ success: true, data: recommendations });
});

/**
 * @desc    Get all pitches with pagination and search
 * @route   GET /api/investor/pitches
 */
exports.getPitches = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;
  const search = req.query.search;

  const pipeline = [
    { $match: { status: "active" } },
    {
      $lookup: {
        from: "startups",
        localField: "startup_id",
        foreignField: "_id",
        as: "startup_id",
      },
    },
    { $unwind: { path: "$startup_id", preserveNullAndEmptyArrays: false } },
  ];

  if (search) {
    pipeline.push({
      $match: {
        "startup_id.startup_name": { $regex: search, $options: "i" },
      },
    });
  }

  // Count total matches before pagination
  const countPipeline = [...pipeline, { $count: "total" }];
  const countResult = await StartupPitch.aggregate(countPipeline);
  const total = countResult.length > 0 ? countResult[0].total : 0;

  // Pagination and sorting
  pipeline.push({ $sort: { submitted_at: -1 } });
  pipeline.push({ $skip: skip });
  pipeline.push({ $limit: limit });

  // Format the startup_id to match original populated output
  pipeline.push({
    $project: {
      "startup_id.created_at": 0,
      "startup_id.updated_at": 0,
      "startup_id.student_id": 0,
      "startup_id.current_stage": 0,
      "startup_id.progress_percentage": 0,
      "startup_id.idea": 0,
      "startup_id.progress": 0,
      "startup_id.pitch_deck": 0,
      "startup_id.mvp_details": 0,
      "startup_id.financials": 0,
      "startup_id.cohort": 0,
    },
  });

  const pitches = await StartupPitch.aggregate(pipeline);

  res.status(200).json({
    success: true,
    data: pitches,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
    },
  });
});

/**
 * @desc    Get a specific pitch (Viewer)
 * @route   GET /api/investor/pitches/:id
 */
exports.getPitchDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const pitch = await StartupPitch.findById(id)
    .populate("startup_id")
    .populate("founder_id", "first_name last_name");
  if (!pitch || pitch.status === "hidden") {
    return res.status(404).json({ message: "Pitch not found" });
  }

  res.status(200).json({ success: true, data: pitch });
});

/**
 * @desc    Filter pitches
 * @route   POST /api/investor/pitches/filter
 */
exports.filterPitches = asyncHandler(async (req, res) => {
  const { industry, funding_stage, technology } = req.body;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const matchStage = { status: "active" };
  if (industry) matchStage.industry = industry;
  if (funding_stage) matchStage.funding_stage = funding_stage;
  if (technology) matchStage.industry = { $regex: technology, $options: "i" };

  const pipeline = [
    { $match: matchStage },
    {
      $lookup: {
        from: "startups",
        localField: "startup_id",
        foreignField: "_id",
        as: "startup_id",
      },
    },
    { $unwind: { path: "$startup_id", preserveNullAndEmptyArrays: false } },
  ];

  // Count total matches before pagination
  const countPipeline = [...pipeline, { $count: "total" }];
  const countResult = await StartupPitch.aggregate(countPipeline);
  const total = countResult.length > 0 ? countResult[0].total : 0;

  pipeline.push({ $sort: { submitted_at: -1 } });
  pipeline.push({ $skip: skip });
  pipeline.push({ $limit: limit });

  pipeline.push({
    $project: {
      "startup_id.created_at": 0,
      "startup_id.updated_at": 0,
      "startup_id.current_stage": 0,
      "startup_id.progress_percentage": 0,
      "startup_id.idea": 0,
      "startup_id.progress": 0,
      "startup_id.pitch_deck": 0,
      "startup_id.mvp_details": 0,
      "startup_id.financials": 0,
      "startup_id.cohort": 0,
    },
  });

  const pitches = await StartupPitch.aggregate(pipeline);

  res.status(200).json({
    success: true,
    data: pitches,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
    },
  });
});

/**
 * @desc    Track pitch view
 * @route   POST /api/investor/pitch/view
 */
exports.trackPitchView = asyncHandler(async (req, res) => {
  const { pitch_id } = req.body;

  const pitch = await StartupPitch.findById(pitch_id);
  if (!pitch) return res.status(404).json({ message: "Pitch not found" });

  await PitchView.create({
    investor_id: req.user._id,
    pitch_id,
  });

  res.status(201).json({ success: true, message: "View tracked" });
});

/**
 * @desc    Add to watchlist
 * @route   POST /api/investor/watchlist
 */
exports.addToWatchlist = asyncHandler(async (req, res) => {
  const { startup_id } = req.body;

  const startup = await Startup.findById(startup_id);
  if (!startup) return res.status(404).json({ message: "Startup not found" });

  const existing = await InvestorWatchlist.findOne({
    investor_id: req.user._id,
    startup_id,
  });

  if (existing) {
    return res
      .status(400)
      .json({ message: "Startup is already in your watchlist" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [item] = await InvestorWatchlist.create(
      [
        {
          investor_id: req.user._id,
          startup_id,
        },
      ],
      { session },
    );

    if (Notification) {
      await Notification.create(
        [
          {
            recipient_id: startup.student_id,
            title: "Startup Watchlisted",
            message: "An investor has added your startup to their watchlist.",
            type: "watchlist",
            related_id: item._id,
          },
        ],
        { session },
      );
    }

    await session.commitTransaction();
    res.status(201).json({ success: true, data: item });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

/**
 * @desc    Remove from watchlist
 * @route   DELETE /api/investor/watchlist/:startupId
 */
exports.removeFromWatchlist = asyncHandler(async (req, res) => {
  const { startupId } = req.params;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const item = await InvestorWatchlist.findOneAndDelete({
      startup_id: startupId,
      investor_id: req.user._id,
    }).session(session);

    if (!item) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: "Watchlist item not found" });
    }

    if (Notification) {
      await Notification.deleteMany(
        { related_id: item._id, type: "watchlist" },
        { session },
      );
    }

    await session.commitTransaction();
    res.status(200).json({ success: true, message: "Removed from watchlist" });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

/**
 * @desc    Add a private note
 * @route   POST /api/investor/notes
 */
exports.addNote = asyncHandler(async (req, res) => {
  const { startup_id, note } = req.body;

  if (!startup_id)
    return res.status(400).json({ message: "Startup ID is required" });
  if (!note) return res.status(400).json({ message: "Note is required" });

  const newNote = await InvestorNote.create({
    investor_id: req.user._id,
    startup_id,
    note,
  });

  res.status(201).json({ success: true, data: newNote });
});

/**
 * @desc    Request a meeting
 * @route   POST /api/investor/request-meeting
 */
exports.requestMeeting = asyncHandler(async (req, res) => {
  const { startup_id, meeting_date, meeting_link } = req.body;

  const startup = await Startup.findById(startup_id);
  if (!startup) return res.status(404).json({ message: "Startup not found" });

  if (new Date(meeting_date) < new Date()) {
    return res
      .status(400)
      .json({ message: "Meeting date must be in the future" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [meeting] = await Meeting.create(
      [
        {
          startup_id,
          reviewer_id: req.user._id, // Investor acting as reviewer
          meeting_date,
          meeting_link,
          status: "scheduled",
        },
      ],
      { session },
    );

    if (Notification) {
      await Notification.create(
        [
          {
            recipient_id: startup.student_id, // Founder
            title: "Investor Meeting Requested",
            message:
              "An investor has requested a meeting regarding your startup.",
            type: "meeting",
            related_id: meeting._id,
          },
        ],
        { session },
      );
    }

    await session.commitTransaction();
    res.status(201).json({ success: true, data: meeting });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

/**
 * @desc    Start conversation
 * @route   POST /api/investor/conversations
 */
exports.startConversation = asyncHandler(async (req, res) => {
  const { founder_id, message, startup_id } = req.body;
  const investorId = req.user._id;

  if (!founder_id || !message || !startup_id) {
    return res
      .status(400)
      .json({ message: "Founder ID, startup ID and message are required" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Find existing chat room or create one
    let chatRoom = await InvestorChatRoom.findOne({
      investor_id: investorId,
      founder_id: founder_id,
      startup_id: startup_id,
    }).session(session);

    if (!chatRoom) {
      const [newRoom] = await InvestorChatRoom.create(
        [
          {
            investor_id: investorId,
            founder_id: founder_id,
            startup_id: startup_id,
          },
        ],
        { session },
      );
      chatRoom = newRoom;
    }

    // Create the actual message
    const [newMessage] = await InvestorMessage.create(
      [
        {
          chat_id: chatRoom._id,
          sender_id: investorId,
          receiver_id: founder_id,
          message: message,
        },
      ],
      { session },
    );

    if (Notification) {
      await Notification.create(
        [
          {
            recipient_id: founder_id,
            title: "New Message from Investor",
            message:
              "You have received a new message from an investor regarding your pitch.",
            type: "message",
            related_id: chatRoom._id,
          },
        ],
        { session },
      );
    }

    await session.commitTransaction();
    res
      .status(201)
      .json({ success: true, data: { chatRoom, message: newMessage } });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

/**
 * @desc    Get all visible startups
 * @route   GET /api/investor/startups
 */
exports.getStartups = asyncHandler(async (req, res) => {
  const startups = await Startup.find({ visibility: true })
    .populate("student_id", "full_name email")
    .sort({ created_at: -1 });
  res.status(200).json({ success: true, data: startups });
});

/**
 * @desc    Get a specific startup
 * @route   GET /api/investor/startups/:startupId
 */
exports.getStartupById = asyncHandler(async (req, res) => {
  const { startupId } = req.params;
  const startup = await Startup.findById(startupId).populate(
    "student_id",
    "full_name email",
  );
  if (!startup || !startup.visibility) {
    return res
      .status(404)
      .json({ success: false, message: "Startup not found or not visible" });
  }
  res.status(200).json({ success: true, data: startup });
});

/**
 * @desc    Search startups by keyword
 * @route   GET /api/investor/startups/search
 */
exports.searchStartups = asyncHandler(async (req, res) => {
  const { q } = req.query;
  const startups = await Startup.find({
    visibility: true,
    $text: { $search: q },
  }).populate("student_id", "full_name email");
  res.status(200).json({ success: true, data: startups });
});

/**
 * @desc    Filter startups
 * @route   POST /api/investor/startups/filter
 */
exports.filterStartups = asyncHandler(async (req, res) => {
  const { industry, stage, chapter, funding_status } = req.body;
  const query = { visibility: true };
  if (industry) query.industry = industry;
  if (stage) query.stage = stage;
  if (chapter) query.chapter = chapter;
  if (funding_status) query.funding_status = funding_status;

  const startups = await Startup.find(query).populate(
    "student_id",
    "full_name email",
  );
  res.status(200).json({ success: true, data: startups });
});

/**
 * @desc    Get startup profile
 * @route   GET /api/investor/startups/:startupId/profile
 */
exports.getStartupProfile = asyncHandler(async (req, res) => {
  // Can be expanded to include founder profile details, metrics, etc.
  exports.getStartupById(req, res);
});

/**
 * @desc    Get startup pitch deck
 * @route   GET /api/investor/startups/:startupId/pitch-deck
 */
exports.getStartupPitchDeck = asyncHandler(async (req, res) => {
  const { startupId } = req.params;
  const startup = await Startup.findById(startupId);
  if (!startup || !startup.visibility) {
    return res
      .status(404)
      .json({ success: false, message: "Startup not found" });
  }
  res
    .status(200)
    .json({ success: true, data: { pitch_deck: startup.pitch_deck } });
});

/**
 * @desc    Get entire watchlist
 * @route   GET /api/investor/watchlist
 */
exports.getWatchlist = asyncHandler(async (req, res) => {
  const watchlist = await InvestorWatchlist.find({ investor_id: req.user._id })
    .populate("startup_id")
    .sort({ added_at: -1 });
  res.status(200).json({ success: true, data: watchlist });
});

/**
 * @desc    Get watchlist statistics
 * @route   GET /api/investor/watchlist/statistics
 */
exports.getWatchlistStatistics = asyncHandler(async (req, res) => {
  const count = await InvestorWatchlist.countDocuments({
    investor_id: req.user._id,
  });
  // Could add more stats like industry breakdown here
  res.status(200).json({ success: true, data: { count } });
});

// ==========================================
// Notifications & Activity Logs
// ==========================================

/**
 * @desc    Get all notifications for investor
 * @route   GET /api/investor/notifications
 */
exports.getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ recipient_id: req.user._id })
    .sort({ created_at: -1 })
    .limit(50);
  res.status(200).json({ success: true, data: notifications });
});

/**
 * @desc    Mark a notification as read
 * @route   PUT /api/investor/notifications/:notificationId/read
 */
exports.markNotificationRead = asyncHandler(async (req, res) => {
  const { notificationId } = req.params;
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, recipient_id: req.user._id },
    { is_read: true },
    { new: true },
  );
  if (!notification) {
    return res
      .status(404)
      .json({ success: false, message: "Notification not found" });
  }
  res.status(200).json({ success: true, data: notification });
});

/**
 * @desc    Get activity logs for investor
 * @route   GET /api/investor/activity-logs
 */
exports.getActivityLogs = asyncHandler(async (req, res) => {
  const logs = await ActivityLog.find({ user_id: req.user._id })
    .sort({ created_at: -1 })
    .limit(50);
  res.status(200).json({ success: true, data: logs });
});
