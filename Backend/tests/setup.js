/**
 * @file setup.js
 * @description Global setup and teardown hooks for Jest test suite.
 * @architecture Manages database connections and wipes data between test runs to ensure test isolation.
 */

require("dotenv").config();
const mongoose = require("mongoose");

beforeAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }

  let uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/project_test_db";

  // Automatically derive a test database name.
  if (uri.includes("mongodb+srv")) {
    const dbNameMatch = uri.match(/\/([^/?]+)(\?|$)/);
    if (dbNameMatch) {
      uri = uri.replace(/\/([^/?]+)(\?|$)/, "/$1_test$2");
    } else {
      uri = uri.replace(/\/?(\?|$)/, "/test_db$1");
    }
  } else if (!uri.includes("test")) {
    const parts = uri.split("/");
    const dbName = parts.pop();
    uri = [...parts, dbName + "_test"].join("/");
  }

  await mongoose.connect(uri);

  if (mongoose.connection.readyState !== 0 && mongoose.connection.db) {
    await mongoose.connection.dropDatabase();
  }

  // Ensure all indexes are built before tests run to prevent WriteConflicts during transactions
  await Promise.all(
    Object.values(mongoose.models).map((model) => model.init()),
  );
});

afterAll(async () => {
  // Wait briefly for any pending operations
  await new Promise((resolve) => setTimeout(resolve, 500));
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  }
}, 15000);
