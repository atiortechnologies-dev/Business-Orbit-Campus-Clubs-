const request = require("supertest");
const _mongoose = require("mongoose");
const { app } = require("../../server");
const User = require("../../models/User");
const Startup = require("../../models/Startup");
const StartupStage = require("../../models/StartupStage");
const StageSubmission = require("../../models/StageSubmission");
const { generateToken } = require("../../utils/token");

describe("StartupProgress Controller", () => {
  let userJwt;
  let userId;

  beforeEach(async () => {
    await User.deleteMany({});
    await Startup.deleteMany({});
    await StartupStage.deleteMany({});
    await StageSubmission.deleteMany({});

    const user = await User.create({
      full_name: "Test Student",
      email: "student@example.com",
      password_hash: "hashedpass",
      role: "student",
      account_status: "active",
      email_verified: true,
    });
    userId = user._id;
    userJwt = generateToken(userId, "student", "student@example.com");
  });

  describe("getProgress", () => {
    it("should return progress for a startup with an active stage but no submission", async () => {
      // The controller calls getOrCreateStartup which will initialize stages
      const res = await request(app)
        .get("/api/startup/progress") // Adjust if route differs
        .set("Authorization", `Bearer ${userJwt}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.currentStage.stageNumber).toBe(1);
      expect(res.body.data.submissionStatus).toBe("not_started");
      expect(res.body.data.reviewStatus).toBe("not_reviewed");
    });

    it("should reflect pending review status", async () => {
      const startup = await Startup.create({
        student_id: userId,
        startup_name: "My Startup",
      });
      const stage = await StartupStage.create({
        startup_id: startup._id,
        stage_number: 1,
        stage_name: "Ideation",
        status: "active",
      });

      await StageSubmission.create({
        startup_id: startup._id,
        stage_id: stage._id,
        title: "Submission 1",
        description: "Test",
        status: "pending_review",
      });

      const res = await request(app)
        .get("/api/startup/progress")
        .set("Authorization", `Bearer ${userJwt}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.submissionStatus).toBe("pending_review");
      expect(res.body.data.reviewStatus).toBe("under_review");
    });
  });

  describe("getStages", () => {
    it("should return all stages with instructions and objectives", async () => {
      const res = await request(app)
        .get("/api/startup/stages") // Adjust if route differs
        .set("Authorization", `Bearer ${userJwt}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.stages)).toBe(true);
      expect(res.body.data.stages.length).toBeGreaterThan(0);
      expect(res.body.data.stages[0].stageNumber).toBe(1);
    });
  });
});
