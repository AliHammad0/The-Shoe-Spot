import mongoose from "mongoose";
import dns from "node:dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
import * as config from "./config.js";

const DBconfig = async () => {
  try {
    await mongoose.connect(config.MONGO);

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default DBconfig;