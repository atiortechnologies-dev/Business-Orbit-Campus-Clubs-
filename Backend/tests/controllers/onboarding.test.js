const request = require("supertest");
const mongoose = require("mongoose");
const { app } = require("../../server");
const User = require("../../models/User");
const { generateToken } = require("../../utils/token");

describe("Onboarding Controller", () => {
  afterEach(async () => {
    await User.deleteMany({});
  });

  const testCases = [
    {
      description: "email not verified",
      userOpts: { email_verified: false },
      expectedNextScreen: "email_verification",
    },
    {
      description: "pending verification",
      userOpts: {
        email_verified: true,
        account_status: "pending_verification",
      },
      expectedNextScreen: "verification_pending",
    },
    {
      description: "pending approval",
      userOpts: { email_verified: true, account_status: "pending_approval" },
      expectedNextScreen: "verification_pending",
    },
    {
      description: "account rejected",
      userOpts: { email_verified: true, account_status: "rejected" },
      expectedNextScreen: "profile_rejected",
    },
    {
      description: "account suspended",
      userOpts: { email_verified: true, account_status: "suspended" },
      expectedNextScreen: "account_suspended",
    },
    {
      description: "active but profile not started",
      userOpts: {
        email_verified: true,
        account_status: "active",
        profile_status: "not_started",
      },
      expectedNextScreen: "complete_profile",
    },
    {
      description: "active and profile completed (student)",
      userOpts: {
        email_verified: true,
        account_status: "active",
        profile_status: "completed",
        role: "student",
      },
      expectedNextScreen: "student_dashboard",
    },
    {
      description: "active and profile skipped (mentor)",
      userOpts: {
        email_verified: true,
        account_status: "active",
        profile_status: "skipped",
        role: "mentor",
      },
      expectedNextScreen: "mentor_dashboard",
    },
  ];

  describe("getOnboardingStatus", () => {
    testCases.forEach(({ description, userOpts, expectedNextScreen }) => {
      it(`should return next_screen='${expectedNextScreen}' when ${description}`, async () => {
        const user = await User.create({
          full_name: "Test User",
          email: "test@example.com",
          password_hash: "hashedpass",
          role: userOpts.role || "student",
          account_status: userOpts.account_status || "pending_verification",
          email_verified: userOpts.email_verified,
          profile_status: userOpts.profile_status || "not_started",
        });

        const token = generateToken(user._id, user.role, user.email);

        const res = await request(app)
          .get("/api/onboarding/status")
          .set("Authorization", `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.data.next_screen).toBe(expectedNextScreen);
      });
    });

    it("should return 404 if user not found", async () => {
      const token = generateToken(
        new mongoose.Types.ObjectId(),
        "student",
        "test@example.com",
      );

      const res = await request(app)
        .get("/api/onboarding/status")
        .set("Authorization", `Bearer ${token}`);

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe("Not authorized, user no longer exists");
    });
  });
});
