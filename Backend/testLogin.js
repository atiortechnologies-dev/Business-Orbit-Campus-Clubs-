const mongoose = require("mongoose");
const User = require("./Backend/models/User");

async function run() {
  await mongoose.connect("mongodb://localhost:27017/bocc");
  const user = await User.findOne({ role: "super_admin" }).select("+password_hash");
  if (!user) {
    console.log("No super_admin found in DB!");
  } else {
    console.log("Admin found:", user.email, "Status:", user.account_status, "Verified:", user.email_verified, "Profile Status:", user.profile_status);
  }
  process.exit(0);
}
run();
