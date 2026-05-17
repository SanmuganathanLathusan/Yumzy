const mongoose = require('mongoose');

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error("CRITICAL ERROR: MONGO_URI is not defined in environment variables.");
    return;
  }

  // Prevent multiple connections in Vercel serverless environment
  if (mongoose.connection.readyState >= 1) {
    console.log("MongoDB is already connected.");
    return;
  }

  try {
    // Trim any accidental quotes from the env variable
    const uri = process.env.MONGO_URI.replace(/^["']|["']$/g, '');
    
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000 // Fail faster if IP is blocked
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
  }
};

module.exports = connectDB;
