const mongoose = require("mongoose");
const request = require("supertest");
const express = require("express");
require("../setup"); // Handles DB connection
const User = require("../../models/User");
const ChatRoom = require("../../models/ChatRoom");
const Message = require("../../models/Message");
const Notification = require("../../models/Notification");
const chatRoutes = require("../../routes/chat.routes");
const MentorAssignment = require("../../models/MentorAssignment");
const { generateToken } = require("../../utils/token");

// Create test app
const app = express();
app.use(express.json());
app.use("/api/chat", chatRoutes);

describe("Chat Message Transactions", () => {
  let studentUser;
  let mentorUser;
  let chatRoom;

  beforeAll(async () => {
    // DB connection is handled by setup.js
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await ChatRoom.deleteMany({});
    await Message.deleteMany({});
    await Notification.deleteMany({});
    await MentorAssignment.deleteMany({});

    studentUser = await User.create({
      full_name: "Test Student",
      email: "student_chat@test.com",
      password_hash: "hashed",
      role: "student",
      account_status: "active",
    });

    mentorUser = await User.create({
      full_name: "Test Mentor",
      email: "mentor_chat@test.com",
      password_hash: "hashed",
      role: "mentor",
      account_status: "active",
    });

    const startupId = new mongoose.Types.ObjectId();

    await MentorAssignment.create({
      mentor_id: mentorUser._id,
      student_id: studentUser._id,
      startup_id: startupId,
      status: "active",
    });

    chatRoom = await ChatRoom.create({
      student_id: studentUser._id,
      mentor_id: mentorUser._id,
      startup_id: startupId,
    });
  });

  it("should securely create message and notification in a transaction", async () => {
    const res = await request(app)
      .post(`/api/chat/send/${chatRoom._id}`)
      .set("Authorization", `Bearer ${generateToken(studentUser)}`)
      .send({ message: "Hello from transaction test" });

    expect(res.statusCode).toEqual(201);

    const message = await Message.findOne({ chat_id: chatRoom._id });
    expect(message).not.toBeNull();
    expect(message.message).toBe("Hello from transaction test");

    const notification = await Notification.findOne({
      recipient_id: mentorUser._id,
    });
    expect(notification).not.toBeNull();
    expect(notification.title).toBe("New Chat Message");
  });

  it("should rollback completely if notification creation fails", async () => {
    // Mock Notification.create to throw an error
    jest.spyOn(Notification, "create").mockImplementationOnce(() => {
      throw new Error("Simulated Notification Failure");
    });

    const res = await request(app)
      .post(`/api/chat/send/${chatRoom._id}`)
      .set("Authorization", `Bearer ${generateToken(studentUser)}`)
      .send({ message: "This message should be rolled back" });

    expect(res.statusCode).toEqual(500);

    // Verify rollback
    const message = await Message.findOne({
      chat_id: chatRoom._id,
      message: "This message should be rolled back",
    });
    expect(message).toBeNull(); // Must be fully rolled back

    const notification = await Notification.findOne({
      recipient_id: mentorUser._id,
    });
    expect(notification).toBeNull();

    Notification.create.mockRestore();
  });
});
