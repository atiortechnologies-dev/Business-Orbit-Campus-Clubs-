/**
 * @file companyOpportunity.test.js
 * @description Unit and integration tests for companyOpportunity controller.
 * @architecture Validates CRUD lifecycle and cascade deletion of dependent applications.
 */

const mongoose = require("mongoose");
const companyOpportunityController = require("../../controllers/companyOpportunity.controller");
const Opportunity = require("../../models/Opportunity");
const Application = require("../../models/Application");
const ApplicantStatus = require("../../models/ApplicantStatus");
const RecruiterNote = require("../../models/RecruiterNote");
const ApplicationInterview = require("../../models/ApplicationInterview");

describe("Company Opportunity Controller", () => {
  let companyId, otherCompanyId, studentId, opportunity;

  beforeEach(async () => {
    await Opportunity.deleteMany({});
    await Application.deleteMany({});
    await ApplicantStatus.deleteMany({});
    await RecruiterNote.deleteMany({});
    await ApplicationInterview.deleteMany({});

    companyId = new mongoose.Types.ObjectId();
    otherCompanyId = new mongoose.Types.ObjectId();
    studentId = new mongoose.Types.ObjectId();

    opportunity = await Opportunity.create({
      company_id: companyId,
      title: "Senior Developer",
      type: "Job",
      description:
        "We are looking for a senior developer with React expertise.",
      application_deadline: new Date(Date.now() + 86400000),
      status: "open",
    });
  });

  const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  describe("createOpportunity", () => {
    it("should create an opportunity for the authenticated company", async () => {
      const req = {
        user: { _id: companyId },
        body: {
          title: "Frontend Intern",
          type: "Internship",
          description: "Internship opportunity for students.",
          application_deadline: new Date(Date.now() + 86400000),
          status: "open",
        },
      };
      const res = mockRes();

      await companyOpportunityController.createOpportunity(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Opportunity created successfully",
        }),
      );
      const created = await Opportunity.findOne({ title: "Frontend Intern" });
      expect(created).not.toBeNull();
      expect(created.company_id.toString()).toBe(companyId.toString());
    });
  });

  describe("getMyOpportunities", () => {
    it("should return opportunities owned by the company", async () => {
      await Opportunity.create({
        company_id: otherCompanyId,
        title: "Other Job",
        type: "Job",
        description: "Other company job posting.",
        application_deadline: new Date(),
        status: "open",
      });

      const req = { user: { _id: companyId } };
      const res = mockRes();

      await companyOpportunityController.getMyOpportunities(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          count: 1,
        }),
      );
    });
  });

  describe("getOpportunityById", () => {
    it("should return opportunity by ID", async () => {
      const req = { params: { id: opportunity._id } };
      const res = mockRes();

      await companyOpportunityController.getOpportunityById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({ title: "Senior Developer" }),
        }),
      );
    });

    it("should return 404 if opportunity not found", async () => {
      const req = { params: { id: new mongoose.Types.ObjectId() } };
      const res = mockRes();

      await companyOpportunityController.getOpportunityById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe("updateOpportunity", () => {
    it("should update opportunity if owned by user", async () => {
      const req = {
        user: { _id: companyId },
        params: { id: opportunity._id },
        body: { title: "Lead Developer" },
      };
      const res = mockRes();

      await companyOpportunityController.updateOpportunity(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      const updated = await Opportunity.findById(opportunity._id);
      expect(updated.title).toBe("Lead Developer");
    });

    it("should return 404 if updating an opportunity owned by another company", async () => {
      const req = {
        user: { _id: otherCompanyId },
        params: { id: opportunity._id },
        body: { title: "Hacked Title" },
      };
      const res = mockRes();

      await companyOpportunityController.updateOpportunity(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe("deleteOpportunity & cascade deletion", () => {
    it("should delete opportunity and cascade delete dependent applications and statuses", async () => {
      const appDoc = await Application.create({
        opportunity_id: opportunity._id,
        student_id: studentId,
        resume_url: "http://example.com/res.pdf",
      });

      await ApplicantStatus.create({
        application_id: appDoc._id,
        status: "shortlisted",
        updated_by: companyId,
      });

      await RecruiterNote.create({
        application_id: appDoc._id,
        recruiter_id: companyId,
        note: "Great candidate",
      });

      const req = {
        user: { _id: companyId },
        params: { id: opportunity._id },
      };
      const res = mockRes();

      await companyOpportunityController.deleteOpportunity(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(await Opportunity.findById(opportunity._id)).toBeNull();
      expect(await Application.findById(appDoc._id)).toBeNull();
      expect(
        await ApplicantStatus.findOne({ application_id: appDoc._id }),
      ).toBeNull();
      expect(
        await RecruiterNote.findOne({ application_id: appDoc._id }),
      ).toBeNull();
    });
  });

  describe("getAllOpportunities", () => {
    it("should return only open opportunities for discovery", async () => {
      await Opportunity.create({
        company_id: companyId,
        title: "Draft Job",
        type: "Job",
        description: "Draft posting not visible.",
        application_deadline: new Date(),
        status: "draft",
      });

      const req = { query: {} };
      const res = mockRes();

      await companyOpportunityController.getAllOpportunities(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          count: 1, // Only Senior Developer (open)
        }),
      );
    });
  });
});
