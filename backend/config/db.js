const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

/**
 * Connect to MongoDB using Mongoose or fallback to Memory Server
 */
const connectDB = async () => {
  try {
    // Try connecting to provided URI first
    let uri = process.env.MONGO_URI;
    
    // If it's the default local host and it fails, we will spin up a memory server
    if (uri.includes('localhost') || uri.includes('127.0.0.1')) {
      try {
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
        console.log(`✅ MongoDB Connected to Local Database`);
        return;
      } catch (err) {
        console.log(`⏱️ Local MongoDB not found, starting In-Memory Database...`);
        const mongoServer = await MongoMemoryServer.create();
        uri = mongoServer.getUri();
      }
    }

    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host} (In-Memory Fallback Active)`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
