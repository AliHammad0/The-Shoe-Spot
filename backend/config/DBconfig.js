
import mongoose from "mongoose";
import dns from "node:dns";
import * as config from "./config.js";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const DBconfig = async () => {
  try {
    if (!config.MONGO) {
      throw new Error("MONGO connection string is missing");
    }

    if (mongoose.connection.readyState === 1) {
      return;
    }

    await mongoose.connect(config.MONGO, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};

export default DBconfig;
