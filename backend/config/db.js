const mongoose = require('mongoose');

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.error("CRITICAL ERROR: MONGO_URI is not defined in environment variables.");
    if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
      throw new Error("MONGO_URI is not defined in environment variables.");
    } else {
      process.exit(1);
    }
  }

  // Prevent multiple connections in Vercel serverless environment
  if (mongoose.connection.readyState >= 1) {
    console.log("MongoDB is already connected.");
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 8000, // Keep below Vercel's 10s serverless function execution limit
      socketTimeoutMS: 45000,
      bufferCommands: true,
      maxPoolSize: 10,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error("Check: 1) MONGO_URI is correct  2) Your IP is whitelisted in MongoDB Atlas Network Access");
    if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
      throw error;
    } else {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
