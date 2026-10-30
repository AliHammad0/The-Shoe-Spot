
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      const product = action.payload;

      const productId = product._id || product.id;

      if (!productId) return;

      const alreadyExists = state.items.some(
        (item) => (item._id || item.id) === productId
      );

      if (!alreadyExists) {
        state.items.push(product);
      }
    },

    removeFromWishlist: (state, action) => {
      const productId =
        typeof action.payload === "object"
          ? action.payload._id || action.payload.id
          : action.payload;

      state.items = state.items.filter(
        (item) => (item._id || item.id) !== productId
      );
    },

    toggleWishlist: (state, action) => {
      const product = action.payload;
      const productId = product._id || product.id;

      if (!productId) return;

      const existingIndex = state.items.findIndex(
        (item) => (item._id || item.id) === productId
      );

      if (existingIndex >= 0) {
        state.items.splice(existingIndex, 1);
      } else {
        state.items.push(product);
      }
    },

    clearWishlist: (state) => {
      state.items = [];
    },
  },
});

export const {
  addToWishlist,
  removeFromWishlist,
  toggleWishlist,
  clearWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
