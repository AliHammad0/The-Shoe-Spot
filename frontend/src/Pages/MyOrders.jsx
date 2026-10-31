import React, { useEffect, useState } from "react";

const API_URL =
  "https://the-shoe-spot-backend.vercel.app/api/v1";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [reviewForms, setReviewForms] = useState({});
  const [submitting, setSubmitting] = useState({});
  const [reviewMessages, setReviewMessages] = useState({});
  const [submittedReviews, setSubmittedReviews] = useState({});

  const [trackingDetails, setTrackingDetails] = useState({
    orderId: "",
    email: "",
  });

  const [tracking, setTracking] = useState(false);
  const [guestTracked, setGuestTracked] = useState(false);

  const [isLoggedIn] = useState(
    Boolean(localStorage.getItem("token"))
  );

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          return;
        }

        const response = await fetch(`${API_URL}/orders/my-orders`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok || !data.ok) {
          throw new Error(data.message || "Failed to load orders.");
        }

        setOrders(data.orders || []);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleTrackOrder = async (event) => {
    event.preventDefault();

    try {
      setTracking(true);
      setError("");
      setOrders([]);
      setGuestTracked(false);

      const response = await fetch(`${API_URL}/orders/track`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: trackingDetails.orderId.trim(),
          email: trackingDetails.email.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Order not found.");
      }

      setOrders([data.order]);
      setGuestTracked(true);
    } catch (err) {
      setError(err.message || "Unable to track order.");
    } finally {
      setTracking(false);
    }
  };

  const formatPrice = (price) =>
    `Rs. ${Number(price || 0).toLocaleString("en-PK")}`;

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("en-PK", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "N/A";

  const statusColors = {
    Pending: "bg-amber-100 text-amber-800",
    Confirmed: "bg-blue-100 text-blue-800",
    Processing: "bg-purple-100 text-purple-800",
    Shipped: "bg-indigo-100 text-indigo-800",
    Delivered: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800",
  };

  const getProductId = (item) =>
    typeof item.product === "object"
      ? item.product?._id
      : item.product;

  const getReviewKey = (orderId, productId) =>
    `${orderId}-${productId}`;

  const updateReviewForm = (key, field, value) => {
    setReviewForms((previous) => ({
      ...previous,
      [key]: {
        rating: 5,
        comment: "",
        ...previous[key],
        [field]: value,
      },
    }));
  };

  const submitReview = async (order, item) => {
    const productId = getProductId(item);
    const key = getReviewKey(order._id, productId);
    const form = reviewForms[key] || {
      rating: 5,
      comment: "",
    };

    if (!productId) {
      setReviewMessages((previous) => ({
        ...previous,
        [key]: {
          type: "error",
          text: "Product ID nahi mila. Review submit nahi ho sakta.",
        },
      }));
      return;
    }

    if (form.comment.trim().length < 3) {
      setReviewMessages((previous) => ({
        ...previous,
        [key]: {
          type: "error",
          text: "Review kam az kam 3 characters ka hona chahiye.",
        },
      }));
      return;
    }

    try {
      setSubmitting((previous) => ({
        ...previous,
        [key]: true,
      }));

      setReviewMessages((previous) => ({
        ...previous,
        [key]: null,
      }));

      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          orderId: order._id,
          rating: Number(form.rating),
          comment: form.comment.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Review submit nahi ho saka.");
      }

      setSubmittedReviews((previous) => ({
        ...previous,
        [key]: true,
      }));

      setReviewMessages((previous) => ({
        ...previous,
        [key]: {
          type: "success",
          text: "Thank you! Tumhara review submit ho gaya.",
        },
      }));
    } catch (err) {
      setReviewMessages((previous) => ({
        ...previous,
        [key]: {
          type: "error",
          text: err.message || "Review submit karte waqt error aaya.",
        },
      }));
    } finally {
      setSubmitting((previous) => ({
        ...previous,
        [key]: false,
      }));
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#faf9f6]">
        <p className="text-sm text-gray-500">
          Loading your orders...
        </p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf9f6] px-4 py-10 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 border-b border-gray-200 pb-6">
          <p className="mb-2 text-xs uppercase tracking-[0.3em] text-[#8c7650]">
            Your Account
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-[#191919] sm:text-4xl">
            My Orders
          </h1>

          <p className="mt-3 text-sm text-gray-500">
            Apne orders track karo aur delivered products ke reviews share karo.
          </p>
        </div>

        {!isLoggedIn && (
          <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
            <h2 className="text-xl font-semibold text-[#191919]">
              Track Your Order
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Apna order number aur checkout wala email enter karein.
            </p>

            <form
              onSubmit={handleTrackOrder}
              className="mt-5 space-y-4"
            >
              <input
                type="text"
                required
                placeholder="Order Number"
                value={trackingDetails.orderId}
                onChange={(event) =>
                  setTrackingDetails((previous) => ({
                    ...previous,
                    orderId: event.target.value,
                  }))
                }
                className="w-full border border-gray-200 bg-white px-4 py-3 text-sm text-[#191919] outline-none focus:border-[#8c7650]"
              />

              <input
                type="email"
                required
                placeholder="Email Address"
                value={trackingDetails.email}
                onChange={(event) =>
                  setTrackingDetails((previous) => ({
                    ...previous,
                    email: event.target.value,
                  }))
                }
                className="w-full border border-gray-200 bg-white px-4 py-3 text-sm text-[#191919] outline-none focus:border-[#8c7650]"
              />

              <button
                type="submit"
                disabled={tracking}
                className="w-full bg-[#191919] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#8c7650] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {tracking ? "Searching..." : "Track Order"}
              </button>
            </form>

            {error && (
              <p className="mt-4 text-sm text-red-600">
                {error}
              </p>
            )}

            {guestTracked && (
              <p className="mt-4 text-sm text-green-700">
                Order successfully found.
              </p>
            )}
          </div>
        )}

        {isLoggedIn && error ? (
          <div className="rounded-lg border border-red-200 bg-white p-6 text-center">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        ) : orders.length === 0 && isLoggedIn ? (
          <div className="rounded-lg border border-gray-200 bg-white px-6 py-16 text-center">
            <h2 className="text-xl font-medium text-[#191919]">
              No orders yet
            </h2>

            <p className="mt-3 text-sm text-gray-500">
              Purchase karne ke baad tumhare orders yahan show honge.
            </p>

            <a
              href="/shop"
              className="mt-6 inline-block bg-[#191919] px-7 py-3 text-sm text-white transition hover:bg-[#8c7650]"
            >
              Continue Shopping
            </a>
          </div>
        ) : orders.length > 0 ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                {orders.length} {orders.length === 1 ? "order" : "orders"}
              </p>

              {!isLoggedIn && (
                <button
                  type="button"
                  onClick={() => {
                    setOrders([]);
                    setGuestTracked(false);
                    setError("");
                    setTrackingDetails({
                      orderId: "",
                      email: "",
                    });
                  }}
                  className="text-sm font-medium text-[#8c7650] underline"
                >
                  Track another order
                </button>
              )}
            </div>

            {orders.map((order) => (
              <section
                key={order._id}
                className="overflow-hidden rounded-lg border border-gray-200 bg-white"
              >
                <div className="flex flex-col gap-4 border-b border-gray-200 bg-[#f5f3ee] p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="grid grid-cols-2 gap-x-8 gap-y-3 sm:flex sm:gap-10">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-500">
                        Order Date
                      </p>

                      <p className="mt-1 text-sm font-medium text-[#191919]">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-gray-500">
                        Order Total
                      </p>

                      <p className="mt-1 text-sm font-medium text-[#191919]">
                        {formatPrice(order.total)}
                      </p>
                    </div>

                    <div className="col-span-2 sm:col-span-1">
                      <p className="text-[10px] uppercase tracking-widest text-gray-500">
                        Order Number
                      </p>

                      <p className="mt-1 break-all text-xs text-gray-700">
                        {order._id}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`inline-block w-fit rounded-full px-3 py-1.5 text-xs font-medium ${
                      statusColors[order.orderStatus] ||
                      "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {order.orderStatus || "Pending"}
                  </span>
                </div>

                <div className="space-y-6 p-5">
                  {(order.items || []).map((item, index) => {
                    const product =
                      item.product && typeof item.product === "object"
                        ? item.product
                        : null;

                    const productId = getProductId(item);
                    const key = getReviewKey(order._id, productId);

                    const image =
                      item.image ||
                      product?.images?.[0] ||
                      product?.image ||
                      "";

                    const form = reviewForms[key] || {
                      rating: 5,
                      comment: "",
                    };

                    const message = reviewMessages[key];

                    return (
                      <div
                        key={`${productId || "item"}-${index}`}
                        className="border-b border-gray-100 pb-6 last:border-0 last:pb-0"
                      >
                        <div className="flex gap-4">
                          <div className="h-24 w-24 shrink-0 overflow-hidden bg-[#f5f3ee] sm:h-28 sm:w-28">
                            {image ? (
                              <img
                                src={image}
                                alt={item.title || "Product"}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-xs text-gray-400">
                                No image
                              </div>
                            )}
                          </div>

                          <div className="flex min-w-0 flex-1 flex-col justify-center">
                            <h3 className="text-sm font-medium text-[#191919] sm:text-base">
                              {item.title || product?.title || "Product"}
                            </h3>

                            {item.color && (
                              <p className="mt-1 text-xs text-gray-500">
                                Color: {item.color}
                              </p>
                            )}

                            {item.size && (
                              <p className="mt-1 text-xs text-gray-500">
                                Size: {item.size}
                              </p>
                            )}

                            <p className="mt-1 text-xs text-gray-500">
                              Quantity: {item.quantity}
                            </p>

                            <p className="mt-2 text-sm font-medium text-[#191919]">
                              {formatPrice(item.price)}
                            </p>
                          </div>
                        </div>

                        {order.orderStatus === "Delivered" &&
                          isLoggedIn && (
                            <div className="mt-5 rounded-lg border border-[#e7dfd1] bg-[#faf9f6] p-4 sm:p-5">
                              {submittedReviews[key] ? (
                                <div>
                                  <p className="text-sm font-semibold text-green-700">
                                    Review submitted successfully
                                  </p>

                                  <p className="mt-1 text-sm text-gray-500">
                                    Shukriya! Tumhara feedback save ho gaya hai.
                                  </p>
                                </div>
                              ) : (
                                <>
                                  <h4 className="text-base font-semibold text-[#191919]">
                                    Write a Review
                                  </h4>

                                  <p className="mt-1 text-sm text-gray-500">
                                    Is product ke bare mein apna experience share karo.
                                  </p>

                                  <div className="mt-4">
                                    <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-600">
                                      Your Rating
                                    </p>

                                    <div className="flex gap-2">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                          key={star}
                                          type="button"
                                          onClick={() =>
                                            updateReviewForm(
                                              key,
                                              "rating",
                                              star
                                            )
                                          }
                                          aria-label={`${star} star rating`}
                                          className={`text-3xl transition ${
                                            star <= Number(form.rating)
                                              ? "text-[#b69a68]"
                                              : "text-gray-300"
                                          }`}
                                        >
                                          ★
                                        </button>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="mt-4">
                                    <label
                                      htmlFor={`review-${key}`}
                                      className="mb-2 block text-xs font-medium uppercase tracking-wider text-gray-600"
                                    >
                                      Your Review
                                    </label>

                                    <textarea
                                      id={`review-${key}`}
                                      value={form.comment}
                                      onChange={(event) =>
                                        updateReviewForm(
                                          key,
                                          "comment",
                                          event.target.value
                                        )
                                      }
                                      placeholder="Product quality, comfort aur fitting ke bare mein likhein..."
                                      rows={4}
                                      maxLength={1000}
                                      className="w-full resize-y border border-gray-200 bg-white p-3 text-sm text-[#191919] outline-none transition focus:border-[#8c7650]"
                                    />

                                    <p className="mt-1 text-right text-xs text-gray-400">
                                      {form.comment.length}/1000
                                    </p>
                                  </div>

                                  {message && (
                                    <p
                                      className={`mt-3 text-sm ${
                                        message.type === "success"
                                          ? "text-green-700"
                                          : "text-red-600"
                                      }`}
                                    >
                                      {message.text}
                                    </p>
                                  )}

                                  <button
                                    type="button"
                                    disabled={Boolean(submitting[key])}
                                    onClick={() =>
                                      submitReview(order, item)
                                    }
                                    className="mt-4 bg-[#191919] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#8c7650] disabled:cursor-not-allowed disabled:opacity-50"
                                  >
                                    {submitting[key]
                                      ? "Submitting..."
                                      : "Submit Review"}
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                      </div>
                    );
                  })}
                </div>

                <div className="flex flex-col gap-2 border-t border-gray-200 px-5 py-4 text-sm sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-gray-500">
                    Payment:{" "}
                    <span className="font-medium text-[#191919]">
                      {order.paymentMethod || "COD"}
                    </span>
                  </p>

                  <p className="font-semibold text-[#191919]">
                    Total: {formatPrice(order.total)}
                  </p>
                </div>
              </section>
            ))}
          </div>
        ) : null}
      </div>
    </main>
  );
};

export default MyOrders;