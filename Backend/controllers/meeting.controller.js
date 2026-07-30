/**
 * @file meeting.controller.js
 * @description Handles operations related to scheduling and viewing meetings.
 * @architecture Retrieves a sorted list of upcoming scheduled meetings for a user's startup, including populated reviewer details.
 */

const asyncHandler = require("../middlewares/asyncHandler");
const Meeting = require("../models/Meeting");
const { getOrCreateStartup } = require("../utils/startupJourney");

/**
 * @desc    List all upcoming and past meetings for the student's startup
 * @route   GET /api/meetings
 * @access  Private (Student)
 */
const listMeetings = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;

  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  const meetings = await Meeting.find({ startup_id: startup._id })
    .populate("reviewer_id", "full_name email")
    .sort({ meeting_date: 1 });

  return res.status(200).json({
    success: true,
    data: meetings.map((m) => ({
      meetingId: m._id,
      reviewer: m.reviewer_id
        ? { name: m.reviewer_id.full_name, email: m.reviewer_id.email }
        : null,
      meetingDate: m.meeting_date,
      meetingLink: m.meeting_link,
      status: m.status,
    })),
  });
});

module.exports = { listMeetings };
