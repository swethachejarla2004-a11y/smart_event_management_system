const mongoose = require('mongoose');

let mongoMemoryServer = null;

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/smart_campus_db';
    
    // Try connecting to local MongoDB first with short timeout
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 2000
    });
    console.log(`MongoDB Connected (Local): ${conn.connection.host}`);
  } catch (err) {
    console.log('Local MongoDB connection failed. Starting in-memory MongoDB server...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create();
      const memoryUri = mongoMemoryServer.getUri();
      const conn = await mongoose.connect(memoryUri);
      console.log(`MongoDB Connected (In-Memory): ${conn.connection.host}`);
    } catch (memErr) {
      console.error(`MongoDB connection error: ${memErr.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
