/**
 * @file mentorMeeting.controller.js
 * @description Handles the scheduling, retrieval, and management of mentor-startup meetings.
 * @architecture Controller layer managing calendar and meeting workflows.
 */

const asyncHandler = require("../middlewares/asyncHandler");
const MentorMeeting = require("../models/MentorMeeting");
const MentorAssignment = require("../models/MentorAssignment");
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
  const { studentId, startupId, date, time, platform, meetingLink } = req.body;

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
    status: MEETING_STATUS.SCHEDULED,
  });

  // TODO: Send calendar invite or email notification to student and mentor

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
  }

  const meetings = await MentorMeeting.find(query)
    .sort({ date: 1, time: 1 })
    .populate("student_id", "full_name email")
    .populate("startup_id", "name stage")
    .lean();

  const formattedMeetings = meetings.map((m) => ({
    meetingId: m._id,
    studentName: m.student_id?.full_name,
    startupName: m.startup_id?.name,
    date: m.date,
    time: m.time,
    platform: m.platform,
    meetingLink: m.meeting_link,
    status: m.status,
  }));

  res.status(200).json(formattedMeetings);
});
