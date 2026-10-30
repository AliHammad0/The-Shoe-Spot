import mongoose from "mongoose";
import slugify from "slugify";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      unique: true,
      index: true,
    },

    price: {
      type: Number,
      required: true,
    },

    discount: {
      type: Number,
      default: 0,
    },

    newArrival: {
      type: Boolean,
      default: false,
    },

    category: {
      type: String,
      enum: [
        "Sneakers",
        "Formal Shoes",
        "Loafers",
        "Boots",
        "Casual Shoes",
        "Sliders",
        "Sports Shoes",
        "Sandals",
      ],
    },

    description: {
      type: String,
      default: "",
    },

    images: {
      type: [String],
      default: [],
    },

    brand: {
      type: String,
      default: "The Shoe Spot",
    },

    stock: {
      type: Number,
      default: 0,
    },

    sizes: {
      type: [Number],
      default: [],
    },

    colors: {
      type: [String],
      default: [],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

productSchema.pre("validate", async function () {
  if (this.title && (!this.slug || this.isModified("title"))) {
    const baseSlug = slugify(this.title, {
      lower: true,
      strict: true,
    });

    let slug = baseSlug;
    let count = 1;

    while (
      await mongoose.models.Product.exists({
        slug,
        _id: { $ne: this._id },
      })
    ) {
      slug = `${baseSlug}-${count}`;
      count++;
    }

    this.slug = slug;
  }
});

const Product = mongoose.model("Product", productSchema);

export default Product;