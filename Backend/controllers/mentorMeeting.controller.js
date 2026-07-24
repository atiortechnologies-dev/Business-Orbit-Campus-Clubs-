/**
 * @file mentorMeeting.controller.js
 * @description Handles the scheduling, retrieval, and management of mentor-startup meetings.
 * @architecture Controller layer managing calendar and meeting workflows.
 */

const asyncHandler = require("../middlewares/asyncHandler");
const MentorMeeting = require("../models/MentorMeeting");
const MeetingNotes = require("../models/MeetingNotes");
const MentorAssignment = require("../models/MentorAssignment");
const Notification = require("../models/Notification");
const ActivityLog = require("../models/ActivityLog");
const {
  MEETING_STATUS,
  ASSIGNMENT_STATUS,
} = require("../constants/statusConstants");

/**
 * @desc    Schedule a new meeting with a startup
 * @route   POST /api/mentor/meetings
 * @access  Private (Mentor)
 */
exports.scheduleMeeting = asyncHandler(async (req, res) => {
  const mentorId = req.user._id;
  const { studentId, startupId, date, time, platform, meetingLink, agenda } =
    req.body;

  // Validate required fields
  if (!studentId || !startupId || !date || !time || !platform || !meetingLink) {
    return res
      .status(400)
      .json({ message: "All meeting details are required." });
  }

  // Verify mentor has active assignment to this startup
  const assignment = await MentorAssignment.findOne({
    mentor_id: mentorId,
    startup_id: startupId,
    status: ASSIGNMENT_STATUS.ACTIVE,
  });

  if (!assignment) {
    return res.status(403).json({
      message: "Unauthorized: You are not actively assigned to this startup.",
    });
  }

  // Create the meeting
  const meeting = await MentorMeeting.create({
    mentor_id: mentorId,
    student_id: studentId,
    startup_id: startupId,
    date,
    time,
    platform,
    meeting_link: meetingLink,
    agenda,
    status: MEETING_STATUS.SCHEDULED,
  });

  // Send notification to student
  await Notification.create({
    recipient_id: studentId,
    title: "New Mentor Meeting Scheduled",
    message: `A new mentoring session is scheduled for ${date} at ${time}. Platform: ${platform}`,
    type: "info",
  });

  res.status(201).json({
    message: "Meeting scheduled successfully",
    meeting,
  });
});

/**
 * @desc    Get all meetings for the mentor (with optional filters)
 * @route   GET /api/mentor/meetings
 * @access  Private (Mentor)
 */
exports.getMeetings = asyncHandler(async (req, res) => {
  const mentorId = req.user._id;
  const { status, timeframe } = req.query;
  const now = new Date();

  const query = { mentor_id: mentorId };

  // Filter by status (scheduled, completed, cancelled)
  if (status) {
    query.status = status;
  }

  // Filter by timeframe
  if (timeframe === "upcoming") {
    query.status = MEETING_STATUS.SCHEDULED;
    query.date = { $gte: now };
  } else if (timeframe === "past") {
    query.$or = [
      { status: MEETING_STATUS.COMPLETED },
      { status: MEETING_STATUS.SCHEDULED, date: { $lt: now } },
    ];
  } else if (timeframe === "today") {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);
    query.date = { $gte: startOfToday, $lte: endOfToday };
  }

  const meetings = await MentorMeeting.find(query)
    .sort({ date: 1, time: 1 })
    .populate("student_id", "full_name email")
    .populate("startup_id", "startup_name current_stage")
    .lean();

  const formattedMeetings = meetings.map((m) => ({
    meetingId: m._id,
    studentName: m.student_id?.full_name,
    startupName: m.startup_id?.startup_name,
    startupStage: m.startup_id?.current_stage,
    date: m.date,
    time: m.time,
    platform: m.platform,
    meetingLink: m.meeting_link,
    agenda: m.agenda,
    status: m.status,
  }));

  res.status(200).json(formattedMeetings);
});

/**
 * @desc    Get a specific meeting by ID
 * @route   GET /api/mentor/meetings/:id
 * @access  Private (Mentor)
 */
exports.getMeetingById = asyncHandler(async (req, res) => {
  const meeting = await MentorMeeting.findOne({
    _id: req.params.id,
    mentor_id: req.user._id,
  })
    .populate("student_id", "full_name email")
    .populate("startup_id", "startup_name current_stage")
    .lean();

  if (!meeting) {
    return res.status(404).json({ message: "Meeting not found" });
  }

  // Fetch notes if available
  const notes = await MeetingNotes.findOne({ meeting_id: meeting._id }).lean();

  res.status(200).json({ ...meeting, notes: notes || null });
});

/**
 * @desc    Add notes to a meeting
 * @route   POST /api/mentor/meetings/:id/notes
 * @access  Private (Mentor)
 */
exports.addMeetingNotes = asyncHandler(async (req, res) => {
  const meeting = await MentorMeeting.findOne({
    _id: req.params.id,
    mentor_id: req.user._id,
  });

  if (!meeting) {
    return res.status(404).json({ message: "Meeting not found" });
  }

  if (meeting.status === MEETING_STATUS.COMPLETED) {
    return res
      .status(400)
      .json({ message: "Cannot add notes to a completed meeting. Read-only." });
  }

  const { mentor_notes, recommendations, outcome } = req.body;

  if (!mentor_notes) {
    return res.status(400).json({ message: "Mentor notes are required." });
  }

  let notes = await MeetingNotes.findOne({ meeting_id: meeting._id });
  if (notes) {
    notes.mentor_notes = mentor_notes;
    notes.recommendations = recommendations;
    notes.outcome = outcome;
    await notes.save();
  } else {
    notes = await MeetingNotes.create({
      meeting_id: meeting._id,
      mentor_notes,
      recommendations,
      outcome,
    });
  }

  res.status(200).json({
    message: "Meeting notes updated successfully",
    notes,
  });
});

/**
 * @desc    Complete a meeting
 * @route   PUT /api/mentor/meetings/:id/complete
 * @access  Private (Mentor)
 */
exports.completeMeeting = asyncHandler(async (req, res) => {
  const meeting = await MentorMeeting.findOne({
    _id: req.params.id,
    mentor_id: req.user._id,
  });

  if (!meeting) {
    return res.status(404).json({ message: "Meeting not found" });
  }

  if (meeting.status === MEETING_STATUS.COMPLETED) {
    return res.status(400).json({ message: "Meeting is already completed" });
  }

  const notes = await MeetingNotes.findOne({ meeting_id: meeting._id });
  if (!notes || !notes.mentor_notes) {
    return res.status(400).json({
      message: "Cannot complete meeting without saving notes first.",
    });
  }

  meeting.status = MEETING_STATUS.COMPLETED;
  await meeting.save();

  await ActivityLog.create({
    user_id: req.user._id,
    action: "Completed a mentoring session",
    entity_type: "MentorMeeting",
    entity_id: meeting._id,
    description: `Session completed for startup ${meeting.startup_id}`,
  });

  res.status(200).json({
    message: "Meeting marked as completed",
    meeting,
  });
});
