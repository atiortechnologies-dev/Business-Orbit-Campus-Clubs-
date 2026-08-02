const mongoose = require("mongoose");
async function run() {
  try {
    await mongoose.connect("mongodb+srv://yadavdharmesh2306_db_user:Dharmesh23@cluster0.jsbmh3v.mongodb.net/");
    console.log("Connected successfully to secondary URI");
    process.exit(0);
  } catch(e) {
    console.error("Failed to connect:", e.message);
    process.exit(1);
  }
}
run();
