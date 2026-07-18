/**
 * @file fullJourney.integration.test.js
 * @description Comprehensive end-to-end integration test suite mirroring the Postman Manual.
 * @architecture Executes a complete, sequential user lifecycle, flowing data from one step to the next,
 * using direct DB queries for verification and selective teardown to prevent state pollution.
 */

const request = require("supertest");
const mongoose = require("mongoose");
const argon2 = require("argon2");
const { app } = require("../server");

// Models for Direct DB Queries
const User = require("../models/User");
const EmailVerification = require("../models/EmailVerification");
const StudentProfile = require("../models/StudentProfile");
const Startup = require("../models/Startup");
const MentorRequest = require("../models/MentorRequest");
const MentorAssignment = require("../models/MentorAssignment");
const ChatRoom = require("../models/ChatRoom");
const Message = require("../models/Message");
const MentorMeeting = require("../models/MentorMeeting");
const FAQ = require("../models/FAQ");
const PartnerLogo = require("../models/PartnerLogo");
const ContactEnquiry = require("../models/ContactEnquiry");

const {
  REQUEST_STATUS,
  ASSIGNMENT_STATUS,
} = require("../constants/statusConstants");

// Mock dependencies
jest.mock("../utils/email", () => ({
  generateOTP: () => "123456",
  sendOTPEmail: jest.fn().mockResolvedValue(true),
}));

// Test State Variables
let studentJwt = "";
let mentorJwt = "";
let otpCode = "";
let studentId, mentorId, startupId, requestId, chatId;
let faqId, partnerLogoId, enquiryId;

const adminApiKey = "testadmin";
process.env.ADMIN_API_KEY = adminApiKey;
process.env.JWT_SECRET = "testsecret";

beforeAll(async () => {
  // DB Connection is managed by tests/setup.js
});

afterAll(async () => {
  // Selective Teardown: Surgically delete only what was created during this test
  if (studentId) {
    await User.deleteOne({ _id: studentId });
    await StudentProfile.deleteOne({ user_id: studentId });
    await EmailVerification.deleteOne({ userId: studentId });
  }
  if (mentorId) {
    await User.deleteOne({ _id: mentorId });
  }
  if (startupId) await Startup.deleteOne({ _id: startupId });
  if (requestId) await MentorRequest.deleteOne({ _id: requestId });
  if (mentorId) {
    await MentorAssignment.deleteMany({ mentor_id: mentorId });
    await MentorMeeting.deleteMany({ mentor_id: mentorId });
  }
  if (chatId) {
    await ChatRoom.deleteOne({ _id: chatId });
    await Message.deleteMany({ chat_id: chatId });
  }
  if (faqId) await FAQ.deleteOne({ _id: faqId });
  if (partnerLogoId) await PartnerLogo.deleteOne({ _id: partnerLogoId });
  if (enquiryId) await ContactEnquiry.deleteOne({ _id: enquiryId });

  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
});

