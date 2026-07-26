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

  let uri =
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/project_test_db";

  // Automatically derive a test database name with JEST_WORKER_ID for parallel isolation
  const workerId = process.env.JEST_WORKER_ID || "1";
  if (uri.includes("mongodb+srv")) {
    uri = uri.replace(/\/([^/?]+)(\?|$)/, `/$1_test_${workerId}$2`);
  } else if (!uri.includes("test")) {
    const parts = uri.split("/");
    const dbName = parts.pop();
    uri = [...parts, `${dbName}_test_${workerId}`].join("/");
  } else {
    // If it already includes 'test', still append workerId to avoid conflicts
    uri = `${uri}_${workerId}`;
  }

  await mongoose.connect(uri);

  if (mongoose.connection.readyState !== 0 && mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();
    for (const collection of collections) {
      await collection.deleteMany({});
    }
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
}, 15000); // Increase Jest's afterAll timeout
