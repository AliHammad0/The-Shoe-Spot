import app from "../backend/server.js";
import DBconfig from "../backend/config/DBconfig.js";

export default async function handler(req, res) {
  try {
    await DBconfig();
    return app(req, res);
  } catch (error) {
    console.error("API error:", error.message);

    return res.status(500).json({
      ok: false,
      message: "Server error. Please try again later.",
    });
  }
}
