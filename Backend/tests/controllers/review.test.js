const request = require("supertest");
const mongoose = require("mongoose");
const { app } = require("../../server");
const User = require("../../models/User");
const Startup = require("../../models/Startup");
const StageSubmission = require("../../models/StageSubmission");
const Review = require("../../models/Review");
const { generateToken } = require("../../utils/token");

describe("Review Controller", () => {
  let userJwt;
  let userId;
  let mentorId;

  beforeEach(async () => {
    await User.deleteMany({});
    await Startup.deleteMany({});
    await StageSubmission.deleteMany({});
    await Review.deleteMany({});

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

    const mentor = await User.create({
      full_name: "Test Mentor",
      email: "mentor@example.com",
      password_hash: "hashedpass",
      role: "mentor",
      account_status: "active",
      email_verified: true,
    });
    mentorId = mentor._id;
  });

  describe("getReviewResult", () => {
    it("should return 404 if no review exists", async () => {
      const res = await request(app)
        .get("/api/review/result")
        .set("Authorization", `Bearer ${userJwt}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("No review available yet");
    });

    it("should return the latest review result", async () => {
      // Create startup
      const startup = await Startup.create({
        student_id: userId,
        startup_name: `${userId}'s Startup`,
      });

      // Create submission
      const submission = await StageSubmission.create({
        startup_id: startup._id,
        stage_id: new mongoose.Types.ObjectId(),
        title: "Test Submission",
        description: "Test description",
        status: "pending_review",
      });

      // Create review
      const reviewDate = new Date();
      await Review.create({
        submission_id: submission._id,
        reviewer_id: mentorId,
        decision: "approved",
        feedback: "Great idea!",
        improvement_suggestions: "None",
        reviewed_at: reviewDate,
      });

      const res = await request(app)
        .get("/api/review/result")
        .set("Authorization", `Bearer ${userJwt}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.decision).toBe("approved");
      expect(res.body.data.feedback).toBe("Great idea!");
      expect(res.body.data.improvementSuggestions).toBe("None");
      expect(res.body.data.reviewedBy).toBe("Test Mentor");
    });
  });
});
