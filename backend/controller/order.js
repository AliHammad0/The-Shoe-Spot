import mongoose from "mongoose";
import Stripe from "stripe";
import Order from "../model/order.js";
import Product from "../model/products.js";
import Review from "../model/review.js";
import { STRIPE_SECRET_KEY } from "../config/config.js";

const stripe = new Stripe(STRIPE_SECRET_KEY);

export const createOrder = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const {
      customerName,
      email,
      phone,
      address,
      city,
      items,
      subtotal,
      shipping,
      total,
      paymentMethod,
      paymentIntentId,
    } = req.body;

    if (
      !customerName ||
      !email ||
      !phone ||
      !address ||
      !city ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        ok: false,
        message: "Please provide all required order details.",
      });
    }

    const orderSubtotal = Number(subtotal);
    const orderShipping = Number(shipping);
    const orderTotal = Number(total);

    if (
      !Number.isFinite(orderSubtotal) ||
      !Number.isFinite(orderShipping) ||
      !Number.isFinite(orderTotal) ||
      orderSubtotal < 0 ||
      orderShipping < 0 ||
      Math.round(orderTotal * 100) !==
        Math.round((orderSubtotal + orderShipping) * 100)
    ) {
      return res.status(400).json({
        ok: false,
        message: "Invalid order amount.",
      });
    }

    const orderItems = items.map((item) => ({
      product: item.product || item.productId,
      title: item.title,
      image: item.image || "",
      color: item.color || "",
      size: item.size || "",
      quantity: Number(item.quantity),
      price: Number(item.price),
    }));

    for (const item of orderItems) {
      if (
        !mongoose.isValidObjectId(item.product) ||
        typeof item.title !== "string" ||
        !item.title.trim() ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        !Number.isFinite(item.price) ||
        item.price <= 0
      ) {
        return res.status(400).json({
          ok: false,
          message: "Invalid product details in order.",
        });
      }
    }

    const calculatedSubtotal = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    if (
      Math.round(calculatedSubtotal * 100) !==
      Math.round(orderSubtotal * 100)
    ) {
      return res.status(400).json({
        ok: false,
        message: "Order subtotal does not match the products.",
      });
    }

    let verifiedPaymentMethod = "COD";
    let verifiedPaymentIntentId;

    if (paymentMethod === "Stripe") {
      if (
        !paymentIntentId ||
        typeof paymentIntentId !== "string"
      ) {
        return res.status(400).json({
          ok: false,
          message: "Stripe payment reference is required.",
        });
      }

      const paymentIntent =
        await stripe.paymentIntents.retrieve(paymentIntentId);

      if (paymentIntent.status !== "succeeded") {
        return res.status(400).json({
          ok: false,
          message: "Stripe payment has not succeeded.",
        });
      }

      if (
        paymentIntent.currency !== "pkr" ||
        paymentIntent.amount !== Math.round(orderTotal * 100)
      ) {
        return res.status(400).json({
          ok: false,
          message: "Stripe payment amount or currency does not match.",
        });
      }

      const metadataUserId = paymentIntent.metadata?.userId;
      const currentUserId = String(
        req.user?.userId ||
          req.user?._id ||
          req.user?.id ||
          ""
      );

      if (
        metadataUserId &&
        metadataUserId !== "guest" &&
        metadataUserId !== currentUserId
      ) {
        return res.status(403).json({
          ok: false,
          message: "This payment does not belong to your account.",
        });
      }

      verifiedPaymentMethod = "Stripe";
      verifiedPaymentIntentId = paymentIntent.id;
    } else if (paymentMethod && paymentMethod !== "COD") {
      return res.status(400).json({
        ok: false,
        message: "Invalid payment method.",
      });
    }

    if (verifiedPaymentIntentId) {
      const existingOrder = await Order.findOne({
        paymentIntentId: verifiedPaymentIntentId,
      });

      if (existingOrder) {
        return res.status(200).json({
          ok: true,
          message: "This payment order has already been created.",
          order: existingOrder,
        });
      }
    }

    const productQuantities = new Map();

    for (const item of orderItems) {
      const productId = String(item.product);

      productQuantities.set(
        productId,
        (productQuantities.get(productId) || 0) + item.quantity
      );
    }

    let createdOrder;

    await session.withTransaction(async () => {
      for (const [productId, quantity] of productQuantities) {
        const updatedProduct = await Product.findOneAndUpdate(
          {
            _id: productId,
            stock: { $gte: quantity },
          },
          {
            $inc: { stock: -quantity },
          },
          {
            new: true,
            session,
          }
        );

        if (!updatedProduct) {
          const error = new Error("INSUFFICIENT_STOCK");
          error.productId = productId;
          throw error;
        }
      }

      const orders = await Order.create(
        [
          {
            user: req.user?.userId || req.user?._id || undefined,
            customerName,
            email,
            phone,
            address,
            city,
            items: orderItems,
            subtotal: orderSubtotal,
            shipping: orderShipping,
            total: orderTotal,
            paymentMethod: verifiedPaymentMethod,
            ...(verifiedPaymentIntentId
              ? { paymentIntentId: verifiedPaymentIntentId }
              : {}),
            paymentStatus: verifiedPaymentIntentId ? "Paid" : "Pending",
          },
        ],
        { session }
      );

      createdOrder = orders[0];
    });

    return res.status(201).json({
      ok: true,
      message: "Order placed successfully.",
      order: createdOrder,
    });
  } catch (error) {
    console.error("Create order error:", error);

    if (
      error.message === "INSUFFICIENT_STOCK" ||
      error.productId
    ) {
      return res.status(409).json({
        ok: false,
        message:
          "Product ka stock available nahi hai. Products refresh karke dobara try karein.",
      });
    }

    return res.status(500).json({
      ok: false,
      message: "Failed to place order.",
    });
  } finally {
    await session.endSession();
  }
};

