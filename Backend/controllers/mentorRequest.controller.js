/**
 * @file mentorRequest.controller.js
 * @description Manages incoming mentorship requests, accepting, declining, and viewing student profiles.
 * @architecture Controller layer governing the mentor-student matching and approval workflow.
 */

const mongoose = require("mongoose");
const asyncHandler = require("../middlewares/asyncHandler");
const MentorRequest = require("../models/MentorRequest");
const MentorAssignment = require("../models/MentorAssignment");
const ChatRoom = require("../models/ChatRoom");
const StudentProfile = require("../models/StudentProfile");
const Notification = require("../models/Notification");
const ActivityLog = require("../models/ActivityLog");
const {
  REQUEST_STATUS,
  ASSIGNMENT_STATUS,
} = require("../constants/statusConstants");

/**
 * @desc    Get all requests (with filters)
 * @route   GET /api/mentor/requests
 * @access  Private (Mentor)
 */
exports.getAllPendingRequests = asyncHandler(async (req, res) => {
  const mentorId = req.user._id;
  const { status, stage, category, college, sort } = req.query;

  // Build match object for MentorRequest
  const matchObj = { mentor_id: mentorId };
  if (status) matchObj.status = status;

  // Aggregation pipeline to allow filtering on populated collections
  const pipeline = [
    { $match: matchObj },
    {
      $lookup: {
        from: "users",
        localField: "student_id",
        foreignField: "_id",
        as: "student",
      },
    },
    { $unwind: { path: "$student", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "studentprofiles",
        localField: "student_id",
        foreignField: "user_id",
        as: "studentProfile",
      },
    },
    { $unwind: { path: "$studentProfile", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "startups",
        localField: "startup_id",
        foreignField: "_id",
        as: "startup",
      },
    },
    { $unwind: { path: "$startup", preserveNullAndEmptyArrays: true } },
  ];

  // Apply related filters
  if (stage)
    pipeline.push({
      $match: {
        "startup.current_stage": !isNaN(stage) ? Number(stage) : stage,
      },
    });
  if (category) pipeline.push({ $match: { "startup.category": category } });
  if (college) pipeline.push({ $match: { "studentProfile.college": college } });

  // Apply sorting
  const sortOrder = sort === "oldest" ? 1 : -1;
  pipeline.push({ $sort: { created_at: sortOrder } });

  // Project the required output
  pipeline.push({
    $project: {
      requestId: "$_id",
      studentId: "$student_id",
      startupId: "$startup_id",
      studentName: "$student.full_name",
      college: "$studentProfile.college",
      startupName: "$startup.startup_name",
      startupStage: "$startup.current_stage",
      startupCategory: "$startup.category",
      problemStatement: "$problem_statement",
      helpRequired: "$help_required",
      preferredMeetingMode: "$preferred_meeting_mode",
      preferredTime: "$preferred_time",
      additionalNotes: "$additional_notes",
      submittedDate: "$created_at",
      requestStatus: "$status",
    },
  });

  const requests = await MentorRequest.aggregate(pipeline);

  res.status(200).json(requests);
});

/**
 * @desc    View Student Profile
 * @route   GET /api/student/{studentId}/profile
 * @access  Private (Mentor)
 */
exports.viewStudentProfile = asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const mentorId = req.user._id;

  // Ensure the mentor is assigned or has a request from this student to get the startup_id
  let assignmentOrRequest = await MentorAssignment.findOne({
    mentor_id: mentorId,
    student_id: studentId,
  }).populate("startup_id");

  if (!assignmentOrRequest) {
    assignmentOrRequest = await MentorRequest.findOne({
      mentor_id: mentorId,
      student_id: studentId,
    }).populate("startup_id");
  }

  if (!assignmentOrRequest) {
    return res
      .status(403)
      .json({ message: "Not authorized to view this student's profile." });
  }

  const studentProfile = await StudentProfile.findOne({
    user_id: studentId,
  }).populate("user_id", "full_name email");
  const startup = assignmentOrRequest.startup_id;

  // Fallback to basic User data if the student hasn't completed their StudentProfile yet
  let name = "Unknown Student";
  if (studentProfile && studentProfile.user_id) {
    name = studentProfile.user_id.full_name;
  } else {
    // If StudentProfile doesn't exist, we can still try to get the basic user info
    const User = require("../models/User");
    const user = await User.findById(studentId).select("full_name");
    if (user) {
      name = user.full_name;
    }
  }

  res.status(200).json({
    studentInformation: {
      name: name,
      college: studentProfile?.college,
      degree: studentProfile?.degree,
      graduationYear: studentProfile?.graduation_year,
    },
    startupInformation: startup
      ? {
          name: startup.startup_name,
          category: startup.category,
          idea: startup.idea,
        }
      : null,
    startupProgress: startup?.progress,
    pitchDeck: startup?.pitch_deck,
    mvpDetails: startup?.mvp_details,
    skills: [], // Could be fetched from a skills model if exists, inferred empty array for now
    previousMentorNotes: "", // Placeholder for future implementation
  });
});

