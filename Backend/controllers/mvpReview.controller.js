const asyncHandler = require("../middlewares/asyncHandler");
const MVPReview = require("../models/MVPReview");
const MVPReviewMeeting = require("../models/MVPReviewMeeting");
const { getOrCreateStartup } = require("../utils/startupJourney");

// GET /api/student/mvp/meeting
const getReviewMeeting = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;

  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  const meeting = await MVPReviewMeeting.findOne({
    startup_id: startup._id,
  })
    .populate("reviewer_id", "full_name email")
    .lean();

  if (!meeting) {
    return res.status(404).json({
      success: false,
      message: "No review meeting scheduled yet",
    });
  }

  res.status(200).json({
    success: true,
    data: {
      meeting: {
        id: meeting._id,
        meeting_id: meeting.meeting_id,
        meeting_date: meeting.meeting_date,
        meeting_time: meeting.meeting_time,
        meeting_link: meeting.meeting_link,
        status: meeting.status,
        agenda: meeting.agenda,
      },
      reviewer: {
        name: meeting.reviewer_id?.full_name || "Assigned Reviewer",
        email: meeting.reviewer_id?.email || "",
      },
    },
  });
});

// POST /api/student/mvp/reschedule
const requestMeetingReschedule = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const { reschedule_reason } = req.body;

  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  const meeting = await MVPReviewMeeting.findOne({
    startup_id: startup._id,
  });

  if (!meeting) {
    return res.status(404).json({
      success: false,
      message: "No review meeting found",
    });
  }

  if (meeting.status !== "Scheduled") {
    return res.status(409).json({
      success: false,
      message: `Cannot reschedule meeting with status: ${meeting.status}`,
    });
  }

  meeting.status = "Reschedule Requested";
  meeting.reschedule_reason = reschedule_reason || "";
  meeting.reschedule_requested_at = new Date();
  await meeting.save();

  res.status(200).json({
    success: true,
    message: "Reschedule request submitted",
    data: {
      status: meeting.status,
      reschedule_requested_at: meeting.reschedule_requested_at,
    },
  });
});

// GET /api/student/mvp/review
const getReviewFeedback = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;

  const startup = await getOrCreateStartup(userId, `${userId}'s Startup`);

  const review = await MVPReview.findOne({
    startup_id: startup._id,
  })
    .populate("reviewer_id", "full_name email")
    .lean();

  if (!review) {
    return res.status(404).json({
      success: false,
      message: "No review feedback available yet",
    });
  }

  res.status(200).json({
    success: true,
    data: {
      review_id: review.review_id,
      decision: review.decision,
      reviewer_name: review.reviewer_id?.full_name || "Reviewer",
      reviewer_comments: review.reviewer_comments,
      strengths: review.strengths,
      areas_to_improve: review.areas_to_improve,
      recommendations: review.recommendations,
      scores: {
        technical: review.technical_score,
        design: review.design_score,
        functionality: review.functionality_score,
      },
      created_at: review.created_at,
    },
  });
});

module.exports = {
  getReviewMeeting,
  requestMeetingReschedule,
  getReviewFeedback,
};
