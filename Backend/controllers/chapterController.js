const asyncHandler = require("../middlewares/asyncHandler");
const Chapter = require("../model/Chapter");
const ChapterChangeRequest = require("../model/ChapterChangeRequest");
const StudentProfile = require("../model/StudentProfile");

//* GET:- /api/student/chapter
const getMyChapter = asyncHandler(async (req, res) => {
  const profile = await StudentProfile.findOne({
    user_id: req.user.id,
  }).populate("chapter_id");

  if (!profile) {
    return res
      .status(404)
      .json({ success: false, message: "Student profile not found" });
  }

  if (!profile.chapter_id) {
    return res.status(409).json({
      success: false,
      message: "No chapter assigned yet. Please complete registration first.",
      data: { redirect_to: "registration" },
    });
  }

  const chapter = profile.chapter_id;
  return res.status(200).json({
    success: true,
    data: {
      studentId: req.user.id,
      registrationStatus: req.user.account_status,
      chapterId: chapter._id,
      chapterName: chapter.chapter_name,
      collegeName: chapter.college_name,
      status: chapter.status,
      description: chapter.description,
      mission: chapter.mission,
    },
  });
});

//* GET:- /api/chapter/:chapterId/stats
const getChapterStats = asyncHandler(async (req, res) => {
  const { chapterId } = req.params;

  const chapter = await Chapter.findById(chapterId);
  if (!chapter) {
    return res
      .status(404)
      .json({ success: false, message: "Chapter not found" });
  }

  return res.status(200).json({
    success: true,
    data: {
      totalMembers: chapter.total_members,
      activeStartups: chapter.active_startups,
      mentors: chapter.mentors_count,
      eventsConducted: chapter.events_conducted,
    },
  });
});

//* POST:- /api/student/request-chapter-change
const requestChapterChange = asyncHandler(async (req, res) => {
  const { reason, requested_chapter_id } = req.body;

  if (!reason || !reason.trim()) {
    return res
      .status(400)
      .json({ success: false, message: "A reason is required" });
  }

  const profile = await StudentProfile.findOne({ user_id: req.user.id });
  if (!profile) {
    return res
      .status(404)
      .json({ success: false, message: "Student profile not found" });
  }
  if (!profile.chapter_id) {
    return res.status(409).json({
      success: false,
      message: "You don't have an assigned chapter yet",
    });
  }

  if (requested_chapter_id) {
    const requestedExist = await Chapter.exists({ _id: requested_chapter_id });
    if (!requestedExist) {
      return res
        .status(400)
        .json({ success: false, message: "Requested chapter does not exist" });
    }
    if (String(requested_chapter_id) === String(profile.chapter_id)) {
      return res
        .status(400)
        .json({ success: false, message: "You are already in this chapter" });
    }
  }

  const existingPending = await ChapterChangeRequest.findOne({
    student_id: req.user.id,
    status: "pending",
  });
  if (existingPending) {
    return res.status(409).json({
      success: false,
      message: "You already have a pending chapter change request",
    });
  }

  const request = await ChapterChangeRequest.create({
    student_id: req.user.id,
    current_chapter_id: profile.chapter_id,
    requested_chapter_id: requested_chapter_id || null,
    reason: reason.trim(),
    status: "pending",
  });

  return res.status(201).json({
    success: true,
    message: "Chapter change request submitted. It's pending admin review.",
    data: {
      requestId: request._id,
      status: request.status,
    },
  });
});

module.exports = {
  getMyChapter,
  getChapterStats,
  requestChapterChange,
};
