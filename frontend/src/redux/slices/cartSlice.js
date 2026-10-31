
import { createSlice } from "@reduxjs/toolkit";

const getProductId = (item) =>
  String(item?._id || item?.productId || item?.id || "");

const sameCartItem = (item, target) => {
  const targetId =
    typeof target === "object" && target !== null
      ? target.id || target.productId || target._id
      : target;

  if (getProductId(item) !== String(targetId || "")) {
    return false;
  }

  if (typeof target !== "object" || target === null) {
    return true;
  }

  return (
    String(item.size || "") === String(target.size || "") &&
    String(item.color || "") === String(target.color || "")
  );
};

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

      state.error = "";

      if (!productId) {
        state.error = "Product ID missing hai.";
        return;
      }

      const existingItem = state.items.find(
        (item) =>
          getProductId(item) === productId &&
          String(item.size || "") === String(product.size || "") &&
          String(item.color || "") === String(product.color || "")
      );

      if (existingItem) {
        existingItem.quantity =
          (Number(existingItem.quantity) || 0) + requestedQuantity;
      } else {
        state.items.push({
          ...product,
          _id: productId,
          productId,
          quantity: requestedQuantity,
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

      item.quantity = (Number(item.quantity) || 0) + 1;
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
