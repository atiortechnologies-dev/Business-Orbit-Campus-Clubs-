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
const { hashPassword } = require("../utils/password");
const dotenv = require("dotenv");
const User = require("../models/User");
const readline = require("readline");

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const askQuestion = (query) => {
  return new Promise((resolve) => rl.question(query, resolve));
};

const seedAdmin = async () => {
  try {
    // Parse command line arguments
    const args = process.argv.slice(2);
    let argEmail, argPassword, argName;

    for (let i = 0; i < args.length; i++) {
      if (args[i] === "--email" || args[i] === "-e") argEmail = args[i + 1];
      if (args[i] === "--password" || args[i] === "-p") argPassword = args[i + 1];
      if (args[i] === "--name" || args[i] === "-n") argName = args[i + 1];
    }

    // Determine values with priority: Args -> Prompt
    let adminEmail = argEmail;
    let adminPassword = argPassword;
    let adminName = argName || "Super Admin";

    // Ask for missing required fields
    if (!adminEmail) {
      const emailInput = await askQuestion("Enter super_admin email: ");
      adminEmail = emailInput.trim();
    }

    if (!adminPassword) {
      const pwdInput = await askQuestion("Enter super_admin password: ");
      adminPassword = pwdInput.trim();
    }

    if (!argName) {
      const nameInput = await askQuestion(`Enter super_admin full name [${adminName}]: `);
      if (nameInput.trim()) {
        adminName = nameInput.trim();
      }
    }

    rl.close();

    if (!adminEmail || !adminPassword || !adminName) {
      console.error("Missing required inputs for super_admin creation.");
      process.exit(1);
    }

    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/bocc",
    );
    console.log("MongoDB Connected for seeding.");

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log(`Admin user with email ${adminEmail} already exists.`);
      process.exit(0);
    }

    const hashedPassword = await hashPassword(adminPassword);

    const adminUser = new User({
      full_name: adminName,
      role: "super_admin",
      email: adminEmail,
      password_hash: hashedPassword,
      account_status: "active",
      email_verified: true,
    });

    await adminUser.save();
    console.log(`Super Admin user '${adminName}' (${adminEmail}) seeded successfully!`);
  } catch (error) {
    console.error(`Error seeding admin: ${error.message}`);
    process.exit(1);
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.connection.close();
      console.log("MongoDB connection closed.");
    }
  }
};

seedAdmin();
