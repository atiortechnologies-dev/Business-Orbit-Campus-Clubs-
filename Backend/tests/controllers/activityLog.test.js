const request = require("supertest");
const mongoose = require("mongoose");
const { app } = require("../../server");
const User = require("../../models/User");
const ActivityLog = require("../../models/ActivityLog");
const { generateToken } = require("../../utils/token");

describe("Activity Log Controller", () => {
  let student1Jwt, student2Jwt;
  let student1Id, student2Id;

  beforeEach(async () => {
    await User.deleteMany({});
    await ActivityLog.deleteMany({});

    const student1 = await User.create({
      full_name: "Student One",
      email: "student1@example.com",
      password_hash: "hashedpass",
      role: "student",
      account_status: "active",
      email_verified: true,
    });
    student1Id = student1._id;
    student1Jwt = generateToken(student1Id, "student", "student1@example.com");

    const student2 = await User.create({
      full_name: "Student Two",
      email: "student2@example.com",
      password_hash: "hashedpass",
      role: "student",
      account_status: "active",
      email_verified: true,
    });
    student2Id = student2._id;
    student2Jwt = generateToken(student2Id, "student", "student2@example.com");
  });

  describe("GET /api/student/activity-log", () => {
    it("should return empty list when no activity logs", async () => {
      const res = await request(app)
        .get("/api/student/activity-log")
        .set("Authorization", `Bearer ${student1Jwt}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(0);
      expect(res.body.data.length).toBe(0);
    });

    it("should return activity logs for the user with pagination", async () => {
      const fakeEntityId = new mongoose.Types.ObjectId();
      await ActivityLog.create([
        { user_id: student1Id, action: "ACTION_1", entity_type: "Test", entity_id: fakeEntityId },
        { user_id: student1Id, action: "ACTION_2", entity_type: "Test", entity_id: fakeEntityId },
        { user_id: student2Id, action: "ACTION_3", entity_type: "Test", entity_id: fakeEntityId },
      ]);

      const res = await request(app)
        .get("/api/student/activity-log?page=1&limit=1")
        .set("Authorization", `Bearer ${student1Jwt}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(1);
      expect(res.body.pagination.total).toBe(2);
      expect(res.body.data[0].user_id.toString()).toBe(student1Id.toString());
    });
  });
});
