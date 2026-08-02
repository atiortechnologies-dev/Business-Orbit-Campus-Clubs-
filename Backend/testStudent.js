const mongoose = require('mongoose');
require('dotenv').config();

async function test() {
  await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/bocc");
  const User = require('./models/User');
  const user = await User.findOne({ role: "student" });
  console.log("Student found:", user?.email);
  
  if (!user) process.exit(1);
  const { generateToken } = require('./utils/token');
  const token = generateToken(user._id);
  
  const res = await fetch('http://localhost:5000/api/admin/overview', {
    headers: { Cookie: `accessToken=${token}` }
  });
  const data = await res.json();
  console.log("Status:", res.status);
  console.log("Data:", data);
  process.exit(0);
}
test();
