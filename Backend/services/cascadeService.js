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

const mongoose = require("mongoose");

const deleteStartupDependencies = async (startupId) => {
  if (!startupId) return;

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
};

const deleteUserDependencies = async (userId) => {
  if (!userId) return;

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

  // 7. If Student, find their Startups and trigger cascade
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
