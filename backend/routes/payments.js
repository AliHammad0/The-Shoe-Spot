import express from "express";
import { createPaymentIntent } from "../controller/payment.js";
import { authMiddleware } from "../middleware/auth.js";

const paymentsRouter = express.Router();

paymentsRouter.post("/create-intent", authMiddleware, createPaymentIntent);

export default paymentsRouter;
