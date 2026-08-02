const mongoose = require('mongoose');
async function test() {
  await mongoose.connect("mongodb://127.0.0.1:27017/bocc");
  const User = require('./models/User');
  const user = await User.findOne({ email: "superadmin@atior.tech" }).lean();
  console.log("User from DB:", user);
  process.exit(0);
}
test();
