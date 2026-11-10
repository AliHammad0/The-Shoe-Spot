
import express from "express";
import { createPaymentIntent } from "../controller/payment.js";

const paymentsRouter = express.Router();

paymentsRouter.post("/create-intent", createPaymentIntent);

export default paymentsRouter;
