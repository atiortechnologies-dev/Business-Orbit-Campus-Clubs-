const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const studentRoutes = require("../../routes/student.routes");
const { errorHandler } = require("../../middlewares/errorHandler");

const app = express();
app.use(express.json());
app.use("/api/student", studentRoutes);
app.use(errorHandler);
const User = require("../../models/User");
const MentorProfile = require("../../models/MentorProfile");
const MentorMeeting = require("../../models/MentorMeeting");
const MentorReview = require("../../models/MentorReview");
const { generateToken } = require("../../utils/token");

describe("Student Mentor Reviews Controller", () => {
  let studentUser, mentorUser, _otherMentorUser, _mentorProfile;
  let studentToken, _mentorToken;

  beforeEach(async () => {
    // Clear collections
    await User.deleteMany({});
    await MentorProfile.deleteMany({});
    await MentorMeeting.deleteMany({});
    await MentorReview.deleteMany({});

    // Create student
    studentUser = await User.create({
      full_name: "Test Student",
      email: "student@test.com",
      password_hash: "hashedpassword",
      role: "student",
      account_status: "active",
      email_verified: true,
    });
    studentToken = generateToken(studentUser);

    // Create mentor
    mentorUser = await User.create({
      full_name: "Test Mentor",
      email: "mentor@test.com",
      password_hash: "hashedpassword",
      role: "mentor",
      account_status: "active",
      email_verified: true,
    });
    _mentorToken = generateToken(mentorUser);

    // Create other mentor
    _otherMentorUser = await User.create({
      full_name: "Other Mentor",
      email: "othermentor@test.com",
      password_hash: "hashedpassword",
      role: "mentor",
      account_status: "active",
      email_verified: true,
    });

    // Create mentor profile
    _mentorProfile = await MentorProfile.create({
      user_id: mentorUser._id,
      organization: "Tech Corp",
      designation: "Senior Engineer",
      expertise: "Backend",
      years_of_experience: 5,
      profile_status: "completed",
    });
  });

  describe("POST /api/student/mentors/:id/reviews", () => {
    it("should return 403 if student has no completed meeting with mentor", async () => {
      // Create a scheduled (but not completed) meeting
      await MentorMeeting.create({
        mentor_id: mentorUser._id,
        student_id: studentUser._id,
        startup_id: new mongoose.Types.ObjectId(), // Dummy startup ID
        date: new Date(),
        time: "10:00",
        platform: "Zoom",
        meeting_link: "http://zoom.us",
        status: "scheduled",
      });

      const res = await request(app)
        .post(`/api/student/mentors/${mentorUser._id}/reviews`)
        .set("Authorization", `Bearer ${studentToken}`)
        .send({
          rating: 4,
          review_text: "Great mentor, but hasn't happened yet.",
        });

      expect(res.statusCode).toBe(403);
      expect(res.body.message).toMatch(/completed session/i);
    });

    it("should successfully submit a review and update mentor rating if meeting is completed", async () => {
      // Create a completed meeting
      await MentorMeeting.create({
        mentor_id: mentorUser._id,
        student_id: studentUser._id,
        startup_id: new mongoose.Types.ObjectId(), // Dummy startup ID
        date: new Date(),
        time: "10:00",
        platform: "Zoom",
        meeting_link: "http://zoom.us",
        status: "completed",
      });

      const res = await request(app)
        .post(`/api/student/mentors/${mentorUser._id}/reviews`)
        .set("Authorization", `Bearer ${studentToken}`)
        .send({
          rating: 5,
          review_text: "Amazing mentor!",
        });

      expect(res.statusCode).toBe(200);

      // Verify review exists
      const review = await MentorReview.findOne({
        mentor_id: mentorUser._id,
        student_id: studentUser._id,
      });
      expect(review).not.toBeNull();
      expect(review.rating).toBe(5);

      // Verify mentor profile is updated
      const updatedProfile = await MentorProfile.findOne({
        user_id: mentorUser._id,
      });
      expect(updatedProfile.rating).toBe(5);
    });

    it("should average multiple reviews correctly", async () => {
      // We need another student
      const studentUser2 = await User.create({
        full_name: "Student 2",
        email: "student2@test.com",
        password_hash: "hashedpassword",
        role: "student",
        account_status: "active",
        email_verified: true,
      });
      const studentToken2 = generateToken(studentUser2);

      // Both students have completed meetings
      await MentorMeeting.create({
        mentor_id: mentorUser._id,
        student_id: studentUser._id,
        startup_id: new mongoose.Types.ObjectId(),
        date: new Date(),
        time: "10:00",
        platform: "Zoom",
        meeting_link: "http://zoom.us",
        status: "completed",
      });

      await MentorMeeting.create({
        mentor_id: mentorUser._id,
        student_id: studentUser2._id,
        startup_id: new mongoose.Types.ObjectId(),
        date: new Date(),
        time: "11:00",
        platform: "Zoom",
        meeting_link: "http://zoom.us",
        status: "completed",
      });

      // Student 1 leaves a 5 star
      await request(app)
        .post(`/api/student/mentors/${mentorUser._id}/reviews`)
        .set("Authorization", `Bearer ${studentToken}`)
        .send({ rating: 5 });

      // Student 2 leaves a 3 star
      await request(app)
        .post(`/api/student/mentors/${mentorUser._id}/reviews`)
        .set("Authorization", `Bearer ${studentToken2}`)
        .send({ rating: 3 });

      // Average should be 4
      const updatedProfile = await MentorProfile.findOne({
        user_id: mentorUser._id,
      });
      expect(updatedProfile.rating).toBe(4);
    });
  });

  describe("GET /api/student/mentors/:id/reviews", () => {
    it("should fetch paginated reviews", async () => {
      // Create some dummy reviews
      await MentorReview.create({
        mentor_id: mentorUser._id,
        student_id: studentUser._id,
        rating: 5,
        review_text: "Excellent!",
      });

      const res = await request(app)
        .get(`/api/student/mentors/${mentorUser._id}/reviews?page=1&limit=10`)
        .set("Authorization", `Bearer ${studentToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(1);
      expect(res.body.data[0].rating).toBe(5);
      expect(res.body.data[0].student_id.full_name).toBe("Test Student");
    });
  });
});
