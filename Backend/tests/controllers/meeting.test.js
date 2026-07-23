const request = require("supertest");
const mongoose = require("mongoose");
const { app } = require("../../server");
const User = require("../../models/User");
const Startup = require("../../models/Startup");
const Meeting = require("../../models/Meeting");
const { generateToken } = require("../../utils/token");

describe("Meeting Controller", () => {
  let studentJwt;
  let studentId;
  let mentorId;

  beforeEach(async () => {
    await User.deleteMany({});
    await Startup.deleteMany({});
    await Meeting.deleteMany({});

    // Create student
    const student = await User.create({
      full_name: "Test Student",
      email: "student@example.com",
      password_hash: "hashedpass",
      role: "student",
      account_status: "active",
      email_verified: true,
    });
    studentId = student._id;
    studentJwt = generateToken(studentId, "student", "student@example.com");

    // Create mentor
    const mentor = await User.create({
      full_name: "Test Mentor",
      email: "mentor@example.com",
      password_hash: "hashedpass",
      role: "mentor",
      account_status: "active",
      email_verified: true,
    });
    mentorId = mentor._id;
  });

  describe("listMeetings", () => {
    it("should return empty list if no meetings exist", async () => {
      const res = await request(app)
        .get("/api/meetings")
        .set("Authorization", `Bearer ${studentJwt}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(0);
    });

    it("should successfully list meetings for the student's startup", async () => {
      // Create startup
      const startup = await Startup.create({
        student_id: studentId, // As per getOrCreateStartup using req.user.id
        startup_name: `${studentId}'s Startup`,
      });

      // Create meetings
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 2);
      
      const futureDate2 = new Date();
      futureDate2.setDate(futureDate2.getDate() + 5);

      await Meeting.create([
        {
          startup_id: startup._id,
          reviewer_id: mentorId,
          meeting_date: futureDate2,
          meeting_link: "https://zoom.us/j/2",
          title: "Meeting 2",
          status: "scheduled",
        },
        {
          startup_id: startup._id,
          reviewer_id: mentorId,
          meeting_date: futureDate,
          meeting_link: "https://zoom.us/j/1",
          title: "Meeting 1",
          status: "completed",
        },
      ]);

      const res = await request(app)
        .get("/api/meetings")
        .set("Authorization", `Bearer ${studentJwt}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBe(2);
      // Ensure sorted by date (ascending)
      expect(res.body.data[0].meetingLink).toBe("https://zoom.us/j/1");
      expect(res.body.data[1].meetingLink).toBe("https://zoom.us/j/2");
      expect(res.body.data[0].reviewer.name).toBe("Test Mentor");
      expect(res.body.data[0].reviewer.email).toBe("mentor@example.com");
    });
  });
});
