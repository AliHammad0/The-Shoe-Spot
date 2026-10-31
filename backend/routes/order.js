import express from "express";
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} from "../controller/order.js";

import {
  authMiddleware,
  adminMiddleware,
} from "../middleware/auth.js";

const ordersRouter = express.Router();

// Guest aur logged-in customer dono order place kar sakte hain
ordersRouter.post("/place", createOrder);

// Existing authenticated order route
ordersRouter.post("/", authMiddleware, createOrder);

// Customer ke apne orders
ordersRouter.get("/my-orders", authMiddleware, getMyOrders);

// Admin orders management
ordersRouter.get("/", authMiddleware, adminMiddleware, getAllOrders);

// Order status update
ordersRouter.patch(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  updateOrderStatus
);

// Order aur linked reviews delete
ordersRouter.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteOrder
);

export default ordersRouter;