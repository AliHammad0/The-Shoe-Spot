import express from "express";
import cors from "cors";
import morgan from "morgan";

import * as config from "./config/config.js";

import productRouter from "./routes/products.js";
import usersRouter from "./routes/users.js";
import ordersRouter from "./routes/order.js";
import reviewRouter from "./routes/review.js";
import paymentsRouter from "./routes/payments.js";
import contactRoutes from "./routes/contact.js";
import reservationsRouter from "./routes/reservations.js";

import DBconfig from "./config/DBconfig.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/v1/test", (req, res) => {
  res.status(200).json({
    ok: true,
    message: "The Shoe Spot API is running",
  });
});

app.use("/api/v1/products", productRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/orders", ordersRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/payments", paymentsRouter);
app.use("/api/v1/contact", contactRoutes);

// Stock reservation routes
app.use("/api/v1/reservations", reservationsRouter);

if (process.env.NODE_ENV !== "production") {
  DBconfig();

  const PORT = config.PORT || 9090;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;