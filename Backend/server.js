/**
 * @file server.js
 * @description Initializes the Express application, sets up global middlewares, establishes the database connection, and mounts the primary route handlers.
 * @architecture Serves as the main entry point for the Node.js application. It glues together configuration, routing, and middlewares into a single server instance.
 */

require("dotenv").config();
const express = require("express");
const configureCors = require("./config/cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const { notFound, errorHandler } = require("./middlewares/errorHandler");

// Connect to database
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

const app = express();

const PORT = process.env.PORT || 4000;

// Middlewares
app.use(configureCors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Backend API is running" });
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true, message: "Server is healthy" });
});

const publicRoutes = require("./routes/public.routes");
const adminRoutes = require("./routes/admin.routes");

app.use("/api/auth", authRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/admin", adminRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

module.exports = app;
