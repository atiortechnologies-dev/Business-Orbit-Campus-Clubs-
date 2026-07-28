/**
 * @file incubationApplication.test.js
 * @description Jest test suite for Student Incubation Application Management endpoints.
 * @architecture Enforces tests for application submission, duplicate checks, edit locking, and withdrawal.
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
const { generateToken } = require("../../utils/token");
const { hashPassword } = require("../../utils/password");

describe("Incubation Application API", () => {
  let studentToken;
  let studentId;
  let startupId;
  let incubatorId;
  let otherStudentToken;

  beforeEach(async () => {
    await User.deleteMany({});
    await Startup.deleteMany({});
    await IncubatorProfile.deleteMany({});
    await IncubationApplication.deleteMany({});
    await ApplicationDocument.deleteMany({});
    await ApplicationTimeline.deleteMany({});

    // Create Student User
    const password_hash = await hashPassword("Password123!");
    const student = await User.create({
      full_name: "John Student",
      email: "john@example.com",
      password_hash,
      role: "student",
      account_status: "active",
      email_verified: true,
    });
    studentId = student._id;
    studentToken = generateToken(studentId, "student", "john@example.com");

    // Create Other Student User (unauthorized for view/edit)
    const otherStudent = await User.create({
      full_name: "Jane Other",
      email: "jane@example.com",
      password_hash,
      role: "student",
      account_status: "active",
      email_verified: true,
    });
    otherStudentToken = generateToken(
      otherStudent._id,
      "student",
      "jane@example.com",
    );

    // Create Startup for Student
    const startup = await Startup.create({
      student_id: studentId,
      startup_name: "Orbit Tech",
      current_stage: 2,
    });
    startupId = startup._id;

    // Create Approved Incubator
    const inc = await IncubatorProfile.create({
      user_id: new mongoose.Types.ObjectId(),
      incubator_name: "YC Campus Hub",
      organization: "Y Combinator",
      city: "Bangalore",
      is_approved: true,
    });
    incubatorId = inc._id;
  });

  describe("POST /api/incubation/apply", () => {
    const validPayload = () => ({
      incubator_id: incubatorId.toString(),
      startup_info: {
        startup_name: "Orbit Tech",
        startup_stage: "Stage 2",
        industry: "EdTech",
        problem_statement: "No mentoring on campus",
        solution_summary: "AI platform for clubs",
      },
      supporting_documents: {
        pitch_deck: "http://example.com/deck.pdf",
        mvp_link: "http://example.com",
      },
      declaration_accepted: true,
      terms_accepted: true,
    });

    it("should successfully submit a new incubation application", async () => {
      const res = await request(app)
        .post("/api/incubation/apply")
        .set("Authorization", `Bearer ${studentToken}`)
        .send(validPayload())
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.application_status).toBe("Submitted");

      const docs = await ApplicationDocument.find({
        application_id: res.body.data._id,
      });
      expect(docs.length).toBe(2);

      const timeline = await ApplicationTimeline.find({
        application_id: res.body.data._id,
      });
      expect(timeline.length).toBe(1);
    });

    it("should prevent duplicate active applications to the same incubator", async () => {
      // Submit first time
      await request(app)
        .post("/api/incubation/apply")
        .set("Authorization", `Bearer ${studentToken}`)
        .send(validPayload())
        .expect(201);

      // Submit second time
      const res2 = await request(app)
        .post("/api/incubation/apply")
        .set("Authorization", `Bearer ${studentToken}`)
        .send(validPayload())
        .expect(400);

      expect(res2.body.success).toBe(false);
      expect(res2.body.message).toMatch(/already have an active application/i);
    });

    it("should return 400 if student has not registered a startup", async () => {
      await Startup.deleteMany({});

      const res = await request(app)
        .post("/api/incubation/apply")
        .set("Authorization", `Bearer ${studentToken}`)
        .send(validPayload())
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/must register a startup/i);
    });
  });

  describe("GET /api/incubation/application/:id", () => {
    let appId;

    beforeEach(async () => {
      const appDoc = await IncubationApplication.create({
        student_id: studentId,
        startup_id: startupId,
        incubator_id: incubatorId,
        application_status: "Submitted",
        startup_info: {
          startup_name: "Orbit Tech",
          startup_stage: "Stage 2",
          industry: "EdTech",
          problem_statement: "Problem",
          solution_summary: "Solution",
        },
        supporting_documents: { pitch_deck: "http://example.com/deck.pdf" },
        declaration_accepted: true,
        terms_accepted: true,
      });
      appId = appDoc._id;
    });

    it("should return application details along with timeline and documents for owner", async () => {
      const res = await request(app)
        .get(`/api/incubation/application/${appId}`)
        .set("Authorization", `Bearer ${studentToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toBe(appId.toString());
      expect(res.body.data).toHaveProperty("timeline");
      expect(res.body.data).toHaveProperty("documents");
    });

    it("should return 403 if an unauthorized student attempts to view application", async () => {
      await request(app)
        .get(`/api/incubation/application/${appId}`)
        .set("Authorization", `Bearer ${otherStudentToken}`)
        .expect(403);
    });
  });

  describe("PUT /api/incubation/application/:id", () => {
    let appId;

    beforeEach(async () => {
      const appDoc = await IncubationApplication.create({
        student_id: studentId,
        startup_id: startupId,
        incubator_id: incubatorId,
        application_status: "Submitted",
        startup_info: {
          startup_name: "Orbit Tech",
          startup_stage: "Stage 2",
          industry: "EdTech",
          problem_statement: "Problem",
          solution_summary: "Solution",
        },
        supporting_documents: { pitch_deck: "http://example.com/deck.pdf" },
        declaration_accepted: true,
        terms_accepted: true,
      });
      appId = appDoc._id;
    });

    it("should allow editing when status is Submitted", async () => {
      const res = await request(app)
        .put(`/api/incubation/application/${appId}`)
        .set("Authorization", `Bearer ${studentToken}`)
        .send({
          startup_info: {
            startup_name: "Orbit Tech Updated",
          },
        })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.startup_info.startup_name).toBe(
        "Orbit Tech Updated",
      );
    });

    it("should prevent editing once status moves to Under Review (edit lock)", async () => {
      await IncubationApplication.findByIdAndUpdate(appId, {
        application_status: "Under Review",
      });

      const res = await request(app)
        .put(`/api/incubation/application/${appId}`)
        .set("Authorization", `Bearer ${studentToken}`)
        .send({
          startup_info: { startup_name: "Illegal Update" },
        })
        .expect(400);

      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/cannot be modified/i);
    });
  });

  describe("POST /api/incubation/withdraw", () => {
    let appId;

    beforeEach(async () => {
      const appDoc = await IncubationApplication.create({
        student_id: studentId,
        startup_id: startupId,
        incubator_id: incubatorId,
        application_status: "Submitted",
        startup_info: {
          startup_name: "Orbit Tech",
          startup_stage: "Stage 2",
          industry: "EdTech",
          problem_statement: "Problem",
          solution_summary: "Solution",
        },
        supporting_documents: { pitch_deck: "http://example.com/deck.pdf" },
        declaration_accepted: true,
        terms_accepted: true,
      });
      appId = appDoc._id;
    });

    it("should withdraw an active application and add timeline entry", async () => {
      const res = await request(app)
        .post("/api/incubation/withdraw")
        .set("Authorization", `Bearer ${studentToken}`)
        .send({ application_id: appId.toString() })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.application_status).toBe("Withdrawn");

      const timeline = await ApplicationTimeline.find({
        application_id: appId,
      });
      expect(timeline[0].status).toBe("Withdrawn");
    });
  });
});
