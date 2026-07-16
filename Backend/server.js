require("dotenv").config();
const express = require("express");
const configureCors = require("./config/cors");
const connectDB = require("./config/db");

const app = express();

const PORT = process.env.PORT || 4000;

// Middlewares
app.use(configureCors());
app.use(express.json());

// Routes

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
