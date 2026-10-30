import express from "express";
import {
  createReview,
  getProductReviews,
} from "../controller/review.js";
import { authMiddleware } from "../middleware/auth.js";

const reviewRouter = express.Router();

reviewRouter.post("/", authMiddleware, createReview);
reviewRouter.get("/product/:productId", getProductReviews);

export default reviewRouter;