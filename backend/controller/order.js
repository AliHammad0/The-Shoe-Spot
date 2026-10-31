
import mongoose from "mongoose";
import Stripe from "stripe";
import Order from "../model/order.js";
import Product from "../model/products.js";
import Review from "../model/review.js";
import Reservation from "../model/reservation.js";
import { STRIPE_SECRET_KEY } from "../config/config.js";

const stripe = STRIPE_SECRET_KEY
  ? new Stripe(STRIPE_SECRET_KEY)
  : null;

const normalizeOption = (value) => String(value || "").trim();

export const createOrder = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const {
      cartId,
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
      !cartId ||
      typeof cartId !== "string" ||
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
        message: "Please provide all required order details, including cart ID.",
      });
    }

    const normalizedCartId = cartId.trim();

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
      color: normalizeOption(item.color),
      size: normalizeOption(item.size),
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
      if (!stripe) {
        return res.status(500).json({
          ok: false,
          message: "Stripe is not configured.",
        });
      }

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

      if (
        paymentIntent.metadata?.cartId !== normalizedCartId
      ) {
        return res.status(403).json({
          ok: false,
          message: "This payment does not belong to this cart.",
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

    // Same product, size aur color ki quantities combine karo.
    const reservationRequirements = new Map();

    for (const item of orderItems) {
      const key = [
        String(item.product),
        item.size,
        item.color,
      ].join("|");

      const existing = reservationRequirements.get(key);

      if (existing) {
        existing.quantity += item.quantity;
      } else {
        reservationRequirements.set(key, {
          product: item.product,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
        });
      }
    }

    let createdOrder;

    await session.withTransaction(async () => {
      const now = new Date();

      // Har cart item ki valid reservation verify karo.
      for (const requirement of reservationRequirements.values()) {
        const reservation = await Reservation.findOne({
          cartId: normalizedCartId,
          product: requirement.product,
          size: requirement.size,
          color: requirement.color,
          quantity: requirement.quantity,
          expiresAt: { $gt: now },
        }).session(session);

        if (!reservation) {
          const error = new Error("RESERVATION_INVALID");
          error.productId = String(requirement.product);
          throw error;
        }

        const product = await Product.findOne({
          _id: requirement.product,
          isActive: { $ne: false },
        }).session(session);

        if (!product) {
          const error = new Error("PRODUCT_NOT_AVAILABLE");
          error.productId = String(requirement.product);
          throw error;
        }
      }

      // Order create karo. Stock dobara minus nahi hoga.
      const orders = await Order.create(
        [
          {
            user:
              req.user?.userId ||
              req.user?._id ||
              undefined,
            customerName,
            email: email.trim().toLowerCase(),
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
            paymentStatus: verifiedPaymentIntentId
              ? "Paid"
              : "Pending",
          },
        ],
        { session }
      );

      createdOrder = orders[0];

      // Order successful hone par reservations consume karo.
      await Reservation.deleteMany(
        { cartId: normalizedCartId },
        { session }
      );
    });

    return res.status(201).json({
      ok: true,
      message: "Order placed successfully.",
      order: createdOrder,
    });
  } catch (error) {
    console.error("Create order error:", error);

    if (
      error.message === "RESERVATION_INVALID" ||
      error.message === "PRODUCT_NOT_AVAILABLE"
    ) {
      return res.status(409).json({
        ok: false,
        message:
          "Cart ki stock reservation missing ya expire ho chuki hai. Cart refresh karke dobara try karein.",
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
  const session = await mongoose.startSession();

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

    let updatedOrder;

    await session.withTransaction(async () => {
      const order = await Order.findById(req.params.id).session(session);

      if (!order) {
        const error = new Error("ORDER_NOT_FOUND");
        throw error;
      }

      if (order.orderStatus === "Cancelled" && status !== "Cancelled") {
        const error = new Error("ORDER_ALREADY_CANCELLED");
        throw error;
      }

      // Cancel hone par stock sirf ek baar restore hoga.
      if (
        status === "Cancelled" &&
        order.orderStatus !== "Cancelled"
      ) {
        for (const item of order.items) {
          await Product.updateOne(
            { _id: item.product },
            { $inc: { stock: item.quantity } },
            { session }
          );
        }
      }

      order.orderStatus = status;
      await order.save({ session });

      updatedOrder = order;
    });

    return res.status(200).json({
      ok: true,
      message: "Order status updated successfully.",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Update order status error:", error);

    if (error.message === "ORDER_NOT_FOUND") {
      return res.status(404).json({
        ok: false,
        message: "Order not found.",
      });
    }

    if (error.message === "ORDER_ALREADY_CANCELLED") {
      return res.status(409).json({
        ok: false,
        message: "A cancelled order cannot be reactivated.",
      });
    }

    return res.status(500).json({
      ok: false,
      message: "Failed to update order status.",
    });
  } finally {
    await session.endSession();
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