/**
 * @desc    Accept Request
 * @route   PATCH /api/mentor/requests/{requestId}/accept
 * @access  Private (Mentor)
 */
exports.acceptRequest = asyncHandler(async (req, res, next) => {
  const { requestId } = req.params;
  const mentorId = req.user._id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const request = await MentorRequest.findOne({
      _id: requestId,
      mentor_id: mentorId,
    }).session(session);

    if (!request) {
      const error = new Error("Request not found or unauthorized.");
      error.statusCode = 404;
      throw error;
    }

    if (request.status !== REQUEST_STATUS.PENDING) {
      const error = new Error("Only pending requests can be accepted.");
      error.statusCode = 400;
      throw error;
    }

    // Update request status
    request.status = REQUEST_STATUS.ACCEPTED;
    await request.save({ session });

    // Assign mentor to startup
    await MentorAssignment.create(
      [
        {
          mentor_id: mentorId,
          student_id: request.student_id,
          startup_id: request.startup_id,
          status: ASSIGNMENT_STATUS.ACTIVE,
        },
      ],
      { session },
    );

    // Enable chat (Create chat room if it doesn't exist)
    const existingChat = await ChatRoom.findOne({
      mentor_id: mentorId,
      student_id: request.student_id,
      startup_id: request.startup_id,
    }).session(session);

    if (!existingChat) {
      await ChatRoom.create(
        [
          {
            mentor_id: mentorId,
            student_id: request.student_id,
            startup_id: request.startup_id,
          },
        ],
        { session },
      );
    }

    // Notify student
    const notification = new Notification({
      recipient_id: request.student_id,
      title: "Mentorship Request Accepted",
      message: "Your mentorship request has been accepted by the mentor.",
      type: "success",
    });
    await notification.save({ session });

    await ActivityLog.create(
      [
        {
          user_id: mentorId,
          action: "ACCEPT_MENTOR_REQUEST",
          entity_type: "MentorRequest",
          entity_id: requestId,
          description: "Mentor accepted the mentorship request.",
        },
      ],
      { session },
    );

    await session.commitTransaction();
    res
      .status(200)
      .json({ message: "Mentorship request accepted successfully." });
  } catch (error) {
    await session.abortTransaction();
    next(error);
  } finally {
    session.endSession();
  }
});

/**
 * @desc    Decline Request
 * @route   PATCH /api/mentor/requests/{requestId}/decline
 * @access  Private (Mentor)
 */
exports.declineRequest = asyncHandler(async (req, res) => {
  const { requestId } = req.params;
  const mentorId = req.user._id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const request = await MentorRequest.findOne({
      _id: requestId,
      mentor_id: mentorId,
    }).session(session);

    if (!request) {
      await session.abortTransaction();
      return res
        .status(404)
        .json({ message: "Request not found or unauthorized." });
    }

    if (request.status !== REQUEST_STATUS.PENDING) {
      await session.abortTransaction();
      return res
        .status(400)
        .json({ message: "Only pending requests can be declined." });
    }

    request.status = REQUEST_STATUS.DECLINED;
    await request.save({ session });

    // Store decline action for audit purposes and Notify student
    await ActivityLog.create(
      [
        {
          user_id: mentorId,
          action: "DECLINE_MENTOR_REQUEST",
          entity_type: "MentorRequest",
          entity_id: requestId,
          description: "Mentor declined the mentorship request.",
        },
      ],
      { session },
    );

    const notification = new Notification({
      recipient_id: request.student_id,
      title: "Mentorship Request Declined",
      message: "Your mentorship request was declined.",
      type: "warning",
    });
    await notification.save({ session });

    await session.commitTransaction();

    res
      .status(200)
      .json({ message: "Mentorship request declined successfully." });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});
