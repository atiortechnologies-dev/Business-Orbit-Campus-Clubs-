const mongoose = require('mongoose');
require('dotenv').config();

async function test() {
  await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/bocc");
  const User = require('./models/User');
  const user = await User.findOne({ role: "super_admin" });
  console.log("Super Admin found:", user?.email);
  
  // Create a token for this user
  const { generateToken } = require('./utils/token');
  const token = generateToken(user._id);
  
  const overviewRes = await fetch('http://localhost:5000/api/admin/overview', {
    headers: { Cookie: `accessToken=${token}` }
  });
  const overviewData = await overviewRes.json();
  console.log("Overview Data:", overviewData);
  console.log("Overview Status:", overviewRes.status);
  process.exit(0);
}
test();
