/**
 * @file seedRequests.js
 * @description Database seed script to generate mock data for mentor requests and related entities.
 * @architecture A standalone utility script to populate the development database with testing data.
 */

require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");
const StudentProfile = require("../models/StudentProfile");
const Startup = require("../models/Startup");
const MentorRequest = require("../models/MentorRequest");

/**
 * @desc    Seeds the database with mock mentor requests, students, and startups for development purposes.
 */
const seedRequests = async () => {
  try {
    // 1. Connect to the database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB...");

    // 2. Find a mentor
    const mentor = await User.findOne({ role: "mentor" });
    if (!mentor) {
      console.log(
        "❌ No mentor found in the database. Please register a mentor first.",
      );
      process.exit(1);
    }
    console.log(`Found Mentor: ${mentor.full_name} (${mentor.email})`);

    // 3. Create mock Students
    const student1 = new User({
      full_name: "Alice Founder",
      email: "alice@example.com",
      password_hash: "dummyhash",
      role: "student",
      account_status: "active",
      email_verified: true,
    });
    const student2 = new User({
      full_name: "Bob Innovator",
      email: "bob@example.com",
      password_hash: "dummyhash",
      role: "student",
      account_status: "active",
      email_verified: true,
    });
    await student1.save();
    await student2.save();

    // 4. Create mock Student Profiles
    await new StudentProfile({
      user_id: student1._id,
      college: "Global Tech University",
      degree: "B.Tech Computer Science",
      graduation_year: 2025,
    }).save();

    await new StudentProfile({
      user_id: student2._id,
      college: "State Business School",
      degree: "MBA",
      graduation_year: 2024,
    }).save();

    // 5. Create mock Startups
    const startup1 = new Startup({
      name: "CryptoLearn",
      category: "EdTech",
      idea: "A gamified platform to learn Web3.",
      stage: "Idea",
    });
    const startup2 = new Startup({
      name: "AgriSense",
      category: "AgriTech",
      idea: "IoT sensors for soil health monitoring.",
      stage: "MVP",
      progress: "Built the hardware prototype, looking for seed funding.",
      mvp_details: "https://example.com/demo",
    });
    await startup1.save();
    await startup2.save();

    // 6. Create Mentor Requests
    await new MentorRequest({
      mentor_id: mentor._id,
      student_id: student1._id,
      startup_id: startup1._id,
      problem_statement: "We are struggling with our blockchain architecture.",
      help_required: "We would love your guidance!",
      preferred_meeting_mode: "online",
      preferred_time: "Weekends",
      additional_notes: "",
      status: "pending",
    }).save();

    await new MentorRequest({
      mentor_id: mentor._id,
      student_id: student2._id,
      startup_id: startup2._id,
      problem_statement: "We have an MVP but need help structuring our pitch deck.",
      help_required: "Need help structuring pitch deck for investors.",
      preferred_meeting_mode: "online",
      preferred_time: "Weekdays evening",
      additional_notes: "",
      status: "pending",
    }).save();

    console.log(
      `✅ Successfully seeded 2 MentorRequests for ${mentor.full_name}!`,
    );
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding requests:", error);
    process.exit(1);
  }
};

seedRequests();
