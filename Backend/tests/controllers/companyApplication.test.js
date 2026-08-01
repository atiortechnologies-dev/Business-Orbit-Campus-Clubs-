/**
 * @file companyApplication.test.js
 * @description Tests for company application controller.
 * @architecture Validates controller logic for managing applications and checking authorizations.
 */

const mongoose = require("mongoose");
const companyApplicationController = require("../../controllers/companyApplication.controller");
const Opportunity = require("../../models/Opportunity");
const Application = require("../../models/Application");
const ApplicantStatus = require("../../models/ApplicantStatus");
const RecruiterNote = require("../../models/RecruiterNote");
const ApplicationInterview = require("../../models/ApplicationInterview");
const _User = require("../../models/User");

describe("Company Application Controller", () => {
  let companyId, studentId, otherCompanyId, opportunity, application;

  beforeEach(async () => {
    // Clear collections
    await Opportunity.deleteMany({});
    await Application.deleteMany({});
    await ApplicantStatus.deleteMany({});
    await RecruiterNote.deleteMany({});
    await ApplicationInterview.deleteMany({});

    companyId = new mongoose.Types.ObjectId();
    studentId = new mongoose.Types.ObjectId();
    otherCompanyId = new mongoose.Types.ObjectId();

    opportunity = await Opportunity.create({
      company_id: companyId,
      title: "Test Job",
      type: "Job",
      description: "Test description",
      application_deadline: new Date(Date.now() + 86400000), // Tomorrow
      status: "open",
    });

    application = await Application.create({
      opportunity_id: opportunity._id,
      student_id: studentId,
      resume_url: "http://example.com/resume.pdf",
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  const mockNext = jest.fn((err) => {
    if (err) console.error("NEXT ERROR:", err);
  });

  describe("getApplicants", () => {
    it("should return applicants for a valid opportunity owned by the company", async () => {
      const req = {
        params: { id: opportunity._id },
        user: { _id: companyId },
        query: {},
      };
      const res = mockResponse();

      await companyApplicationController.getApplicants(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.any(Array),
        }),
      );
      expect(res.json.mock.calls[0][0].data.length).toBe(1);
    });

    it("should return 403 if accessed by a different company", async () => {
      const req = {
        params: { id: opportunity._id },
        user: { _id: otherCompanyId },
      };
      const res = mockResponse();

      await companyApplicationController.getApplicants(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(403);
    });
  });

  describe("updateApplicationStatus", () => {
    it("should update status and create an audit log", async () => {
      const req = {
        params: { id: application._id },
        body: { status: "shortlisted" },
        user: { _id: companyId },
      };
      const res = mockResponse();

      await companyApplicationController.updateApplicationStatus(
        req,
        res,
        mockNext,
      );

      expect(res.status).toHaveBeenCalledWith(200);

      const updatedApp = await Application.findById(application._id);
      expect(updatedApp.application_status).toBe("shortlisted");

      const log = await ApplicantStatus.findOne({
        application_id: application._id,
      });
      expect(log).not.toBeNull();
      expect(log.status).toBe("shortlisted");
    });
  });

  describe("scheduleInterview", () => {
    it("should schedule interview and update status to interviewing", async () => {
      const req = {
        params: { id: application._id },
        body: {
          interview_date: new Date(Date.now() + 86400000), // Tomorrow
          meeting_link: "http://zoom.us/test",
        },
        user: { _id: companyId },
      };
      const res = mockResponse();

      await companyApplicationController.scheduleInterview(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(201);

      const interview = await ApplicationInterview.findOne({
        application_id: application._id,
      });
      expect(interview).not.toBeNull();
      expect(interview.meeting_link).toBe("http://zoom.us/test");

      const updatedApp = await Application.findById(application._id);
      expect(updatedApp.application_status).toBe("interviewing");
    });

    it("should reject past interview dates", async () => {
      const req = {
        params: { id: application._id },
        body: {
          interview_date: new Date(Date.now() - 86400000), // Yesterday
          meeting_link: "http://zoom.us/test",
        },
        user: { _id: companyId },
      };
      const res = mockResponse();

      await companyApplicationController.scheduleInterview(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
  describe("getStats", () => {
    it("should return correct application stats for an opportunity", async () => {
      const req = {
        params: { id: opportunity._id },
        user: { _id: companyId },
      };
      const res = mockResponse();

      await companyApplicationController.getStats(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            total: 1,
            applied: 1,
            shortlisted: 0,
            rejected: 0,
          }),
        }),
      );
    });
  });

  describe("filterApplications", () => {
    it("should return filtered applications", async () => {
      const req = {
        body: { status: "applied", opportunity_id: opportunity._id },
        user: { _id: companyId },
        query: {},
      };
      const res = mockResponse();

      await companyApplicationController.filterApplications(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json.mock.calls[0][0].data.length).toBe(1);
    });
  });

  describe("getApplicationDetails", () => {
    it("should return full applicant profile", async () => {
      const req = {
        params: { id: application._id },
        user: { _id: companyId },
      };
      const res = mockResponse();

      await companyApplicationController.getApplicationDetails(
        req,
        res,
        mockNext,
      );

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            application: expect.objectContaining({
              _id: application._id,
            }),
          }),
        }),
      );
    });
  });

  describe("addRecruiterNote", () => {
    it("should add a recruiter note", async () => {
      const req = {
        params: { id: application._id },
        body: { note: "Great candidate" },
        user: { _id: companyId },
      };
      const res = mockResponse();

      await companyApplicationController.addRecruiterNote(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(201);
      const note = await RecruiterNote.findOne({
        application_id: application._id,
      });
      expect(note).not.toBeNull();
      expect(note.note).toBe("Great candidate");
    });
  });

  describe("getResume", () => {
    it("should return resume url", async () => {
      const req = {
        params: { id: application._id },
        user: { _id: companyId },
      };
      const res = mockResponse();

      await companyApplicationController.getResume(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          data: expect.objectContaining({
            resume_url: "http://example.com/resume.pdf",
          }),
        }),
      );
    });
  });
});
