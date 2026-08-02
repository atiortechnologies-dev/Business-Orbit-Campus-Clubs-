require("dotenv").config({ path: __dirname + "/.env" });
const mongoose = require("mongoose");
const User = require("./models/User");

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const users = await User.find({}).select("email role");
    console.log("All users in DB:");
    users.forEach(u => console.log(u.email, u.role));
  } catch(e) {
    console.error(e);
  } finally {
    mongoose.connection.close();
  }
})();
