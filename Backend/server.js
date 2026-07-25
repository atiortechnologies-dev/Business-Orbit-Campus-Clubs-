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
const validationRoutes = require("./routes/validation.routes");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const { createProfileRouter } = require("./routes/profile.routes");
const {
  studentChapterRouter,
  chapterStatsRouter,
} = require("./routes/chapter.routes");

const stage3StageRoutes = require("./routes/stage3.routes");
const stage3ProductTypeRoutes = require("./routes/productType.routes");
const stage3AtiorRoutes = require("./routes/atior.routes");
const stage3MVPRoutes = require("./routes/mvpSubmission.routes");

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
const { requireAuth, authorizeRoles } = require("./middlewares/requireAuth");

app.use("/api/auth", authRoutes);
app.use("/api/onboarding", onboardingRoutes);

app.use("/api/student/profile", createProfileRouter("student"));
app.use("/api/mentor/profile", createProfileRouter("mentor"));
app.use("/api/investor/profile", createProfileRouter("investor"));
app.use("/api/incubator/profile", createProfileRouter("incubator"));
app.use("/api/company/profile", createProfileRouter("company"));

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

app.use("/api/public", publicRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/mentor", requireAuth, authorizeRoles("mentor"), mentorRoutes);
app.use("/api/student", requireAuth, authorizeRoles("student"), studentRoutes);

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

module.exports = { app, server };
