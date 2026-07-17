require("dotenv").config();
const express = require("express");
const configureCors = require("./config/cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.routes");
const { notFound, errorHandler } = require("./middlewares/errorHandler");

// Connect to database
connectDB();

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

app.use("/api/auth", authRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
