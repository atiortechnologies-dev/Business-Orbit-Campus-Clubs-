const request = require("supertest");
const mongoose = require("mongoose");
const { app } = require("../../server");
const User = require("../../models/User");
const StudentProfile = require("../../models/StudentProfile");
const Chapter = require("../../models/Chapter");
const ChapterChangeRequest = require("../../models/ChapterChangeRequest");
const { generateToken } = require("../../utils/token");
const { hashPassword } = require("../../utils/password");

describe("Chapter Controller", () => {
  let studentJwt;
  let studentId;
  let chapterId;
  let anotherChapterId;

  beforeEach(async () => {
    await User.deleteMany({});
    await StudentProfile.deleteMany({});
    await Chapter.deleteMany({});
    await ChapterChangeRequest.deleteMany({});

    // Create Chapters
    const chapter = await Chapter.create({
      chapter_name: "Test Chapter",
      college_name: "Test College",
      description: "Test Description",
      mission: "Test Mission",
      status: "Active",
      total_members: 10,
      active_startups: 2,
      mentors_count: 5,
      events_conducted: 3,
    });
    chapterId = chapter._id;

    const anotherChapter = await Chapter.create({
      chapter_name: "Another Chapter",
      college_name: "Another College",
      description: "Another Description",
      mission: "Another Mission",
      status: "Active",
    });
    anotherChapterId = anotherChapter._id;

    // Create User
    const password_hash = await hashPassword("Password123!");
    const student = await User.create({
      full_name: "Test Student",
      email: "student@example.com",
      password_hash,
      role: "student",
      account_status: "active",
      email_verified: true,
    });
    studentId = student._id;

    studentJwt = generateToken(studentId, "student", "student@example.com");
  });

  describe("getMyChapter", () => {
    it("should return 404 if student profile is not found", async () => {
      const res = await request(app)
        .get("/api/student/chapter")
        .set("Authorization", `Bearer ${studentJwt}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Student profile not found");
    });

    it("should return 409 if no chapter is assigned", async () => {
      await StudentProfile.create({
        user_id: studentId,
        college: "Test College",
        degree: "BTech",
        graduation_year: 2026,
      });

      const res = await request(app)
        .get("/api/student/chapter")
        .set("Authorization", `Bearer ${studentJwt}`);

      expect(res.statusCode).toBe(409);
      expect(res.body.message).toBe("No chapter assigned yet. Please complete registration first.");
    });

    it("should successfully retrieve the chapter details if assigned", async () => {
      await StudentProfile.create({
        user_id: studentId,
        chapter_id: chapterId,
        college: "Test College",
        degree: "BTech",
        graduation_year: 2026,
      });

      const res = await request(app)
        .get("/api/student/chapter")
        .set("Authorization", `Bearer ${studentJwt}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.chapterName).toBe("Test Chapter");
    });
  });

  describe("getChapterStats", () => {
    it("should return 404 if chapter is not found", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/chapter/${fakeId}/stats`)
        .set("Authorization", `Bearer ${studentJwt}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("Chapter not found");
    });

    it("should successfully return chapter stats", async () => {
      const res = await request(app)
        .get(`/api/chapter/${chapterId}/stats`)
        .set("Authorization", `Bearer ${studentJwt}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.totalMembers).toBe(10);
      expect(res.body.data.activeStartups).toBe(2);
    });
  });

  describe("requestChapterChange", () => {
    beforeEach(async () => {
      await StudentProfile.create({
        user_id: studentId,
        chapter_id: chapterId,
        college: "Test College",
        degree: "BTech",
        graduation_year: 2026,
      });
    });

    it("should return 400 if reason is missing", async () => {
      const res = await request(app)
        .post("/api/student/request-chapter-change")
        .set("Authorization", `Bearer ${studentJwt}`)
        .send({ requested_chapter_id: anotherChapterId });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("A reason is required");
    });

    it("should return 400 if requested chapter does not exist", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .post("/api/student/request-chapter-change")
        .set("Authorization", `Bearer ${studentJwt}`)
        .send({ reason: "Moving", requested_chapter_id: fakeId });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Requested chapter does not exist");
    });

    it("should return 400 if requested chapter is current chapter", async () => {
      const res = await request(app)
        .post("/api/student/request-chapter-change")
        .set("Authorization", `Bearer ${studentJwt}`)
        .send({ reason: "Moving", requested_chapter_id: chapterId });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("You are already in this chapter");
    });

    it("should successfully submit a chapter change request", async () => {
      const res = await request(app)
        .post("/api/student/request-chapter-change")
        .set("Authorization", `Bearer ${studentJwt}`)
        .send({ reason: "Moving", requested_chapter_id: anotherChapterId });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Chapter change request submitted. It's pending admin review.");

      const requestObj = await ChapterChangeRequest.findOne({ student_id: studentId });
      expect(requestObj).not.toBeNull();
      expect(requestObj.status).toBe("pending");
    });

    it("should return 409 if a pending request already exists", async () => {
      await ChapterChangeRequest.create({
        student_id: studentId,
        current_chapter_id: chapterId,
        requested_chapter_id: anotherChapterId,
        reason: "Moving",
        status: "pending",
      });

      const res = await request(app)
        .post("/api/student/request-chapter-change")
        .set("Authorization", `Bearer ${studentJwt}`)
        .send({ reason: "Moving again", requested_chapter_id: anotherChapterId });

      expect(res.statusCode).toBe(409);
      expect(res.body.message).toBe("You already have a pending chapter change request");
    });
  });
});
