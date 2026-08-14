import mongoose from "mongoose";

let cached = global._mongooseConn;
if (!cached) {
  cached = global._mongooseConn = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) return cached.conn;

  const uri = process.env.MONGO_URI || process.env.LOCAL_MONGO_URI;
  if (!uri) {
    throw new Error(
      "No MongoDB URI found. Set MONGO_URI or LOCAL_MONGO_URI in your .env"
    );
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
      })
      .then((mongooseInstance) => {
        console.log("MongoDB connected:", mongooseInstance.connection.name);
        return mongooseInstance;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

export default connectDB;