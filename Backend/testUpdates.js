const mongoose = require('mongoose');
require('dotenv').config();

async function test() {
  await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/bocc");
  const User = require('./models/User');
  const user = await User.findOne({ role: "super_admin" });
  
  if (!user) process.exit(1);
  const { generateToken } = require('./utils/token');
  const token = generateToken(user); // Pass the FULL user object!
  
  const res = await fetch('http://localhost:5000/api/admin/updates', {
    headers: { Cookie: `accessToken=${token}` }
  });
  const data = await res.json();
  console.log("Status:", res.status);
  console.log("Data:", data);
  process.exit(0);
}
test();
