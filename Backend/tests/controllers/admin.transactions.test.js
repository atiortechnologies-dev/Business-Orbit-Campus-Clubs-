const mongoose = require("mongoose");
const request = require("supertest");
const express = require("express");
require("../setup"); // Handles DB connection
const User = require("../../models/User");
const Startup = require("../../models/Startup");
const MentorMeeting = require("../../models/MentorMeeting");
const MeetingNotes = require("../../models/MeetingNotes");
const MentorReview = require("../../models/MentorReview");
const cascadeService = require("../../services/cascadeService");
const adminRoutes = require("../../routes/admin.routes");

// Setup Express App
const app = express();
app.use(express.json());
process.env.ADMIN_API_KEY = "DUMMY_SECRET_FOR_TESTING_ONLY";
app.use("/api/admin", adminRoutes);

describe("Admin Transactional User Deletion", () => {
  let studentUser;
  let startup;
  let mentorMeeting;
  let meetingNotes;
  let mentorReview;

  beforeAll(async () => {
    // DB connection is handled by setup.js
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Startup.deleteMany({});
    await MentorMeeting.deleteMany({});
    await MeetingNotes.deleteMany({});
    await MentorReview.deleteMany({});

    studentUser = await User.create({
      full_name: "Test Student Cascade",
      email: "student_cascade@test.com",
      password_hash: "hashedpass",
      role: "student",
      account_status: "active",
      email_verified: true,
    });

    startup = await Startup.create({
      student_id: studentUser._id,
      startup_name: "Test Cascade Startup",
      current_stage: 1,
    });

    const mentorId = new mongoose.Types.ObjectId();

    mentorMeeting = await MentorMeeting.create({
      student_id: studentUser._id,
      mentor_id: mentorId,
      startup_id: startup._id,
      meeting_title: "Initial Pitch",
      date: new Date().toISOString().split("T")[0],
      time: "10:00 AM",
      platform: "zoom",
      meeting_link: "https://zoom.us/j/123",
      scheduled_at: new Date(),
      status: "completed",
    });

    meetingNotes = await MeetingNotes.create({
      meeting_id: mentorMeeting._id,
      mentor_id: mentorId,
      student_id: studentUser._id,
      mentor_notes: "Great idea",
    });

    mentorReview = await MentorReview.create({
      student_id: studentUser._id,
      mentor_id: mentorId,
      meeting_id: mentorMeeting._id,
      rating: 5,
      review: "Excellent student",
    });
  });

  it("should securely delete user and all dependencies in a transaction", async () => {
    const res = await request(app)
      .delete(`/api/admin/users/${studentUser._id}`)
      .set("x-api-key", "DUMMY_SECRET_FOR_TESTING_ONLY");

    expect(res.statusCode).toEqual(200);

    // Assert User deleted
    expect(await User.findById(studentUser._id)).toBeNull();
    // Assert Dependencies deleted
    expect(await Startup.findById(startup._id)).toBeNull();
    expect(await MentorMeeting.findById(mentorMeeting._id)).toBeNull();
    expect(await MeetingNotes.findById(meetingNotes._id)).toBeNull();
    expect(await MentorReview.findById(mentorReview._id)).toBeNull();
  });

  it("should rollback completely if cascade deletion fails", async () => {
    // Spy on cascadeService and mock it to throw an error
    jest
      .spyOn(cascadeService, "deleteUserDependencies")
      .mockImplementationOnce(() => {
        throw new Error("Simulated database failure");
      });

    const res = await request(app)
      .delete(`/api/admin/users/${studentUser._id}`)
      .set("x-api-key", "DUMMY_SECRET_FOR_TESTING_ONLY");

    expect(res.statusCode).toEqual(500); // Because next(error) will eventually return 500

    // Assert User NOT deleted (rollback successful)
    expect(await User.findById(studentUser._id)).not.toBeNull();
    // Assert Dependencies NOT deleted (rollback successful)
    expect(await Startup.findById(startup._id)).not.toBeNull();
    expect(await MentorMeeting.findById(mentorMeeting._id)).not.toBeNull();
    expect(await MeetingNotes.findById(meetingNotes._id)).not.toBeNull();
    expect(await MentorReview.findById(mentorReview._id)).not.toBeNull();

    cascadeService.deleteUserDependencies.mockRestore();
  });
});
