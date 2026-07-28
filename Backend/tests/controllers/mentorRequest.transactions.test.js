const mongoose = require("mongoose");
const mentorRequestController = require("../../controllers/mentorRequest.controller");
const MentorRequest = require("../../models/MentorRequest");
const Notification = require("../../models/Notification");
const User = require("../../models/User");
const ActivityLog = require("../../models/ActivityLog");

describe("MentorRequest Controller - Transactions", () => {
  let mentor, student, mentorRequestObj;

  beforeAll(async () => {
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const names = collections.map((c) => c.name);

    const required = [
      "mentorrequests",
      "notifications",
      "activitylogs",
      "users",
    ];
    for (const name of required) {
      if (!names.includes(name)) {
        await db.createCollection(name);
      }
    }

    mentor = await User.create({
      full_name: "Test Mentor 2",
      email: "mentor2@example.com",
      password_hash: "password123",
      role: "mentor",
      isEmailVerified: true,
    });

    student = await User.create({
      full_name: "Test Student 2",
      email: "student2@example.com",
      password_hash: "password123",
      role: "student",
      isEmailVerified: true,
    });
  });

  beforeEach(async () => {
    mentorRequestObj = await MentorRequest.create({
      mentor_id: mentor._id,
      student_id: student._id,
      startup_id: new mongoose.Types.ObjectId(),
      problem_statement: "Need help with marketing",
      help_required: "Need help with marketing",
      preferred_time: "Now",
      status: "pending",
    });
  });

  afterAll(async () => {
    await User.deleteMany({});
    await MentorRequest.deleteMany({});
    await Notification.deleteMany({});
    await ActivityLog.deleteMany({});
  });

  it("should rollback request decline if notification save fails", async () => {
    const originalSave = Notification.prototype.save;
    Notification.prototype.save = jest
      .fn()
      .mockRejectedValue(new Error("Simulated Notification save failure"));

    const req = {
      params: { requestId: mentorRequestObj._id },
      user: { _id: mentor._id },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    // Call controller directly
    await mentorRequestController.declineRequest(req, res, next);

    // Expect next to have been called with the error
    expect(next).toHaveBeenCalled();
    expect(next.mock.calls[0][0].message).toBe(
      "Simulated Notification save failure",
    );

    // Check rollback
    const checkRequest = await MentorRequest.findById(mentorRequestObj._id);
    expect(checkRequest.status).toBe("pending"); // Should have rolled back

    Notification.prototype.save = originalSave;
  });
});
