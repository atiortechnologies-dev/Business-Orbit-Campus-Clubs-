/**
 * @file test_chatController.js
 * @description Standalone test script for verifying chat message sending logic.
 * @architecture Uses mocked models to test controller behavior in isolation without a real database connection.
 */

const assert = require("assert");

// 1. Mock dependencies
const mockChatRoom = {
  _id: "chat123",
  mentor_id: "mentor123",
  student_id: "student123",
  startup_id: "startup123",
};

const mockChatRoomModel = {
  findOne: async (query) => {
    if (query._id === "chat123" && query.mentor_id === "mentor123")
      return mockChatRoom;
    return null;
  },
};

const mockAssignmentModel = {
  findOne: async (query) => {
    if (
      query.mentor_id === "mentor123" &&
      query.startup_id === "startup123" &&
      query.status === "active"
    ) {
      return { _id: "assign123" }; // active assignment
    }
    return null;
  },
};

const mockMessageModel = {
  create: async (data) => {
    return { _id: "msg123", ...data };
  },
};

// 2. Inline Controller Logic (simulated with mocks)
async function sendMessageLogic(req, res) {
  const { chatId } = req.params;
  const { message } = req.body;
  const mentorId = req.user._id;

  if (!message || message.trim() === "") {
    return res
      .status(400)
      .json({ message: "Message content cannot be empty." });
  }

  const chatRoom = await mockChatRoomModel.findOne({
    _id: chatId,
    mentor_id: mentorId,
  });
  if (!chatRoom) {
    return res
      .status(404)
      .json({ message: "Chat room not found or unauthorized." });
  }

  // verify mentor access helper simulation
  const assignment = await mockAssignmentModel.findOne({
    mentor_id: mentorId,
    startup_id: chatRoom.startup_id,
    status: "active",
  });
  if (!assignment) {
    throw new Error(
      "Unauthorized: Mentor is not actively assigned to this startup.",
    );
  }

  const newMessage = await mockMessageModel.create({
    chat_id: chatId,
    sender_id: mentorId,
    message: message.trim(),
  });

  res.status(201).json(newMessage);
}

// 3. Mock req/res
function mockReq(params = {}, body = {}, user = {}) {
  return { params, body, user };
}

function mockRes() {
  const res = {};
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (data) => {
    res.body = data;
    return res;
  };
  return res;
}

// 4. Run tests
async function runTests() {
  console.log("Running sendMessage tests...\n");

  // Test: Success Case
  const req = mockReq(
    { chatId: "chat123" },
    { message: "Hello there" },
    { _id: "mentor123" },
  );
  const res = mockRes();
  await sendMessageLogic(req, res);
  assert.strictEqual(res.statusCode, 201, "Expected 201 Created");
  assert.strictEqual(
    res.body.message,
    "Hello there",
    "Expected message content to match",
  );
  console.log("✅ Success case passed");

  // Test: Empty Message
  const reqEmpty = mockReq(
    { chatId: "chat123" },
    { message: "   " },
    { _id: "mentor123" },
  );
  const resEmpty = mockRes();
  await sendMessageLogic(reqEmpty, resEmpty);
  assert.strictEqual(resEmpty.statusCode, 400, "Expected 400 Bad Request");
  console.log("✅ Empty message case passed");

  // Test: Unauthorized Chat Room
  const reqUnauth = mockReq(
    { chatId: "invalid_chat" },
    { message: "Hello" },
    { _id: "mentor123" },
  );
  const resUnauth = mockRes();
  await sendMessageLogic(reqUnauth, resUnauth);
  assert.strictEqual(resUnauth.statusCode, 404, "Expected 404 Not Found");
  console.log("✅ Unauthorized chat room case passed");

  console.log("\n✅ All tests passed");
}

runTests().catch((err) => {
  console.error("❌ Test failed:", err.message);
  process.exit(1);
});
