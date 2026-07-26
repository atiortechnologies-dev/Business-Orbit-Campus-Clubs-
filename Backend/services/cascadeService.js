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
const MentorReview = require("../models/MentorReview");

const ChatRoom = require("../models/ChatRoom");
const Message = require("../models/Message");

const ChapterChangeRequest = require("../models/ChapterChangeRequest");
const Meeting = require("../models/Meeting");
const MeetingNotes = require("../models/MeetingNotes");
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
const PitchSubmission = require("../models/PitchSubmission");
const PitchDocument = require("../models/PitchDocument");

const IncubationApplication = require("../models/IncubationApplication");
const ApplicationDocument = require("../models/ApplicationDocument");
const ApplicationTimeline = require("../models/ApplicationTimeline");
const IncubationAdmission = require("../models/IncubationAdmission");
const AdmissionDocument = require("../models/AdmissionDocument");
const IncubationUpdate = require("../models/IncubationUpdate");

const mongoose = require("mongoose");

const deleteStartupDependencies = async (startupId, session = null) => {
  if (!startupId) return;

  const opts = session ? { session } : {};

  // 1. Delete Progression
  await StartupStage.deleteMany({ startup_id: startupId }, opts);
  await StageSubmission.deleteMany({ startup_id: startupId }, opts);

  // 2. Delete Meetings & Reviews
  await Meeting.deleteMany({ startup_id: startupId }, opts);
  await Review.deleteMany({ startup_id: startupId }, opts);

  // 3. Delete Mentor Relations
  await MentorRequest.deleteMany({ startup_id: startupId }, opts);
  await MentorAssignment.deleteMany({ startup_id: startupId }, opts);

  const mentorMeetings = await MentorMeeting.find(
    { startup_id: startupId },
    null,
    opts,
  );
  const mentorMeetingIds = mentorMeetings.map((m) => m._id);
  if (mentorMeetingIds.length > 0) {
    await MeetingNotes.deleteMany(
      { meeting_id: { $in: mentorMeetingIds } },
      opts,
    );
    await MentorMeeting.deleteMany({ _id: { $in: mentorMeetingIds } }, opts);
  }

  // 4. Delete ChatRooms & Messages
  const chatRooms = await ChatRoom.find({ startup_id: startupId }, null, opts);
  const chatRoomIds = chatRooms.map((c) => c._id);
  if (chatRoomIds.length > 0) {
    await Message.deleteMany({ chat_id: { $in: chatRoomIds } }, opts);
    await ChatRoom.deleteMany({ _id: { $in: chatRoomIds } }, opts);
  }

  // 5. Delete Investor Ecosystem Relations
  await InvestorWatchlist.deleteMany({ startup_id: startupId }, opts);
  await InvestorNote.deleteMany({ startup_id: startupId }, opts);

  const pitches = await StartupPitch.find(
    { startup_id: startupId },
    null,
    opts,
  );
  const pitchIds = pitches.map((p) => p._id);
  if (pitchIds.length > 0) {
    await PitchView.deleteMany({ pitch_id: { $in: pitchIds } }, opts);
    await StartupPitch.deleteMany({ _id: { $in: pitchIds } }, opts);
  }

  const pitchSubmissions = await PitchSubmission.find(
    { startup_id: startupId },
    null,
    opts,
  );
  const pitchSubmissionIds = pitchSubmissions.map((p) => p._id);
  if (pitchSubmissionIds.length > 0) {
    await PitchDocument.deleteMany({ submission_id: { $in: pitchSubmissionIds } }, opts);
    await PitchSubmission.deleteMany({ _id: { $in: pitchSubmissionIds } }, opts);
  }

  // 6. Delete Incubation Ecosystem Relations (by Startup)
  const incApps = await IncubationApplication.find(
    { startup_id: startupId },
    null,
    opts,
  );
  const incAppIds = incApps.map((a) => a._id);
  if (incAppIds.length > 0) {
    const appAdmissions = await IncubationAdmission.find(
      { application_id: { $in: incAppIds } },
      null,
      opts,
    );
    const appAdmIds = appAdmissions.map((a) => a._id);
    if (appAdmIds.length > 0) {
      await AdmissionDocument.deleteMany(
        { admission_id: { $in: appAdmIds } },
        opts,
      );
      await IncubationAdmission.deleteMany({ _id: { $in: appAdmIds } }, opts);
    }
    await ApplicationDocument.deleteMany(
      { application_id: { $in: incAppIds } },
      opts,
    );
    await ApplicationTimeline.deleteMany(
      { application_id: { $in: incAppIds } },
      opts,
    );
    await IncubationUpdate.deleteMany(
      { application_id: { $in: incAppIds } },
      opts,
    );
    await IncubationApplication.deleteMany({ _id: { $in: incAppIds } }, opts);
  }

  const incAdmissions = await IncubationAdmission.find(
    { startup_id: startupId },
    null,
    opts,
  );
  const incAdmIds = incAdmissions.map((a) => a._id);
  if (incAdmIds.length > 0) {
    await AdmissionDocument.deleteMany(
      { admission_id: { $in: incAdmIds } },
      opts,
    );
    await IncubationAdmission.deleteMany({ _id: { $in: incAdmIds } }, opts);
  }
};

