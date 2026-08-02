const mongoose = require("mongoose");
require("dotenv").config({ path: "./Backend/.env" });

const User = require("./Backend/models/User");
const Startup = require("./Backend/models/Startup");
const AuditLog = require("./Backend/models/AuditLog");

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected");

  try {
    const data = await Promise.all([
      User.countDocuments(),
      Startup.countDocuments(),
      User.countDocuments({ account_status: "pending_verification" }),
      User.aggregate([{ $group: { _id: "$role", count: { $sum: 1 } } }]),
      Startup.aggregate([{ $group: { _id: "$current_stage", count: { $sum: 1 } } }]),
      User.find({ account_status: "pending_verification" }).limit(5).select("_id full_name email role")
    ]);
    console.log("Success:", data);
  } catch (e) {
    console.error("Error:", e);
  }
  process.exit();
}

run();
