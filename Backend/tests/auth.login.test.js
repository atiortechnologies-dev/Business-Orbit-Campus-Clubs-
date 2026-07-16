/**
 * Goal: Tests the login authentication flow.
 * Architecture relevance: Validates that the login endpoint functions correctly, ensuring users can authenticate and receive valid JWT tokens in the overall system.
 */
const mongoose = require("mongoose");
const { spawn } = require("child_process");
const User = require("../models/User");
const { hashPassword } = require("../utils/hash");
require("dotenv").config();

const API_URL = `http://localhost:${process.env.PORT || 5000}/api/auth`;

const seedTestUsers = async () => {
  await mongoose.connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/bocc",
  );

  // Clear any existing test users
  await User.deleteMany({ email: { $regex: "testuser.*@bocc.com" } });

  const password = await hashPassword("password123");

  const users = [
    {
      role: "student",
      email: "testuser.valid@bocc.com",
      password,
      status: "approved",
      emailVerified: true,
    },
    {
      role: "mentor",
      email: "testuser.unverified@bocc.com",
      password,
      status: "approved",
      emailVerified: false,
    },
    {
      role: "investor",
      email: "testuser.pending@bocc.com",
      password,
      status: "pending",
      emailVerified: true,
    },
    {
      role: "company",
      email: "testuser.rejected@bocc.com",
      password,
      status: "rejected",
      emailVerified: true,
    },
  ];

  await User.insertMany(users);
  console.log("Test users seeded.");
};

const cleanupTestUsers = async () => {
  await User.deleteMany({ email: { $regex: "testuser.*@bocc.com" } });
  await mongoose.connection.close();
  console.log("Test users cleaned up.");
};

const makeRequest = async (body) => {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return { status: response.status, data };
};

const runTests = async () => {
  console.log("\\n--- Running Login API Tests ---\\n");
  let allPassed = true;

  const assert = (name, condition, details) => {
    if (condition) {
      console.log(`✅ PASS: ${name}`);
    } else {
      console.log(`❌ FAIL: ${name} -> ${details}`);
      allPassed = false;
    }
  };

  // Case 1: Success
  let res = await makeRequest({
    email: "testuser.valid@bocc.com",
    password: "password123",
  });
  assert(
    "1. Successful login (200)",
    res.status === 200 && res.data.success === true,
    `Got ${res.status}`,
  );

  // Case 2: Invalid Email
  res = await makeRequest({
    email: "testuser.doesnotexist@bocc.com",
    password: "password123",
  });
  assert(
    "2. Invalid email (401)",
    res.status === 401 && res.data.message === "Invalid credentials",
    `Got ${res.status} - ${res.data.message}`,
  );

  // Case 3: Invalid Password
  res = await makeRequest({
    email: "testuser.valid@bocc.com",
    password: "wrongpassword",
  });
  assert(
    "3. Invalid password (401)",
    res.status === 401 && res.data.message === "Invalid credentials",
    `Got ${res.status} - ${res.data.message}`,
  );

  // Case 4: Email Not Verified
  res = await makeRequest({
    email: "testuser.unverified@bocc.com",
    password: "password123",
  });
  assert(
    "4. Email not verified (403)",
    res.status === 403 && res.data.message === "Please verify your email",
    `Got ${res.status} - ${res.data.message}`,
  );

  // Case 5: Account Pending
  res = await makeRequest({
    email: "testuser.pending@bocc.com",
    password: "password123",
  });
  assert(
    "5. Account pending (403)",
    res.status === 403 && res.data.message === "Account pending verification",
    `Got ${res.status} - ${res.data.message}`,
  );

  // Case 6: Account Rejected
  res = await makeRequest({
    email: "testuser.rejected@bocc.com",
    password: "password123",
  });
  assert(
    "6. Account rejected (403)",
    res.status === 403 && res.data.message === "Account has been rejected",
    `Got ${res.status} - ${res.data.message}`,
  );

  // Case 7: Validation Error
  res = await makeRequest({
    email: "invalidemailformat",
    password: "password123",
  });
  assert(
    "7. Validation error (400)",
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
  // Start the server via child process
  console.log("Starting server...");
  const server = spawn("node", ["server.js"], { stdio: "ignore" });

  // Give server 2 seconds to start
  await new Promise((resolve) => setTimeout(resolve, 2000));

  await seedTestUsers();
  const exitCode = await runTests();
  await cleanupTestUsers();

  // Kill server
  server.kill();
  console.log("Server stopped.");
  process.exit(exitCode);
};

execute();
