/**
 * @file adminSeed.js
 * @description Script to programmatically seed the initial superadmin user into the database.
 * @architecture Provides a repeatable bootstrap mechanism for deploying fresh environments with required administrative access.
 */

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");
const { hashPassword } = require("../utils/password");

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB Connected for seeding.");

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME || "Super Admin";

    if (!adminEmail || !adminPassword) {
      console.error("Please define ADMIN_EMAIL and ADMIN_PASSWORD in .env");
      process.exit(1);
    }

    if (adminPassword.length < 8) {
      console.error("ADMIN_PASSWORD must be at least 8 characters long.");
      process.exit(1);
    }

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log(`Admin user with email ${adminEmail} already exists.`);
      process.exit(0);
    }

    // Hash with argon2 (matches utils/password.js, which is what the login
    // flow uses to verify credentials). Field names below match models/User.js
    // exactly: password_hash, account_status, email_verified.
    const password_hash = await hashPassword(adminPassword);

    const adminUser = new User({
      full_name: adminName,
      role: "admin",
      email: adminEmail,
      password_hash,
      account_status: "active",
      email_verified: true,
      profile_status: "completed",
    });

    await adminUser.save();
    console.log(`Admin user ${adminEmail} seeded successfully!`);
  } catch (error) {
    console.error(`Error seeding admin: ${error.message}`);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
  }
};

seedAdmin();
