const request = require("supertest");
const _mongoose = require("mongoose");
const { app } = require("../../server");
const User = require("../../models/User");
const MentorProfile = require("../../models/MentorProfile");
const { generateToken } = require("../../utils/token");

describe("MentorProfile Controller", () => {
  let mentorJwt;
  let mentorId;

  beforeEach(async () => {
    await User.deleteMany({});
    await MentorProfile.deleteMany({});

    const mentor = await User.create({
      full_name: "Active Mentor",
      email: "mentor@example.com",
      password_hash: "hashedpass",
      role: "mentor",
      account_status: "active",
      email_verified: true,
      profile_status: "not_started",
    });
    mentorId = mentor._id;
    mentorJwt = generateToken(mentorId, "mentor", "mentor@example.com");

    await MentorProfile.create({
      user_id: mentorId,
      organization: "Tech Corp",
      designation: "Senior Engineer",
      expertise: "Backend",
      years_of_experience: 5,
      profile_status: "incomplete",
    });
  });

  describe("getMentorProfile", () => {
    it("should successfully retrieve the mentor profile", async () => {
      const res = await request(app)
        .get("/api/mentor/profile")
        .set("Authorization", `Bearer ${mentorJwt}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.organization).toBe("Tech Corp");
    });
  });

  describe("updateMentorProfile", () => {
    it("should successfully update an existing mentor profile", async () => {
      const res = await request(app)
        .put("/api/mentor/profile")
        .set("Authorization", `Bearer ${mentorJwt}`)
        .send({ bio: "This is a valid length mentor bio." });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      const profile = await MentorProfile.findOne({ user_id: mentorId });
      expect(profile.bio).toBe("This is a valid length mentor bio.");
    });
  });

  describe("uploadProfilePhoto", () => {
    it("should return 400 if no file is uploaded", async () => {
      const res = await request(app)
        .post("/api/mentor/profile/photo")
        .set("Authorization", `Bearer ${mentorJwt}`);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("No file uploaded");
    });
  });
});
