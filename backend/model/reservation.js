import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    cartId: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    size: {
      type: String,
      default: "",
    },

    color: {
      type: String,
      default: "",
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

reservationSchema.index(
  { cartId: 1, product: 1, size: 1, color: 1 },
  { unique: true }
);

const Reservation = mongoose.model(
  "Reservation",
  reservationSchema
);

export default Reservation;