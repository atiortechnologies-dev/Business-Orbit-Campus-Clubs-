/**
 * @file test_meetingController.js
 * @description Standalone test script for verifying mentor meeting scheduling logic.
 * @architecture Uses mocked models to test controller behavior in isolation without a real database connection.
 */

const assert = require("assert");

// 1. Mock dependencies
const mockAssignmentModel = {
  findOne: async (query) => {
    if (
      query.mentor_id === "mentor123" &&
      query.startup_id === "startup123" &&
      query.status === "active"
    ) {
      return { _id: "assign123" };
    }
    return null;
  },
};

const mockMeetingModel = {
  create: async (data) => {
    return { _id: "meeting123", ...data };
  },
};

// 2. Inline controller logic (simulated with mocks)
async function scheduleMeetingLogic(req, res) {
  const mentorId = req.user._id;
  const { studentId, startupId, date, time, platform, meetingLink } = req.body;

  if (!studentId || !startupId || !date || !time || !platform || !meetingLink) {
    return res
      .status(400)
      .json({ message: "All meeting details are required." });
  }

  const assignment = await mockAssignmentModel.findOne({
    mentor_id: mentorId,
    startup_id: startupId,
    status: "active",
  });
  if (!assignment) {
    return res.status(403).json({
      message: "Unauthorized: You are not actively assigned to this startup.",
    });
  }

  const meeting = await mockMeetingModel.create({
    mentor_id: mentorId,
    student_id: studentId,
    startup_id: startupId,
    date,
    time,
    platform,
    meeting_link: meetingLink,
    status: "scheduled",
  });

  res.status(201).json({ message: "Meeting scheduled successfully", meeting });
}

// 3. Mock req/res
function mockReq(body = {}, user = {}) {
  return { body, user };
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
  console.log("Running scheduleMeeting tests...\n");

  // Test: Success Case
  const req = mockReq(
    {
      studentId: "student123",
      startupId: "startup123",
      date: new Date(),
      time: "10:00 AM",
      platform: "Google Meet",
      meetingLink: "https://meet.google.com/abc",
    },
    { _id: "mentor123" },
  );

  const res = mockRes();
  await scheduleMeetingLogic(req, res);
  assert.strictEqual(res.statusCode, 201, "Expected 201 Created");
  assert.strictEqual(
    res.body.message,
    "Meeting scheduled successfully",
    "Expected success message",
  );
  console.log("✅ Success case passed");

  // Test: Missing Fields
  const reqMissing = mockReq({ startupId: "startup123" }, { _id: "mentor123" });
  const resMissing = mockRes();
  await scheduleMeetingLogic(reqMissing, resMissing);
  assert.strictEqual(resMissing.statusCode, 400, "Expected 400 Bad Request");
  console.log("✅ Missing fields case passed");

  // Test: Unauthorized
  const reqUnauth = mockReq(
    {
      studentId: "student123",
      startupId: "invalid_startup",
      date: new Date(),
      time: "10:00 AM",
      platform: "Google Meet",
      meetingLink: "https://meet.google.com/abc",
    },
    { _id: "mentor123" },
  );

  const resUnauth = mockRes();
  await scheduleMeetingLogic(reqUnauth, resUnauth);
  assert.strictEqual(resUnauth.statusCode, 403, "Expected 403 Forbidden");
  console.log("✅ Unauthorized assignment case passed");

  console.log("\n✅ All tests passed");
}

runTests().catch((err) => {
  console.error("❌ Test failed:", err.message);
  process.exit(1);
});
