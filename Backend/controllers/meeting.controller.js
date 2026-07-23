const asyncHandler = require("../middlewares/asyncHandler");
const Meeting = require("../models/Meeting");
const { getOrCreateStartup } = require("../utils/startupJourney");

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
