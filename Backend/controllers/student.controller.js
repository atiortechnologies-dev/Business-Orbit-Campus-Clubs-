/**
 * @file student.controller.js
 * @description Manages operations specific to students, such as requesting a mentor.
 * @architecture Controller layer for student role workflows.
 */

const mongoose = require("mongoose");
const asyncHandler = require("../middlewares/asyncHandler");
const User = require("../models/User");
const Startup = require("../models/Startup");
const MentorRequest = require("../models/MentorRequest");
const Notification = require("../models/Notification");
const MentorProfile = require("../models/MentorProfile");
const MentorReview = require("../models/MentorReview");
const MentorMeeting = require("../models/MentorMeeting");

// Utility to escape string for use in a MongoDB $regex
const escapeRegex = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * @desc    Submit a mentorship request to a mentor (Creates a MentorRequest)
 * @route   POST /api/student/mentors/:mentorId/request
 * @access  Private (Student)
 */
exports.requestMentor = asyncHandler(async (req, res, next) => {
  const mentorId = req.params.mentorId || req.body.mentorId;
  const studentId = req.user._id;
  const {
    problem_statement,
    help_required,
    preferred_meeting_mode,
    preferred_time,
    additional_notes,
  } = req.body;

  if (!mentorId) {
    return res.status(400).json({
      success: false,
      message: "mentorId is required.",
    });
  }

  // 1. Verify that the requested mentor exists and has the correct role
  const mentor = await User.findOne({ _id: mentorId, role: "mentor" });
  if (!mentor) {
    return res.status(404).json({
      success: false,
      message: "Mentor not found or invalid role.",
    });
  }

  // 2. Fetch the student's startup
  const startup = await Startup.findOne({ student_id: studentId });
  if (!startup) {
    return res.status(400).json({
      success: false,
      message: "You must have a registered startup to request a mentor.",
    });
  }

  // 3. Check for existing pending or accepted requests to this mentor
  const existingRequest = await MentorRequest.findOne({
    student_id: studentId,
    mentor_id: mentorId,
    status: { $in: ["pending", "accepted"] },
  });

  if (existingRequest) {
    return res.status(400).json({
      success: false,
      message:
        "You already have a pending or accepted request with this mentor.",
    });
  }

  // 4. Create the MentorRequest and Notification within a transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [mentorRequest] = await MentorRequest.create(
      [
        {
          mentor_id: mentorId,
          student_id: studentId,
          startup_id: startup._id,
          problem_statement,
          help_required,
          preferred_meeting_mode,
          preferred_time,
          additional_notes,
          status: "pending",
        },
      ],
      { session },
    );

    const [notification] = await Notification.create(
      [
        {
          recipient_id: mentorId,
          title: "New Mentorship Request",
          message: `${req.user.full_name || "A student"} has requested your mentorship for their startup, ${startup.startup_name}.`,
          type: "info",
        },
      ],
      { session },
    );

    await require("../models/ActivityLog").create(
      [
        {
          user_id: studentId,
          action: "SUBMIT_MENTOR_REQUEST",
          entity_type: "MentorRequest",
          entity_id: mentorRequest._id,
          description: `Student submitted a mentorship request to mentor ${mentorId}.`,
        },
      ],
      { session },
    );

    await session.commitTransaction();

    res.status(201).json({
      success: true,
      message: "Mentorship request submitted successfully.",
      data: mentorRequest,
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
});

/**
 * @desc    Get student's mentorship requests and status
 * @route   GET /api/student/mentorship/request-status
 * @access  Private (Student)
 */
exports.getMentorshipRequestStatus = asyncHandler(async (req, res, next) => {
  const studentId = req.user._id;

  const requests = await MentorRequest.find({ student_id: studentId })
    .populate({
      path: "mentor_id",
      select: "full_name email profile_photo",
    })
    .sort({ updated_at: -1 });

  res.status(200).json({
    success: true,
    count: requests.length,
    data: requests,
  });
});

/**
 * @desc    List all approved mentors
 * @route   GET /api/student/mentors
 * @access  Private (Student)
 */
exports.listMentors = asyncHandler(async (req, res, next) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;

  const pipeline = [
    { $match: { profile_status: "completed", is_visible: true } },
    {
      $lookup: {
        from: "users",
        localField: "user_id",
        foreignField: "_id",
        as: "user_id"
      }
    },
    { $unwind: "$user_id" },
    { $match: { "user_id.role": "mentor", "user_id.account_status": "active" } }
  ];

  const totalResult = await MentorProfile.aggregate([...pipeline, { $count: "total" }]);
  const total = totalResult.length > 0 ? totalResult[0].total : 0;

  const mentors = await MentorProfile.aggregate([
    ...pipeline,
    { $sort: { rating: -1, total_sessions: -1 } },
    { $skip: startIndex },
    { $limit: limit },
    {
      $addFields: {
        user_id: {
          _id: "$user_id._id",
          full_name: "$user_id.full_name",
          email: "$user_id.email"
        }
      }
    }
  ]);

  res.status(200).json({
    success: true,
    count: mentors.length,
    pagination: {
      total,
      page,
      limit,
    },
    data: mentors,
  });
});

