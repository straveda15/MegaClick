import mongoose from "mongoose";

const connectDB = async () => {
  const uri = process.env.MONGO_URI || process.env.LOCAL_MONGO_URI;

  if (!uri) {
    throw new Error(
      "No MongoDB URI found. Set MONGO_URI or LOCAL_MONGO_URI in your .env"
    );
  }

  await mongoose.connect(uri);
  console.log("MongoDB connected:", mongoose.connection.name);
};

export default connectDB;
