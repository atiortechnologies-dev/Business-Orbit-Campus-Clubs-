/**
 * @file cascadeService.js
 * @description Centralized orchestration service to handle cascading deletions of related documents when primary entities (User, Startup) are deleted.
 * @architecture Solves Mongoose's lack of automatic cascading deletions by defining explicit dependency graphs.
 */

const StudentProfile = require("../models/StudentProfile");
const MentorProfile = require("../models/MentorProfile");
const InvestorProfile = require("../models/InvestorProfile");
const IncubatorProfile = require("../models/IncubatorProfile");
const CompanyProfile = require("../models/CompanyProfile");

const EmailVerification = require("../models/EmailVerification");
const PasswordReset = require("../models/PasswordReset");
const ActivityLog = require("../models/ActivityLog");
const Notification = require("../models/Notification");

const MentorRequest = require("../models/MentorRequest");
const MentorAssignment = require("../models/MentorAssignment");
const MentorMeeting = require("../models/MentorMeeting");

const ChatRoom = require("../models/ChatRoom");
const Message = require("../models/Message");

const ChapterChangeRequest = require("../models/ChapterChangeRequest");
const Meeting = require("../models/Meeting");
const Review = require("../models/Review");

const StartupStage = require("../models/StartupStage");
const StageSubmission = require("../models/StageSubmission");

const Opportunity = require("../models/Opportunity");
const Application = require("../models/Application");
const ApplicantStatus = require("../models/ApplicantStatus");
const ApplicationInterview = require("../models/ApplicationInterview");
const RecruiterNote = require("../models/RecruiterNote");

const StartupPitch = require("../models/StartupPitch");
const PitchView = require("../models/PitchView");
const InvestorWatchlist = require("../models/InvestorWatchlist");
const InvestorNote = require("../models/InvestorNote");
const InvestorChatRoom = require("../models/InvestorChatRoom");
const InvestorMessage = require("../models/InvestorMessage");

const mongoose = require("mongoose");

const deleteStartupDependencies = async (startupId) => {
  if (!startupId) return;

  console.log(
    `[Cascade] Deleting Startup dependencies for Startup: ${startupId}`,
  );

  // 1. Delete Progression
  await StartupStage.deleteMany({ startup_id: startupId });
  await StageSubmission.deleteMany({ startup_id: startupId });

  // 2. Delete Meetings & Reviews
  await Meeting.deleteMany({ startup_id: startupId });
  await Review.deleteMany({ startup_id: startupId });

  // 3. Delete Mentor Relations
  await MentorRequest.deleteMany({ startup_id: startupId });
  await MentorAssignment.deleteMany({ startup_id: startupId });
  await MentorMeeting.deleteMany({ startup_id: startupId });

  // 4. Delete ChatRooms & Messages
  const chatRooms = await ChatRoom.find({ startup_id: startupId });
  const chatRoomIds = chatRooms.map((c) => c._id);
  if (chatRoomIds.length > 0) {
    await Message.deleteMany({ chat_id: { $in: chatRoomIds } });
    await ChatRoom.deleteMany({ _id: { $in: chatRoomIds } });
  }

  // 5. Delete Investor Ecosystem Relations
  await InvestorWatchlist.deleteMany({ startup_id: startupId });
  await InvestorNote.deleteMany({ startup_id: startupId });

  const pitches = await StartupPitch.find({ startup_id: startupId });
  const pitchIds = pitches.map((p) => p._id);
  if (pitchIds.length > 0) {
    await PitchView.deleteMany({ pitch_id: { $in: pitchIds } });
    await StartupPitch.deleteMany({ _id: { $in: pitchIds } });
  }
};

