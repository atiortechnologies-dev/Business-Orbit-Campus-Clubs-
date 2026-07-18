/**
 * @file mentorMeeting.test.js
 * @description Integration and unit tests for the mentor meeting controller.
 * @architecture Validates the meeting scheduling logic and role-based assignment constraints.
 */

const mongoose = require("mongoose");
const {
  scheduleMeeting,
} = require("../../controllers/mentorMeeting.controller");
const MentorMeeting = require("../../models/MentorMeeting");
const MentorAssignment = require("../../models/MentorAssignment");

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Mentor Meeting Controller", () => {
  let mentorId, studentId, startupId;

  beforeEach(() => {
    mentorId = new mongoose.Types.ObjectId();
    studentId = new mongoose.Types.ObjectId();
    startupId = new mongoose.Types.ObjectId();
  });

  describe("scheduleMeeting", () => {
    it("should successfully schedule a meeting if assignment is active", async () => {
      await MentorAssignment.create({
        mentor_id: mentorId,
        student_id: studentId,
        startup_id: startupId,
        status: "active",
      });

      const req = {
        user: { _id: mentorId },
        body: {
          studentId,
          startupId,
          date: "2026-08-01",
          time: "10:00 AM",
          platform: "Zoom",
          meetingLink: "https://zoom.us/j/123",
        },
      };
      const res = mockResponse();

      await scheduleMeeting(req, res, () => {});
      expect(res.status).toHaveBeenCalledWith(201);

      const meeting = await MentorMeeting.findOne({ mentor_id: mentorId });
      expect(meeting).not.toBeNull();
      expect(meeting.platform).toBe("Zoom");
    });

    it("should return 400 if fields are missing", async () => {
      const req = { user: { _id: mentorId }, body: { studentId } };
      const res = mockResponse();

      await scheduleMeeting(req, res, () => {});
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });
});
