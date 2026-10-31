const CART_ID_KEY = "shoe-spot-cart-id";

export const getCartId = () => {
  if (typeof window === "undefined") {
    return "";
  }

  let cartId = localStorage.getItem(CART_ID_KEY);

  if (!cartId) {
    cartId =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `cart-${Date.now()}-${Math.random().toString(36).slice(2)}`;

    localStorage.setItem(CART_ID_KEY, cartId);
  }

  return cartId;
};

export default getCartId;