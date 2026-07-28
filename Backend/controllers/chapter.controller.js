const asyncHandler = require("../middlewares/asyncHandler");
const Chapter = require("../models/Chapter");
const ChapterChangeRequest = require("../models/ChapterChangeRequest");
const StudentProfile = require("../models/StudentProfile");

/**
 * Get student's assigned chapter with full details
 */
const getMyChapter = asyncHandler(async (req, res) => {
  const profile = await StudentProfile.findOne({
    user_id: req.user.id,
  }).populate("chapter_id");

  if (!profile) {
    return res.status(404).json({
      success: false,
      message: "Student profile not found",
    });
  }

  // Check if chapter is assigned
  if (!profile.chapter_id) {
    return res.status(409).json({
      success: false,
      message: "No chapter assigned. Please contact support.",
    });
  }

  const chapter = profile.chapter_id;

  return res.status(200).json({
    success: true,
    data: {
      studentId: req.user.id,
      studentName: profile.full_name || "", // Add if available
      registrationStatus: req.user.account_status,
      college: profile.college,
      chapterId: chapter._id,
      chapterName: chapter.chapter_name,
      collegeName: chapter.college_name,
      status: chapter.status,
      description: chapter.description,
      mission: chapter.mission,
    },
  });
});

/**
 * Get statistics for a specific chapter
 */
const getChapterStats = asyncHandler(async (req, res) => {
  const { chapterId } = req.params;

  // Validate chapterId format
  if (!chapterId || !chapterId.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({
      success: false,
      message: "Invalid chapter ID",
    });
  }

  const chapter = await Chapter.findById(chapterId);
  if (!chapter) {
    return res.status(404).json({
      success: false,
      message: "Chapter not found",
    });
  }

  return res.status(200).json({
    success: true,
    data: {
      chapterId: chapter._id,
      chapterName: chapter.chapter_name,
      collegeName: chapter.college_name,
      totalMembers: chapter.total_members,
      activeStartups: chapter.active_startups,
      mentors: chapter.mentors_count,
      eventsConducted: chapter.events_conducted,
    },
  });
});

/**
 * Request a chapter change (after auto-assignment)
 * Student can request to move to a different chapter
 */
const requestChapterChange = asyncHandler(async (req, res) => {
  const { reason, requested_chapter_id } = req.body;

  // Validate reason
  if (!reason || !reason.trim()) {
    return res.status(400).json({
      success: false,
      message: "A reason is required for chapter change",
    });
  }

  if (reason.trim().length < 10) {
    return res.status(400).json({
      success: false,
      message: "Reason must be at least 10 characters",
    });
  }

  // Get student profile
  const profile = await StudentProfile.findOne({ user_id: req.user.id });
  if (!profile) {
    return res.status(404).json({
      success: false,
      message: "Student profile not found",
    });
  }

  // Check if student has assigned chapter
  if (!profile.chapter_id) {
    return res.status(409).json({
      success: false,
      message: "You don't have an assigned chapter yet",
    });
  }

  // Validate requested chapter if provided
  if (requested_chapter_id) {
    const requestedChapter = await Chapter.findById(requested_chapter_id);
    if (!requestedChapter) {
      return res.status(400).json({
        success: false,
        message: "Requested chapter does not exist",
      });
    }

    // Check if student is already in this chapter
    if (String(requested_chapter_id) === String(profile.chapter_id)) {
      return res.status(400).json({
        success: false,
        message: "You are already in this chapter",
      });
    }

    // Check if requested chapter is active
    if (requestedChapter.status !== "Active") {
      return res.status(400).json({
        success: false,
        message: "Requested chapter is not active",
      });
    }
  }

  // Check for existing pending request
  const existingPending = await ChapterChangeRequest.findOne({
    student_id: req.user.id,
    status: "pending",
  });

  if (existingPending) {
    return res.status(409).json({
      success: false,
      message:
        "You already have a pending chapter change request. Please wait for admin approval.",
    });
  }

  // Create chapter change request
  const changeRequest = await ChapterChangeRequest.create({
    student_id: req.user.id,
    current_chapter_id: profile.chapter_id,
    requested_chapter_id: requested_chapter_id || null,
    reason: reason.trim(),
    status: "pending",
  });

  return res.status(201).json({
    success: true,
    message:
      "Chapter change request submitted successfully. It's pending admin review.",
    data: {
      requestId: changeRequest._id,
      status: changeRequest.status,
      currentChapter: profile.chapter_id,
      requestedChapter: requested_chapter_id,
      submittedAt: changeRequest.created_at,
    },
  });
});

/**
 * Get list of available chapters for transfer (optional)
 * Helps student know which chapters they can request
 */
const getAvailableChaptersForTransfer = asyncHandler(async (req, res) => {
  const profile = await StudentProfile.findOne({ user_id: req.user.id });

  if (!profile || !profile.chapter_id) {
    return res.status(404).json({
      success: false,
      message: "Student profile or chapter not found",
    });
  }

  // Get all active chapters except current one
  const chapters = await Chapter.find({
    _id: { $ne: profile.chapter_id },
    status: "Active",
  }).select("_id chapter_name college_name total_members");

  return res.status(200).json({
    success: true,
    data: {
      currentChapterId: profile.chapter_id,
      availableChapters: chapters,
    },
  });
});

module.exports = {
  getMyChapter,
  getChapterStats,
  requestChapterChange,
  getAvailableChaptersForTransfer,
};
