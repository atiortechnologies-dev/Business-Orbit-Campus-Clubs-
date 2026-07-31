const request = require("supertest");
const mongoose = require("mongoose");
const { app } = require("../../server");
const User = require("../../models/User");
const CompanyProfile = require("../../models/CompanyProfile");
const Opportunity = require("../../models/Opportunity");
const SavedOpportunity = require("../../models/SavedOpportunity");
const Application = require("../../models/Application");
const ApplicantStatus = require("../../models/ApplicantStatus");
const ApplicationDocument = require("../../models/ApplicationDocument");
const ApplicationInterview = require("../../models/ApplicationInterview");

const { generateToken } = require("../../utils/token");

describe("Student Freelancing Controller", () => {
  let studentUser;
  let companyUser;
  let studentToken;
  let companyToken;
  let opp1, opp2, opp3;

  beforeAll(async () => {
    // 1. Create a student user
    studentUser = await User.create({
      full_name: "Test Student",
      email: "test.student@example.com",
      password_hash: "hashedpassword",
      role: "student",
      account_status: "active",
      email_verified: true,
    });
    studentToken = generateToken(studentUser);

    // 2. Create an active company user
    companyUser = await User.create({
      full_name: "Test Company",
      email: "test.company@example.com",
      password_hash: "hashedpassword",
      role: "company",
      account_status: "active",
      email_verified: true,
    });
    companyToken = generateToken(companyUser);

    await CompanyProfile.create({
      user_id: companyUser._id,
      company_name: "Test Company",
      industry: "Software",
      company_size: "10-50",
      website: "https://testcompany.com",
      contact_person: "John Doe",
    });

    // Create an unapproved company user
    const unapprovedCompany = await User.create({
      full_name: "Unapproved Company",
      email: "unapproved.company@example.com",
      password_hash: "hashedpassword",
      role: "company",
      account_status: "pending_approval",
      email_verified: true,
    });

    // 3. Create opportunities
    opp1 = await Opportunity.create({
      company_id: companyUser._id,
      title: "Frontend Developer",
      type: "Internship",
      work_mode: "Remote",
      industry: "Software",
      experience_level: "Entry Level",
      description: "React and Node.js developer",
      application_deadline: new Date(Date.now() + 86400000), // Tomorrow
      status: "open",
    });

    opp2 = await Opportunity.create({
      company_id: companyUser._id,
      title: "Backend Engineer",
      type: "Job",
      work_mode: "On-site",
      industry: "Software",
      experience_level: "Mid Level",
      description: "Express and MongoDB expert",
      application_deadline: new Date(Date.now() + 86400000),
      status: "open",
    });

    opp3 = await Opportunity.create({
      company_id: unapprovedCompany._id,
      title: "Data Analyst",
      type: "Freelance",
      work_mode: "Remote",
      industry: "Data",
      experience_level: "Entry Level",
      description: "Data analysis project",
      application_deadline: new Date(Date.now() + 86400000),
      status: "open",
    });

    // Create text index for search
    await Opportunity.syncIndexes();
  });

  afterAll(async () => {
    await User.deleteMany({});
    await CompanyProfile.deleteMany({});
    await Opportunity.deleteMany({});
    await SavedOpportunity.deleteMany({});
  });

  describe("GET /api/student/freelancing/opportunities", () => {
    it("should list active opportunities from approved companies only", async () => {
      const res = await request(app)
        .get("/api/student/freelancing/opportunities")
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(2); // Should not see opp3
      expect(res.body.data.some((o) => o._id === opp3._id.toString())).toBe(
        false,
      );
    });
  });

  describe("GET /api/student/freelancing/opportunities/search", () => {
    it("should return 400 if no keyword provided", async () => {
      const res = await request(app)
        .get("/api/student/freelancing/opportunities/search")
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.status).toBe(400);
    });

    it("should search opportunities by keyword", async () => {
      const res = await request(app)
        .get("/api/student/freelancing/opportunities/search?keyword=React")
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].title).toBe("Frontend Developer");
    });
  });

  describe("POST /api/student/freelancing/opportunities/filter", () => {
    it("should filter opportunities", async () => {
      const res = await request(app)
        .post("/api/student/freelancing/opportunities/filter")
        .set("Authorization", `Bearer ${studentToken}`)
        .send({ type: "Job", sort: "deadline" });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].title).toBe("Backend Engineer");
    });
  });

  describe("GET /api/student/freelancing/opportunities/:opportunityId/details", () => {
    it("should return opportunity details", async () => {
      const res = await request(app)
        .get(`/api/student/freelancing/opportunities/${opp1._id}/details`)
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.opportunity.title).toBe("Frontend Developer");
      expect(res.body.data.companyProfile.company_name).toBe("Test Company");
      expect(res.body.data.isSaved).toBe(false);
    });

    it("should return 404 for non-existent opportunity", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .get(`/api/student/freelancing/opportunities/${fakeId}/details`)
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.status).toBe(404);
    });
  });

  describe("POST /api/student/freelancing/opportunities/:opportunityId/save", () => {
    it("should save an opportunity", async () => {
      const res = await request(app)
        .post(`/api/student/freelancing/opportunities/${opp1._id}/save`)
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Opportunity saved successfully");

      const saved = await SavedOpportunity.findOne({
        student_id: studentUser._id,
        opportunity_id: opp1._id,
      });
      expect(saved).toBeTruthy();
    });

    it("should not allow duplicate saves", async () => {
      const res = await request(app)
        .post(`/api/student/freelancing/opportunities/${opp1._id}/save`)
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Opportunity is already saved");
    });

    it("should return 404 for saving non-existent opportunity", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .post(`/api/student/freelancing/opportunities/${fakeId}/save`)
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.status).toBe(404);
    });
  });

  describe("DELETE /api/student/freelancing/opportunities/:opportunityId/save", () => {
    it("should unsave an opportunity", async () => {
      const res = await request(app)
        .delete(`/api/student/freelancing/opportunities/${opp1._id}/save`)
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Opportunity removed from saved list");

      const saved = await SavedOpportunity.findOne({
        student_id: studentUser._id,
        opportunity_id: opp1._id,
      });
      expect(saved).toBeNull();
    });

    it("should return 404 if not saved", async () => {
      const res = await request(app)
        .delete(`/api/student/freelancing/opportunities/${opp1._id}/save`)
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.status).toBe(404);
    });
  });

  describe("POST /api/student/freelancing/applications", () => {
    it("should create a draft application", async () => {
      const res = await request(app)
        .post("/api/student/freelancing/applications")
        .set("Authorization", `Bearer ${studentToken}`)
        .send({
          opportunity_id: opp1._id,
          resume_url: "http://example.com/resume.pdf",
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.application_status).toBe("draft");
    });

    it("should prevent duplicate applications", async () => {
      const res = await request(app)
        .post("/api/student/freelancing/applications")
        .set("Authorization", `Bearer ${studentToken}`)
        .send({
          opportunity_id: opp1._id,
          resume_url: "http://example.com/resume2.pdf",
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/already applied/i);
    });

    it("should require resume_url", async () => {
      const res = await request(app)
        .post("/api/student/freelancing/applications")
        .set("Authorization", `Bearer ${studentToken}`)
        .send({
          opportunity_id: opp2._id,
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/Resume is required/i);
    });
  });

  describe("PUT /api/student/freelancing/applications/:applicationId", () => {
    let appId;
    beforeAll(async () => {
      const app = await Application.findOne({ opportunity_id: opp1._id });
      appId = app._id;
    });

    it("should update a draft application", async () => {
      const res = await request(app)
        .put(`/api/student/freelancing/applications/${appId}`)
        .set("Authorization", `Bearer ${studentToken}`)
        .send({
          cover_letter: "Updated cover letter",
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.cover_letter).toBe("Updated cover letter");
    });
  });

  describe("GET /api/student/freelancing/applications/:applicationId", () => {
    let appId;
    beforeAll(async () => {
      const application = await Application.findOne({
        opportunity_id: opp1._id,
      });
      appId = application._id;
    });

    it("should get application details", async () => {
      const res = await request(app)
        .get(`/api/student/freelancing/applications/${appId}`)
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.application).toBeDefined();
    });
  });

  describe("POST /api/student/freelancing/applications/:applicationId/submit", () => {
    let appId;
    beforeAll(async () => {
      const application = await Application.findOne({
        opportunity_id: opp1._id,
      });
      appId = application._id;
    });

    it("should submit a draft application", async () => {
      const res = await request(app)
        .post(`/api/student/freelancing/applications/${appId}/submit`)
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.application_status).toBe("submitted");
    });

    it("should not submit an already submitted application", async () => {
      const res = await request(app)
        .post(`/api/student/freelancing/applications/${appId}/submit`)
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/student/freelancing/applications", () => {
    it("should list student applications", async () => {
      const res = await request(app)
        .get("/api/student/freelancing/applications")
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(1);
    });
  });

  describe("GET /api/student/freelancing/applications/status", () => {
    it("should return status summary", async () => {
      const res = await request(app)
        .get("/api/student/freelancing/applications/status")
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.counts.total).toBe(1);
    });
  });

  describe("DELETE /api/student/freelancing/applications/:applicationId/withdraw", () => {
    let appId;
    beforeAll(async () => {
      const application = await Application.findOne({
        opportunity_id: opp1._id,
      });
      appId = application._id;
    });

    it("should withdraw application", async () => {
      const res = await request(app)
        .delete(`/api/student/freelancing/applications/${appId}/withdraw`)
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toMatch(/withdrawn/i);
    });
  });

  describe("GET /api/student/freelancing/applications/:applicationId/timeline", () => {
    let appId;
    beforeAll(async () => {
      const application = await Application.findOne({
        opportunity_id: opp1._id,
      });
      appId = application._id;
    });

    it("should return timeline", async () => {
      const res = await request(app)
        .get(`/api/student/freelancing/applications/${appId}/timeline`)
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.timeline)).toBe(true);
    });
  });

  describe("GET /api/student/freelancing/applications/interviews", () => {
    it("should list interviews", async () => {
      const res = await request(app)
        .get("/api/student/freelancing/applications/interviews")
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.interviews)).toBe(true);
    });
  });

  describe("File Upload Endpoints", () => {
    let appId;
    beforeAll(async () => {
      // Setup a draft application for upload testing
      const res = await request(app)
        .post("/api/student/freelancing/applications")
        .set("Authorization", `Bearer ${studentToken}`)
        .send({
          opportunity_id: opp2._id,
          resume_url: "http://example.com/initial.pdf",
        });
      appId = res.body.data._id;
    });

    it("should upload resume", async () => {
      const res = await request(app)
        .post("/api/student/freelancing/applications/upload-resume")
        .set("Authorization", `Bearer ${studentToken}`)
        .attach("file", Buffer.from("dummy resume content"), "resume.pdf");

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.url).toBeDefined();
    });

    it("should upload document and attach to application", async () => {
      const res = await request(app)
        .post("/api/student/freelancing/applications/upload-document")
        .set("Authorization", `Bearer ${studentToken}`)
        .field("application_id", appId.toString())
        .field("document_type", "Portfolio")
        .attach(
          "file",
          Buffer.from("dummy portfolio content"),
          "portfolio.pdf",
        );

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.document_type).toBe("Portfolio");
    });
  });
});
