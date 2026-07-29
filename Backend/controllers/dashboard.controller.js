/**
 * @file dashboard.controller.js
 * @description Serves aggregated data required for the main student dashboard.
 * @architecture Aggregates profile data, startup progress, and active stages ensuring the user has a startup entity.
 */

const asyncHandler = require("../middlewares/asyncHandler");
const Meeting = require("../models/Meeting");
const Startup = require("../models/Startup");
const StartupStage = require("../models/StartupStage");
const StudentProfile = require("../models/StudentProfile");
const User = require("../models/User");
const { getOrCreateStartup } = require("../utils/startupJourney");

/**
 * @desc    Get aggregated dashboard data for the authenticated student
 * @route   GET /api/dashboard
 * @access  Private (Student)
 */
const getDashboard = asyncHandler(async (req, res) => {
  const { id: userId, role, account_status, email_verified } = req.user;

  console.log("userId", userId);

  if (!email_verified) {
    return res.status(403).json({
      success: false,
      message: "Please verify your email first",
      data: { redirect_to: "/onboarding/verify-email" },
    });
  }

  if (account_status !== "active") {
    return res.status(403).json({
      success: false,
      message: "Your account is not yet approved",
      data: {
        redirect_to:
          account_status === "rejected"
            ? "/onboarding/application-rejected"
            : "/onboarding/verification-progress",
      },
    });
  }

  let profile = await StudentProfile.findOne({ user_id: userId });
  if (!profile) {
    return res.status(403).json({
      success: false,
      message: "Please complete your student profile first",
      data: {
        redirect_to: `/onboarding/complete-profile/${role || "student"}`,
      },
    });
  }

  const startup = await getOrCreateStartup(userId, `${req.user.id}'s Startup`);

  const activeStage = await StartupStage.findOne({
    startup_id: startup._id,
    status: "active",
  });

  const upcomingMeetings = await Meeting.find({
    startup_id: startup._id,
    status: "scheduled",
    meeting_date: { $gte: new Date() },
  })
    .sort({ meeting_date: 1 })
    .limit(5);

  // load notification - will see after wards

  // load announcements -  will see after wards

  return res.status(200).json({
    success: true,
    data: {
      studentProfile: {
        fullName: req.user.full_name,
        bio: profile.bio,
        profilePhoto: profile.profile_photo,
      },
      startupName: startup.startup_name,
      currentStage: activeStage
        ? {
            stageNumber: activeStage.stage_number,
            stageName: activeStage.stage_name,
            status: activeStage.status,
          }
        : null,
      overallProgress: startup.progress_percentage,
      upcomingReviewMeetings: upcomingMeetings,
    },
  });
});

// GET /api/student/profile-details
const getStudentProfile = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;

  const user = await User.findById(userId)
    .select("-password_hash -otp_code_hash")
    .lean();

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  // Get profile info
  const profile = await StudentProfile.findOne({ user_id: userId }).lean();

  // Get startup info
  const startup = await Startup.findOne({ student_id: userId }).lean();

  res.status(200).json({
    success: true,
    data: {
      user: {
        id: user._id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
      },
      profile: profile || {
        bio: "",
        skills: [],
        college: "",
        degree: "",
        graduation_year: null,
        linkedin_url: "",
        portfolio_url: "",
        profile_photo: null,
      },
      startup: startup || {
        startup_name: "My Startup",
        tagline: "",
        industry: "",
        problem_statement: "",
        current_stage: 3,
      },
    },
  });
});

// PUT /api/student/profile-details
const updateProfile = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const updateData = req.validatedData;

  // Find or create profile
  let profile = await StudentProfile.findOne({ user_id: userId });

  if (!profile) {
    return res.status(404).json({
      success: false,
      message: "Profile not found",
    });
  }

  // Update fields
  Object.assign(profile, updateData);
  profile.updated_at = new Date();
  await profile.save();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: profile,
  });
});

// GET /api/student/startup
const getStartup = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;

  const startup = await Startup.findOne({ student_id: userId }).lean();

  if (!startup) {
    return res.status(404).json({
      success: false,
      message: "Startup not found",
    });
  }

  res.status(200).json({
    success: true,
    data: startup,
  });
});

// PUT /api/student/startup
const updateStartup = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const updateData = req.validatedData;

  const startup = await Startup.findOneAndUpdate(
    { student_id: userId },
    {
      startup_name: updateData.startup_name,
      tagline: updateData.tagline || "",
      industry: updateData.industry || "",
      problem_statement: updateData.problem_statement || "",
    },
    { new: true },
  );

  if (!startup) {
    return res.status(404).json({
      success: false,
      message: "Startup not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Startup updated successfully",
    data: startup,
  });
});

module.exports = {
  getDashboard,
  getStudentProfile,
  updateProfile,
  getStartup,
  updateStartup,
};
