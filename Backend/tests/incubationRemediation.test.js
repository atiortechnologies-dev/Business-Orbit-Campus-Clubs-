/**
 * @file incubationRemediation.test.js
 * @description Jest test suite verifying architectural remediation in the Incubation module.
 * @architecture Validates cascade deletions, Zod validation middleware enforcement, acceptance query filtering, and index re-application rules.
 */

const request = require("supertest");
const mongoose = require("mongoose");
const { app, server } = require("../server");
const User = require("../models/User");
const Startup = require("../models/Startup");
const IncubatorProfile = require("../models/IncubatorProfile");
const IncubationApplication = require("../models/IncubationApplication");
const ApplicationDocument = require("../models/ApplicationDocument");
const ApplicationTimeline = require("../models/ApplicationTimeline");
const IncubationAdmission = require("../models/IncubationAdmission");
const AdmissionDocument = require("../models/AdmissionDocument");
const IncubationUpdate = require("../models/IncubationUpdate");
const { generateToken } = require("../utils/token");
const { hashPassword } = require("../utils/password");
const cascadeService = require("../services/cascadeService");

describe("Incubation Architectural Remediation Tests", () => {
  let studentToken;
  let studentId;
  let startupId;
  let incubatorId;
  let incubatorUserId;

  beforeAll(async () => {
    // Database connection is managed by server import or jest config
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
    if (server && server.close) {
      server.close();
    }
  });

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

    const password_hash = await hashPassword("Password123!");
    const student = await User.create({
      full_name: "Remediation Student",
      email: "remedy@example.com",
      password_hash,
      role: "student",
      account_status: "active",
      email_verified: true,
    });
    studentId = student._id;
    studentToken = generateToken(studentId, "student", "remedy@example.com");

    const startup = await Startup.create({
      student_id: studentId,
      startup_name: "Remediation Tech",
      current_stage: 2,
    });
    startupId = startup._id;

    incubatorUserId = new mongoose.Types.ObjectId();
    const inc = await IncubatorProfile.create({
      user_id: incubatorUserId,
      incubator_name: "Remediation Incubator",
      organization: "Remediation Org",
      city: "Bangalore",
      is_approved: true,
    });
    incubatorId = inc._id;
  });

  describe("1. Cascading Deletion Verification", () => {
    it("should cascade delete incubation application and admission when Startup is deleted", async () => {
      const appDoc = await IncubationApplication.create({
        student_id: studentId,
        startup_id: startupId,
        incubator_id: incubatorId,
        application_status: "Accepted",
        startup_info: {
          startup_name: "Remediation Tech",
          startup_stage: "Stage 2",
          industry: "AI",
          problem_statement: "Problem",
          solution_summary: "Solution",
        },
        supporting_documents: { pitch_deck: "http://example.com/deck.pdf" },
        declaration_accepted: true,
        terms_accepted: true,
      });

      await ApplicationDocument.create({
        application_id: appDoc._id,
        document_type: "Pitch Deck",
        file_name: "deck.pdf",
        file_url: "http://example.com/deck.pdf",
      });

      const adm = await IncubationAdmission.create({
        application_id: appDoc._id,
        student_id: studentId,
        startup_id: startupId,
        incubator_id: incubatorId,
        status: "Active",
      });

      await AdmissionDocument.create({
        admission_id: adm._id,
        document_type: "Agreement",
        file_name: "agreement.pdf",
        file_url: "http://example.com/agreement.pdf",
      });

      // Verify records exist
      expect(await IncubationApplication.findById(appDoc._id)).not.toBeNull();
      expect(await IncubationAdmission.findById(adm._id)).not.toBeNull();

      // Trigger delete via cascadeService (simulate Mongoose hook / startup deletion)
      await cascadeService.deleteStartupDependencies(startupId);
      await Startup.deleteOne({ _id: startupId });

      // Assert orphaned records are cleaned up
      expect(await IncubationApplication.findById(appDoc._id)).toBeNull();
      expect(
        await ApplicationDocument.findOne({ application_id: appDoc._id }),
      ).toBeNull();
      expect(await IncubationAdmission.findById(adm._id)).toBeNull();
      expect(
        await AdmissionDocument.findOne({ admission_id: adm._id }),
      ).toBeNull();
    });

    it("should clean up incubator applications and updates when Incubator User is deleted", async () => {
      const appDoc = await IncubationApplication.create({
        student_id: studentId,
        startup_id: startupId,
        incubator_id: incubatorId,
        application_status: "Submitted",
        startup_info: {
          startup_name: "Remediation Tech",
          startup_stage: "Stage 2",
          industry: "AI",
          problem_statement: "Problem",
          solution_summary: "Solution",
        },
        supporting_documents: { pitch_deck: "http://example.com/deck.pdf" },
        declaration_accepted: true,
        terms_accepted: true,
      });

      await IncubationUpdate.create({
        application_id: appDoc._id,
        incubator_id: incubatorId,
        title: "Cohort Announcement",
        description: "Welcome all applicants!",
      });

      // Delete Incubator User
      await cascadeService.deleteUserDependencies(incubatorUserId);

      expect(await IncubationApplication.findById(appDoc._id)).toBeNull();
      expect(
        await IncubationUpdate.findOne({ incubator_id: incubatorId }),
      ).toBeNull();
    });
  });

  describe("2. Zod Validation Middleware Verification", () => {
    it("should return 400 Bad Request from Zod middleware when accepting offer with missing fields", async () => {
      const res = await request(app)
        .post("/api/student/incubation/accept-offer")
        .set("Authorization", `Bearer ${studentToken}`)
        .send({}) // Empty payload
        .expect(400);

      expect(res.body.success).toBe(false);
      // Verify error comes from Zod validation (has errors array or specific message)
      expect(JSON.stringify(res.body)).toMatch(
        /required|invalid|application_id/i,
      );
    });

    it("should return 400 Bad Request from Zod middleware when uploading document with invalid URL", async () => {
      const res = await request(app)
        .post("/api/student/incubation/upload-document")
        .set("Authorization", `Bearer ${studentToken}`)
        .send({
          application_id: new mongoose.Types.ObjectId().toString(),
          document_type: "Pitch Deck",
          file_name: "deck.pdf",
          file_url: "not-a-valid-url", // Malformed URL
        })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(JSON.stringify(res.body)).toMatch(/url/i);
    });
  });

  describe("3. Acceptance Query Filtering Verification", () => {
    it("should filter by application_id query parameter when multiple accepted applications exist", async () => {
      // Create a second incubator
      const inc2 = await IncubatorProfile.create({
        user_id: new mongoose.Types.ObjectId(),
        incubator_name: "Second Incubator",
        organization: "Second Org",
        city: "Delhi",
        is_approved: true,
      });

      const _app1 = await IncubationApplication.create({
        student_id: studentId,
        startup_id: startupId,
        incubator_id: incubatorId,
        application_status: "Accepted",
        startup_info: {
          startup_name: "Remediation Tech",
          startup_stage: "Stage 2",
          industry: "AI",
          problem_statement: "Problem",
          solution_summary: "Solution",
        },
        supporting_documents: { pitch_deck: "http://example.com/deck1.pdf" },
        declaration_accepted: true,
        terms_accepted: true,
      });

      const app2 = await IncubationApplication.create({
        student_id: studentId,
        startup_id: startupId,
        incubator_id: inc2._id,
        application_status: "Accepted",
        startup_info: {
          startup_name: "Remediation Tech 2",
          startup_stage: "Stage 2",
          industry: "AI",
          problem_statement: "Problem",
          solution_summary: "Solution",
        },
        supporting_documents: { pitch_deck: "http://example.com/deck2.pdf" },
        declaration_accepted: true,
        terms_accepted: true,
      });

      // Request specific application by ID
      const res = await request(app)
        .get(`/api/student/incubation/acceptance?application_id=${app2._id}`)
        .set("Authorization", `Bearer ${studentToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.application._id.toString()).toBe(
        app2._id.toString(),
      );
      expect(res.body.data.application.incubator_id.incubator_name).toBe(
        "Second Incubator",
      );
    });
  });

  describe("4. Unique Index Re-application Verification", () => {
    it("should allow submitting a new application to the same incubator if previous application was Accepted", async () => {
      // First application accepted
      await IncubationApplication.create({
        student_id: studentId,
        startup_id: startupId,
        incubator_id: incubatorId,
        application_status: "Accepted",
        startup_info: {
          startup_name: "Remediation Tech",
          startup_stage: "Stage 2",
          industry: "AI",
          problem_statement: "Problem",
          solution_summary: "Solution",
        },
        supporting_documents: { pitch_deck: "http://example.com/deck.pdf" },
        declaration_accepted: true,
        terms_accepted: true,
      });

      // Submit new application to the SAME incubator
      const res = await request(app)
        .post("/api/incubation/apply")
        .set("Authorization", `Bearer ${studentToken}`)
        .send({
          incubator_id: incubatorId.toString(),
          startup_info: {
            startup_name: "Remediation Tech",
            startup_stage: "Stage 2",
            industry: "AI",
            problem_statement: "New Problem",
            solution_summary: "New Solution",
          },
          supporting_documents: {
            pitch_deck: "http://example.com/deck_new.pdf",
          },
          declaration_accepted: true,
          terms_accepted: true,
        })
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.application_status).toBe("Submitted");
    });
  });
});
