/**
 * Goal: Tests the reset password flow.
 * Architecture relevance: Ensures that a user can successfully update their password using a valid reset token, maintaining security and account recovery capabilities.
 */
const mongoose = require("mongoose");
const { spawn } = require("child_process");
const User = require("../models/User");
const PasswordReset = require("../models/PasswordReset");
const { hashPassword } = require("../utils/hash");
require("dotenv").config();

const API_URL = `http://localhost:${process.env.PORT || 5000}/api/auth`;

let validOtp = "111111";
let usedOtp = "222222";
let expiredOtp = "333333";

const setupTestData = async () => {
  await mongoose.connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/bocc",
  );

  // Cleanup
  await User.deleteMany({ email: "testreset@bocc.com" });
  await PasswordReset.deleteMany({});

  const password = await hashPassword("oldpassword123");

  // Create user
  const user = new User({
    role: "student",
    email: "testreset@bocc.com",
    password,
    status: "approved",
    emailVerified: true,
  });
  await user.save();

  // Create valid OTP
  await new PasswordReset({
    userId: user._id,
    resetToken: validOtp,
    expiresAt: Date.now() + 15 * 60 * 1000,
    used: false,
  }).save();

  // Create used OTP
  await new PasswordReset({
    userId: user._id,
    resetToken: usedOtp,
    expiresAt: Date.now() + 15 * 60 * 1000,
    used: true,
  }).save();

  // Create expired OTP
  await new PasswordReset({
    userId: user._id,
    resetToken: expiredOtp,
    expiresAt: Date.now() - 1000, // expired 1s ago
    used: false,
  }).save();

  console.log("Test data seeded.");
};

const cleanupTestData = async () => {
  await User.deleteMany({ email: "testreset@bocc.com" });
  await PasswordReset.deleteMany({});
  await mongoose.connection.close();
  console.log("Test data cleaned up.");
};

const makeRequest = async (path, body) => {
  const response = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return { status: response.status, data };
};

const runTests = async () => {
  console.log("\\n--- Running Reset Password API Tests ---\\n");
  let allPassed = true;

  const assert = (name, condition, details) => {
    if (condition) {
      console.log(`✅ PASS: ${name}`);
    } else {
      console.log(`❌ FAIL: ${name} -> ${details}`);
      allPassed = false;
    }
  };

  const expectedErr = "Invalid or expired reset token";

  // Case 2: Invalid email
  let res = await makeRequest("/reset-password", {
    email: "wrong@bocc.com",
    resetToken: validOtp,
    newPassword: "NewPassword1",
    confirmPassword: "NewPassword1",
  });
  assert(
    "2. Invalid email (400)",
    res.status === 400 && res.data.message === expectedErr,
    `Got ${res.status}`,
  );

  // Case 3: Wrong OTP
  res = await makeRequest("/reset-password", {
    email: "testreset@bocc.com",
    resetToken: "999999",
    newPassword: "NewPassword1",
    confirmPassword: "NewPassword1",
  });
  assert(
    "3. Wrong OTP (400)",
    res.status === 400 && res.data.message === expectedErr,
    `Got ${res.status}`,
  );

  // Case 4: Expired OTP
  res = await makeRequest("/reset-password", {
    email: "testreset@bocc.com",
    resetToken: expiredOtp,
    newPassword: "NewPassword1",
    confirmPassword: "NewPassword1",
  });
  assert(
    "4. Expired OTP (400)",
    res.status === 400 && res.data.message === expectedErr,
    `Got ${res.status}`,
  );

  // Case 5: Used OTP
  res = await makeRequest("/reset-password", {
    email: "testreset@bocc.com",
    resetToken: usedOtp,
    newPassword: "NewPassword1",
    confirmPassword: "NewPassword1",
  });
  assert(
    "5. Used OTP (400)",
    res.status === 400 && res.data.message === expectedErr,
    `Got ${res.status}`,
  );

  // Case 6: Passwords don't match
  res = await makeRequest("/reset-password", {
    email: "testreset@bocc.com",
    resetToken: validOtp,
    newPassword: "NewPassword1",
    confirmPassword: "Different1",
  });
  assert(
    "6. Mismatched passwords (400 validation error)",
    res.status === 400 && Array.isArray(res.data.errors),
    `Got ${res.status}`,
  );

  // Case 7: Weak password
  res = await makeRequest("/reset-password", {
    email: "testreset@bocc.com",
    resetToken: validOtp,
    newPassword: "weakpassword",
    confirmPassword: "weakpassword",
  });
  assert(
    "7. Weak password (400 validation error)",
    res.status === 400 && Array.isArray(res.data.errors),
    `Got ${res.status}`,
  );

  // Case 1: Successful reset
  res = await makeRequest("/reset-password", {
    email: "testreset@bocc.com",
    resetToken: validOtp,
    newPassword: "NewPassword1",
    confirmPassword: "NewPassword1",
  });
  assert(
    "1. Successful reset (200)",
    res.status === 200 && res.data.success === true,
    `Got ${res.status}`,
  );

  // Case 1b: Verify OTPs are now invalidated
  res = await makeRequest("/reset-password", {
    email: "testreset@bocc.com",
    resetToken: validOtp,
    newPassword: "NewPassword2",
    confirmPassword: "NewPassword2",
  });
  assert(
    "1b. OTP cannot be reused (400)",
    res.status === 400 && res.data.message === expectedErr,
    `Got ${res.status}`,
  );

  // Case 8: Verify new password via Login endpoint
  res = await makeRequest("/login", {
    email: "testreset@bocc.com",
    password: "NewPassword1",
  });
  assert(
    "8. Verify new password via Login (200)",
    res.status === 200 && res.data.success === true,
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
