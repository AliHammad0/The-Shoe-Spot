import mongoose from "mongoose";
import Product from "../model/products.js";

// CREATE PRODUCT
export const createProduct = async (req, res) => {
  try {
    const {
      title,
      price,
      discount,
      newArrival,
      category,
      description,
      images,
      brand,
      stock,
      sizes,
      colors,
      isActive,
    } = req.body;

    if (!title || price === undefined || !category) {
      return res.status(400).json({
        ok: false,
        message: "Title, price and category are required",
      });
    }

    const product = await Product.create({
      title,
      price,
      discount,
      newArrival: newArrival ?? false,
      category,
      description,
      images,
      brand,
      stock,
      sizes,
      colors,
      isActive: isActive ?? true,
    });

    return res.status(201).json({
      ok: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

// GET ALL PRODUCTS
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    return res.status(200).json({
      ok: true,
      total: products.length,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

// GET NEW ARRIVALS ONLY
export const getNewArrivals = async (req, res) => {
  try {
    const parsedLimit = Number.parseInt(req.query.limit, 10);
    const limit = Math.min(
      Math.max(Number.isNaN(parsedLimit) ? 36 : parsedLimit, 1),
      100
    );

    const products = await Product.find({
      newArrival: true,
      isActive: true,
    })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return res.status(200).json({
      ok: true,
      total: products.length,
      products,
    });
  } catch (error) {
    console.error("Get New Arrivals Error:", error);

    return res.status(500).json({
      ok: false,
      message: "Failed to fetch new arrivals",
    });
  }
};

// GET SINGLE PRODUCT
export const getSingleProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        ok: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({
        ok: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      ok: true,
      product,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

// UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        ok: false,
        message: "Invalid product ID",
      });
    }

    const allowedFields = [
      "title",
      "price",
      "discount",
      "newArrival",
      "category",
      "description",
      "images",
      "brand",
      "stock",
      "sizes",
      "colors",
      "isActive",
    ];

    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const product = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({
        ok: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      ok: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

// DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        ok: false,
        message: "Invalid product ID",
      });
    }

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({
        ok: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      ok: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: error.message,
    });
  }
};

// SEARCH PRODUCTS
export const searchProducts = async (req, res) => {
  try {
    const { title, category, q } = req.query;

    const searchTerm = (q || title || "").trim();
    const categoryTerm = (category || "").trim();

    if (!searchTerm && !categoryTerm) {
      return res.status(400).json({
        ok: false,
        message: "Search ke liye product name ya category provide karein.",
      });
    }

    const filter = {
      isActive: true,
    };

    if (searchTerm && categoryTerm) {
      filter.$and = [
        {
          $or: [
            { title: { $regex: escapeRegex(searchTerm), $options: "i" } },
            { category: { $regex: escapeRegex(searchTerm), $options: "i" } },
            { brand: { $regex: escapeRegex(searchTerm), $options: "i" } },
          ],
        },
        {
          category: {
            $regex: `^${escapeRegex(categoryTerm)}$`,
            $options: "i",
          },
        },
      ];
    } else if (searchTerm) {
      filter.$or = [
        { title: { $regex: escapeRegex(searchTerm), $options: "i" } },
        { category: { $regex: escapeRegex(searchTerm), $options: "i" } },
        { brand: { $regex: escapeRegex(searchTerm), $options: "i" } },
      ];
    } else {
      filter.category = {
        $regex: `^${escapeRegex(categoryTerm)}$`,
        $options: "i",
      };
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

    return res.status(200).json({
      ok: true,
      total: products.length,
      products,
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: "Products search karte waqt error aaya.",
      error: error.message,
    });
  }
};

// ESCAPE REGEX CHARACTERS
function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
