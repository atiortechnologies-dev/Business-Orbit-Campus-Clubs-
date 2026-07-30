/**
 * @file companyApplication.transactions.test.js
 * @description Verifies that multi-document writes in company workflows roll back cleanly if a dependent operation fails.
 * @architecture Integration tests focusing on Mongoose transactions.
 */

const mongoose = require("mongoose");
const companyApplicationController = require("../../controllers/companyApplication.controller");
const Application = require("../../models/Application");
const ApplicantStatus = require("../../models/ApplicantStatus");
const Notification = require("../../models/Notification");
const Opportunity = require("../../models/Opportunity");

// Setup/Teardown logic relies on tests/setup.js running globally
// But we need to pre-create collections to avoid catalog changes error in transactions
beforeAll(async () => {
  const db = mongoose.connection.db;
  const collections = await db.listCollections().toArray();
  const names = collections.map((c) => c.name);

  const required = [
    "applications",
    "applicantstatuses",
    "notifications",
    "opportunities",
  ];
  for (const name of required) {
    if (!names.includes(name)) {
      await db.createCollection(name);
    }
  }
});

beforeEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    if (collections[key]) {
      await collections[key].deleteMany({});
    }
  }
  jest.restoreAllMocks();
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("Company Application Transactions", () => {
  let mockNext;

  beforeEach(() => {
    mockNext = jest.fn((err) => {
      if (err) console.error("NEXT ERROR:", err);
    });
  });

  describe("updateApplicationStatus", () => {
    it("should rollback application status and applicant status if notification creation fails", async () => {
      // 1. Seed data
      const companyId = new mongoose.Types.ObjectId();
      const studentId = new mongoose.Types.ObjectId();
      const opportunity = await Opportunity.create({
        company_id: companyId,
        title: "Test Job",
        description: "Test Desc",
        type: "Job",
        location: "Remote",
        application_deadline: new Date(Date.now() + 1000000),
      });

      const application = await Application.create({
        opportunity_id: opportunity._id,
        student_id: studentId,
        application_status: "applied",
        resume_url: "http://example.com/resume.pdf",
      });

      // 2. Mock Notification.create to simulate failure
      jest
        .spyOn(Notification, "create")
        .mockRejectedValueOnce(new Error("Simulated Notification Failure"));

      // 3. Mock Express Request/Response
      const req = {
        params: { id: application._id.toString() },
        body: { status: "shortlisted" },
        user: { _id: companyId },
      };

      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // 4. Call Controller
      await companyApplicationController.updateApplicationStatus(
        req,
        res,
        mockNext,
      );

      // 5. Assertions
      // Ensure the error was passed to next()
      expect(mockNext).toHaveBeenCalled();
      const errorArg = mockNext.mock.calls[0][0];
      expect(errorArg.message).toBe("Simulated Notification Failure");

      // Verify the transaction was rolled back
      // The Application should still be "applied"
      const reloadedApplication = await Application.findById(application._id);
      expect(reloadedApplication.application_status).toBe("applied");

      // The ApplicantStatus history should NOT have been created
      const statuses = await ApplicantStatus.find({
        application_id: application._id,
      });
      expect(statuses.length).toBe(0);
    });
  });
});
