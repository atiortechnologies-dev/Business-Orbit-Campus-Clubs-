require("dotenv").config();
const express = require("express");
const configureCors = require("./config/cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoute");
const onboardingRoutes = require("./routes/onboardingRoutes");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const { createProfileRouter } = require("./routes/profileRoutes");

const app = express();

const PORT = process.env.PORT || 4000;

// Middlewares
app.use(configureCors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Backend API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/onboarding", onboardingRoutes);

// onboarding routes
app.use("/api/student/profile", createProfileRouter("student"));
app.use("/api/mentor/profile", createProfileRouter("mentor"));
app.use("/api/investor/profile", createProfileRouter("investor"));
app.use("/api/incubator/profile", createProfileRouter("incubator"));
app.use("/api/company/profile", createProfileRouter("company"));

// error handling
app.use(notFound);
app.use(errorHandler);

// connection
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Startup failed:", err);
    process.exit(1);
  }
};

startServer();
