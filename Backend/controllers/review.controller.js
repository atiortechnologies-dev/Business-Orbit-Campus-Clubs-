const asyncHandler = require("../middlewares/asyncHandler");
const Meeting = require("../models/Meeting");
const MeetingFeedback = require("../models/MeetingFeedback");
const Startup = require("../models/Startup");

/**
 * @desc    Get stage-specific review feedback for logged-in student
 * @route   GET /api/student/feedback/stage/:stage
 * @access  Private (Student)
 */
const getStudentStageFeedback = asyncHandler(async (req, res) => {
  const userId = req.user?._id || req.user?.id;
  const { stage = "ideation" } = req.params;

  // 1. Find student startup
  const startup = await Startup.findOne({ student_id: userId });

  if (!startup) {
    return res.status(200).json({
      success: true,
      data: null,
      message: "No startup registered for this student.",
    });
  }

  // 2. Find meetings matching student's startup AND the requested stage
  const meetings = await Meeting.find({
    startup_id: startup._id,
    stage: stage,
  }).select("_id");

  if (!meetings || meetings.length === 0) {
    return res.status(200).json({
      success: true,
      data: null,
      message: `No ${stage} review meeting found.`,
    });
  }

  const meetingIds = meetings.map((m) => m._id);

  // 3. Find the latest feedback for any meeting matching this specific stage
  const feedback = await MeetingFeedback.findOne({
    meeting_id: { $in: meetingIds },
  })
    .sort({ updated_at: -1 })
    .populate("reviewer_id", "full_name email")
    .lean();

  if (!feedback) {
    return res.status(200).json({
      success: true,
      data: null,
      message: `No feedback submitted for ${stage} stage yet.`,
    });
  }

  return res.status(200).json({
    success: true,
    data: {
      feedback_id: feedback._id,
      meeting_id: feedback.meeting_id,
      stage: stage,
      reviewer_name: feedback.reviewer_id?.full_name || "Reviewer",
      reviewer_comments: feedback.reviewer_comments || "",
      summary: feedback.summary || "",
      strengths: feedback.strengths || "",
      improvements: feedback.improvements || "",
      recommendations: feedback.recommendations || "",
      decision: feedback.decision || "approve",
      validation_approved: Boolean(feedback.validation_approved),
      updated_at: feedback.updated_at,
    },
  });
});

module.exports = { getStudentStageFeedback };
