const mongoose = require("mongoose");
const User = require("./models/User");

(async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/bocc");
    const users = await User.find({}).select("email role");
    console.log("Local DB Users:");
    users.forEach(u => console.log(u.email, u.role));
  } catch(e) {
    console.error(e);
  } finally {
    mongoose.connection.close();
  }
})();
