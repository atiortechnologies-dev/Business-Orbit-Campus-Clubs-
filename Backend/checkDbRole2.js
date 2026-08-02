const mongoose = require('mongoose');
require('dotenv').config();
async function test() {
  await mongoose.connect(process.env.MONGODB_URI);
  const User = require('./models/User');
  const user = await User.findOne({ email: "superadmin@atior.tech" }).lean();
  console.log("User from DB:", user);
  process.exit(0);
}
test();
