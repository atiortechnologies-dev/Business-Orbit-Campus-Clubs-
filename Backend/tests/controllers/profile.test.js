const request = require("supertest");
const mongoose = require("mongoose");
const { app } = require("../../server");
const User = require("../../models/User");
const StudentProfile = require("../../models/StudentProfile");
const { generateToken } = require("../../utils/token");

describe("Profile Controller", () => {
  let activeJwt;
  let activeId;
  let unverifiedJwt;

  beforeEach(async () => {
    await User.deleteMany({});
    await StudentProfile.deleteMany({});

    const activeUser = await User.create({
      full_name: "Active Student",
      email: "active@example.com",
      password_hash: "hashedpass",
      role: "student",
      account_status: "active",
      email_verified: true,
      profile_status: "not_started",
    });
    activeId = activeUser._id;
    activeJwt = generateToken(activeId, "student", "active@example.com");

    await StudentProfile.create({
      user_id: activeId,
      college: "MIT",
      degree: "Computer Science",
      graduation_year: 2026,
      profile_status: "incomplete",
    });

    const unverifiedUser = await User.create({
      full_name: "Unverified Student",
      email: "unverified@example.com",
      password_hash: "hashedpass",
      role: "student",
      account_status: "pending_verification",
      email_verified: false,
    });
    unverifiedJwt = generateToken(unverifiedUser._id, "student", "unverified@example.com");

    await StudentProfile.create({
      user_id: unverifiedUser._id,
      college: "MIT",
      degree: "Computer Science",
      graduation_year: 2026,
      profile_status: "incomplete",
    });
  });

  describe("createProfile", () => {
    it("should return 403 if email is not verified", async () => {
      const res = await request(app)
        .post("/api/student/profile")
        .set("Authorization", `Bearer ${unverifiedJwt}`)
        .send({ bio: "Hello" });

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toBe("Please verify your email before completing your profile");
    });

    it("should return 400 for invalid data", async () => {
      const res = await request(app)
        .post("/api/student/profile")
        .set("Authorization", `Bearer ${activeJwt}`)
        .send({
          // Missing required fields like college, degree, graduation_year
          bio: "Hello",
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Validation failed");
    });

    it("should successfully create a profile", async () => {
      const res = await request(app)
        .post("/api/student/profile")
        .set("Authorization", `Bearer ${activeJwt}`)
        .send({
          bio: "I am a student and this bio is longer than 10 characters.",
          skills: ["JavaScript", "React"],
          linkedin_url: "https://linkedin.com/in/teststudent",
          startup_interests: ["EdTech", "FinTech"],
          areas_of_interest: ["Software Engineering"],
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Profile completed successfully");

      const profile = await StudentProfile.findOne({ user_id: activeId });
      expect(profile).not.toBeNull();
      expect(profile.college).toBe("MIT");
      expect(profile.skills.length).toBe(2);
      
      const user = await User.findById(activeId);
      expect(user.profile_status).toBe("completed");
    });

    it("should return 409 if profile is already completed", async () => {
      await StudentProfile.findOneAndUpdate(
        { user_id: activeId },
        { profile_status: "completed" }
      );

      const res = await request(app)
        .post("/api/student/profile")
        .set("Authorization", `Bearer ${activeJwt}`)
        .send({
          bio: "I am a student and this bio is longer than 10 characters.",
          skills: ["JavaScript", "React"],
          linkedin_url: "https://linkedin.com/in/teststudent",
          startup_interests: ["EdTech", "FinTech"],
          areas_of_interest: ["Software Engineering"],
        });

      expect(res.statusCode).toBe(409);
      expect(res.body.message).toBe("Profile already completed. Use PUT to update it instead.");
    });
  });

  describe("skipProfile", () => {
    it("should mark profile as skipped and return 200", async () => {
      const res = await request(app)
        .post("/api/student/profile/skip")
        .set("Authorization", `Bearer ${activeJwt}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      const user = await User.findById(activeId);
      expect(user.profile_status).toBe("skipped");

      const profile = await StudentProfile.findOne({ user_id: activeId });
      expect(profile).not.toBeNull();
    });
  });

  describe("updateProfile", () => {
    it("should return 404 if profile does not exist", async () => {
      // Temporarily remove the profile created in beforeEach to test this case
      await StudentProfile.deleteOne({ user_id: activeId });

      const res = await request(app)
        .put("/api/student/profile")
        .set("Authorization", `Bearer ${activeJwt}`)
        .send({ bio: "This is a new bio that is long enough." });

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("Profile not found. Complete your profile first.");
    });

    it("should successfully update an existing profile", async () => {
      // The profile was created in beforeEach with profile_status: "incomplete"
      
      const res = await request(app)
        .put("/api/student/profile")
        .set("Authorization", `Bearer ${activeJwt}`)
        .send({ bio: "This is a new bio that is long enough.", portfolio_url: "https://github.com/test" });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      const profile = await StudentProfile.findOne({ user_id: activeId });
      expect(profile.bio).toBe("This is a new bio that is long enough.");
      expect(profile.portfolio_url).toBe("https://github.com/test");
    });
  });

  describe("getMyProfile", () => {
    it("should return 404 if profile is not found", async () => {
      // Temporarily remove the profile to test the 404 case
      await StudentProfile.deleteOne({ user_id: activeId });

      const res = await request(app)
        .get("/api/student/profile")
        .set("Authorization", `Bearer ${activeJwt}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("Profile not found");
    });

    it("should successfully retrieve the profile", async () => {
      // Profile already exists from beforeEach
      const res = await request(app)
        .get("/api/student/profile")
        .set("Authorization", `Bearer ${activeJwt}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.college).toBe("MIT");
    });
  });
});
