/**
 * @file server.js
 * @description Main application entry point and route aggregator.
 * @architecture Initializes the Express application, configures middleware (CORS, error handling), connects to the database, and registers all module routes (auth, student, mentor, company, investor, admin).
 */
require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const configureCors = require("./config/cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes"); // mine one : authRoute
const onboardingRoutes = require("./routes/onboarding.routes");
const uploadRouter = require("./routes/upload.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const startupRoutes = require("./routes/startup.routes");
const resourceRoutes = require("./routes/resource.routes");
const submissionRoutes = require("./routes/submission.routes");
const meetingRoutes = require("./routes/meeting.routes");
const reviewRoutes = require("./routes/review.routes");
const validationRoutes = require("./routes/validation.routes");
const incubatorDiscoveryRoutes = require("./routes/incubatorDiscovery.routes");
const incubationApplicationRoutes = require("./routes/incubationApplication.routes");
const studentIncubationRoutes = require("./routes/studentIncubation.routes");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const { createProfileRouter } = require("./routes/profile.routes");
const {
  studentChapterRouter,
  chapterStatsRouter,
} = require("./routes/chapter.routes");

const publicRoutes = require("./routes/public.routes");
const mentorRoutes = require("./routes/mentor.routes");
const studentRoutes = require("./routes/student.routes");

const { apiLimiter } = require("./middlewares/rateLimiter");

const stage3StageRoutes = require("./routes/stage3.routes");
const stage3ProductTypeRoutes = require("./routes/productType.routes");
const stage3AtiorRoutes = require("./routes/atior.routes");
const stage3MVPRoutes = require("./routes/mvpSubmission.routes");
const stage3ReviewRoutes = require("./routes/mvpReview.routes");

const incubationRoutes = require("./routes/incubation.routes");
const tractionRoutes = require("./routes/traction.routes");
const launchRoutes = require("./routes/launch.routes");

const http = require("http");
const { configureSocket } = require("./utils/socket");

const studentFreelancingRoutes = require("./routes/studentFreelancing.routes");
const companyRoutes = require("./routes/company.routes");
const investorRoutes = require("./routes/investor.routes");
const chatRoutes = require("./routes/chat.routes");

const adminDashboardRoutes = require("./routes/adminDashboard.routes");

const studentInvestorRoutes = require("./routes/studentInvestor.routes");
const studentPitchRoutes = require("./routes/studentPitch.routes");
const investorPitchRoutes = require("./routes/investorPitch.routes");
const {
  requireAuth,
  requireActiveAccount,
  requireRole,
} = require("./middlewares/authMiddleware");

// Connect to database
if (process.env.NODE_ENV !== "test") {
  connectDB();
}

const app = express();

const PORT = process.env.PORT;

// Configure Morgan Request Logging Middleware (DEP-007) ---
const isProduction = process.env.NODE_ENV === "production";
if (process.env.NODE_ENV !== "test") {
  app.use(morgan(isProduction ? "combined" : "dev"));
}

// Middlewares
app.use(helmet());
app.use(configureCors());
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.use((req, res, next) => {
  if (req.body) {
    req.body = mongoSanitize.sanitize(req.body, { replaceWith: "_" });
  }
  if (req.params) {
    req.params = mongoSanitize.sanitize(req.params, { replaceWith: "_" });
  }
  next();
});

if (process.env.NODE_ENV !== "test") {
  app.use("/api", apiLimiter);
}

// Routes
app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Backend API is running" });
});

// Enhanced Health Check Endpoint reporting DB status & uptime (DEP-007) ---
app.get("/api/health", (req, res) => {
  const dbStatus =
    mongoose.connection.readyState === 1 ? "connected" : "disconnected";
  const status = dbStatus === "connected" ? 200 : 503;

  res.status(status).json({
    success: status === 200,
    status: status === 200 ? "healthy" : "unhealthy",
    timestamp: new Date().toISOString(),
    uptime: `${process.uptime().toFixed(0)}s`,
    database: dbStatus,
    environment: process.env.NODE_ENV || "development",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/onboarding", onboardingRoutes);

app.use("/api/student/profile", createProfileRouter("student"));
app.use("/api/mentor/profile", createProfileRouter("mentor"));
app.use("/api/investor/profile", createProfileRouter("investor"));
app.use("/api/incubator/profile", createProfileRouter("incubator"));
app.use("/api/company/profile", createProfileRouter("company"));

// uploads
app.use("/api/uploads", uploadRouter);

//
app.use("/api/student", studentChapterRouter);
app.use("/api/chapter", chapterStatsRouter);

// startup ( stage 1: Ideation )
app.use("/api/student", dashboardRoutes);
app.use("/api/startup", startupRoutes);
app.use("/api/startup", submissionRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/meetings", meetingRoutes);
app.use("/api/review", reviewRoutes);

// startup ( stage 2: Validation )
app.use("/api/student/validation", validationRoutes);

// Register Stage 3 Routes
app.use("/api/student", stage3StageRoutes);
app.use("/api/student", stage3ProductTypeRoutes);
app.use("/api/student", stage3AtiorRoutes);
app.use("/api/student", stage3MVPRoutes);
app.use("/api/student", stage3ReviewRoutes);

// incubation stage
app.use("/api/student", incubationRoutes);

// traction stage
app.use("/api/student", tractionRoutes);

// launch satge routes
app.use("/api/student", launchRoutes);

// admin
app.use("/api/admin", adminDashboardRoutes);

app.use("/api/public", publicRoutes);
app.use(
  "/api/mentor",
  requireAuth,
  requireActiveAccount,
  requireRole("mentor"),
  mentorRoutes,
);
app.use(
  "/api/student",
  requireAuth,
  requireActiveAccount,
  requireRole("student"),
  studentRoutes,
);
app.use(
  "/api/student/freelancing",
  requireAuth,
  requireActiveAccount,
  requireRole("student"),
  studentFreelancingRoutes,
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

app.use(
  "/api/student/incubation",
  requireAuth,
  requireActiveAccount,
  requireRole("student"),
  studentIncubationRoutes,
);

app.use(
  "/api/student/investors",
  requireAuth,
  requireActiveAccount,
  requireRole("student"),
  studentInvestorRoutes,
);

app.use(
  "/api/student/pitches",
  requireAuth,
  requireActiveAccount,
  requireRole("student"),
  studentPitchRoutes,
);

app.use(
  "/api/investor/direct-pitches",
  requireAuth,
  requireActiveAccount,
  requireRole("investor"),
  investorPitchRoutes,
);

// Error handling
app.use(notFound);
app.use(errorHandler);

const server = http.createServer(app);
configureSocket(server);

if (require.main === module) {
  server.listen(PORT, () => {
    console.info(
      `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`,
    );
  });
}

/**
 * @module server
 */
module.exports = { app, server };
