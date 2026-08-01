/**
 * @file mentorDashboard.controller.js
 * @description Aggregates dashboard statistics, upcoming meetings, and recent conversations for the mentor dashboard.
 * @architecture Controller layer providing summary APIs to feed the mentor dashboard UI.
 */

const asyncHandler = require("../middlewares/asyncHandler");
const MentorAssignment = require("../models/MentorAssignment");
const MentorRequest = require("../models/MentorRequest");
const MentorMeeting = require("../models/MentorMeeting");

const { getHydratedChatRooms } = require("../services/chatRoomService");
const {
  REQUEST_STATUS,
  ASSIGNMENT_STATUS,
  MEETING_STATUS,
} = require("../constants/statusConstants");

/**
 * @desc    Get dashboard summary counters
 * @route   GET /api/mentor/dashboard
 * @access  Private (Mentor)
 */
exports.getDashboardSummary = asyncHandler(async (req, res) => {
  const mentorId = req.user._id;

  const [activeStudents, pendingRequests, upcomingMeetings, completedSessions] =
    await Promise.all([
      MentorAssignment.countDocuments({
        mentor_id: mentorId,
        status: ASSIGNMENT_STATUS.ACTIVE,
      }),
      MentorRequest.countDocuments({
        mentor_id: mentorId,
        status: REQUEST_STATUS.PENDING,
      }),
      MentorMeeting.countDocuments({
        mentor_id: mentorId,
        status: MEETING_STATUS.SCHEDULED,
        date: { $gte: new Date() },
      }),
      MentorMeeting.countDocuments({
        mentor_id: mentorId,
        status: MEETING_STATUS.COMPLETED,
      }),
    ]);

  res.status(200).json({
    mentorName: req.user.full_name,
    activeStudents,
    pendingRequests,
    upcomingMeetings,
    completedSessions,
  });
});

/**
 * @desc    Get recent mentorship requests
 * @route   GET /api/mentor/requests/recent
 * @access  Private (Mentor)
 */
exports.getRecentRequests = asyncHandler(async (req, res) => {
  const mentorId = req.user._id;

  const requests = await MentorRequest.find({
    mentor_id: mentorId,
    status: REQUEST_STATUS.PENDING,
  })
    .sort({ created_at: -1 })
    .limit(5)
    .populate("student_id", "full_name")
    .populate("startup_id", "startup_name current_stage")
    .lean();

  const formattedRequests = requests.map((req) => ({
    requestId: req._id,
    studentId: req.student_id?._id,
    startupId: req.startup_id?._id,
    studentName: req.student_id?.full_name,
    startupName: req.startup_id?.startup_name,
    startupStage: req.startup_id?.current_stage,
    requestDate: req.created_at,
    requestStatus: req.status,
  }));

  res.status(200).json(formattedRequests);
});

/**
 * @desc    Get upcoming meetings
 * @route   GET /api/mentor/meetings/upcoming
 * @access  Private (Mentor)
 */
exports.getUpcomingMeetings = asyncHandler(async (req, res) => {
  const mentorId = req.user._id;

  const meetings = await MentorMeeting.find({
    mentor_id: mentorId,
    status: MEETING_STATUS.SCHEDULED,
    date: { $gte: new Date() },
  })
    .sort({ date: 1 })
    .limit(5)
    .populate("student_id", "full_name")
    .lean();

  const formattedMeetings = meetings.map((meeting) => ({
    meetingTitle: "Mentorship Session", // Inferred default title, can be added to model if requested
    studentName: meeting.student_id?.full_name,
    date: meeting.date,
    time: meeting.time,
    meetingLink: meeting.meeting_link,
    platform: meeting.platform,
  }));

  res.status(200).json(formattedMeetings);
});

/**
 * @desc    Get recent conversations
 * @route   GET /api/mentor/chats/recent
 * @access  Private (Mentor)
 */
exports.getRecentConversations = asyncHandler(async (req, res) => {
  const mentorId = req.user._id;

  const chatRooms = await getHydratedChatRooms(mentorId, "mentor", 10);

  res.status(200).json(chatRooms);
});
