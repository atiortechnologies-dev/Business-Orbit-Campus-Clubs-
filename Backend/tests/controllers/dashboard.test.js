const request = require("supertest");
const _mongoose = require("mongoose");
const { app } = require("../../server");
const User = require("../../models/User");
const StudentProfile = require("../../models/StudentProfile");
const Startup = require("../../models/Startup");
const StartupStage = require("../../models/StartupStage");
const Meeting = require("../../models/Meeting");
const { generateToken } = require("../../utils/token");

describe("Dashboard Controller", () => {
  let studentJwt;
  let unverifiedJwt;
  let inactiveJwt;
  let studentId;
  let unverifiedId;
  let inactiveId;

  beforeEach(async () => {
    await User.deleteMany({});
    await StudentProfile.deleteMany({});
    await Startup.deleteMany({});
    await StartupStage.deleteMany({});
    await Meeting.deleteMany({});

    // Active verified student
    const student = await User.create({
      full_name: "Active Student",
      email: "active@example.com",
      password_hash: "hashedpass",
      role: "student",
      account_status: "active",
      email_verified: true,
    });
    studentId = student._id;
    studentJwt = generateToken(studentId, "student", "active@example.com");

    // Unverified student
    const unverified = await User.create({
      full_name: "Unverified Student",
      email: "unverified@example.com",
      password_hash: "hashedpass",
      role: "student",
      account_status: "active",
      email_verified: false,
    });
    unverifiedId = unverified._id;
    unverifiedJwt = generateToken(
      unverifiedId,
      "student",
      "unverified@example.com",
    );

    // Inactive student
    const inactive = await User.create({
      full_name: "Inactive Student",
      email: "inactive@example.com",
      password_hash: "hashedpass",
      role: "student",
      account_status: "pending_approval",
      email_verified: true,
    });
    inactiveId = inactive._id;
    inactiveJwt = generateToken(inactiveId, "student", "inactive@example.com");
  });

  describe("getDashboard", () => {
    it("should return 403 if email is not verified", async () => {
      const res = await request(app)
        .get("/api/student/dashboard")
        .set("Authorization", `Bearer ${unverifiedJwt}`);

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toBe("Please verify your email first");
    });

    it("should return 403 if account is not active", async () => {
      const res = await request(app)
        .get("/api/student/dashboard")
        .set("Authorization", `Bearer ${inactiveJwt}`);

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toBe("Your account is not yet approved");
    });

    it("should return 404 if student profile is not found", async () => {
      const res = await request(app)
        .get("/api/student/dashboard")
        .set("Authorization", `Bearer ${studentJwt}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("Student profile not found");
    });

    it("should successfully return dashboard data", async () => {
      await StudentProfile.create({
        user_id: studentId,
        bio: "Test bio",
        profile_photo: "http://photo.com/me.png",
        college: "Test College",
        degree: "BTech",
        graduation_year: 2026,
      });

      // The controller creates a startup if it doesn't exist via getOrCreateStartup
      const res = await request(app)
        .get("/api/student/dashboard")
        .set("Authorization", `Bearer ${studentJwt}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.studentProfile.fullName).toBe("Active Student");
      expect(res.body.data.startupName).toBe(`${studentId}'s Startup`);

      // Check if it created the startup in DB
      const startup = await Startup.findOne({ student_id: studentId });
      expect(startup).not.toBeNull();
      expect(startup.startup_name).toBe(`${studentId}'s Startup`);
    });

    it("should successfully return dashboard data with existing startup, stage, and meetings", async () => {
      await StudentProfile.create({
        user_id: studentId,
        bio: "Test bio",
        profile_photo: "http://photo.com/me.png",
        college: "Test College",
        degree: "BTech",
        graduation_year: 2026,
      });

      const startup = await Startup.create({
        student_id: studentId,
        startup_name: "My Awesome Startup",
        progress_percentage: 42,
        status: "active",
      });

      await StartupStage.create({
        startup_id: startup._id,
        stage_number: 2,
        stage_name: "Prototype",
        status: "active",
      });

      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 2);
      await Meeting.create({
        startup_id: startup._id,
        status: "scheduled",
        meeting_date: futureDate,
        title: "Test Meeting",
        meeting_link: "https://zoom.us/j/123456789",
        reviewer_id: inactiveId, // Just using an existing user ID for simplicity
      });

      const res = await request(app)
        .get("/api/student/dashboard")
        .set("Authorization", `Bearer ${studentJwt}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.startupName).toBe("My Awesome Startup");
      expect(res.body.data.overallProgress).toBe(42);
      expect(res.body.data.currentStage.stageNumber).toBe(2);
      expect(res.body.data.currentStage.stageName).toBe("Prototype");
      expect(res.body.data.upcomingReviewMeetings.length).toBe(1);
    });
  });
});
