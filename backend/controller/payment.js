
import Stripe from "stripe";
import mongoose from "mongoose";
import { STRIPE_SECRET_KEY } from "../config/config.js";
import Product from "../model/products.js";

const stripe = new Stripe(STRIPE_SECRET_KEY);

const SHIPPING_FEE = 250;
const FREE_SHIPPING_LIMIT = 5000;

export const createPaymentIntent = async (req, res) => {
  try {
    const { items } = req.body;

    if (!STRIPE_SECRET_KEY || !STRIPE_SECRET_KEY.startsWith("sk_test_")) {
      return res.status(500).json({
        ok: false,
        message: "Stripe test secret key is missing or invalid.",
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        ok: false,
        message: "Cart items are required.",
      });
    }

    let subtotal = 0;
    const verifiedItems = [];

    for (const item of items) {
      const { productId, quantity } = item;

      if (
        !mongoose.Types.ObjectId.isValid(productId) ||
        !Number.isInteger(quantity) ||
        quantity < 1
      ) {
        return res.status(400).json({
          ok: false,
          message: "Invalid product or quantity.",
        });
      }

      const product = await Product.findById(productId);

      if (!product || product.isActive === false) {
        return res.status(404).json({
          ok: false,
          message: "A product in your cart is unavailable.",
        });
      }

      if (product.stock < quantity) {
        return res.status(409).json({
          ok: false,
          message: `${product.title} does not have enough stock.`,
        });
      }

      const price =
        typeof product.specialPrice === "number" &&
        product.specialPrice > 0 &&
        product.specialPrice < product.price
          ? product.specialPrice
          : product.price;

      subtotal += price * quantity;

      verifiedItems.push({
        productId: product._id.toString(),
        quantity,
        price,
      });
    }

    const shipping =
      subtotal >= FREE_SHIPPING_LIMIT ? 0 : SHIPPING_FEE;

    const total = subtotal + shipping;
    const amountInMinorUnits = Math.round(total * 100);

    if (
      !Number.isSafeInteger(amountInMinorUnits) ||
      amountInMinorUnits < 50
    ) {
      return res.status(400).json({
        ok: false,
        message: "Invalid payment total.",
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInMinorUnits,
      currency: "pkr",
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        userId:
          req.user?._id?.toString() ||
          req.user?.id?.toString() ||
          "guest",
        items: JSON.stringify(
          verifiedItems.map(({ productId, quantity }) => ({
            productId,
            quantity,
          }))
        ).slice(0, 500),
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
    console.error("Stripe payment error:", error.message);

    return res.status(500).json({
      ok: false,
      message: "Unable to initialize test payment.",
    });
  }
};
