/**
 * @file db.js
 * @description Manages the connection setup and lifecycle for the MongoDB database using Mongoose.
 * @architecture Abstracts database connection logic away from the server initialization, ensuring database state is managed consistently.
 */

/**
 * Goal: Manages the database connection.
 * Architecture relevance: Connects the application to the MongoDB database using Mongoose.
 * This is a central configuration file used at the startup of the application.
 */
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/bocc",
    );
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

// Graceful exit
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed due to app termination");
  process.exit(0);
});

module.exports = connectDB;