// Guest aur registered customer dono Order Number + Email se order track kar sakte hain.
export const trackOrder = async (req, res) => {
  try {
    const { orderId, email } = req.body;

    if (!orderId || !email) {
      return res.status(400).json({
        ok: false,
        message: "Order number and email are required.",
      });
    }

    if (!mongoose.isValidObjectId(orderId.trim())) {
      return res.status(400).json({
        ok: false,
        message: "Invalid order number.",
      });
    }

    const order = await Order.findOne({
      _id: orderId.trim(),
      email: email.trim().toLowerCase(),
    }).populate("items.product");

    if (!order) {
      return res.status(404).json({
        ok: false,
        message:
          "Order not found. Please check your order number and email.",
      });
    }

    return res.status(200).json({
      ok: true,
      order,
    });
  } catch (error) {
    console.error("Track order error:", error);

    return res.status(500).json({
      ok: false,
      message: "Failed to track order.",
    });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user.userId,
    })
      .populate("items.product")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      ok: true,
      orders,
    });
  } catch (error) {
    console.error("Get my orders error:", error);

    return res.status(500).json({
      ok: false,
      message: "Failed to fetch your orders.",
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      ok: true,
      orders,
    });
  } catch (error) {
    console.error("Get all orders error:", error);

    return res.status(500).json({
      ok: false,
      message: "Failed to fetch orders.",
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        ok: false,
        message: "Invalid order ID.",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        ok: false,
        message: "Invalid order status.",
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus: status },
      { new: true, runValidators: true }
    );

    if (!order) {
      return res.status(404).json({
        ok: false,
        message: "Order not found.",
      });
    }

    return res.status(200).json({
      ok: true,
      message: "Order status updated successfully.",
      order,
    });
  } catch (error) {
    console.error("Update order status error:", error);

    return res.status(500).json({
      ok: false,
      message: "Failed to update order status.",
    });
  }
};

export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        ok: false,
        message: "Invalid order ID.",
      });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        ok: false,
        message: "Order not found.",
      });
    }

    await Review.deleteMany({ order: order._id });
    await Order.deleteOne({ _id: order._id });

    return res.status(200).json({
      ok: true,
      message: "Order and its reviews deleted successfully.",
    });
  } catch (error) {
    console.error("Delete order error:", error);

    return res.status(500).json({
      ok: false,
      message: "Failed to delete order.",
    });
  }
};