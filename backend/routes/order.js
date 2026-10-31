import express from "express";

import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  trackOrder,
} from "../controller/order.js";

import {
  authMiddleware,
  adminMiddleware,
} from "../middleware/auth.js";

const ordersRouter = express.Router();

// Guest order placement
ordersRouter.post("/place", createOrder);

// Guest order tracking
ordersRouter.post("/track", trackOrder);

// Registered customer orders
ordersRouter.post("/", authMiddleware, createOrder);
ordersRouter.get("/my-orders", authMiddleware, getMyOrders);

// Admin orders management
ordersRouter.get("/", authMiddleware, adminMiddleware, getAllOrders);

ordersRouter.patch(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  updateOrderStatus
);

ordersRouter.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteOrder
);

export default ordersRouter;