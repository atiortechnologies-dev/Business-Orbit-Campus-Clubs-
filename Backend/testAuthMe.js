const mongoose = require('mongoose');
const axios = require('axios');

async function test() {
  await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/bocc");
  const User = require('./models/User');
  const user = await User.findOne({ email: "superadmin@atior.tech" });
  
  // change password to known
  const bcrypt = require('bcryptjs');
  user.password_hash = await bcrypt.hash('Password123!', 10);
  await user.save();
  console.log("Password reset");

  try {
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'superadmin@atior.tech',
      password: 'Password123!'
    });
    
    const cookies = loginRes.headers['set-cookie'];
    console.log("Login User Role:", loginRes.data.data.user.role);
    console.log("Redirect to:", loginRes.data.data.redirect_to);
    
    const reqConf = { headers: { Cookie: cookies.join('; ') } };
    const meRes = await axios.get('http://localhost:5000/api/auth/me', reqConf);
    console.log("Me Role:", meRes.data.data.role);
  } catch (err) {
    console.error("Error Status:", err.response?.status);
    console.error("Error Data:", err.response?.data);
  }
  process.exit(0);
}
test();
