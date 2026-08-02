const mongoose = require("mongoose");
const request = require("supertest");
const express = require("express");
require("../setup");
const User = require("../../models/User");
const Chapter = require("../../models/Chapter");
const StudentProfile = require("../../models/StudentProfile");
const ChapterChangeRequest = require("../../models/ChapterChangeRequest");
const adminRoutes = require("../../routes/admin.routes");
const { generateToken } = require("../../utils/token");

const app = express();
app.use(express.json());
process.env.ADMIN_API_KEY = "TEST_API_KEY_123";
app.use("/api/admin", adminRoutes);

describe("Admin Chapter Change Review Lifecycle", () => {
  let studentUser;
  let currentChapter;
  let requestedChapter;
  let _studentProfile;
  let changeRequest;
  let adminUser;
  let adminToken;

  beforeEach(async () => {
    await User.deleteMany({});
    await Chapter.deleteMany({});
    await StudentProfile.deleteMany({});
    await ChapterChangeRequest.deleteMany({});

    adminUser = await User.create({
      full_name: "Admin User",
      email: "admin@test.com",
      password_hash: "hashedpassword123",
      role: "admin",
      is_verified: true,
      status: "active",
    });
    adminToken = generateToken(adminUser);

    studentUser = await User.create({
      full_name: "Test Student",
      email: "student@test.com",
      password_hash: "hashedpassword123",
      role: "student",
      is_verified: true,
      status: "active",
    });

    currentChapter = await Chapter.create({
      chapter_name: "Old Club",
      college_name: "Old University",
      status: "Active",
    });

    requestedChapter = await Chapter.create({
      chapter_name: "New Club",
      college_name: "New University",
      status: "Active",
    });

    _studentProfile = await StudentProfile.create({
      user_id: studentUser._id,
      college: "Old University",
      degree: "B.Tech",
      graduation_year: 2026,
      chapter_id: currentChapter._id,
      profile_status: "completed",
    });

    changeRequest = await ChapterChangeRequest.create({
      student_id: studentUser._id,
      current_chapter_id: currentChapter._id,
      requested_chapter_id: requestedChapter._id,
      reason: "Relocating to New University campus",
      status: "pending",
    });
  });

  describe("GET /api/admin/chapter-change-requests", () => {
    it("should return a list of chapter change requests", async () => {
      const res = await request(app)
        .get("/api/admin/chapter-change-requests")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(1);
      expect(res.body.data[0]._id).toBe(changeRequest._id.toString());
      expect(res.body.data[0].student_id.full_name).toBe("Test Student");
    });

    it("should filter chapter change requests by status", async () => {
      const res = await request(app)
        .get("/api/admin/chapter-change-requests?status=approved")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.count).toBe(0);
    });
  });

  describe("GET /api/admin/chapter-change-requests/:id", () => {
    it("should return details of a specific request", async () => {
      const res = await request(app)
        .get(`/api/admin/chapter-change-requests/${changeRequest._id}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.reason).toBe("Relocating to New University campus");
    });

    it("should return 404 if request not found", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/admin/chapter-change-requests/${fakeId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe("PUT /api/admin/chapter-change-requests/:id/approve", () => {
    it("should approve request and update student profile chapter_id atomically", async () => {
      const res = await request(app)
        .put(`/api/admin/chapter-change-requests/${changeRequest._id}/approve`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe("approved");

      const updatedReq = await ChapterChangeRequest.findById(changeRequest._id);
      expect(updatedReq.status).toBe("approved");

      const updatedProfile = await StudentProfile.findOne({
        user_id: studentUser._id,
      });
      expect(updatedProfile.chapter_id.toString()).toBe(
        requestedChapter._id.toString(),
      );
    });

    it("should return 400 if request is already approved or rejected", async () => {
      changeRequest.status = "approved";
      await changeRequest.save();

      const res = await request(app)
        .put(`/api/admin/chapter-change-requests/${changeRequest._id}/approve`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("PUT /api/admin/chapter-change-requests/:id/reject", () => {
    it("should reject request without modifying student profile", async () => {
      const res = await request(app)
        .put(`/api/admin/chapter-change-requests/${changeRequest._id}/reject`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe("rejected");

      const updatedReq = await ChapterChangeRequest.findById(changeRequest._id);
      expect(updatedReq.status).toBe("rejected");

      const updatedProfile = await StudentProfile.findOne({
        user_id: studentUser._id,
      });
      expect(updatedProfile.chapter_id.toString()).toBe(
        currentChapter._id.toString(),
      );
    });
  });

  describe("POST /api/admin/chapter-change-requests/bulk-approve", () => {
    it("should approve multiple valid requests successfully", async () => {
      const student2 = await User.create({
        full_name: "Test Student 2",
        email: "test2@example.com",
        password_hash: "hashed",
        role: "student",
      });
      await StudentProfile.create({
        user_id: student2._id,
        chapter_id: currentChapter._id,
        college: "Test College",
        degree: "BTech",
        graduation_year: 2026,
      });
      const request2 = await ChapterChangeRequest.create({
        student_id: student2._id,
        current_chapter_id: currentChapter._id,
        requested_chapter_id: requestedChapter._id,
        reason: "Test reason 2",
      });

      const res = await request(app)
        .post("/api/admin/chapter-change-requests/bulk-approve")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ requestIds: [changeRequest._id.toString(), request2._id.toString()] });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(2);

      const req1 = await ChapterChangeRequest.findById(changeRequest._id);
      const req2 = await ChapterChangeRequest.findById(request2._id);
      expect(req1.status).toBe("approved");
      expect(req2.status).toBe("approved");

      const profile1 = await StudentProfile.findOne({ user_id: studentUser._id });
      const profile2 = await StudentProfile.findOne({ user_id: student2._id });
      expect(profile1.chapter_id.toString()).toBe(requestedChapter._id.toString());
      expect(profile2.chapter_id.toString()).toBe(requestedChapter._id.toString());
    });

    it("should return 400 for empty array", async () => {
      const res = await request(app)
        .post("/api/admin/chapter-change-requests/bulk-approve")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ requestIds: [] });

      expect(res.statusCode).toBe(400);
    });
  });
});
