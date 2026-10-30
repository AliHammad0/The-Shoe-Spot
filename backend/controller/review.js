import mongoose from "mongoose";
import Review from "../model/review.js";
import Order from "../model/order.js";
import Product from "../model/products.js";

export const createReview = async (req, res) => {
  try {
    const { productId, orderId, rating, comment } = req.body;
    const userId = req.user.userId;

    if (
      !mongoose.isValidObjectId(productId) ||
      !mongoose.isValidObjectId(orderId)
    ) {
      return res.status(400).json({
        ok: false,
        message: "Invalid product or order ID.",
      });
    }

    const numericRating = Number(rating);

    if (
      !Number.isInteger(numericRating) ||
      numericRating < 1 ||
      numericRating > 5
    ) {
      return res.status(400).json({
        ok: false,
        message: "Rating must be between 1 and 5.",
      });
    }

    if (
      typeof comment !== "string" ||
      comment.trim().length < 3 ||
      comment.trim().length > 1000
    ) {
      return res.status(400).json({
        ok: false,
        message: "Review must be between 3 and 1000 characters.",
      });
    }

    const order = await Order.findOne({
      _id: orderId,
      user: userId,
      orderStatus: "Delivered",
      "items.product": productId,
    });

    if (!order) {
      return res.status(403).json({
        ok: false,
        message: "You can review this product only after its order is delivered.",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        ok: false,
        message: "Product not found.",
      });
    }

    const existingReview = await Review.findOne({
      product: productId,
      user: userId,
      order: orderId,
    });

    if (existingReview) {
      return res.status(409).json({
        ok: false,
        message: "You have already reviewed this product for this order.",
      });
    }

    const review = await Review.create({
      product: productId,
      user: userId,
      order: orderId,
      customerName: order.customerName,
      rating: numericRating,
      comment: comment.trim(),
    });

    return res.status(201).json({
      ok: true,
      message: "Review submitted successfully.",
      review,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        ok: false,
        message: "You have already reviewed this product for this order.",
      });
    }

    console.error("Create review error:", error);

    return res.status(500).json({
      ok: false,
      message: "Failed to submit review.",
    });
  }
};

export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!mongoose.isValidObjectId(productId)) {
      return res.status(400).json({
        ok: false,
        message: "Invalid product ID.",
      });
    }

    const productExists = await Product.exists({ _id: productId });

    if (!productExists) {
      return res.status(404).json({
        ok: false,
        message: "Product not found.",
      });
    }

    const reviews = await Review.find({ product: productId })
      .select("customerName rating comment createdAt")
      .sort({ createdAt: -1 })
      .lean();

    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? Number(
            (
              reviews.reduce((sum, review) => sum + review.rating, 0) /
              totalReviews
            ).toFixed(1)
          )
        : 0;

    return res.status(200).json({
      ok: true,
      totalReviews,
      averageRating,
      reviews,
    });
  } catch (error) {
    console.error("Get product reviews error:", error);

    return res.status(500).json({
      ok: false,
      message: "Failed to fetch product reviews.",
    });
  }
};
