/**
 * @file setup.js
 * @description Global setup and teardown hooks for Jest test suite.
 * @architecture Manages database connections and wipes data between test runs to ensure test isolation.
 */

require("dotenv").config();
const mongoose = require("mongoose");

beforeAll(async () => {
  // Disconnect if already connected
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not defined in .env");
  }

  await mongoose.connect(uri);
});

// The afterAll and afterEach hooks have been removed to prevent global side-effects.
// Individual test files are now responsible for managing their own teardown/cleanup logic.
