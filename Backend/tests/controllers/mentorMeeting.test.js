/**
 * @file mentorMeeting.test.js
 * @description Integration and unit tests for the mentor meeting controller.
 * @architecture Validates the meeting scheduling logic and role-based assignment constraints.
 */

const mongoose = require("mongoose");
const {
  scheduleMeeting,
  completeMeeting,
} = require("../../controllers/mentorMeeting.controller");
const MentorMeeting = require("../../models/MentorMeeting");
const MentorAssignment = require("../../models/MentorAssignment");
const Notification = require("../../models/Notification");
const MeetingNotes = require("../../models/MeetingNotes");
const ActivityLog = require("../../models/ActivityLog");

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe("Mentor Meeting Controller", () => {
  afterAll(async () => {
    await mongoose.connection.close();
  });
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

      const next = jest.fn((err) => {
        if (err) console.error("NEXT ERROR:", err);
      });
      await scheduleMeeting(req, res, next);

      if (next.mock.calls.length > 0) {
        throw next.mock.calls[0][0];
      }

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

    it("should rollback meeting creation if notification fails", async () => {
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

      const next = jest.fn();

      // Mock Notification.create to throw an error
      jest
        .spyOn(Notification, "create")
        .mockRejectedValueOnce(new Error("DB Error"));

      await scheduleMeeting(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));

      const meeting = await MentorMeeting.findOne({ mentor_id: mentorId });
      expect(meeting).toBeNull();

      jest.restoreAllMocks();
    });
  });

  describe("completeMeeting", () => {
    it("should successfully complete a meeting and create an activity log", async () => {
      const meeting = await MentorMeeting.create({
        mentor_id: mentorId,
        student_id: studentId,
        startup_id: startupId,
        date: "2026-08-01",
        time: "10:00 AM",
        platform: "Zoom",
        meeting_link: "https://zoom.us/j/123",
        status: "scheduled",
      });

      await MeetingNotes.create({
        meeting_id: meeting._id,
        mentor_notes: "Great session",
      });

      const req = {
        user: { _id: mentorId },
        params: { id: meeting._id },
      };
      const res = mockResponse();

      const next = jest.fn((err) => {
        if (err) console.error("NEXT ERROR:", err);
      });
      await completeMeeting(req, res, next);

      if (next.mock.calls.length > 0) {
        throw next.mock.calls[0][0];
      }

      expect(res.status).toHaveBeenCalledWith(200);

      const updatedMeeting = await MentorMeeting.findById(meeting._id);
      expect(updatedMeeting.status).toBe("completed");

      const log = await ActivityLog.findOne({ entity_id: meeting._id });
      expect(log).not.toBeNull();
      expect(log.action).toBe("Completed a mentoring session");
    });

    it("should rollback meeting completion if activity log creation fails", async () => {
      const meeting = await MentorMeeting.create({
        mentor_id: mentorId,
        student_id: studentId,
        startup_id: startupId,
        date: "2026-08-01",
        time: "10:00 AM",
        platform: "Zoom",
        meeting_link: "https://zoom.us/j/123",
        status: "scheduled",
      });

      await MeetingNotes.create({
        meeting_id: meeting._id,
        mentor_notes: "Great session",
      });

      const req = {
        user: { _id: mentorId },
        params: { id: meeting._id },
      };
      const res = mockResponse();
      const next = jest.fn();

      jest
        .spyOn(ActivityLog, "create")
        .mockRejectedValueOnce(new Error("DB Error"));

      await completeMeeting(req, res, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));

      const revertedMeeting = await MentorMeeting.findById(meeting._id);
      expect(revertedMeeting.status).toBe("scheduled");

      jest.restoreAllMocks();
    });
  });
});
