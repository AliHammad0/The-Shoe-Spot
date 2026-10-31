import mongoose from "mongoose";
import Product from "../model/products.js";
import Reservation from "../model/reservation.js";

const RESERVATION_MINUTES = 15;

const getExpiryDate = () =>
  new Date(Date.now() + RESERVATION_MINUTES * 60 * 1000);

const normalizeOption = (value) => String(value || "").trim();

const isValidQuantity = (quantity) =>
  Number.isInteger(quantity) && quantity >= 0;

// Reserve product stock
export const reserveStock = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { cartId, productId, quantity, size, color } = req.body;

    if (
      !cartId ||
      !mongoose.Types.ObjectId.isValid(productId) ||
      !Number.isInteger(quantity) ||
      quantity < 1
    ) {
      return res.status(400).json({
        ok: false,
        message: "Invalid cart, product or quantity.",
      });
    }

    let response;

    await session.withTransaction(async () => {
      const product = await Product.findOne({
        _id: productId,
        isActive: { $ne: false },
      }).session(session);

      if (!product) {
        throw new Error("PRODUCT_NOT_FOUND");
      }

      const reservationQuery = {
        cartId: String(cartId).trim(),
        product: productId,
        size: normalizeOption(size),
        color: normalizeOption(color),
      };

      const existingReservation = await Reservation.findOne(
        reservationQuery
      ).session(session);

      const previousQuantity = existingReservation
        ? existingReservation.quantity
        : 0;

      const difference = quantity - previousQuantity;

      if (difference > 0) {
        const updatedProduct = await Product.findOneAndUpdate(
          {
            _id: productId,
            stock: { $gte: difference },
            isActive: { $ne: false },
          },
          {
            $inc: { stock: -difference },
          },
          {
            new: true,
            session,
          }
        );

        if (!updatedProduct) {
          throw new Error("INSUFFICIENT_STOCK");
        }
      }

      if (difference < 0) {
        await Product.updateOne(
          { _id: productId },
          { $inc: { stock: Math.abs(difference) } },
          { session }
        );
      }

      const expiresAt = getExpiryDate();

      if (quantity === 0) {
        if (existingReservation) {
          await Reservation.deleteOne(
            { _id: existingReservation._id },
            { session }
          );
        }
      } else if (existingReservation) {
        existingReservation.quantity = quantity;
        existingReservation.expiresAt = expiresAt;
        await existingReservation.save({ session });
      } else {
        await Reservation.create(
          [
            {
              ...reservationQuery,
              quantity,
              expiresAt,
            },
          ],
          { session }
        );
      }

      const updatedProduct = await Product.findById(productId)
        .session(session);

      response = {
        ok: true,
        message: "Stock reservation updated.",
        stock: updatedProduct.stock,
        reservedQuantity: quantity,
      };
    });

    return res.status(200).json(response);
  } catch (error) {
    if (error.message === "PRODUCT_NOT_FOUND") {
      return res.status(404).json({
        ok: false,
        message: "Product available nahi hai.",
      });
    }

    if (error.message === "INSUFFICIENT_STOCK") {
      return res.status(409).json({
        ok: false,
        message: "Required quantity ka stock available nahi hai.",
      });
    }

    console.error("Reserve stock error:", error);

    return res.status(500).json({
      ok: false,
      message: "Stock reserve nahi ho saka.",
    });
  } finally {
    await session.endSession();
  }
};

// Release one product reservation
export const releaseStock = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { cartId, productId, size, color } = req.body;

    if (!cartId || !mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        ok: false,
        message: "Invalid cart or product.",
      });
    }

    await session.withTransaction(async () => {
      const reservation = await Reservation.findOne({
        cartId: String(cartId).trim(),
        product: productId,
        size: normalizeOption(size),
        color: normalizeOption(color),
      }).session(session);

      if (!reservation) return;

      await Product.updateOne(
        { _id: reservation.product },
        { $inc: { stock: reservation.quantity } },
        { session }
      );

      await Reservation.deleteOne(
        { _id: reservation._id },
        { session }
      );
    });

    return res.status(200).json({
      ok: true,
      message: "Stock released successfully.",
    });
  } catch (error) {
    console.error("Release stock error:", error);

    return res.status(500).json({
      ok: false,
      message: "Stock release nahi ho saka.",
    });
  } finally {
    await session.endSession();
  }
};

// Release complete cart reservations
export const releaseCartStock = async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { cartId } = req.body;

    if (!cartId) {
      return res.status(400).json({
        ok: false,
        message: "Cart ID required hai.",
      });
    }

    await session.withTransaction(async () => {
      const reservations = await Reservation.find({
        cartId: String(cartId).trim(),
      }).session(session);

      for (const reservation of reservations) {
        await Product.updateOne(
          { _id: reservation.product },
          { $inc: { stock: reservation.quantity } },
          { session }
        );
      }

      await Reservation.deleteMany(
        { cartId: String(cartId).trim() },
        { session }
      );
    });

    return res.status(200).json({
      ok: true,
      message: "Cart stock released successfully.",
    });
  } catch (error) {
    console.error("Release cart error:", error);

    return res.status(500).json({
      ok: false,
      message: "Cart stock release nahi ho saka.",
    });
  } finally {
    await session.endSession();
  }
};

// Restore expired reservations
// Restore expired reservations
export const cleanupExpiredReservations = async () => {
  const session = await mongoose.startSession();

  try {
    let cleanedCount = 0;

    await session.withTransaction(async () => {
      const expiredReservations = await Reservation.find({
        expiresAt: { $lte: new Date() },
      }).session(session);

      for (const reservation of expiredReservations) {
        await Product.updateOne(
          { _id: reservation.product },
          { $inc: { stock: reservation.quantity } },
          { session }
        );

        await Reservation.deleteOne(
          {
            _id: reservation._id,
            expiresAt: { $lte: new Date() },
          },
          { session }
        );

        cleanedCount++;
      }
    });

    return cleanedCount;
  } catch (error) {
    console.error("Expired reservation cleanup error:", error);
    throw error;
  } finally {
    await session.endSession();
  }
};;