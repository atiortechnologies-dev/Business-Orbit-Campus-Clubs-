/**
 * @file startup.test.js
 * @description Integration and unit tests for the startup controller.
 * @architecture Validates mentor authorization and retrieval logic for startup details.
 */

const mongoose = require("mongoose");
const { getStartupDetails } = require("../../controllers/startup.controller");
const Startup = require("../../models/Startup");
const MentorAssignment = require("../../models/MentorAssignment");

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Startup Controller", () => {
  let mentorId, studentId, startupId;

  beforeEach(async () => {
    mentorId = new mongoose.Types.ObjectId();
    studentId = new mongoose.Types.ObjectId();
    startupId = new mongoose.Types.ObjectId();

    await Startup.create({
      _id: startupId,
      name: "Test Startup",
      stage: "Seed",
      category: "EdTech",
      idea: "Test Idea",
      progress: "Building MVP",
    });
  });

  describe("getStartupDetails", () => {
    it("should successfully retrieve startup details if assigned", async () => {
      await MentorAssignment.create({
        mentor_id: mentorId,
        student_id: studentId,
        startup_id: startupId,
        status: "active",
      });

      const req = {
        user: { _id: mentorId },
        params: { startupId },
      };
      const res = mockResponse();

      await getStartupDetails(req, res, () => {});
      expect(res.status).toHaveBeenCalledWith(200);

      const data = res.json.mock.calls[0][0];
      expect(data.name).toBe("Test Startup");
      expect(data.progress).toBe("Building MVP");
    });

    it("should return 403 if mentor is not actively assigned", async () => {
      const req = {
        user: { _id: mentorId },
        params: { startupId },
      };
      const res = mockResponse();

      await getStartupDetails(req, res, () => {});
      expect(res.status).toHaveBeenCalledWith(403);
    });

    it("should return 404 if startup does not exist", async () => {
      await MentorAssignment.create({
        mentor_id: mentorId,
        student_id: studentId,
        startup_id: new mongoose.Types.ObjectId(),
        status: "active",
      });

      const req = {
        user: { _id: mentorId },
        params: { startupId: new mongoose.Types.ObjectId() },
      };
      const res = mockResponse();

      await getStartupDetails(req, res, () => {});
      expect(res.status).toHaveBeenCalledWith(403); // Actually it returns 403 because the assignment check fails first. Let's mock a valid assignment but invalid startup.

      // Wait, if assignment is valid, startup_id exists in assignment. So the assignment query will find it.
      // But we can create an assignment for a startup that was deleted from the DB.
      const deletedStartupId = new mongoose.Types.ObjectId();
      await MentorAssignment.create({
        mentor_id: mentorId,
        student_id: studentId,
        startup_id: deletedStartupId,
        status: "active",
      });

      const req2 = {
        user: { _id: mentorId },
        params: { startupId: deletedStartupId },
      };
      const res2 = mockResponse();

      await getStartupDetails(req2, res2, () => {});
      expect(res2.status).toHaveBeenCalledWith(404);
    });
  });
});
