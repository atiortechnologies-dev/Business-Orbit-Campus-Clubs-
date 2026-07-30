/**
 * @file test_models_standalone.js
 * @description Standalone test script for verifying Mongoose data model validations.
 * @architecture Loads the original Mongoose models and triggers validateSync() to ensure required fields and defaults work.
 */

const mongoose = require("mongoose");
const assert = require("assert");

const Startup = require("../models/Startup");
const MentorRequest = require("../models/MentorRequest");
const MentorAssignment = require("../models/MentorAssignment");
const ChatRoom = require("../models/ChatRoom");
const Message = require("../models/Message");
const MentorMeeting = require("../models/MentorMeeting");

console.log("Running Phase 1 Verification Tests...\n");

try {
  // Test 1: Startup
  const startup = new Startup({
    name: "TechNova",
    stage: "Seed",
    category: "EdTech",
    idea: "AI Learning Platform",
  });
  let err = startup.validateSync();
  assert.strictEqual(err, undefined, "Startup should have all required fields");

  const badStartup = new Startup({ name: "TechNova" });
  err = badStartup.validateSync();
  assert.notStrictEqual(err, undefined, "Startup should fail if missing stage");
  console.log("✅ Startup model validation passed.");

  // Test 2: MentorRequest
  const req = new MentorRequest({
    mentor_id: new mongoose.Types.ObjectId(),
    student_id: new mongoose.Types.ObjectId(),
    startup_id: new mongoose.Types.ObjectId(),
    problem_statement: "Need help scaling",
    help_required: "Need help scaling",
    preferred_time: "Now",
  });
  err = req.validateSync();
  assert.strictEqual(err, undefined, "MentorRequest should validate");
  assert.strictEqual(req.status, "pending");
  console.log("✅ MentorRequest model validation passed.");

  // Test 3: MentorAssignment
  const assignment = new MentorAssignment({
    mentor_id: new mongoose.Types.ObjectId(),
    student_id: new mongoose.Types.ObjectId(),
    startup_id: new mongoose.Types.ObjectId(),
  });
  err = assignment.validateSync();
  assert.strictEqual(err, undefined, "MentorAssignment should validate");
  assert.strictEqual(assignment.status, "active");
  console.log("✅ MentorAssignment model validation passed.");

  // Test 4: ChatRoom
  const room = new ChatRoom({
    mentor_id: new mongoose.Types.ObjectId(),
    student_id: new mongoose.Types.ObjectId(),
    startup_id: new mongoose.Types.ObjectId(),
  });
  err = room.validateSync();
  assert.strictEqual(err, undefined, "ChatRoom should validate");
  console.log("✅ ChatRoom model validation passed.");

  // Test 5: Message
  const msg = new Message({
    chat_id: new mongoose.Types.ObjectId(),
    sender_id: new mongoose.Types.ObjectId(),
    message: "Hello!",
  });
  err = msg.validateSync();
  assert.strictEqual(err, undefined, "Message should validate");
  assert.strictEqual(msg.read_at, null);
  console.log("✅ Message model validation passed.");

  // Test 6: MentorMeeting
  const meeting = new MentorMeeting({
    mentor_id: new mongoose.Types.ObjectId(),
    student_id: new mongoose.Types.ObjectId(),
    startup_id: new mongoose.Types.ObjectId(),
    date: new Date(),
    time: "10:00 AM",
    platform: "Google Meet",
    meeting_link: "https://meet.google.com/abc",
  });
  err = meeting.validateSync();
  assert.strictEqual(err, undefined, "MentorMeeting should validate");
  assert.strictEqual(meeting.status, "scheduled");
  console.log("✅ MentorMeeting model validation passed.");

  console.log("\n✅ All Phase 1 tests passed.");
} catch (error) {
  console.error("❌ Test failed:", error.message);
  process.exit(1);
}
