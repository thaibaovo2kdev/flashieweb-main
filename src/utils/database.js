import mongoose from "mongoose";
// import getConfig from "next/config";

// const { serverRuntimeConfig } = getConfig();

let cached = { conn: null, promise: null };

const connectDB = async () => {
  if (cached.conn) {
    return cached.conn;
  }

  // If a connection does not exist, we check if a promise is already in progress. If a promise is already in progress, we wait for it to resolve to get the connection
  if (!cached.promise) {
    // const opts = {
    //   bufferCommands: false,
    // };
    cached.promise = mongoose.connect(`${process.env.MONGODB_URI}`);
    mongoose.Promise = global.Promise;
  }

  try {
    cached.conn = await cached.promise;
    console.log("MongoDB connected");
  } catch (e) {
    cached.promise = null;
    console.log("MongoDB connect error::", e);
    throw e;
  }

  return cached.conn;
};

export default connectDB;
