const request = require("supertest");
const { app, server } = require("../server");
const mongoose = require("mongoose");
const User = require("../models/User");
const Startup = require("../models/Startup");
const StudentProfile = require("../models/StudentProfile");
const StartupStage = require("../models/StartupStage");
const StageSubmission = require("../models/StageSubmission");
const ChatRoom = require("../models/ChatRoom");
const Message = require("../models/Message");

describe("Cascading Deletions Integration Test", () => {
  let studentUser;
  let mentorUser;
  let startup;
  let chatRoom;

  beforeAll(async () => {
    // Note: Setup handles the DB connection in test mode
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
    server.close();
  });

  beforeEach(async () => {
    // Clear collections
    await User.deleteMany({});
    await Startup.deleteMany({});
    await StudentProfile.deleteMany({});
    await StartupStage.deleteMany({});
    await StageSubmission.deleteMany({});
    await ChatRoom.deleteMany({});
    await Message.deleteMany({});

    // Seed test data
    studentUser = await User.create({
      full_name: "Test Student",
      email: "student@test.com",
      password_hash: "hashedpass",
      role: "student",
      account_status: "active",
      email_verified: true,
    });

    await StudentProfile.create({
      user_id: studentUser._id,
      college: "Test College",
      degree: "BTech",
      graduation_year: 2026,
    });

    mentorUser = await User.create({
      full_name: "Test Mentor",
      email: "mentor@test.com",
      password_hash: "hashedpass",
      role: "mentor",
      account_status: "active",
      email_verified: true,
    });

    startup = await Startup.create({
      student_id: studentUser._id,
      startup_name: "Test Startup",
      current_stage: 1,
    });

    await StartupStage.create({
      startup_id: startup._id,
      stage_number: 1,
      stage_name: "Idea Validation",
      status: "active",
    });

    await StageSubmission.create({
      startup_id: startup._id,
      stage_id: startup._id, // mock ID for stage
      title: "Draft Idea",
      description: "My brilliant idea",
      status: "draft",
    });

    chatRoom = await ChatRoom.create({
      student_id: studentUser._id,
      mentor_id: mentorUser._id,
      startup_id: startup._id,
    });

    await Message.create({
      chat_id: chatRoom._id,
      sender_id: studentUser._id,
      message: "Hello Mentor!",
    });
  });

  it("should cascade delete all dependencies when a User is deleted", async () => {
    // Delete the user
    await User.findByIdAndDelete(studentUser._id);

    // Assertions
    const foundUser = await User.findById(studentUser._id);
    expect(foundUser).toBeNull();

    const foundProfile = await StudentProfile.findOne({
      user_id: studentUser._id,
    });
    expect(foundProfile).toBeNull();

    const foundStartup = await Startup.findOne({ student_id: studentUser._id });
    expect(foundStartup).toBeNull();

    // The startup dependencies should also be cascading deleted!
    const foundStage = await StartupStage.findOne({ startup_id: startup._id });
    expect(foundStage).toBeNull();

    const foundSubmission = await StageSubmission.findOne({
      startup_id: startup._id,
    });
    expect(foundSubmission).toBeNull();

    const foundChatRoom = await ChatRoom.findOne({
      student_id: studentUser._id,
    });
    expect(foundChatRoom).toBeNull();

    const foundMessage = await Message.findOne({ chat_id: chatRoom._id });
    expect(foundMessage).toBeNull();
  });
});
