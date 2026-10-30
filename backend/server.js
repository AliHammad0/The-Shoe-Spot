
import express from "express";
import cors from "cors";
import morgan from "morgan";
import * as config from "./config/config.js";
import productRouter from "./routes/products.js";
import usersRouter from "./routes/users.js";
import ordersRouter from "./routes/order.js";
import DBconfig from "./config/DBconfig.js";
import reviewRouter from "./routes/review.js";
import paymentsRouter from "./routes/payments.js";
import contactRoutes from "./routes/contact.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Backend Test API
app.get("/api/v1/test", (req, res) => {
  res.status(200).json({
    ok: true,
    message: "The Shoe Spot Backend API is running",
    backend: "https://the-shoe-spot-backend.vercel.app",
  });
});

// API Routes
app.use("/api/v1/products", productRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/orders", ordersRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/payments", paymentsRouter);
app.use("/api/v1/contact", contactRoutes);

// Local Development Server
if (process.env.NODE_ENV !== "production") {
  const startServer = async () => {
    try {
      await DBconfig();

      app.listen(config.PORT, () => {
        console.log(`Backend running at http://localhost:${config.PORT}`);
      });
    } catch (error) {
      console.error("Server startup failed:", error.message);
      process.exit(1);
    }
  };

  startServer();
}

export default app;
