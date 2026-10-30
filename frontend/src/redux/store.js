
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice.js";
import wishlistReducer from "./slices/wishlistSlice.js";

const loadCart = () => {
  try {
    const savedCart = localStorage.getItem("shoe-spot-cart");

    return savedCart ? JSON.parse(savedCart) : { items: [], error: "" };
  } catch {
    return { items: [], error: "" };
  }
};

const saveCart = (cart) => {
  try {
    localStorage.setItem(
      "shoe-spot-cart",
      JSON.stringify({
        items: cart.items,
      })
    );
  } catch (error) {
    console.error("Cart save nahi ho saka:", error);
  }
};

const loadWishlist = () => {
  try {
    const savedWishlist = localStorage.getItem("shoe-spot-wishlist");

    return savedWishlist ? JSON.parse(savedWishlist) : { items: [] };
  } catch {
    return { items: [] };
  }
};

const saveWishlist = (wishlist) => {
  try {
    localStorage.setItem(
      "shoe-spot-wishlist",
      JSON.stringify({
        items: wishlist.items,
      })
    );
  } catch (error) {
    console.error("Wishlist save nahi ho saki:", error);
  }
};

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    wishlist: wishlistReducer,
  },
  preloadedState: {
    cart: loadCart(),
    wishlist: loadWishlist(),
  },
});

store.subscribe(() => {
  const state = store.getState();

  saveCart(state.cart);
  saveWishlist(state.wishlist);
});
