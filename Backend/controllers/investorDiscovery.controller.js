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
  const watchlistCount = await InvestorWatchlist.countDocuments({ investor_id: investorId });
  const reviewedCount = await PitchView.countDocuments({ investor_id: investorId });
  const activeConversations = await InvestorChatRoom.countDocuments({ investor_id: investorId });

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

  const query = { status: "active" };

  const pitches = await StartupPitch.find(query)
    .populate({
      path: "startup_id",
      select: "startup_name category",
      match: search ? { startup_name: { $regex: search, $options: "i" } } : {},
    })
    .sort({ submitted_at: -1 })
    .skip(skip)
    .limit(limit);

  // Filter out null startup_ids (caused by $regex match failing)
  const filteredPitches = search ? pitches.filter((p) => p.startup_id !== null) : pitches;
  const total = await StartupPitch.countDocuments(query);

  res.status(200).json({ 
    success: true, 
    data: filteredPitches,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
    }
  });
});

/**
 * @desc    Get a specific pitch (Viewer)
 * @route   GET /api/investor/pitches/:id
 */
exports.getPitchDetails = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const pitch = await StartupPitch.findById(id).populate("startup_id").populate("founder_id", "first_name last_name");
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
  const { industry, funding_stage, chapter, technology } = req.body;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;

  const query = { status: "active" };
  if (industry) query.industry = industry;
  if (funding_stage) query.funding_stage = funding_stage;
  
  // Chapter & Technology filtering requires deeper lookup, for simplicity matching technology against industry or custom startup fields if populated
  if (technology) query.industry = { $regex: technology, $options: "i" }; // Assuming technology is part of industry for now

  // Populate startup to filter by chapter if necessary (requires cross-collection filtering or in-memory map)
  let pitches = await StartupPitch.find(query)
    .populate("startup_id", "startup_name category student_id")
    .sort({ submitted_at: -1 })
    .skip(skip)
    .limit(limit);

  const total = await StartupPitch.countDocuments(query);

  res.status(200).json({ 
    success: true, 
    data: pitches,
    pagination: {
      total,
      page,
      pages: Math.ceil(total / limit),
    }
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
    return res.status(400).json({ message: "Startup is already in your watchlist" });
  }

  const item = await InvestorWatchlist.create({
    investor_id: req.user._id,
    startup_id,
  });

  if (Notification) {
    await Notification.create({
      recipient_id: startup.student_id,
      title: "Startup Watchlisted",
      message: "An investor has added your startup to their watchlist.",
      type: "watchlist",
      related_id: item._id,
    });
  }

  res.status(201).json({ success: true, data: item });
});

/**
 * @desc    Remove from watchlist
 * @route   DELETE /api/investor/watchlist/:id
 */
exports.removeFromWatchlist = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const item = await InvestorWatchlist.findOneAndDelete({
    _id: id,
    investor_id: req.user._id,
  });

  if (!item) return res.status(404).json({ message: "Watchlist item not found" });

  res.status(200).json({ success: true, message: "Removed from watchlist" });
});

/**
 * @desc    Add a private note
 * @route   POST /api/investor/notes
 */
exports.addNote = asyncHandler(async (req, res) => {
  const { startup_id, note } = req.body;

  if (!startup_id) return res.status(400).json({ message: "Startup ID is required" });
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
    return res.status(400).json({ message: "Meeting date must be in the future" });
  }

  const meeting = await Meeting.create({
    startup_id,
    reviewer_id: req.user._id, // Investor acting as reviewer
    meeting_date,
    meeting_link,
    status: "scheduled",
  });

  if (Notification) {
    await Notification.create({
      recipient_id: startup.student_id, // Founder
      title: "Investor Meeting Requested",
      message: "An investor has requested a meeting regarding your startup.",
      type: "meeting",
      related_id: meeting._id,
    });
  }

  res.status(201).json({ success: true, data: meeting });
});

/**
 * @desc    Start conversation
 * @route   POST /api/investor/conversations
 */
exports.startConversation = asyncHandler(async (req, res) => {
  const { founder_id, message } = req.body;
  const investorId = req.user._id;

  if (!founder_id || !message) {
    return res.status(400).json({ message: "Founder ID and message are required" });
  }

  // Find existing chat room or create one
  let chatRoom = await InvestorChatRoom.findOne({
    investor_id: investorId, founder_id: founder_id,
  });

  if (!chatRoom) {
    chatRoom = await InvestorChatRoom.create({
      investor_id: investorId,
      founder_id: founder_id,
    });
  }

  // Create the actual message
  const newMessage = await InvestorMessage.create({
    chat_id: chatRoom._id,
    sender_id: investorId,
    message: message,
  });

  if (Notification) {
    await Notification.create({
      recipient_id: founder_id,
      title: "New Message from Investor",
      message: "You have received a new message from an investor regarding your pitch.",
      type: "message",
      related_id: chatRoom._id,
    });
  }

  res.status(201).json({ success: true, data: { chatRoom, message: newMessage } });
});
