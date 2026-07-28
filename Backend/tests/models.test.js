/**
 * @file models.test.js
 * @description Unit tests for Mongoose data models and schema validations.
 * @architecture Ensures database constraints and default values behave as expected without hitting the database.
 */

const mongoose = require("mongoose");
const Startup = require("../models/Startup");
const MentorRequest = require("../models/MentorRequest");
const MentorAssignment = require("../models/MentorAssignment");
const ChatRoom = require("../models/ChatRoom");
const Message = require("../models/Message");
const MentorMeeting = require("../models/MentorMeeting");

describe("Phase 1: Database Models Verification", () => {
  it("Startup model should have all required fields", () => {
    const startup = new Startup({
      startup_name: "TechNova",
      student_id: new mongoose.Types.ObjectId(),
      category: "EdTech",
      idea: "AI Learning Platform",
    });
    const err = startup.validateSync();
    expect(err).toBeUndefined();
  });

  it("Startup model should fail validation if required fields are missing", () => {
    const startup = new Startup({ category: "EdTech" });
    const err = startup.validateSync();
    expect(err).toBeDefined();
    expect(err.errors.startup_name).toBeDefined();
    expect(err.errors.student_id).toBeDefined();
  });

  it("MentorRequest model should have correct refs and validation", () => {
    const req = new MentorRequest({
      mentor_id: new mongoose.Types.ObjectId(),
      student_id: new mongoose.Types.ObjectId(),
      startup_id: new mongoose.Types.ObjectId(),
      problem_statement: "Need help scaling",
      help_required: "Need help scaling",
      preferred_time: "Now",
    });
    const err = req.validateSync();
    expect(err).toBeUndefined();
    expect(req.status).toBe("pending"); // default value
  });

  it("MentorAssignment model should have correct defaults", () => {
    const assignment = new MentorAssignment({
      mentor_id: new mongoose.Types.ObjectId(),
      student_id: new mongoose.Types.ObjectId(),
      startup_id: new mongoose.Types.ObjectId(),
    });
    const err = assignment.validateSync();
    expect(err).toBeUndefined();
    expect(assignment.status).toBe("active"); // default value
  });

  it("ChatRoom model should validate refs", () => {
    const room = new ChatRoom({
      mentor_id: new mongoose.Types.ObjectId(),
      student_id: new mongoose.Types.ObjectId(),
      startup_id: new mongoose.Types.ObjectId(),
    });
    const err = room.validateSync();
    expect(err).toBeUndefined();
  });

  it("Message model should have correct defaults", () => {
    const msg = new Message({
      chat_id: new mongoose.Types.ObjectId(),
      sender_id: new mongoose.Types.ObjectId(),
      message: "Hello!",
    });
    const err = msg.validateSync();
    expect(err).toBeUndefined();
    expect(msg.read_at).toBe(null); // default value
  });

  it("MentorMeeting model should require meeting specifics", () => {
    const meeting = new MentorMeeting({
      mentor_id: new mongoose.Types.ObjectId(),
      student_id: new mongoose.Types.ObjectId(),
      startup_id: new mongoose.Types.ObjectId(),
      date: new Date(),
      time: "10:00 AM",
      platform: "Google Meet",
      meeting_link: "https://meet.google.com/abc",
    });
    const err = meeting.validateSync();
    expect(err).toBeUndefined();
    expect(meeting.status).toBe("scheduled"); // default value
  });
});
