/**
 * Goal: Main entry point of the Node.js application.
 * Architecture relevance: Configures Express, connects to the database, sets up middleware, 
 * defines API routes, and starts the server. It orchestrates the entire backend system.
 */
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(express.json());

// Basic health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "BOCC Auth API is running",
    environment: process.env.NODE_ENV || "development",
  });
});

// Mount routers
app.use("/api/auth", require("./routes/auth.routes"));

// Global Error Handler (Express v5)
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
