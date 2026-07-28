/**
 * @file studentIncubation.test.js
 * @description Jest test suite for Student Incubation Dashboard and Acceptance Workflow endpoints.
 * @architecture Enforces tests for dashboard summary, document uploads, offer acceptance, feature unlocking, and onboarding guides.
 */

const request = require("supertest");
const mongoose = require("mongoose");
const { app } = require("../../server");
const User = require("../../models/User");
const Startup = require("../../models/Startup");
const IncubatorProfile = require("../../models/IncubatorProfile");
const IncubationApplication = require("../../models/IncubationApplication");
const ApplicationDocument = require("../../models/ApplicationDocument");
const ApplicationTimeline = require("../../models/ApplicationTimeline");
const IncubationAdmission = require("../../models/IncubationAdmission");
const AdmissionDocument = require("../../models/AdmissionDocument");
const IncubationUpdate = require("../../models/IncubationUpdate");
const { generateToken } = require("../../utils/token");
const { hashPassword } = require("../../utils/password");

describe("Student Incubation Dashboard & Acceptance API", () => {
  let studentToken;
  let studentId;
  let startupId;
  let incubatorId;
  let appId;

  beforeEach(async () => {
    await User.deleteMany({});
    await Startup.deleteMany({});
    await IncubatorProfile.deleteMany({});
    await IncubationApplication.deleteMany({});
    await ApplicationDocument.deleteMany({});
    await ApplicationTimeline.deleteMany({});
    await IncubationAdmission.deleteMany({});
    await AdmissionDocument.deleteMany({});
    await IncubationUpdate.deleteMany({});

    // Create Student User
    const password_hash = await hashPassword("Password123!");
    const student = await User.create({
      full_name: "Dashboard Student",
      email: "dash@example.com",
      password_hash,
      role: "student",
      account_status: "active",
      email_verified: true,
    });
    studentId = student._id;
    studentToken = generateToken(studentId, "student", "dash@example.com");

    // Create Startup
    const startup = await Startup.create({
      student_id: studentId,
      startup_name: "Dashboard Tech",
      current_stage: 3,
    });
    startupId = startup._id;

    // Create Incubator
    const inc = await IncubatorProfile.create({
      user_id: new mongoose.Types.ObjectId(),
      incubator_name: "Top Campus Incubator",
      organization: "Top Org",
      city: "Hyderabad",
      is_approved: true,
      contact_email: "inc@example.com",
    });
    incubatorId = inc._id;

    // Create Application
    const appDoc = await IncubationApplication.create({
      student_id: studentId,
      startup_id: startupId,
      incubator_id: incubatorId,
      application_status: "Submitted",
      startup_info: {
        startup_name: "Dashboard Tech",
        startup_stage: "Stage 3",
        industry: "AI",
        problem_statement: "Problem",
        solution_summary: "Solution",
      },
      supporting_documents: {
        pitch_deck: "http://example.com/deck.pdf",
      },
      declaration_accepted: true,
      terms_accepted: true,
    });
    appId = appDoc._id;

    await ApplicationTimeline.create({
      application_id: appId,
      status: "Submitted",
      remarks: "Initial submission",
      updated_by: studentId,
    });

    await ApplicationDocument.create({
      application_id: appId,
      document_type: "Pitch Deck",
      file_name: "deck.pdf",
      file_url: "http://example.com/deck.pdf",
    });

    await IncubationUpdate.create({
      application_id: appId,
      incubator_id: incubatorId,
      update_type: "Announcement",
      title: "Screening Started",
      description: "Your application has moved to the screening round.",
    });
  });

  describe("GET /api/student/incubation/dashboard", () => {
    it("should return applications, active admission, and recent updates", async () => {
      const res = await request(app)
        .get("/api/student/incubation/dashboard")
        .set("Authorization", `Bearer ${studentToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.applications.length).toBe(1);
      expect(res.body.data.recent_updates.length).toBe(1);
      expect(res.body.data.active_admission).toBeNull();
    });
  });

  describe("GET /api/student/incubation/timeline/:applicationId", () => {
    it("should return review timeline for application", async () => {
      const res = await request(app)
        .get(`/api/student/incubation/timeline/${appId}`)
        .set("Authorization", `Bearer ${studentToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data[0].status).toBe("Submitted");
    });
  });

  describe("GET /api/student/incubation/documents/:applicationId", () => {
    it("should return uploaded documents for application", async () => {
      const res = await request(app)
        .get(`/api/student/incubation/documents/${appId}`)
        .set("Authorization", `Bearer ${studentToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data[0].document_type).toBe("Pitch Deck");
    });
  });

  describe("POST /api/student/incubation/upload-document", () => {
    it("should upload requested document and add timeline entry", async () => {
      const res = await request(app)
        .post("/api/student/incubation/upload-document")
        .set("Authorization", `Bearer ${studentToken}`)
        .send({
          application_id: appId.toString(),
          document_type: "Financial Projections",
          file_name: "fin.xlsx",
          file_url: "http://example.com/fin.xlsx",
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.document_type).toBe("Financial Projections");

      const timeline = await ApplicationTimeline.find({
        application_id: appId,
      });
      expect(timeline.length).toBe(2);
      expect(timeline[1].remarks).toMatch(/Additional document/i);
    });
  });

  describe("GET /api/student/incubation/updates", () => {
    it("should return status updates and announcements", async () => {
      const res = await request(app)
        .get("/api/student/incubation/updates")
        .set("Authorization", `Bearer ${studentToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data[0].title).toBe("Screening Started");
    });
  });

  describe("Acceptance Workflow (GET /acceptance & POST /accept-offer)", () => {
    beforeEach(async () => {
      await IncubationApplication.findByIdAndUpdate(appId, {
        application_status: "Accepted",
      });
      const adm = await IncubationAdmission.create({
        student_id: studentId,
        startup_id: startupId,
        incubator_id: incubatorId,
        application_id: appId,
        admission_date: new Date(),
        status: "Pending",
      });
      await AdmissionDocument.create({
        admission_id: adm._id,
        document_type: "Agreement",
        file_name: "agreement.pdf",
        file_url: "http://example.com/agreement.pdf",
      });
    });

    it("should return acceptance info and compliance documents when status is Accepted", async () => {
      const res = await request(app)
        .get("/api/student/incubation/acceptance")
        .set("Authorization", `Bearer ${studentToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.application.application_status).toBe("Accepted");
      expect(res.body.data.admission_documents.length).toBe(1);
    });

    it("should accept incubation offer, activate admission, and unlock features", async () => {
      const res = await request(app)
        .post("/api/student/incubation/accept-offer")
        .set("Authorization", `Bearer ${studentToken}`)
        .send({
          application_id: appId.toString(),
          terms_accepted: true,
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe("Active");
      expect(res.body.data.unlocked_features.workspace_access).toBe(true);
      expect(res.body.data.unlocked_features.mentorship_access).toBe(true);

      const appCheck = await IncubationApplication.findById(appId);
      expect(appCheck.accepted_by_student).toBe(true);
    });

    it("should prevent accepting offer if application status is not Accepted", async () => {
      await IncubationApplication.findByIdAndUpdate(appId, {
        application_status: "Under Review",
      });

      const res = await request(app)
        .post("/api/student/incubation/accept-offer")
        .set("Authorization", `Bearer ${studentToken}`)
        .send({
          application_id: appId.toString(),
          terms_accepted: true,
        })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Status must be 'Accepted'/i);
    });
  });

  describe("GET /api/student/incubation/admission-documents & /onboarding", () => {
    beforeEach(async () => {
      const adm2 = await IncubationAdmission.create({
        student_id: studentId,
        startup_id: startupId,
        incubator_id: incubatorId,
        application_id: appId,
        admission_date: new Date(),
        status: "Active",
        unlocked_features: {
          workspace_access: true,
          mentorship_access: true,
          grant_eligibility: true,
          investor_network: true,
        },
      });

      await AdmissionDocument.create({
        admission_id: adm2._id,
        document_type: "Rules",
        file_name: "rules.pdf",
        file_url: "http://example.com/rules.pdf",
      });
    });

    it("should return admission documents for active admission", async () => {
      const res = await request(app)
        .get("/api/student/incubation/admission-documents")
        .set("Authorization", `Bearer ${studentToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data[0].document_type).toBe("Rules");
    });

    it("should return orientation schedule and welcome guide in onboarding info", async () => {
      const res = await request(app)
        .get("/api/student/incubation/onboarding")
        .set("Authorization", `Bearer ${studentToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.admission_status).toBe("Active");
      expect(res.body.data.welcome_guide.checklist.length).toBeGreaterThan(0);
      expect(res.body.data.unlocked_features.workspace_access).toBe(true);
    });
  });
});
