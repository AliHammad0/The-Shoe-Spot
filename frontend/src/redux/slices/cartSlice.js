
import { createSlice } from "@reduxjs/toolkit";

const getProductId = (item) =>
  String(item._id || item.productId || item.id || "");

const getStock = (item) =>
  Math.max(0, Number(item.stock ?? item.quantityAvailable ?? 0));

const sameCartItem = (item, target) =>
  getProductId(item) === String(target.id ?? target) &&
  (typeof target === "object"
    ? item.size === target.size && item.color === target.color
    : true);

const cartSlice = createSlice({
  name: "cart",

  initialState: {
    items: [],
    error: "",
  },

  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const productId = getProductId(product);
      const requestedQuantity = Math.max(
        1,
        Number(product.quantity) || 1
      );
      const stock = getStock(product);

      state.error = "";

      if (!productId) {
        state.error = "Product ID missing hai.";
        return;
      }

      if (stock <= 0) {
        state.error = "Yeh product out of stock hai.";
        return;
      }

      const existingItem = state.items.find(
        (item) =>
          getProductId(item) === productId &&
          item.size === product.size &&
          item.color === product.color
      );

      const currentQuantity = existingItem
        ? Number(existingItem.quantity) || 0
        : 0;

      if (currentQuantity + requestedQuantity > stock) {
        state.error = `Sirf ${stock} items available hain. Cart mein pehle se ${currentQuantity} hain.`;
        return;
      }

      if (existingItem) {
        existingItem.quantity = currentQuantity + requestedQuantity;
        existingItem.stock = stock;
      } else {
        state.items.push({
          ...product,
          _id: productId,
          productId,
          quantity: requestedQuantity,
          stock,
        });
      }
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (item) => !sameCartItem(item, action.payload)
      );
      state.error = "";
    },

    increaseQuantity: (state, action) => {
      const item = state.items.find((item) =>
        sameCartItem(item, action.payload)
      );

      state.error = "";

      if (!item) return;

      const stock = getStock(item);

      if (item.quantity >= stock) {
        state.error = `Sirf ${stock} items available hain.`;
        return;
      }

      item.quantity += 1;
    },

    decreaseQuantity: (state, action) => {
      const item = state.items.find((item) =>
        sameCartItem(item, action.payload)
      );

      state.error = "";

      if (item && item.quantity > 1) {
        item.quantity -= 1;
      }
    },

    clearCart: (state) => {
      state.items = [];
      state.error = "";
    },

    clearCartError: (state) => {
      state.error = "";
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
  clearCartError,
} = cartSlice.actions;

export default cartSlice.reducer;