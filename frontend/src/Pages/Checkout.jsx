
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { FiCheckCircle, FiCreditCard, FiPackage } from "react-icons/fi";
import { clearCart } from "../redux/slices/cartSlice";

const API_URL = "http://localhost:8080/api/v1";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ""
);

const SHIPPING_CHARGES = 250;
const FREE_SHIPPING_LIMIT = 5000;

const getProductId = (product) =>
  product?._id ||
  product?.productId ||
  product?.id ||
  product?.product?._id ||
  "";

const getPrice = (product) =>
  Number(
    product?.specialPrice ??
      product?.price ??
      product?.product?.specialPrice ??
      product?.product?.price ??
      0
  );

const getQuantity = (product) =>
  Number(product?.quantity ?? product?.qty ?? 1);

const getProductTitle = (product) =>
  product?.title ||
  product?.name ||
  product?.product?.title ||
  product?.product?.name ||
  "Product";

const getProductImage = (product) =>
  product?.image ||
  product?.images?.[0] ||
  product?.product?.image ||
  product?.product?.images?.[0] ||
  "";

const getToken = () =>
  localStorage.getItem("token") ||
  localStorage.getItem("accessToken") ||
  "";

const getHeaders = () => {
  const token = getToken();

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const formatPrice = (amount) =>
  new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

const getErrorMessage = (data, fallback) =>
  data?.message || data?.error || fallback;

const getOrderTotal = (order, fallbackTotal) => {
  const candidates = [
    order?.total,
    order?.totalAmount,
    order?.grandTotal,
    order?.paymentSummary?.total,
  ];

  for (const value of candidates) {
    if (
      value !== undefined &&
      value !== null &&
      value !== "" &&
      Number.isFinite(Number(value))
    ) {
      return Number(value);
    }
  }

  return fallbackTotal;
};

const StripePaymentForm = ({
  formRef,
  validateDelivery,
  onPaymentSuccess,
  loading,
  setLoading,
  setError,
}) => {
  const stripe = useStripe();
  const elements = useElements();

  const handlePayment = async () => {
    setError("");

    if (!formRef.current?.reportValidity()) return;

    if (!stripe || !elements) {
      setError("Stripe abhi load nahi hua. Dobara try karein.");
      return;
    }

    if (!validateDelivery()) return;

    setLoading(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout`,
        },
        redirect: "if_required",
      });

      if (error) {
        setError(error.message || "Payment complete nahi ho saki.");
        return;
      }

      if (paymentIntent?.status !== "succeeded") {
        setError(
          `Payment status: ${paymentIntent?.status || "unknown"}. Payment abhi successful confirm nahi hui.`
        );
        return;
      }

      await onPaymentSuccess(paymentIntent.id);
    } catch (err) {
      setError(err.message || "Payment process mein error aa gaya.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-5 rounded-xl border border-stone-200 bg-white p-4 sm:p-5">
      <div className="mb-4 flex items-center gap-2">
        <FiCreditCard className="text-xl" />
        <h3 className="font-semibold text-stone-900">Card Payment</h3>
      </div>

      <PaymentElement />

      <button
        type="button"
        onClick={handlePayment}
        disabled={!stripe || !elements || loading}
        className="mt-5 w-full rounded-lg bg-black px-5 py-3.5 font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Processing Payment..." : "Pay Now"}
      </button>

      <p className="mt-3 text-center text-xs text-stone-500">
        Your payment details are processed securely by Stripe.
      </p>
    </div>
  );
};

const Checkout = () => {
  const dispatch = useDispatch();
  const formRef = useRef(null);

  const cartItems = useSelector((state) => state.cart.items || []);

  const [form, setForm] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [intentLoading, setIntentLoading] = useState(false);
  const [error, setError] = useState("");
  const [placedOrder, setPlacedOrder] = useState(null);
  const [placedOrderTotal, setPlacedOrderTotal] = useState(null);

  const items = useMemo(
    () =>
      cartItems.map((item) => ({
        productId: getProductId(item),
        title: getProductTitle(item),
        image: getProductImage(item),
        price: getPrice(item),
        quantity: getQuantity(item),
        color: item?.color || item?.selectedColor || "",
        size: item?.size || item?.selectedSize || "",
      })),
    [cartItems]
  );

  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      ),
    [items]
  );

  const shipping =
    subtotal >= FREE_SHIPPING_LIMIT ? 0 : SHIPPING_CHARGES;

  const total = subtotal + shipping;

  const validateDelivery = () => {
    if (!form.customerName.trim()) {
      setError("Apna full name enter karein.");
      return false;
    }

    if (!form.email.trim()) {
      setError("Email address enter karein.");
      return false;
    }

    if (!form.phone.trim()) {
      setError("Phone number enter karein.");
      return false;
    }

    if (!form.address.trim()) {
      setError("Delivery address enter karein.");
      return false;
    }

    if (!form.city.trim()) {
      setError("City enter karein.");
      return false;
    }

    if (!items.length) {
      setError("Aapka cart empty hai.");
      return false;
    }

    if (
      items.some(
        (item) =>
          !item.productId ||
          !Number.isInteger(item.quantity) ||
          item.quantity < 1 ||
          !Number.isFinite(item.price) ||
          item.price < 0
      )
    ) {
      setError("Cart mein product information check karein.");
      return false;
    }

    setError("");
    return true;
  };

  const createOrder = async (method, paymentIntentId = "") => {
    const response = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({
        ...form,
        items,
        subtotal,
        shipping,
        total,
        paymentMethod: method,
        ...(paymentIntentId ? { paymentIntentId } : {}),
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || data.ok === false) {
      throw new Error(
        getErrorMessage(data, "Order create nahi ho saka.")
      );
    }

    const order = data.order || data.data || data;

    setPlacedOrderTotal(getOrderTotal(order, total));
    setPlacedOrder(order);
    setClientSecret("");
    dispatch(clearCart());
  };

  useEffect(() => {
    if (
      paymentMethod !== "Stripe" ||
      !total ||
      placedOrder ||
      !import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
    ) {
      setClientSecret("");
      return;
    }

    let cancelled = false;

    const createPaymentIntent = async () => {
      setIntentLoading(true);
      setError("");
      setClientSecret("");

      try {
        const response = await fetch(
          `${API_URL}/payments/create-intent`,
          {
            method: "POST",
            headers: getHeaders(),
            body: JSON.stringify({
              items: items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
              })),
            }),
          }
        );

        const data = await response.json().catch(() => ({}));

        if (!response.ok || data.ok === false) {
          throw new Error(
            getErrorMessage(
              data,
              "Stripe PaymentIntent create nahi hua."
            )
          );
        }

        if (!data.clientSecret) {
          throw new Error(
            "Backend se clientSecret nahi mila. Payment API check karein."
          );
        }

        if (!cancelled) {
          setClientSecret(data.clientSecret);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Stripe initialize nahi hua.");
        }
      } finally {
        if (!cancelled) {
          setIntentLoading(false);
        }
      }
    };

    createPaymentIntent();

    return () => {
      cancelled = true;
    };
  }, [paymentMethod, total, placedOrder, items]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) setError("");
  };

  const handleCOD = async (event) => {
    event.preventDefault();
    setError("");

    if (!formRef.current?.reportValidity()) return;
    if (!validateDelivery()) return;

    setLoading(true);

    try {
      await createOrder("COD");
    } catch (err) {
      setError(err.message || "Order place nahi ho saka.");
    } finally {
      setLoading(false);
    }
  };

  const handleStripeSuccess = async (paymentIntentId) => {
    try {
      await createOrder("Stripe", paymentIntentId);
    } catch (err) {
      setError(
        `Payment successful hai, lekin order save nahi hua. Payment ID: ${paymentIntentId}. ${err.message}`
      );
    }
  };

  if (placedOrder) {
    const confirmationTotal =
      placedOrderTotal !== null ? placedOrderTotal : total;

    return (
      <main className="min-h-screen bg-[#faf9f6] px-4 py-16">
        <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 text-center shadow-sm sm:p-12">
          <FiCheckCircle className="mx-auto mb-5 text-5xl text-green-600" />

          <h1 className="text-2xl font-bold text-stone-900">
            Order Placed Successfully
          </h1>

          <p className="mt-3 text-stone-600">
            Thank you for shopping with us.
          </p>

          {(placedOrder.orderNumber ||
            placedOrder._id ||
            placedOrder.id) && (
            <p className="mt-4 text-sm text-stone-700">
              Order ID:{" "}
              <span className="font-semibold">
                {placedOrder.orderNumber ||
                  placedOrder._id ||
                  placedOrder.id}
              </span>
            </p>
          )}

          <p className="mt-3 font-semibold text-stone-900">
            Total: {formatPrice(confirmationTotal)}
          </p>

          <p className="mt-2 text-sm text-stone-500">
            Payment Method: {placedOrder.paymentMethod || paymentMethod}
          </p>

          <button
            type="button"
            onClick={() => (window.location.href = "/")}
            className="mt-7 rounded-lg bg-black px-7 py-3 font-semibold text-white hover:bg-stone-800"
          >
            Continue Shopping
          </button>
        </div>
      </main>
    );
  }

  if (!cartItems.length) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center bg-[#faf9f6] px-4">
        <div className="text-center">
          <FiPackage className="mx-auto mb-4 text-4xl text-stone-500" />

          <h1 className="text-2xl font-bold text-stone-900">
            Your Cart Is Empty
          </h1>

          <p className="mt-2 text-stone-600">
            Checkout karne ke liye pehle products cart mein add karein.
          </p>

          <button
            type="button"
            onClick={() => (window.location.href = "/shop")}
            className="mt-5 rounded-lg bg-black px-6 py-3 text-white"
          >
            Shop Now
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf9f6] px-4 py-10 sm:px-6 lg:py-14">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-3xl font-bold text-stone-900 sm:text-4xl">
          Checkout
        </h1>

        <p className="mb-8 text-stone-600">
          Delivery details enter karein aur payment method select karein.
        </p>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_0.9fr]">
          <form
            ref={formRef}
            onSubmit={handleCOD}
            className="rounded-2xl bg-white p-5 shadow-sm sm:p-7"
          >
            <h2 className="mb-5 text-xl font-bold text-stone-900">
              Delivery Information
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label
                  htmlFor="customerName"
                  className="mb-1.5 block text-sm font-medium text-stone-700"
                >
                  Full Name
                </label>

                <input
                  id="customerName"
                  name="customerName"
                  type="text"
                  autoComplete="name"
                  value={form.customerName}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-black"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-stone-700"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-black"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="mb-1.5 block text-sm font-medium text-stone-700"
                >
                  Phone Number
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-black"
                  placeholder="03XX XXXXXXX"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="address"
                  className="mb-1.5 block text-sm font-medium text-stone-700"
                >
                  Complete Address
                </label>

                <textarea
                  id="address"
                  name="address"
                  autoComplete="street-address"
                  value={form.address}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full resize-y rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-black"
                  placeholder="House number, street, area"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="city"
                  className="mb-1.5 block text-sm font-medium text-stone-700"
                >
                  City
                </label>

                <input
                  id="city"
                  name="city"
                  type="text"
                  autoComplete="address-level2"
                  value={form.city}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-black"
                  placeholder="Enter your city"
                />
              </div>
            </div>

            <div className="mt-8">
              <h2 className="mb-4 text-xl font-bold text-stone-900">
                Payment Method
              </h2>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod("COD");
                    setError("");
                  }}
                  className={`rounded-xl border p-4 text-left transition ${
                    paymentMethod === "COD"
                      ? "border-black bg-stone-50"
                      : "border-stone-200 hover:border-stone-400"
                  }`}
                >
                  <span className="block font-semibold text-stone-900">
                    Cash on Delivery
                  </span>

                  <span className="mt-1 block text-sm text-stone-500">
                    Pay when your order arrives
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod("Stripe");
                    setError("");
                  }}
                  className={`rounded-xl border p-4 text-left transition ${
                    paymentMethod === "Stripe"
                      ? "border-black bg-stone-50"
                      : "border-stone-200 hover:border-stone-400"
                  }`}
                >
                  <span className="flex items-center gap-2 font-semibold text-stone-900">
                    <FiCreditCard />
                    Card Payment
                  </span>

                  <span className="mt-1 block text-sm text-stone-500">
                    Secure payment through Stripe
                  </span>
                </button>
              </div>
            </div>

            {error && (
              <div
                role="alert"
                className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            {paymentMethod === "COD" ? (
              <button
                type="submit"
                disabled={loading}
                className="mt-6 w-full rounded-lg bg-black px-5 py-3.5 font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Placing Order..." : "Place Order"}
              </button>
            ) : (
              <div>
                {!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY && (
                  <p className="mt-5 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                    Frontend ki VITE_STRIPE_PUBLISHABLE_KEY configure nahi hai.
                  </p>
                )}

                {intentLoading && (
                  <p className="mt-5 text-sm text-stone-600">
                    Secure payment form load ho raha hai...
                  </p>
                )}

                {clientSecret &&
                  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY && (
                    <Elements
                      stripe={stripePromise}
                      options={{
                        clientSecret,
                        appearance: {
                          theme: "stripe",
                          variables: {
                            colorPrimary: "#191919",
                            borderRadius: "8px",
                          },
                        },
                      }}
                    >
                      <StripePaymentForm
                        formRef={formRef}
                        validateDelivery={validateDelivery}
                        onPaymentSuccess={handleStripeSuccess}
                        loading={loading}
                        setLoading={setLoading}
                        setError={setError}
                      />
                    </Elements>
                  )}
              </div>
            )}
          </form>

          <aside className="h-fit rounded-2xl bg-white p-5 shadow-sm sm:p-7">
            <h2 className="mb-5 text-xl font-bold text-stone-900">
              Order Summary
            </h2>

            <div className="max-h-80 space-y-4 overflow-y-auto">
              {items.map((item, index) => (
                <div
                  key={`${item.productId}-${index}`}
                  className="flex gap-3"
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-20 w-20 rounded-lg bg-stone-100 object-cover"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-stone-100">
                      <FiPackage className="text-2xl text-stone-400" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <h3 className="line-clamp-2 font-medium text-stone-900">
                      {item.title}
                    </h3>

                    {item.color && (
                      <p className="mt-1 text-xs text-stone-500">
                        Color: {item.color}
                      </p>
                    )}

                    {item.size && (
                      <p className="text-xs text-stone-500">
                        Size: {item.size}
                      </p>
                    )}

                    <p className="mt-1 text-sm text-stone-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>

                  <p className="whitespace-nowrap text-sm font-semibold text-stone-900">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3 border-t border-stone-200 pt-5">
              <div className="flex justify-between text-sm text-stone-600">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              <div className="flex justify-between text-sm text-stone-600">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? "Free" : formatPrice(shipping)}
                </span>
              </div>

              {subtotal < FREE_SHIPPING_LIMIT && (
                <p className="text-xs text-stone-500">
                  {formatPrice(FREE_SHIPPING_LIMIT - subtotal)} more ki
                  shopping par free shipping.
                </p>
              )}

              <div className="flex justify-between border-t border-stone-200 pt-4 text-lg font-bold text-stone-900">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <p className="mt-5 text-xs leading-5 text-stone-500">
              Shipping charges aur final amount order place karne se pehle
              check kar lein.
            </p>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default Checkout;
