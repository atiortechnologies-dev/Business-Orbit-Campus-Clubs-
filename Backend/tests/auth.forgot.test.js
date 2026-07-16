/**
 * Goal: Tests the forgot password functionality.
 * Architecture relevance: Validates the endpoint responsible for generating password reset tokens and sending reset emails, which is a critical part of the user account lifecycle.
 */
const mongoose = require("mongoose");
const { spawn } = require("child_process");
const User = require("../models/User");
const PasswordReset = require("../models/PasswordReset");
const { hashPassword } = require("../utils/hash");
require("dotenv").config();

const API_URL = `http://localhost:${process.env.PORT || 5000}/api/auth`;

const setupTestData = async () => {
  await mongoose.connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/bocc",
  );

  // Cleanup
  await User.deleteMany({ email: "testforgot@bocc.com" });
  await PasswordReset.deleteMany({}); // clear all resets for clean test

  const password = await hashPassword("password123");

  // Create one valid user
  const user = new User({
    role: "student",
    email: "testforgot@bocc.com",
    password,
    status: "approved",
    emailVerified: true,
  });
  await user.save();
  console.log("Test user seeded.");
};

const cleanupTestData = async () => {
  await User.deleteMany({ email: "testforgot@bocc.com" });
  await PasswordReset.deleteMany({});
  await mongoose.connection.close();
  console.log("Test data cleaned up.");
};

const makeRequest = async (body) => {
  const response = await fetch(`${API_URL}/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return { status: response.status, data };
};

const runTests = async () => {
  console.log("\\n--- Running Forgot Password API Tests ---\\n");
  let allPassed = true;

  const assert = (name, condition, details) => {
    if (condition) {
      console.log(`✅ PASS: ${name}`);
    } else {
      console.log(`❌ FAIL: ${name} -> ${details}`);
      allPassed = false;
    }
  };

  const expectedMessage =
    "If an account with that email exists, an OTP has been sent.";

  // Case 1: Valid Email
  let res = await makeRequest({ email: "testforgot@bocc.com" });
  assert(
    "1. Valid email (200 + generic msg)",
    res.status === 200 && res.data.message === expectedMessage,
    `Got ${res.status} - ${res.data.message}`,
  );

  // Verify OTP was stored in DB correctly
  const resetDoc = await PasswordReset.findOne({}).populate("userId");
  assert(
    "1b. OTP stored in DB correctly",
    resetDoc &&
      resetDoc.userId.email === "testforgot@bocc.com" &&
      /^[0-9]{6}$/.test(resetDoc.resetToken), // Must be exactly 6 digits
    `DB Check failed. Found token: ${resetDoc?.resetToken}`,
  );

  // Clear DB for next test
  await PasswordReset.deleteMany({});

  // Case 2: Invalid/Unregistered Email
  res = await makeRequest({ email: "nobody@bocc.com" });
  assert(
    "2. Unregistered email (200 + generic msg)",
    res.status === 200 && res.data.message === expectedMessage,
    `Got ${res.status} - ${res.data.message}`,
  );

  // Verify NO OTP was stored in DB
  const emptyReset = await PasswordReset.findOne({});
  assert(
    "2b. No OTP stored for unregistered email",
    emptyReset === null,
    `DB Check failed. Found document when there should be none.`,
  );

  // Case 3: Validation Error (bad email format)
  res = await makeRequest({ email: "not-an-email" });
  assert(
    "3. Validation error (400)",
    res.status === 400 && Array.isArray(res.data.errors),
    `Got ${res.status}`,
  );

  console.log("\\n--- Test Summary ---");
  if (allPassed) {
    console.log("🎉 ALL TESTS PASSED!");
    return 0;
  } else {
    console.log("💥 SOME TESTS FAILED!");
    return 1;
  }
};

const execute = async () => {
  console.log("Starting server...");
  const server = spawn("node", ["server.js"], { stdio: "ignore" });

  await new Promise((resolve) => setTimeout(resolve, 2000));

  await setupTestData();
  const exitCode = await runTests();
  await cleanupTestData();

  server.kill();
  console.log("Server stopped.");
  process.exit(exitCode);
};

execute();
