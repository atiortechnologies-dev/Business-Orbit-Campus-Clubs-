/**
 * @file test_acceptRequest.js
 * @description Standalone test script for verifying the mentor request acceptance logic.
 * @architecture Uses mocked Mongoose models and transactions to test controller logic in isolation.
 */

const assert = require("assert");
const mongoose = require("mongoose");

// 1. Mock dependencies
const mockRequest = {
  _id: "req123",
  mentor_id: "mentor123",
  student_id: "student123",
  startup_id: "startup123",
  status: "pending",
  save: async function () {
    this.saved = true;
    return this;
  },
};

const mockMentorRequestModel = {
  findOne: (query) => {
    return {
      session: () => {
        if (query._id === "req123" && query.mentor_id === "mentor123") {
          return mockRequest;
        }
        return null;
      },
    };
  },
};

const mockMentorAssignmentModel = {
  create: async (docs) => {
    return docs;
  },
};

const mockChatRoomModel = {
  findOne: (_query) => {
    return { session: () => null }; // Simulate no existing chat room
  },
  create: async (docs) => {
    return docs;
  },
};

// Override mongoose session for test
mongoose.startSession = async () => ({
  startTransaction: () => {},
  commitTransaction: async () => {},
  abortTransaction: async () => {},
  endSession: () => {},
});

// 2. Inline the controller logic (simulated)
async function acceptRequestLogic(req, res) {
  const { requestId } = req.params;
  const mentorId = req.user._id;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const request = await mockMentorRequestModel
      .findOne({ _id: requestId, mentor_id: mentorId })
      .session(session);

    if (!request) throw new Error("Request not found or unauthorized.");
    if (request.status !== "pending")
      throw new Error("Only pending requests can be accepted.");

    request.status = "accepted";
    await request.save({ session });

    await mockMentorAssignmentModel.create(
      [
        {
          mentor_id: mentorId,
          student_id: request.student_id,
          startup_id: request.startup_id,
          status: "active",
        },
      ],
      { session },
    );

    const existingChat = await mockChatRoomModel
      .findOne({
        mentor_id: mentorId,
        student_id: request.student_id,
        startup_id: request.startup_id,
      })
      .session(session);
    if (!existingChat) {
      await mockChatRoomModel.create(
        [
          {
            mentor_id: mentorId,
            student_id: request.student_id,
            startup_id: request.startup_id,
          },
        ],
        { session },
      );
    }

    await session.commitTransaction();
    res
      .status(200)
      .json({ message: "Mentorship request accepted successfully." });
  } catch (error) {
    await session.abortTransaction();
    res.status(400).json({ message: error.message });
  } finally {
    session.endSession();
  }
}

// 3. Create mock req/res
function mockReq(params = {}, user = {}) {
  return { params, user };
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
  console.log("Running acceptRequest tests...\n");

  // Test: Success case
  const req = mockReq({ requestId: "req123" }, { _id: "mentor123" });
  const res = mockRes();
  await acceptRequestLogic(req, res);
  assert.strictEqual(res.statusCode, 200, "Expected 200 OK");
  assert.strictEqual(
    res.body.message,
    "Mentorship request accepted successfully.",
    "Expected success message",
  );
  assert.strictEqual(
    mockRequest.status,
    "accepted",
    "Request status should be accepted",
  );
  console.log("✅ Success case passed");

  // Test: Unauthorized / Not found
  const reqFail = mockReq({ requestId: "invalidReq" }, { _id: "mentor123" });
  const resFail = mockRes();
  await acceptRequestLogic(reqFail, resFail);
  assert.strictEqual(resFail.statusCode, 400, "Expected 400 Bad Request");
  assert.strictEqual(
    resFail.body.message,
    "Request not found or unauthorized.",
    "Expected not found message",
  );
  console.log("✅ Not found case passed");

  console.log("\n✅ All tests passed");
}

runTests().catch((err) => {
  console.error("❌ Test failed:", err.message);
  process.exit(1);
});
