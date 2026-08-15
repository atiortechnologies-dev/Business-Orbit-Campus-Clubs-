const request = require("supertest");
const { app } = require("../../server");
const User = require("../../models/User");
const Startup = require("../../models/Startup");
const StartupStage = require("../../models/StartupStage");
const StageSubmission = require("../../models/StageSubmission");
const { generateToken } = require("../../utils/token");

describe("Submission Controller", () => {
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

  describe("saveDraft", () => {
    it("should return 409 if there is no active stage", async () => {
      // Create startup but no active stage
      await Startup.create({ student_id: userId, startup_name: "No Stage" });

      const res = await request(app)
        .put("/api/startup/save-draft")
        .set("Authorization", `Bearer ${userJwt}`)
        .send({ title: "My Draft", description: "Draft Desc" });

      expect(res.statusCode).toBe(409);
      expect(res.body.message).toBe("No active stage to save a draft against");
    });

    it("should successfully save a draft", async () => {
      const startup = await Startup.create({
        student_id: userId,
        startup_name: "My Startup",
      });
      await StartupStage.create({
        startup_id: startup._id,
        stage_number: 1,
        stage_name: "Ideation",
        status: "active",
      });

      const res = await request(app)
        .put("/api/startup/save-draft")
        .set("Authorization", `Bearer ${userJwt}`)
        .send({ title: "My Draft", description: "Draft Desc" });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Draft saved");

      const draft = await StageSubmission.findOne({ startup_id: startup._id });
      expect(draft.title).toBe("My Draft");
      expect(draft.status).toBe("draft");
    });

    it("should successfully save a draft with an attachment_url", async () => {
      const startup = await Startup.create({
        student_id: userId,
        startup_name: "My Startup",
      });
      await StartupStage.create({
        startup_id: startup._id,
        stage_number: 1,
        stage_name: "Ideation",
        status: "active",
      });

      const res = await request(app)
        .put("/api/startup/save-draft")
        .set("Authorization", `Bearer ${userJwt}`)
        .send({
          title: "My Draft with Attachment",
          description: "Draft Desc",
          attachment_url: "https://example.com/pitch.pdf",
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      const draft = await StageSubmission.findOne({ startup_id: startup._id });
      expect(draft.attachment_url).toBe("https://example.com/pitch.pdf");
    });
  });

  describe("submitIdea", () => {
    it("should successfully submit an idea and change stage status", async () => {
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

      const res = await request(app)
        .post("/api/startup/submit")
        .set("Authorization", `Bearer ${userJwt}`)
        .send({ title: "Final Idea", description: "Final Desc" });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toMatch(/submitted successfully/);

      const submission = await StageSubmission.findById(
        res.body.data.submissionId,
      );
      expect(submission.title).toBe("Final Idea");
      expect(submission.status).toBe("pending_review");

      const updatedStage = await StartupStage.findById(stage._id);
      expect(updatedStage.status).toBe("submitted");
    });

    it("should successfully submit an idea with an attachment_url", async () => {
      const startup = await Startup.create({
        student_id: userId,
        startup_name: "My Startup",
      });
      await StartupStage.create({
        startup_id: startup._id,
        stage_number: 1,
        stage_name: "Ideation",
        status: "active",
      });

      const res = await request(app)
        .post("/api/startup/submit")
        .set("Authorization", `Bearer ${userJwt}`)
        .send({
          title: "Idea with Attachment",
          description: "Desc with attachment",
          attachment_url: "https://example.com/deck.pdf",
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);

      const submission = await StageSubmission.findById(
        res.body.data.submissionId,
      );
      expect(submission.attachment_url).toBe("https://example.com/deck.pdf");
    });
  });

  describe("getSubmissionStatus", () => {
    it("should return the submission status of the active stage", async () => {
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
        title: "Test",
        description: "Test Desc",
        attachment_url: "https://example.com/doc.pdf",
        status: "pending_review",
      });

      const res = await request(app)
        .get("/api/startup/submission-status")
        .set("Authorization", `Bearer ${userJwt}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.currentStatus).toBe("pending_review");
      expect(res.body.data.title).toBe("Test");
      expect(res.body.data.description).toBe("Test Desc");
      expect(res.body.data.attachment_url).toBe("https://example.com/doc.pdf");
    });
  });
});