/**
 * @desc    Search and filter mentors
 * @route   POST /api/student/mentors/filter
 * @access  Private (Student)
 */
exports.searchMentors = asyncHandler(async (req, res, next) => {
  const { expertise, industry, availability, sort } = req.body;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;

  // Find all active mentor users first to apply proper DB-level pagination
  const activeMentorUsers = await User.find({
    role: "mentor",
    account_status: "active",
  }).select("_id");
  const activeMentorIds = activeMentorUsers.map((u) => u._id);

  let query = {
    profile_status: "completed",
    is_visible: true,
    user_id: { $in: activeMentorIds },
  };

  if (expertise) {
    query.expertise = { $regex: escapeRegex(expertise), $options: "i" };
  }

  if (industry) {
    query.mentoring_domains = { $in: [new RegExp(escapeRegex(industry), "i")] };
  }

  if (availability) {
    query.availability = { $regex: escapeRegex(availability), $options: "i" };
  }

  let sortObj = { rating: -1 };
  if (sort === "experience") sortObj = { years_of_experience: -1 };

  const total = await MentorProfile.countDocuments(query);
  const mentors = await MentorProfile.find(query)
    .populate("user_id", "full_name email")
    .skip(startIndex)
    .limit(limit)
    .sort(sortObj);

  res.status(200).json({
    success: true,
    count: mentors.length,
    pagination: {
      total,
      page,
      limit,
    },
    data: mentors,
  });
});

/**
 * @desc    Get full mentor profile
 * @route   GET /api/student/mentors/:id
 * @access  Private (Student)
 */
exports.getMentorProfileStudentView = asyncHandler(async (req, res, next) => {
  const mentorId = req.params.id;

  // mentorId could be User._id
  const profile = await MentorProfile.findOne({
    user_id: mentorId,
    profile_status: "completed",
  }).populate("user_id", "full_name email");

  if (!profile || !profile.user_id) {
    return res
      .status(404)
      .json({
        success: false,
        message: "Mentor not found or profile incomplete.",
      });
  }

  res.status(200).json({
    success: true,
    data: profile,
  });
});

/**
 * @desc    Get mentor reviews
 * @route   GET /api/student/mentors/:id/reviews
 * @access  Private (Student)
 */
exports.getMentorReviews = asyncHandler(async (req, res, next) => {
  const mentorId = req.params.id;
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;

  const total = await MentorReview.countDocuments({ mentor_id: mentorId });
  const reviews = await MentorReview.find({ mentor_id: mentorId })
    .populate("student_id", "full_name profile_photo")
    .sort({ created_at: -1 })
    .skip(startIndex)
    .limit(limit);

  res.status(200).json({
    success: true,
    count: reviews.length,
    pagination: {
      total,
      page,
      limit,
    },
    data: reviews,
  });
});

/**
 * @desc    Submit a mentor review
 * @route   POST /api/student/mentors/:id/reviews
 * @access  Private (Student)
 */
exports.submitMentorReview = asyncHandler(async (req, res, next) => {
  const mentorId = req.params.id;
  const studentId = req.user._id;
  const { rating, review_text } = req.validatedData;

  // Verify eligibility: Must have at least one completed meeting with the mentor
  const hasCompletedMeeting = await MentorMeeting.exists({
    mentor_id: mentorId,
    student_id: studentId,
    status: "completed",
  });

  if (!hasCompletedMeeting) {
    return res.status(403).json({
      success: false,
      message:
        "You can only review mentors you have had a completed session with.",
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Upsert the review
    await MentorReview.findOneAndUpdate(
      { mentor_id: mentorId, student_id: studentId },
      { rating, review_text },
      { returnDocument: "after", upsert: true, session },
    );

    // 2. Recalculate average rating for mentor
    const aggResult = await MentorReview.aggregate([
      { $match: { mentor_id: new mongoose.Types.ObjectId(mentorId) } },
      { $group: { _id: "$mentor_id", avgRating: { $avg: "$rating" } } },
    ]).session(session);

    let newAvg = rating;
    if (aggResult.length > 0) {
      newAvg = aggResult[0].avgRating;
    }

    // Round to 1 decimal place
    newAvg = Math.round(newAvg * 10) / 10;

    // 3. Update MentorProfile
    await MentorProfile.findOneAndUpdate(
      { user_id: mentorId },
      { rating: newAvg },
      { session, returnDocument: "after" },
    );

    await session.commitTransaction();

    res.status(200).json({
      success: true,
      message: "Review submitted successfully.",
    });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
});

/**
 * @desc    Get mentor availability
 * @route   GET /api/student/mentors/:id/availability
 * @access  Private (Student)
 */
exports.getMentorAvailability = asyncHandler(async (req, res, next) => {
  const mentorId = req.params.id;

  const profile = await MentorProfile.findOne({ user_id: mentorId }).select(
    "availability",
  );

  if (!profile) {
    return res
      .status(404)
      .json({ success: false, message: "Mentor not found." });
  }

  res.status(200).json({
    success: true,
    data: {
      availability: profile.availability || "Not specified",
    },
  });
});
