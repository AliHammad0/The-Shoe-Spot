import express from "express";

import {
  reserveStock,
  releaseStock,
  releaseCartStock,
  cleanupExpiredReservations,
} from "../controller/reservations.js";

const reservationsRouter = express.Router();

reservationsRouter.post("/reserve", reserveStock);
reservationsRouter.post("/release", releaseStock);
reservationsRouter.post("/release-cart", releaseCartStock);

// Automatically clean expired reservations
reservationsRouter.get("/cleanup", async (req, res) => {
  try {
    const cronSecret = process.env.CRON_SECRET;

    if (!cronSecret) {
      return res.status(503).json({
        ok: false,
        message: "Cron secret is not configured.",
      });
    }

    if (req.headers.authorization !== `Bearer ${cronSecret}`) {
      return res.status(401).json({
        ok: false,
        message: "Unauthorized.",
      });
    }

    const cleanedCount = await cleanupExpiredReservations();

    return res.status(200).json({
      ok: true,
      message: "Expired reservations cleanup completed.",
      cleanedCount,
    });
  } catch (error) {
    console.error("Reservation cleanup route error:", error);

    return res.status(500).json({
      ok: false,
      message: "Reservation cleanup failed.",
    });
  }
});

export default reservationsRouter;