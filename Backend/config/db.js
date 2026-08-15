/**
 * @file db.js
 * @description Manages the connection setup and lifecycle for the MongoDB database using Mongoose.
 * @architecture Abstracts database connection logic away from the server initialization, ensuring database state is managed consistently.
 */

const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  // Fail fast if connection URI is not provided in environment variables
  if (!mongoUri || !mongoUri.trim()) {
    console.error(
      "FATAL ERROR: MONGODB_URI is not defined in environment variables.",
    );
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(mongoUri);
    console.info(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

// Graceful exit handling
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.info("MongoDB connection closed due to app termination");
  process.exit(0);
});

module.exports = connectDB;