const deleteUserDependencies = async (userId, session = null) => {
  if (!userId) return;

  const opts = session ? { session } : {};

  const incProfiles = await IncubatorProfile.find(
    { user_id: userId },
    null,
    opts,
  );
  const incProfileIds = incProfiles.map((p) => p._id);

  // 1. Delete Profiles
  await StudentProfile.deleteMany({ user_id: userId }, opts);
  await MentorProfile.deleteMany({ user_id: userId }, opts);
  await InvestorProfile.deleteMany({ user_id: userId }, opts);
  await IncubatorProfile.deleteMany({ user_id: userId }, opts);
  await CompanyProfile.deleteMany({ user_id: userId }, opts);

  // 2. Delete Auth & Meta
  await EmailVerification.deleteMany({ userId: userId }, opts);
  await PasswordReset.deleteMany({ user_id: userId }, opts);
  await ActivityLog.deleteMany({ user_id: userId }, opts);
  await Notification.deleteMany({ recipient_id: userId }, opts);

  // 3. Delete Mentor Relations (as mentor or student)
  await MentorRequest.deleteMany(
    {
      $or: [{ mentor_id: userId }, { student_id: userId }],
    },
    opts,
  );
  await MentorAssignment.deleteMany(
    {
      $or: [{ mentor_id: userId }, { student_id: userId }],
    },
    opts,
  );

  const mentorMeetings = await MentorMeeting.find(
    {
      $or: [{ mentor_id: userId }, { student_id: userId }],
    },
    null,
    opts,
  );
  const mentorMeetingIds = mentorMeetings.map((m) => m._id);
  if (mentorMeetingIds.length > 0) {
    await MeetingNotes.deleteMany(
      { meeting_id: { $in: mentorMeetingIds } },
      opts,
    );
    await MentorMeeting.deleteMany({ _id: { $in: mentorMeetingIds } }, opts);
  }

  await MentorReview.deleteMany(
    {
      $or: [{ mentor_id: userId }, { student_id: userId }],
    },
    opts,
  );

  // 4. Delete Chapter Change Requests
  await ChapterChangeRequest.deleteMany({ student_id: userId }, opts);

  // 5. Delete ChatRooms & Messages where user is participant
  const chatRooms = await ChatRoom.find(
    {
      $or: [{ mentor_id: userId }, { student_id: userId }],
    },
    null,
    opts,
  );
  const chatRoomIds = chatRooms.map((c) => c._id);
  if (chatRoomIds.length > 0) {
    await Message.deleteMany({ chat_id: { $in: chatRoomIds } }, opts);
    await ChatRoom.deleteMany({ _id: { $in: chatRoomIds } }, opts);
  }

  // 6. If Admin/Reviewer, delete their assigned meetings and reviews
  await Meeting.deleteMany({ reviewer_id: userId }, opts);
  await Review.deleteMany({ reviewer_id: userId }, opts);

  // 7. Delete Investor Ecosystem (Direct refs)
  await InvestorWatchlist.deleteMany({ investor_id: userId }, opts);
  await InvestorNote.deleteMany({ investor_id: userId }, opts);
  await PitchView.deleteMany({ investor_id: userId }, opts);

  const pitchSubmissions = await PitchSubmission.find(
    { investor_id: userId },
    null,
    opts,
  );
  const pitchSubmissionIds = pitchSubmissions.map((p) => p._id);
  if (pitchSubmissionIds.length > 0) {
    await PitchDocument.deleteMany({ submission_id: { $in: pitchSubmissionIds } }, opts);
    await PitchSubmission.deleteMany({ _id: { $in: pitchSubmissionIds } }, opts);
  }

  // 8. Delete Investor/Founder Chat Rooms
  const invChatRooms = await InvestorChatRoom.find(
    {
      $or: [{ investor_id: userId }, { founder_id: userId }],
    },
    null,
    opts,
  );
  const invChatRoomIds = invChatRooms.map((c) => c._id);
  if (invChatRoomIds.length > 0) {
    await InvestorMessage.deleteMany(
      { chat_id: { $in: invChatRoomIds } },
      opts,
    );
    await InvestorChatRoom.deleteMany({ _id: { $in: invChatRoomIds } }, opts);
  }

  // 9. Delete Company Ecosystem (Opportunities & deeply nested Applications)
  const opportunities = await Opportunity.find(
    { company_id: userId },
    null,
    opts,
  );
  const oppIds = opportunities.map((o) => o._id);
  if (oppIds.length > 0) {
    const oppApplications = await Application.find(
      {
        opportunity_id: { $in: oppIds },
      },
      null,
      opts,
    );
    const oppAppIds = oppApplications.map((a) => a._id);

    if (oppAppIds.length > 0) {
      await ApplicantStatus.deleteMany(
        { application_id: { $in: oppAppIds } },
        opts,
      );
      await ApplicationInterview.deleteMany(
        {
          application_id: { $in: oppAppIds },
        },
        opts,
      );
      await RecruiterNote.deleteMany(
        { application_id: { $in: oppAppIds } },
        opts,
      );
      await Application.deleteMany({ _id: { $in: oppAppIds } }, opts);
    }
    await Opportunity.deleteMany({ _id: { $in: oppIds } }, opts);
  }

  // 10. Delete Student Ecosystem (Applications & deeply nested statuses)
  const studentApplications = await Application.find(
    { student_id: userId },
    null,
    opts,
  );
  const studentAppIds = studentApplications.map((a) => a._id);
  if (studentAppIds.length > 0) {
    await ApplicantStatus.deleteMany(
      {
        application_id: { $in: studentAppIds },
      },
      opts,
    );
    await ApplicationInterview.deleteMany(
      {
        application_id: { $in: studentAppIds },
      },
      opts,
    );
    await RecruiterNote.deleteMany(
      { application_id: { $in: studentAppIds } },
      opts,
    );
    await Application.deleteMany({ _id: { $in: studentAppIds } }, opts);
  }

  // 11. RecruiterNotes authored by this user
  await RecruiterNote.deleteMany({ recruiter_id: userId }, opts);

  // 12. If Student, find their Startups and trigger cascade
  const Startup = mongoose.model("Startup"); // dynamically retrieve
  const startups = await Startup.find({ student_id: userId }, null, opts);
  for (const startup of startups) {
    await deleteStartupDependencies(startup._id, session);
    await Startup.deleteOne({ _id: startup._id }, opts);
  }

  // 13. Delete Incubation Ecosystem (Applications, Admissions, Updates where User is Student or Incubator)
  const incApps = await IncubationApplication.find(
    {
      $or: [{ student_id: userId }, { incubator_id: { $in: incProfileIds } }],
    },
    null,
    opts,
  );
  const incAppIds = incApps.map((a) => a._id);
  if (incAppIds.length > 0) {
    const appAdmissions = await IncubationAdmission.find(
      { application_id: { $in: incAppIds } },
      null,
      opts,
    );
    const appAdmIds = appAdmissions.map((a) => a._id);
    if (appAdmIds.length > 0) {
      await AdmissionDocument.deleteMany(
        { admission_id: { $in: appAdmIds } },
        opts,
      );
      await IncubationAdmission.deleteMany({ _id: { $in: appAdmIds } }, opts);
    }
    await ApplicationDocument.deleteMany(
      { application_id: { $in: incAppIds } },
      opts,
    );
    await ApplicationTimeline.deleteMany(
      { application_id: { $in: incAppIds } },
      opts,
    );
    await IncubationUpdate.deleteMany(
      { application_id: { $in: incAppIds } },
      opts,
    );
    await IncubationApplication.deleteMany({ _id: { $in: incAppIds } }, opts);
  }

  const incAdmissions = await IncubationAdmission.find(
    {
      $or: [{ student_id: userId }, { incubator_id: { $in: incProfileIds } }],
    },
    null,
    opts,
  );
  const incAdmIds = incAdmissions.map((a) => a._id);
  if (incAdmIds.length > 0) {
    await AdmissionDocument.deleteMany(
      { admission_id: { $in: incAdmIds } },
      opts,
    );
    await IncubationAdmission.deleteMany({ _id: { $in: incAdmIds } }, opts);
  }

  await IncubationUpdate.deleteMany(
    { incubator_id: { $in: incProfileIds } },
    opts,
  );
  await IncubationAdmission.updateMany(
    { assigned_mentor: userId },
    { $unset: { assigned_mentor: "" } },
    opts,
  );
  await ApplicationTimeline.updateMany(
    { updated_by: userId },
    { $unset: { updated_by: "" } },
    opts,
  );
};

/**
 * Cascade delete an Opportunity and its dependent Applications and sub-documents.
 */
const deleteOpportunityDependencies = async (opportunityId, session = null) => {
  const opts = session ? { session } : {};
  const oppApplications = await Application.find(
    { opportunity_id: opportunityId },
    null,
    opts,
  );
  const oppAppIds = oppApplications.map((a) => a._id);

  if (oppAppIds.length > 0) {
    await ApplicantStatus.deleteMany(
      { application_id: { $in: oppAppIds } },
      opts,
    );
    await ApplicationInterview.deleteMany(
      { application_id: { $in: oppAppIds } },
      opts,
    );
    await RecruiterNote.deleteMany(
      { application_id: { $in: oppAppIds } },
      opts,
    );
    await Application.deleteMany({ _id: { $in: oppAppIds } }, opts);
  }
  await Opportunity.deleteOne({ _id: opportunityId }, opts);
};

module.exports = {
  deleteUserDependencies,
  deleteStartupDependencies,
  deleteOpportunityDependencies,
};