const deleteUserDependencies = async (userId) => {
  if (!userId) return;

  console.log(`[Cascade] Deleting User dependencies for User: ${userId}`);

  // 1. Delete Profiles
  await StudentProfile.deleteMany({ user_id: userId });
  await MentorProfile.deleteMany({ user_id: userId });
  await InvestorProfile.deleteMany({ user_id: userId });
  await IncubatorProfile.deleteMany({ user_id: userId });
  await CompanyProfile.deleteMany({ user_id: userId });

  // 2. Delete Auth & Meta
  await EmailVerification.deleteMany({ userId: userId });
  await PasswordReset.deleteMany({ user_id: userId });
  await ActivityLog.deleteMany({ user_id: userId });
  await Notification.deleteMany({ recipient_id: userId });

  // 3. Delete Mentor Relations (as mentor or student)
  await MentorRequest.deleteMany({
    $or: [{ mentor_id: userId }, { student_id: userId }],
  });
  await MentorAssignment.deleteMany({
    $or: [{ mentor_id: userId }, { student_id: userId }],
  });
  await MentorMeeting.deleteMany({
    $or: [{ mentor_id: userId }, { student_id: userId }],
  });

  // 4. Delete Chapter Change Requests
  await ChapterChangeRequest.deleteMany({ student_id: userId });

  // 5. Delete ChatRooms & Messages where user is participant
  const chatRooms = await ChatRoom.find({
    $or: [{ mentor_id: userId }, { student_id: userId }],
  });
  const chatRoomIds = chatRooms.map((c) => c._id);
  if (chatRoomIds.length > 0) {
    await Message.deleteMany({ chat_id: { $in: chatRoomIds } });
    await ChatRoom.deleteMany({ _id: { $in: chatRoomIds } });
  }

  // 6. If Admin/Reviewer, delete their assigned meetings and reviews
  await Meeting.deleteMany({ reviewer_id: userId });
  await Review.deleteMany({ reviewer_id: userId });

  // 7. Delete Investor Ecosystem (Direct refs)
  await InvestorWatchlist.deleteMany({ investor_id: userId });
  await InvestorNote.deleteMany({ investor_id: userId });
  await PitchView.deleteMany({ investor_id: userId });

  // 8. Delete Investor/Founder Chat Rooms
  const invChatRooms = await InvestorChatRoom.find({
    $or: [{ investor_id: userId }, { founder_id: userId }],
  });
  const invChatRoomIds = invChatRooms.map((c) => c._id);
  if (invChatRoomIds.length > 0) {
    await InvestorMessage.deleteMany({ chat_id: { $in: invChatRoomIds } });
    await InvestorChatRoom.deleteMany({ _id: { $in: invChatRoomIds } });
  }

  // 9. Delete Company Ecosystem (Opportunities & deeply nested Applications)
  const opportunities = await Opportunity.find({ company_id: userId });
  const oppIds = opportunities.map((o) => o._id);
  if (oppIds.length > 0) {
    const oppApplications = await Application.find({
      opportunity_id: { $in: oppIds },
    });
    const oppAppIds = oppApplications.map((a) => a._id);

    if (oppAppIds.length > 0) {
      await ApplicantStatus.deleteMany({ application_id: { $in: oppAppIds } });
      await ApplicationInterview.deleteMany({
        application_id: { $in: oppAppIds },
      });
      await RecruiterNote.deleteMany({ application_id: { $in: oppAppIds } });
      await Application.deleteMany({ _id: { $in: oppAppIds } });
    }
    await Opportunity.deleteMany({ _id: { $in: oppIds } });
  }

  // 10. Delete Student Ecosystem (Applications & deeply nested statuses)
  const studentApplications = await Application.find({ student_id: userId });
  const studentAppIds = studentApplications.map((a) => a._id);
  if (studentAppIds.length > 0) {
    await ApplicantStatus.deleteMany({
      application_id: { $in: studentAppIds },
    });
    await ApplicationInterview.deleteMany({
      application_id: { $in: studentAppIds },
    });
    await RecruiterNote.deleteMany({ application_id: { $in: studentAppIds } });
    await Application.deleteMany({ _id: { $in: studentAppIds } });
  }

  // 11. RecruiterNotes authored by this user
  await RecruiterNote.deleteMany({ recruiter_id: userId });

  // 12. If Student, find their Startups and trigger cascade
  const Startup = mongoose.model("Startup"); // dynamically retrieve
  const startups = await Startup.find({ student_id: userId });
  for (const startup of startups) {
    await deleteStartupDependencies(startup._id);
    await Startup.deleteOne({ _id: startup._id });
  }
};

module.exports = {
  deleteUserDependencies,
  deleteStartupDependencies,
};
