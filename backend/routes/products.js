import express from "express";
import {
  createProduct,
  getAllProducts,
  getNewArrivals,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
} from "../controller/products.js";

import {
  authMiddleware,
  adminMiddleware,
} from "../middleware/auth.js";

const productRouter = express.Router();

productRouter.post(
  "/create",
  // authMiddleware,
  // adminMiddleware,
  createProduct
);

productRouter.get("/search", searchProducts);

// NEW ARRIVALS — is route ko /:id se pehle rakhna zaroori hai
productRouter.get("/new", getNewArrivals);

productRouter.get("/", getAllProducts);
productRouter.get("/:id", getSingleProduct);

productRouter.put("/:id", updateProduct);

productRouter.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteProduct
);

export default productRouter;
