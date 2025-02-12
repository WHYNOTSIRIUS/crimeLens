// mongoose
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// connect to mongodb
const connectDb = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    
    if (!uri) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    await mongoose.connect(uri);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ Error connecting to database: ", error);
    process.exit(1);
  }
};

export default connectDb;