describe("Full Lifecycle Integration Journey", () => {
  describe("Part 2: Authentication Flow", () => {
    it("Test 2.1: Register Student", async () => {
      const payload = {
        role: "student",
        full_name: "Postman Tester",
        email: "tester@example.com",
        password: "Password123!",
        confirm_password: "Password123!",
        college: "Global University",
        degree: "B.Tech",
        graduation_year: 2025,
      };

      const res = await request(app).post("/api/auth/register").send(payload);

      expect(res.status).toBe(201);

      const user = await User.findOne({ email: "tester@example.com" });
      expect(user).not.toBeNull();
      expect(user.account_status).toBe("pending_verification");

      studentId = user._id;
    });

    it("DB Query: Extract OTP", async () => {
      const otpDoc = await EmailVerification.findOne({ userId: studentId });
      expect(otpDoc).not.toBeNull();
      otpCode = otpDoc.otp;
    });

    it("Test 2.2: Verify OTP", async () => {
      const payload = {
        email: "tester@example.com",
        otp: otpCode,
      };

      const res = await request(app).post("/api/auth/verify-otp").send(payload);

      expect(res.status).toBe(200);
      expect(res.body.data.token).toBeDefined();

      studentJwt = res.body.data.token;

      const user = await User.findById(studentId);
      expect(user.account_status).toBe("active");
    });

    it("Test 2.3: Login Student", async () => {
      const payload = {
        email: "tester@example.com",
        password: "Password123!",
      };

      const res = await request(app).post("/api/auth/login").send(payload);

      expect(res.status).toBe(200);
      expect(res.body.data.token).toBeDefined();
    });
  });

  describe("Part 3 & 4: Admin CMS & Public Landing Pages", () => {
    it("Test 3.1: Admin Create FAQ", async () => {
      const payload = {
        question: "How do I join a chapter?",
        answer: "Register on the platform.",
        pageType: "Student",
      };

      const res = await request(app)
        .post("/api/admin/faqs")
        .set("x-api-key", adminApiKey)
        .send(payload);

      expect(res.status).toBe(201);

      const faq = await FAQ.findOne({ question: "How do I join a chapter?" });
      expect(faq).not.toBeNull();
      faqId = faq._id;
    });

    it("Test 3.2: Admin Create Partner Logo", async () => {
      const payload = {
        name: "Tech Corp Inc.",
        logoUrl: "https://example.com/logo.png",
        category: "Technology Partner",
      };

      const res = await request(app)
        .post("/api/admin/partner-logos")
        .set("x-api-key", adminApiKey)
        .send(payload);

      expect(res.status).toBe(201);

      const logo = await PartnerLogo.findOne({ name: "Tech Corp Inc." });
      expect(logo).not.toBeNull();
      partnerLogoId = logo._id;
    });

    it("Test 4.1: Public Fetch FAQs", async () => {
      const res = await request(app).get("/api/public/faqs?pageType=Student");

      expect(res.status).toBe(200);
      expect(res.body.data).toBeInstanceOf(Array);

      const foundFaq = res.body.data.find(
        (f) => f.question === "How do I join a chapter?",
      );
      expect(foundFaq).toBeDefined();
    });

    it("Test 4.2: Public Submit Enquiry", async () => {
      const payload = {
        companyName: "Future Tech",
        contactPerson: "John Smith",
        email: "john@futuretech.com",
        message: "We would like to partner.",
      };

      const res = await request(app)
        .post("/api/public/enquiries")
        .send(payload);

      expect(res.status).toBe(201);

      const enquiry = await ContactEnquiry.findOne({
        email: "john@futuretech.com",
      });
      expect(enquiry).not.toBeNull();
      enquiryId = enquiry._id;
    });
  });

  describe("Transition Data Seeding", () => {
    it("Seed Data directly to MongoDB (Bypassing 501 Endpoints)", async () => {
      const startup = await Startup.create({
        name: "Postman Startup Inc.",
        stage: "MVP",
        category: "EdTech",
        idea: "Revolutionizing postman tests",
        progress: "Building prototype",
      });
      startupId = startup._id;

      const passwordHash = await argon2.hash("Password123!");
      const mentor = await User.create({
        full_name: "Postman Mentor",
        email: "mentor@example.com",
        password_hash: passwordHash,
        role: "mentor",
        account_status: "active",
        email_verified: true,
      });
      mentorId = mentor._id;

      const requestObj = await MentorRequest.create({
        student_id: studentId,
        startup_id: startupId,
        mentor_id: mentorId,
        request_summary: "We need guidance on testing.",
        status: REQUEST_STATUS.PENDING,
      });
      requestId = requestObj._id;
    });

    it("Test T.1: Mentor Login", async () => {
      const payload = {
        email: "mentor@example.com",
        password: "Password123!",
      };

      const res = await request(app).post("/api/auth/login").send(payload);

      expect(res.status).toBe(200);
      mentorJwt = res.body.data.token;
    });
  });

  describe("Part 5: Mentor Dashboard Flow", () => {
    let apiRequestId, apiStudentId, apiStartupId, apiChatId;

    it("Test 5.1: Mentor Dashboard Summary", async () => {
      const res = await request(app)
        .get("/api/mentor/dashboard")
        .set("Authorization", `Bearer ${mentorJwt}`);

      expect(res.status).toBe(200);
      expect(res.body.activeStudents).toBeDefined();
      expect(res.body.pendingRequests).toBeDefined();
    });

    it("Test 5.2: Get Recent Requests", async () => {
      const res = await request(app)
        .get("/api/mentor/requests/recent")
        .set("Authorization", `Bearer ${mentorJwt}`);

      expect(res.status).toBe(200);

      const targetRequest = res.body.find(
        (r) => r.requestId.toString() === requestId.toString(),
      );
      expect(targetRequest).toBeDefined();
      expect(targetRequest.studentId).toBeDefined();
      expect(targetRequest.startupId).toBeDefined();

      apiRequestId = targetRequest.requestId;
      apiStudentId = targetRequest.studentId;
      apiStartupId = targetRequest.startupId;
    });

    it("Test 5.3: View Student Profile", async () => {
      const res = await request(app)
        .get(`/api/mentor/student/${apiStudentId}/profile`)
        .set("Authorization", `Bearer ${mentorJwt}`);

      expect(res.status).toBe(200);
      expect(res.body.studentInformation.name).toBe("Postman Tester");
      expect(res.body.startupInformation.name).toBe("Postman Startup Inc.");
    });

    it("Test 5.4: Accept Mentorship Request", async () => {
      const res = await request(app)
        .patch(`/api/mentor/requests/${apiRequestId}/accept`)
        .set("Authorization", `Bearer ${mentorJwt}`);

      expect(res.status).toBe(200);

      // Direct DB Verifications
      const requestObj = await MentorRequest.findById(requestId);
      expect(requestObj.status).toBe(REQUEST_STATUS.ACCEPTED);

      const assignment = await MentorAssignment.findOne({
        mentor_id: mentorId,
        startup_id: startupId,
      });
      expect(assignment).not.toBeNull();
      expect(assignment.status).toBe(ASSIGNMENT_STATUS.ACTIVE);

      const room = await ChatRoom.findOne({ startup_id: startupId });
      expect(room).not.toBeNull();
    });

    it("Test 5.5: Fetch Initialized Chat Rooms", async () => {
      const res = await request(app)
        .get("/api/mentor/chats")
        .set("Authorization", `Bearer ${mentorJwt}`);

      expect(res.status).toBe(200);
      const room = res.body.find(
        (r) => r.startupId.toString() === apiStartupId.toString(),
      );
      expect(room).toBeDefined();

      apiChatId = room.chatId;
      chatId = apiChatId; // Store in global for teardown
    });

    it("Test 5.6: Send Chat Message", async () => {
      const res = await request(app)
        .post(`/api/mentor/chats/${apiChatId}/messages`)
        .set("Authorization", `Bearer ${mentorJwt}`)
        .send({ message: "Hello! Looking forward to working together." });

      expect(res.status).toBe(201);

      const message = await Message.findOne({ chat_id: chatId });
      expect(message).not.toBeNull();
      expect(message.message).toBe(
        "Hello! Looking forward to working together.",
      );
    });

    it("Test 5.7: Fetch Chat Messages", async () => {
      const res = await request(app)
        .get(`/api/mentor/chats/${apiChatId}/messages`)
        .set("Authorization", `Bearer ${mentorJwt}`);

      expect(res.status).toBe(200);
      expect(res.body.messages.length).toBeGreaterThan(0);
      expect(res.body.messages[0].message).toBe(
        "Hello! Looking forward to working together.",
      );
    });

    it("Test 5.8: Schedule a Meeting", async () => {
      const payload = {
        studentId: apiStudentId,
        startupId: apiStartupId,
        date: "2026-08-01",
        time: "14:00",
        platform: "Zoom",
        meetingLink: "https://zoom.us/j/123456789",
      };

      const res = await request(app)
        .post("/api/mentor/meetings")
        .set("Authorization", `Bearer ${mentorJwt}`)
        .send(payload);

      expect(res.status).toBe(201);
    });

    it("Test 5.9: Unlock Startup Details", async () => {
      const res = await request(app)
        .get(`/api/mentor/startups/${apiStartupId}`)
        .set("Authorization", `Bearer ${mentorJwt}`);

      expect(res.status).toBe(200);
      expect(res.body.name).toBe("Postman Startup Inc.");
      expect(res.body.stage).toBe("MVP");
    });
  });
});
