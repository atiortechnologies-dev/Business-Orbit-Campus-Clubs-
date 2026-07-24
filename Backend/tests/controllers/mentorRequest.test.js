/**
 * @file mentorRequest.test.js
 * @description Integration and unit tests for the mentor request controller.
 * @architecture Validates the request acceptance/decline logic, ensuring atomic database transactions and constraints.
 */

const mongoose = require("mongoose");
const {
  acceptRequest,
  declineRequest,
} = require("../../controllers/mentorRequest.controller");
const MentorRequest = require("../../models/MentorRequest");
const MentorAssignment = require("../../models/MentorAssignment");
const ChatRoom = require("../../models/ChatRoom");

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockImplementation((code) => {
    console.log("Mock status called with:", code);
    return res;
  });
  res.json = jest.fn().mockImplementation((data) => {
    console.log("Mock json called with:", data);
    return res;
  });
  return res;
};

describe("Mentor Request Controller", () => {
  afterAll(async () => {
    await mongoose.connection.close();
  });
  let mentorId, studentId, startupId;

  beforeEach(async () => {
    mentorId = new mongoose.Types.ObjectId();
    studentId = new mongoose.Types.ObjectId();
    startupId = new mongoose.Types.ObjectId();
    await MentorRequest.createCollection();
    await MentorAssignment.createCollection();
    await ChatRoom.createCollection();
    const Notification = require("../../models/Notification");
    const ActivityLog = require("../../models/ActivityLog");
    await Notification.createCollection();
    await ActivityLog.createCollection();
  });

  describe("acceptRequest", () => {
    it("should successfully accept a request, create an assignment, and create a chat room within a transaction", async () => {
      const request = await MentorRequest.create({
        mentor_id: mentorId,
        student_id: studentId,
        startup_id: startupId,
        problem_statement: "Help me",
        help_required: "Help me",
        preferred_time: "Now",
        status: "pending",
      });

      const req = {
        params: { requestId: request._id },
        user: { _id: mentorId },
      };
      const res = mockResponse();

      const next = jest.fn((err) => {
        if (err) console.error("NEXT ERROR:", err);
      });
      await acceptRequest(req, res, next);
      if (next.mock.calls.length > 0) throw next.mock.calls[0][0];

      expect(res.status).toHaveBeenCalledWith(200);

      // Verify DB state
      const updatedReq = await MentorRequest.findById(request._id);
      expect(updatedReq.status).toBe("accepted");

      const assignment = await MentorAssignment.findOne({
        mentor_id: mentorId,
        startup_id: startupId,
      });
      expect(assignment).not.toBeNull();
      expect(assignment.status).toBe("active");

      const chat = await ChatRoom.findOne({
        mentor_id: mentorId,
        startup_id: startupId,
      });
      expect(chat).not.toBeNull();
    });

    it("should fail if request is not pending", async () => {
      const request = await MentorRequest.create({
        mentor_id: mentorId,
        student_id: studentId,
        startup_id: startupId,
        problem_statement: "Help me",
        help_required: "Help me",
        preferred_time: "Now",
        status: "declined",
      });

      const req = {
        params: { requestId: request._id },
        user: { _id: mentorId },
      };
      const res = mockResponse();

      const next = jest.fn();
      await acceptRequest(req, res, next);

      expect(next).toHaveBeenCalled();
      const errorArg = next.mock.calls[0][0];
      expect(errorArg).toBeInstanceOf(Error);
      expect(errorArg.statusCode).toBe(400);
      expect(errorArg.message).toBe("Only pending requests can be accepted.");
    });
  });

  describe("declineRequest", () => {
    it("should successfully decline a request", async () => {
      const request = await MentorRequest.create({
        mentor_id: mentorId,
        student_id: studentId,
        startup_id: startupId,
        problem_statement: "Help me",
        help_required: "Help me",
        preferred_time: "Now",
        status: "pending",
      });

      const req = {
        params: { requestId: request._id },
        user: { _id: mentorId },
      };
      const res = mockResponse();

      await declineRequest(req, res, () => {});

      expect(res.status).toHaveBeenCalledWith(200);

      const updatedReq = await MentorRequest.findById(request._id);
      expect(updatedReq.status).toBe("declined");
    });
  });
});
