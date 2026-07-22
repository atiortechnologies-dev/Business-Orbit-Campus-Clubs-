//* GET: /api/student/dashboard

const asyncHandler = require("../middlewares/asyncHandler");
const Meeting = require("../model/Meeting");
const StartupStage = require("../model/StartupStage");
const StudentProfile = require("../model/StudentProfile");
const { getOrCreateStartup } = require("../utils/startupJourney");

const getDashboard = asyncHandler(async (req, res) => {
  const { id: userId, account_status, email_verified } = req.user;

  if (!email_verified) {
    return res
      .status(403)
      .json({ success: false, message: "Please verify your email first" });
  }
  if (account_status !== "active") {
    return res
      .status(403)
      .json({ success: false, message: "Your account is not yet approved" });
  }

  // Load student profile
  const profile = await StudentProfile.findOne({ user_id: userId });
  if (!profile) {
    return res
      .status(404)
      .json({ success: false, message: "Student profile not found" });
  }

  // console.log("")

  // load startup journey
  const startup = await getOrCreateStartup(userId, `${req.user.id}'s Startup`);

  // load current active stage
  const activeStage = await StartupStage.findOne({
    startup_id: startup._id,
    status: "active",
  });

  // Load upcoming review meetings
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

module.exports = { getDashboard };
