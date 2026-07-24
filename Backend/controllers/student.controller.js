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

/**
 * @desc    Submit a mentorship request to a mentor (Creates a MentorRequest)
 * @route   POST /api/student/mentors/:mentorId/request
 * @access  Private (Student)
 */
exports.requestMentor = asyncHandler(async (req, res, next) => {
  const { mentorId } = req.params;
  const studentId = req.user._id;
  const { request_summary } = req.body;

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
          request_summary,
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
