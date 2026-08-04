const asyncHandler = require("../middlewares/asyncHandler");
const Meeting = require("../models/Meeting");
const StageSubmission = require("../models/StageSubmission");
const { getOrCreateStartup } = require("../utils/startupJourney");

/**
 * @desc    Get current active review meeting for the student's startup
 * @route   GET /api/meetings
 * @access  Private (Student)
 */
const listMeetings = asyncHandler(async (req, res) => {
  const userId = req.user.id || req.user._id;

  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  // 1. Check if the startup has an approved submission for the active stage
  const approvedSubmission = await StageSubmission.findOne({
    startup_id: startup._id,
    status: "approved",
  });

  if (!approvedSubmission) {
    return res.status(200).json({
      success: true,
      message:
        "No approved stage submission found. Meeting scheduling is locked.",
      data: {
        isApproved: false,
        meeting: null,
      },
    });
  }

  // 2. Fetch scheduled, rescheduled, or completed meeting matching new schema
  const meeting = await Meeting.findOne({
    startup_id: startup._id,
    status: { $in: ["scheduled", "rescheduled", "completed"] },
  })
    .populate("reviewer_id", "full_name email role")
    .sort({ scheduledAt: -1 });

  if (!meeting) {
    return res.status(200).json({
      success: true,
      message:
        "Stage submission is approved, but no review meeting is scheduled yet.",
      data: {
        isApproved: true,
        meeting: null,
      },
    });
  }

  // Parse description/agenda into list items if applicable
  const agendaList = meeting.description
    ? meeting.description.split("\n").filter((line) => line.trim().length > 0)
    : [];

  return res.status(200).json({
    success: true,
    data: {
      isApproved: true,
      meeting: {
        id: meeting._id,
        stage: meeting.stage,
        title: meeting.title,
        reviewer: meeting.reviewer_id
          ? {
              name: meeting.reviewer_id.full_name,
              email: meeting.reviewer_id.email,
              role: meeting.reviewer_id.role,
            }
          : null,
        scheduledAt: meeting.scheduledAt,
        duration: meeting.duration,
        description: meeting.description,
        agenda: agendaList,
        status: meeting.status,
        rescheduleHistory: meeting.rescheduleHistory,
      },
    },
  });
});

module.exports = { listMeetings };
