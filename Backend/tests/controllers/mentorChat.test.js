/**
 * @file mentorChat.test.js
 * @description Integration and unit tests for the mentor chat controller.
 * @architecture Validates the chat controller's interaction with Mongoose models and request/response lifecycle.
 */

const mongoose = require("mongoose");
const {
  getChatRooms,
  sendMessage,
  markMessagesRead,
} = require("../../controllers/mentorChat.controller");
const ChatRoom = require("../../models/ChatRoom");
const Message = require("../../models/Message");
const User = require("../../models/User");
const MentorAssignment = require("../../models/MentorAssignment");
const Startup = require("../../models/Startup");

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Mentor Chat Controller", () => {
  afterAll(async () => {
    await mongoose.connection.close();
  });
  afterEach(async () => {
    await User.deleteMany({});
    await Startup.deleteMany({});
    await ChatRoom.deleteMany({});
    await Message.deleteMany({});
    await MentorAssignment.deleteMany({});
  });
  let mentorId, studentId, startupId, chatRoomId;

  beforeEach(async () => {
    mentorId = new mongoose.Types.ObjectId();
    studentId = new mongoose.Types.ObjectId();
    startupId = new mongoose.Types.ObjectId();

    await User.create({
      _id: studentId,
      full_name: "Test Student",
      email: `${studentId}@test.com`,
      password_hash: "hash",
      role: "student",
    });
    await Startup.create({
      _id: startupId,
      student_id: studentId,
      startup_name: "Test Startup",
      current_stage: 1,
      category: "AI",
      idea: "Test Idea",
    });

    const chat = await ChatRoom.create({
      mentor_id: mentorId,
      student_id: studentId,
      startup_id: startupId,
    });
    chatRoomId = chat._id;
  });

  describe("getChatRooms", () => {
    it("should retrieve all chat rooms for a mentor", async () => {
      const req = { user: { _id: mentorId } };
      const res = mockResponse();

      await getChatRooms(req, res, () => {});
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json.mock.calls[0][0].length).toBe(1);
    });
  });

  describe("sendMessage", () => {
    it("should send a message if assigned to startup", async () => {
      await MentorAssignment.create({
        mentor_id: mentorId,
        student_id: studentId,
        startup_id: startupId,
        status: "active",
      });

      const req = {
        params: { chatId: chatRoomId },
        user: { _id: mentorId },
        body: { message: "Hello there!" },
      };
      const res = mockResponse();

      await sendMessage(req, res, () => {});
      expect(res.status).toHaveBeenCalledWith(201);

      const savedMessage = await Message.findOne({ chat_id: chatRoomId });
      expect(savedMessage.message).toBe("Hello there!");
      expect(savedMessage.sender_id.toString()).toBe(mentorId.toString());
    });

    it("should fail to send if not assigned", async () => {
      const req = {
        params: { chatId: chatRoomId },
        user: { _id: mentorId },
        body: { message: "Unauthorized msg" },
      };
      const res = mockResponse();

      const next = jest.fn();
      await sendMessage(req, res, next);
      expect(next).toHaveBeenCalled();
      expect(next.mock.calls[0][0].message).toMatch(/Unauthorized/);
    });
  });

  describe("markMessagesRead", () => {
    it("should mark unread messages as read", async () => {
      await Message.create({
        chat_id: chatRoomId,
        sender_id: studentId,
        message: "Unread",
        is_read: false,
      });

      const req = {
        params: { chatId: chatRoomId },
        user: { _id: mentorId },
      };
      const res = mockResponse();

      await markMessagesRead(req, res, () => {});
      expect(res.status).toHaveBeenCalledWith(200);

      const msgs = await Message.find({ chat_id: chatRoomId });
      expect(msgs[0].is_read).toBe(true);
    });
  });
});
