import mongoose from "mongoose";
import { conf } from "../conf/conf.js";

let connectionPromise;

export const connectDatabase = async () => {
  if (mongoose.connection.readyState === 1) return mongoose.connection;
  if (!connectionPromise) {
    const uri = conf.MONGODB_URI;
    if (!uri) throw new Error("MONGODB_URI is required");
    connectionPromise = mongoose
      .connect(uri, {
        serverSelectionTimeoutMS: Number(
          conf.MONGO_SERVER_SELECTION_TIMEOUT_MS || 5000,
        ),
      })
      .catch((error) => {
        connectionPromise = undefined;
        throw error;
      });
  }
  await connectionPromise;
  return mongoose.connection;
};

export const disconnectDatabase = () => mongoose.disconnect();
