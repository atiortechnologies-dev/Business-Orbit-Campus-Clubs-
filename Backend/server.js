/**
 * @file server.js
 * @description Main application entry point and route aggregator.
 * @architecture Initializes the Express application, configures middleware (CORS, error handling), connects to the database, and registers all module routes (auth, student, mentor, company, investor, admin).
 */
require("dotenv").config();
const express = require("express");
const configureCors = require("./config/cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes"); // mine one : authRoute
const onboardingRoutes = require("./routes/onboarding.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const startupRoutes = require("./routes/startup.routes");
const resourceRoutes = require("./routes/resource.routes");
const submissionRoutes = require("./routes/submission.routes");
const meetingRoutes = require("./routes/meeting.routes");
const reviewRoutes = require("./routes/review.routes");
const incubatorDiscoveryRoutes = require("./routes/incubatorDiscovery.routes");
const incubationApplicationRoutes = require("./routes/incubationApplication.routes");
const studentIncubationRoutes = require("./routes/studentIncubation.routes");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const { createProfileRouter } = require("./routes/profile.routes");
const {
  studentChapterRouter,
  chapterStatsRouter,
} = require("./routes/chapter.routes");
const http = require("http");
const { configureSocket } = require("./utils/socket");

// Connect to database
if (process.env.NODE_ENV !== "test") {
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
const mentorRoutes = require("./routes/mentor.routes");
const studentRoutes = require("./routes/student.routes");
const companyRoutes = require("./routes/company.routes");
const investorRoutes = require("./routes/investor.routes");
const chatRoutes = require("./routes/chat.routes");
const {
  requireAuth,
  authorizeRoles,
  requireActiveAccount,
} = require("./middlewares/requireAuth");

app.use("/api/auth", authRoutes);
app.use("/api/onboarding", onboardingRoutes);

app.use("/api/student/profile", createProfileRouter("student"));
app.use("/api/mentor/profile", createProfileRouter("mentor"));
app.use("/api/investor/profile", createProfileRouter("investor"));
app.use("/api/incubator/profile", createProfileRouter("incubator"));
app.use("/api/company/profile", createProfileRouter("company"));

app.use("/api/student", studentChapterRouter);
app.use("/api/chapter", chapterStatsRouter);
app.use("/api/student", dashboardRoutes);
app.use("/api/startup", startupRoutes);
app.use("/api/startup", submissionRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/review", reviewRoutes);

app.use("/api/public", publicRoutes);
app.use("/api/admin", adminRoutes);
app.use(
  "/api/mentor",
  requireAuth,
  requireActiveAccount,
  authorizeRoles("mentor"),
  mentorRoutes,
);
app.use(
  "/api/student",
  requireAuth,
  requireActiveAccount,
  authorizeRoles("student"),
  studentRoutes,
);
app.use("/api/company", companyRoutes);
app.use("/api/investor", investorRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/incubators", incubatorDiscoveryRoutes);
app.use(
  "/api/incubation",
  requireAuth,
  requireActiveAccount,
  incubationApplicationRoutes,
);
const studentInvestorRoutes = require("./routes/studentInvestor.routes");

app.use(
  "/api/student/incubation",
  requireAuth,
  requireActiveAccount,
  authorizeRoles("student"),
  studentIncubationRoutes,
);

app.use(
  "/api/student/investors",
  requireAuth,
  requireActiveAccount,
  authorizeRoles("student"),
  studentInvestorRoutes,
);

// Error handling
app.use(notFound);
app.use(errorHandler);

const server = http.createServer(app);
configureSocket(server);

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(
      `Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`,
    );
  });
}

/**
 * @module server
 */
module.exports = { app, server };
