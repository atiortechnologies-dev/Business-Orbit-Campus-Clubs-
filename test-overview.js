const mongoose = require('mongoose');
const { getOverview } = require('./Backend/controllers/adminDashboard.controller');

async function run() {
  await mongoose.connect('mongodb://localhost:27017/bocc_test_db_or_similar_from_env');
  
  const req = {};
  const res = {
    status: function(code) { this.code = code; return this; },
    json: function(data) { console.log("JSON:", JSON.stringify(data, null, 2)); return this; }
  };
  
  try {
    await getOverview(req, res);
  } catch(e) {
    console.error("ERROR:", e);
  }
  process.exit(0);
}
// wait, better to just hit the actual running dev server with curl!
