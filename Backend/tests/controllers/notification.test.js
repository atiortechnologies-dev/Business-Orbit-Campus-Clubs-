const request = require("supertest");
const mongoose = require("mongoose");
const { app } = require("../../server");
const User = require("../../models/User");
const Notification = require("../../models/Notification");
const { generateToken } = require("../../utils/token");

describe("Notification Controller", () => {
  let student1Jwt, _student2Jwt;
  let student1Id, student2Id;

  beforeEach(async () => {
    await User.deleteMany({});
    await Notification.deleteMany({});

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
    _student2Jwt = generateToken(student2Id, "student", "student2@example.com");
  });

  describe("GET /api/student/notifications", () => {
    it("should return empty list when no notifications", async () => {
      const res = await request(app)
        .get("/api/student/notifications")
        .set("Authorization", `Bearer ${student1Jwt}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(0);
      expect(res.body.data.length).toBe(0);
    });

    it("should return notifications for the user with pagination", async () => {
      // Create some notifications for student1
      await Notification.create([
        { recipient_id: student1Id, title: "Test 1", message: "Message 1" },
        { recipient_id: student1Id, title: "Test 2", message: "Message 2" },
        { recipient_id: student2Id, title: "Test 3", message: "Message 3" },
      ]);

      const res = await request(app)
        .get("/api/student/notifications?page=1&limit=1")
        .set("Authorization", `Bearer ${student1Jwt}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(1);
      expect(res.body.pagination.total).toBe(2);
      expect(res.body.data[0].recipient_id.toString()).toBe(
        student1Id.toString(),
      );
    });
  });

  describe("PUT /api/student/notifications/:notificationId/read", () => {
    it("should mark a notification as read", async () => {
      const notification = await Notification.create({
        recipient_id: student1Id,
        title: "Test",
        message: "Message",
        read_status: false,
      });

      const res = await request(app)
        .put(`/api/student/notifications/${notification._id}/read`)
        .set("Authorization", `Bearer ${student1Jwt}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.read_status).toBe(true);

      // Verify in DB
      const updated = await Notification.findById(notification._id);
      expect(updated.read_status).toBe(true);
    });

    it("should return 404 if notification belongs to another user", async () => {
      const notification = await Notification.create({
        recipient_id: student2Id,
        title: "Test",
        message: "Message",
        read_status: false,
      });

      const res = await request(app)
        .put(`/api/student/notifications/${notification._id}/read`)
        .set("Authorization", `Bearer ${student1Jwt}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Notification not found");
    });

    it("should return 404 if notification does not exist", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/student/notifications/${fakeId}/read`)
        .set("Authorization", `Bearer ${student1Jwt}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Notification not found");
    });
  });
});
