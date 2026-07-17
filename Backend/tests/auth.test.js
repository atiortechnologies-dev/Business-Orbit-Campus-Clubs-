const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("../routes/auth.routes");
const { errorHandler } = require("../middlewares/errorHandler");

const { hashPassword } = require("../utils/hash");

// Mock email to avoid actual emails being sent during tests
jest.mock("../utils/email", () => ({
  generateOTP: jest.fn(() => "123456"),
  sendOTPEmail: jest.fn().mockResolvedValue(true),
  sendEmail: jest.fn().mockResolvedValue(true)
}));

// Setup app
const app = express();
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use(errorHandler);

describe("Auth Routes Tests", () => {
  const baseUser = {
    full_name: "John Doe",
    email: "john@example.com",
    password: "Password123!",
    confirm_password: "Password123!"
  };

  beforeEach(async () => {
    // Seed a test user for existing email tests
    const User = mongoose.model("User");
    const password_hash = await hashPassword(baseUser.password);
    await new User({
      full_name: baseUser.full_name,
      email: baseUser.email,
      password_hash: password_hash,
      role: "student"
    }).save();
  });

  describe("POST /api/auth/register", () => {
    it("should fail validation for missing role-specific fields (Student)", async () => {
      const res = await request(app).post("/api/auth/register").send({
        ...baseUser,
        role: "student",
      });
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ field: "college" }),
          expect.objectContaining({ field: "degree" })
        ])
      );
    });

    it("should register a student successfully", async () => {
      const res = await request(app).post("/api/auth/register").send({
        ...baseUser,
        email: "newstudent@example.com",
        role: "student",
        college: "Tech University",
        degree: "B.Sc Computer Science",
        graduation_year: 2026
      });
      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.userId).toBeDefined();
    });

    it("should not allow registration with duplicate email", async () => {
      const res = await request(app).post("/api/auth/register").send({
        ...baseUser,
        email: "john@example.com", // existing user
        role: "student",
        college: "Tech University",
        degree: "B.Sc Computer Science",
        graduation_year: 2026
      });
      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe("Email already exists");
    });

    it("should register a mentor successfully", async () => {
      const res = await request(app).post("/api/auth/register").send({
        ...baseUser,
        email: "mentor@example.com",
        role: "mentor",
        organization: "Tech Corp",
        designation: "Senior Engineer",
        expertise: "Node.js",
        years_of_experience: 5
      });
      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
    });
  });

  describe("GET /api/auth/check-email", () => {
    it("should return available false for existing email", async () => {
      const res = await request(app).get("/api/auth/check-email").query({
        email: "john@example.com"
      });
      expect(res.statusCode).toBe(200);
      expect(res.body.available).toBe(false);
    });

    it("should return available true for new email", async () => {
      const res = await request(app).get("/api/auth/check-email").query({
        email: "newuser@example.com"
      });
      expect(res.statusCode).toBe(200);
      expect(res.body.available).toBe(true);
    });
  });

  describe("POST /api/auth/send-otp", () => {
    it("should send OTP to existing user and delete old verifications", async () => {
      const res = await request(app).post("/api/auth/send-otp").send({
        email: "john@example.com"
      });
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("If an account exists, an OTP has been sent.");
    });
  });

  describe("POST /api/auth/login", () => {
    it("should not login if email is unverified", async () => {
      const res = await request(app).post("/api/auth/login").send({
        email: "john@example.com",
        password: "Password123!"
      });
      expect(res.statusCode).toBe(403);
      expect(res.body.message).toBe("Please verify your email");
    });
    
    // Manual verification is needed to test successful login, we update DB directly
    it("should login successfully if verified and active", async () => {
      const User = mongoose.model("User");
      await User.findOneAndUpdate({ email: "john@example.com" }, { 
        email_verified: true, 
        account_status: "active" 
      });

      const res = await request(app).post("/api/auth/login").send({
        email: "john@example.com",
        password: "Password123!"
      });
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.token).toBeDefined();
    });
  });

  describe("POST /api/auth/forgot-password & reset-password", () => {
    it("should request password reset", async () => {
      const res = await request(app).post("/api/auth/forgot-password").send({
        email: "john@example.com"
      });
      expect(res.statusCode).toBe(200);
    });

    it("should reset password successfully", async () => {
      // First request a password reset to generate the token in the DB
      await request(app).post("/api/auth/forgot-password").send({
        email: "john@example.com"
      });

      const res = await request(app).post("/api/auth/reset-password").send({
        email: "john@example.com",
        reset_token: "123456", // mocked OTP
        new_password: "NewPassword123!",
        confirm_password: "NewPassword123!"
      });
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify login with new password
      const User = mongoose.model("User");
      await User.findOneAndUpdate({ email: "john@example.com" }, { 
        email_verified: true, 
        account_status: "active" 
      });

      const loginRes = await request(app).post("/api/auth/login").send({
        email: "john@example.com",
        password: "NewPassword123!"
      });
      expect(loginRes.statusCode).toBe(200);
    });
  });
});
