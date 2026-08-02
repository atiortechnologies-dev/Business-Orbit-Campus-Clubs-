require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./models/User");

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    const user = await User.findOne({ email: "superadmin@atior.tech" });
    console.log("Found User:", user ? { email: user.email, role: user.role } : "NOT FOUND");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
