import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000, // Increase from default 30s to 60s
      socketTimeoutMS: 45000,          // Increase socket timeout
      connectTimeoutMS: 30000,         // Increase connection timeout
    });
    dbName: "festhive", // ✅ correct DB
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error(' MongoDB connection error:', error.message);
    process.exit(1);
  }
};

export default connectDB;
