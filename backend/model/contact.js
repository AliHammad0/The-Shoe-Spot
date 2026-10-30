import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    orderType: {
      type: String,
      required: true,
      enum: ["Single Order", "Bulk Order"],
    },

    shoeCategory: {
      type: String,
      required: true,
      enum: [
        "Sneakers",
        "Formal Shoes",
        "Loafers",
        "Boots",
        "Casual Shoes",
        "Sandals",
        "Sliders",
        "Sports Shoes",
      ],
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    additionalRequirements: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;