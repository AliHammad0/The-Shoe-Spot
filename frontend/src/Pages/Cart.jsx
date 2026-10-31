
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  FiX,
  FiPlus,
  FiMinus,
  FiTrash2,
  FiShoppingBag,
} from "react-icons/fi";
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
  clearCartError,
} from "../redux/slices/cartSlice.js";
import getCartId from "../utils/cartId";

const API_URL =
  "https://the-shoe-spot-backend.vercel.app/api/v1";

const Cart = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.items || []);
  const cartError = useSelector((state) => state.cart.error);

  const [actionError, setActionError] = useState("");
  const [busyItems, setBusyItems] = useState({});
  const [clearing, setClearing] = useState(false);

  const cartId = getCartId();

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose?.();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const getItemId = (item) =>
    String(
      item._id ||
        item.productId ||
        item.id ||
        item.product?._id ||
        ""
    );

  const getQuantity = (item) =>
    Number(item.quantity || 1);

  const getPrice = (item) =>
    Number(
      item.specialPrice ??
        item.price ??
        item.product?.specialPrice ??
        item.product?.price ??
        0
    );

  const getStock = (item) =>
    Number(
      item.stock ??
        item.quantityAvailable ??
        item.product?.stock ??
        0
    );

  const getVariant = (item) => ({
    productId: getItemId(item),
    size: item.size || item.selectedSize || "",
    color: item.color || item.selectedColor || "",
  });

  const subtotal = cartItems.reduce(
    (sum, item) =>
      sum + getPrice(item) * getQuantity(item),
    0
  );

  const totalItems = cartItems.reduce(
    (sum, item) => sum + getQuantity(item),
    0
  );

  const formatPrice = (amount) =>
    `Rs. ${amount.toLocaleString("en-PK")}`;

  const setItemBusy = (key, value) => {
    setBusyItems((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const reservationRequest = async (endpoint, payload) => {
    const response = await fetch(
      `${API_URL}/reservations/${endpoint}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cartId,
          ...payload,
        }),
      }
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok || data.ok === false) {
      throw new Error(
        data.message ||
          data.error ||
          "Stock reservation update nahi ho saki."
      );
    }

    return data;
  };

  const handleIncrease = async (item) => {
    const variant = getVariant(item);
    const key = `${variant.productId}-${variant.size}-${variant.color}`;

    if (!variant.productId || busyItems[key]) return;

    setActionError("");
    setItemBusy(key, true);

    try {
      // Pehle backend mein extra stock reserve hoga.
      await reservationRequest("reserve", {
        ...variant,
        quantity: getQuantity(item) + 1,
      });

      // Backend success ke baad Redux cart update hoga.
      dispatch(
        increaseQuantity({
          id: variant.productId,
          size: variant.size,
          color: variant.color,
        })
      );
    } catch (error) {
      setActionError(error.message);
    } finally {
      setItemBusy(key, false);
    }
  };

  const handleDecrease = async (item) => {
    const variant = getVariant(item);
    const key = `${variant.productId}-${variant.size}-${variant.color}`;
    const quantity = getQuantity(item);

    if (
      !variant.productId ||
      quantity <= 1 ||
      busyItems[key]
    ) {
      return;
    }

    setActionError("");
    setItemBusy(key, true);

    try {
      // Quantity kam hone par extra reserved stock release hoga.
      await reservationRequest("reserve", {
        ...variant,
        quantity: quantity - 1,
      });

      dispatch(
        decreaseQuantity({
          id: variant.productId,
          size: variant.size,
          color: variant.color,
        })
      );
    } catch (error) {
      setActionError(error.message);
    } finally {
      setItemBusy(key, false);
    }
  };

  const handleRemove = async (item) => {
    const variant = getVariant(item);
    const key = `${variant.productId}-${variant.size}-${variant.color}`;

    if (!variant.productId || busyItems[key]) return;

    setActionError("");
    setItemBusy(key, true);

    try {
      await reservationRequest("release", variant);

      dispatch(removeFromCart(variant.productId));
    } catch (error) {
      setActionError(error.message);
    } finally {
      setItemBusy(key, false);
    }
  };

  const handleClearCart = async () => {
    if (clearing) return;

    setActionError("");
    setClearing(true);

    try {
      await reservationRequest("release-cart", {});

      dispatch(clearCart());
    } catch (error) {
      setActionError(error.message);
    } finally {
      setClearing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] font-[Arial]">
      <button
        type="button"
        aria-label="Close cart"
        onClick={onClose}
        className="absolute inset-0 h-full w-full bg-black/50"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className="absolute right-0 top-0 flex h-full w-full max-w-[480px] flex-col bg-white shadow-2xl animate-[cartSlideIn_0.3s_ease-out]"
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-5 sm:px-7">
          <div className="flex items-center gap-3">
            <FiShoppingBag size={21} />

            <h2 className="text-xl font-semibold">
              Your Cart
            </h2>

            <span className="flex h-6 min-w-6 items-center justify-center rounded-full bg-black px-2 text-xs text-white">
              {totalItems}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close cart"
            className="p-2 hover:bg-gray-100"
          >
            <FiX size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 sm:px-7">
          {cartItems.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <FiShoppingBag
                size={48}
                className="mb-5 text-gray-300"
              />

              <h3 className="mb-2 text-xl font-semibold">
                Your cart is empty
              </h3>

              <p className="mb-6 text-sm text-gray-500">
                Add your favourite shoes to get started.
              </p>

              <button
                type="button"
                onClick={onClose}
                className="bg-black px-7 py-3 text-sm font-semibold uppercase tracking-wider text-white hover:bg-gray-800"
              >
                Continue shopping
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {cartItems.map((item) => {
                const itemId = getItemId(item);
                const image =
                  item.image ?? item.images?.[0] ?? "";
                const stock = getStock(item);
                const quantity = getQuantity(item);

                const variant = getVariant(item);
                const key = `${variant.productId}-${variant.size}-${variant.color}`;
                const busy = Boolean(busyItems[key]);

                return (
                  <div
                    key={`${itemId}-${item.size ?? ""}-${item.color ?? ""}`}
                    className="flex gap-4 py-5"
                  >
                    <img
                      src={image}
                      alt={item.title || item.name || "Shoe"}
                      className="h-32 w-24 shrink-0 bg-gray-100 object-cover"
                    />

                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-sm font-semibold leading-5">
                          {item.title || item.name}
                        </h3>

                        <button
                          type="button"
                          onClick={() => handleRemove(item)}
                          disabled={busy || clearing}
                          aria-label="Remove item"
                          className="shrink-0 text-gray-400 hover:text-red-600 disabled:opacity-40"
                        >
                          <FiTrash2 size={17} />
                        </button>
                      </div>

                      {item.size != null && (
                        <p className="mt-1 text-xs text-gray-500">
                          Size: {item.size}
                        </p>
                      )}

                      {item.color && (
                        <p className="mt-1 text-xs text-gray-500">
                          Color: {item.color}
                        </p>
                      )}

                      <p className="mt-2 text-sm font-medium">
                        {formatPrice(getPrice(item))}
                      </p>

                      <div className="mt-auto flex items-center justify-between pt-3">
                        <div className="flex items-center border border-gray-300">
                          <button
                            type="button"
                            onClick={() => handleDecrease(item)}
                            disabled={
                              quantity <= 1 || busy || clearing
                            }
                            className="p-2 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label="Decrease quantity"
                          >
                            <FiMinus size={12} />
                          </button>

                          <span className="min-w-8 text-center text-xs">
                            {quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() => handleIncrease(item)}
                            disabled={busy || clearing}
                            className="p-2 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
                            aria-label="Increase quantity"
                          >
                            <FiPlus size={12} />
                          </button>
                        </div>

                        <span className="text-sm font-semibold">
                          {formatPrice(getPrice(item) * quantity)}
                        </span>
                      </div>

                      <p className="mt-2 text-xs text-gray-500">
                        {busy
                          ? "Updating stock..."
                          : stock > 0
                            ? `${stock} items available`
                            : "Stock information unavailable"}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {(actionError || cartError) && (
            <div
              role="alert"
              className="mb-4 border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              <div className="flex items-start justify-between gap-3">
                <p>{actionError || cartError}</p>

                <button
                  type="button"
                  onClick={() => {
                    setActionError("");
                    dispatch(clearCartError());
                  }}
                  aria-label="Dismiss error"
                  className="shrink-0"
                >
                  <FiX size={17} />
                </button>
              </div>
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="border-t border-gray-200 bg-white px-5 py-5 sm:px-7">
            <div className="mb-2 flex justify-between text-sm">
              <span className="text-gray-600">
                Subtotal
              </span>

              <span className="font-semibold">
                {formatPrice(subtotal)}
              </span>
            </div>

            <p className="mb-5 text-xs leading-5 text-gray-500">
              Shipping and applicable charges are calculated at checkout.
            </p>

            <Link
              to="/checkout"
              onClick={onClose}
              className="flex w-full items-center justify-center bg-black px-5 py-4 text-sm font-semibold uppercase tracking-wider text-white hover:bg-gray-800"
            >
              Checkout
            </Link>

            <button
              type="button"
              onClick={handleClearCart}
              disabled={clearing}
              className="mt-4 w-full text-center text-sm text-red-600 underline underline-offset-4 hover:text-red-800 disabled:opacity-50"
            >
              {clearing ? "Clearing cart..." : "Clear Cart"}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="mt-4 w-full text-center text-sm underline underline-offset-4 hover:text-gray-500"
            >
              Continue shopping
            </button>
          </div>
        )}
      </aside>

      <style>{`
        @keyframes cartSlideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default Cart;
