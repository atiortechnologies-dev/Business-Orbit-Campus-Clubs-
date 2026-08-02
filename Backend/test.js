const mongoose = require("mongoose");
require("dotenv").config({ path: "./.env" });

const User = require("./models/User");
const Startup = require("./models/Startup");
const AuditLog = require("./models/AuditLog");

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
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
    console.log("Success:", JSON.stringify(data, null, 2));
  } catch (e) {
    console.error("Error:", e);
  }
  process.exit();
}

run();
