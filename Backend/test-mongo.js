/**
 * Goal: Simple script to test MongoDB connectivity.
 * Architecture relevance: Used as a diagnostic tool during development and deployment to quickly verify that the backend can establish a connection with the database.
 */
const mongoose = require('mongoose');

const uri = 'mongodb+srv://jimfleax:jimfleax@local.f18dsim.mongodb.net/bocc?appName=Local';

async function testConnection() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
    
    const admin = mongoose.connection.db.admin();
    const info = await admin.command({ replSetGetStatus: 1 }).catch(err => err.message);
    
    if (typeof info === 'string') {
      console.log('Replica Set Status:', info);
    } else {
      console.log('Replica Set Name:', info.set);
      console.log('Is Replica Set:', !!info.set);
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Connection error:', err);
    process.exit(1);
  }
}

testConnection();
