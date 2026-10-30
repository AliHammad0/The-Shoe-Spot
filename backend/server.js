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
const port = config.PORT;

// CORS
app.use(cors());

// JSON
app.use(express.json());

// Morgan
app.use(morgan("dev"));

// Routes
app.use("/api/v1/products", productRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/orders", ordersRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/payments", paymentsRouter);
app.use("/api/v1/contact", contactRoutes);

// Database
DBconfig();

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});