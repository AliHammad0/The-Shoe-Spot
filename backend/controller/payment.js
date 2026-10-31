import Stripe from "stripe";
import mongoose from "mongoose";
import { STRIPE_SECRET_KEY } from "../config/config.js";
import Product from "../model/products.js";
import Reservation from "../model/reservation.js";

const stripe = STRIPE_SECRET_KEY ? new Stripe(STRIPE_SECRET_KEY) : null;

const SHIPPING_FEE = 250;
const FREE_SHIPPING_LIMIT = 5000;

const normalizeOption = (value) => String(value || "").trim();

export const createPaymentIntent = async (req, res) => {
  try {
    const { items, cartId } = req.body;

    if (!STRIPE_SECRET_KEY || !STRIPE_SECRET_KEY.startsWith("sk_test_")) {
      return res.status(500).json({
        ok: false,
        message: "Stripe test key is not configured.",
      });
    }

    if (!cartId || typeof cartId !== "string") {
      return res.status(400).json({
        ok: false,
        message: "Cart ID is required.",
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        ok: false,
        message: "Cart is empty.",
      });
    }

    let subtotal = 0;

    for (const item of items) {
      const productId = item.productId || item._id || item.product;
      const quantity = Number(item.quantity);
      const size = normalizeOption(item.size);
      const color = normalizeOption(item.color);

      if (
        !productId ||
        !mongoose.Types.ObjectId.isValid(productId) ||
        !Number.isInteger(quantity) ||
        quantity < 1
      ) {
        return res.status(400).json({
          ok: false,
          message: "Invalid cart item.",
        });
      }

      const product = await Product.findById(productId);

      if (!product || product.isActive === false) {
        return res.status(404).json({
          ok: false,
          message: "One of your products is no longer available.",
        });
      }

      const reservation = await Reservation.findOne({
        cartId: cartId.trim(),
        product: productId,
        size,
        color,
        quantity,
        expiresAt: { $gt: new Date() },
      });

      if (!reservation) {
        return res.status(409).json({
          ok: false,
          message: `${product.title}: stock reservation is missing or expired. Please update your cart.`,
        });
      }

      const price =
        Number(product.specialPrice) > 0 &&
        Number(product.specialPrice) < Number(product.price)
          ? Number(product.specialPrice)
          : Number(product.price);

      if (!Number.isFinite(price) || price <= 0) {
        return res.status(400).json({
          ok: false,
          message: `Invalid price for ${product.title}.`,
        });
      }

      subtotal += price * quantity;
    }

    const shipping =
      subtotal >= FREE_SHIPPING_LIMIT ? 0 : SHIPPING_FEE;

    const total = subtotal + shipping;
    const amount = Math.round(total * 100);

    if (!Number.isSafeInteger(amount) || amount < 5000) {
      return res.status(400).json({
        ok: false,
        message: "Payment amount must be at least PKR 50.",
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "pkr",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        cartId: cartId.trim(),
        userId: req.user?._id?.toString() || "guest",
      },
    });

    return res.status(200).json({
      ok: true,
      clientSecret: paymentIntent.client_secret,
      subtotal,
      shipping,
      total,
    });
  } catch (error) {
    console.error("Create Payment Intent Error:", error);

    return res.status(500).json({
      ok: false,
      message: "Unable to initialize test payment.",
    });
  }
};