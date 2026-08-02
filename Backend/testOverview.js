require("dotenv").config();
const mongoose = require("mongoose");
const { getOverview } = require("./controllers/adminDashboard.controller");
const connectDB = require("./config/db");

(async () => {
  await connectDB();
  const req = {};
  const res = {
    status: (code) => ({
      json: (data) => {
        console.log("Status:", code);
        console.log("Data:", JSON.stringify(data, null, 2));
      }
    })
  };
  try {
    await getOverview(req, res, (err) => console.log("Next called with err:", err));
  } catch (e) {
    console.error("Crash:", e);
  }
  process.exit(0);
})();
