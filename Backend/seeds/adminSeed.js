/**
 * @file adminSeed.js
 * @description Script to programmatically seed the initial superadmin user into the database.
 * @architecture Provides a repeatable bootstrap mechanism for deploying fresh environments with required administrative access.
 */

/**
 * Goal: Script to seed the database with an initial administrator account.
 * Architecture relevance: Used during initial setup or deployment to ensure there is at least one admin user in the system to manage other entities.
 */
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/bocc",
    );
    console.log("MongoDB Connected for seeding.");

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.error("Please define ADMIN_EMAIL and ADMIN_PASSWORD in .env");
      process.exit(1);
    }

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log(`Admin user with email ${adminEmail} already exists.`);
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    const adminUser = new User({
      role: "admin",
      email: adminEmail,
      password: hashedPassword,
      status: "approved",
      emailVerified: true,
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
