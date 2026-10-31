import React, { useEffect, useState } from "react";

const API_URL =
  "https://the-shoe-spot-backend.vercel.app/api/v1";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [success, setSuccess] = useState("");

  const statuses = [
    "Pending",
    "Confirmed",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  const formatPrice = (price) =>
    `Rs. ${Number(price || 0).toLocaleString("en-PK")}`;

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleString("en-PK", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "N/A";

  const getToken = () => localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await fetch(`${API_URL}/orders`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Orders load nahi ho sake.");
      }

      setOrders(data.orders || []);
    } catch (err) {
      setError(err.message || "Orders load karte waqt error aaya.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      setUpdatingId(orderId);
      setError("");
      setSuccess("");

      const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Status update nahi hua.");
      }

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order._id === orderId
            ? { ...order, orderStatus: data.order?.orderStatus || status }
            : order
        )
      );

      setSuccess("Order status successfully update ho gaya.");
    } catch (err) {
      setError(err.message || "Status update karte waqt error aaya.");
    } finally {
      setUpdatingId("");
    }
  };

  const deleteOrder = async (order) => {
    const confirmed = window.confirm(
      `Kya aap order "${order._id}" delete karna chahte hain?\n\nIs order ke linked reviews bhi delete ho jayenge. Yeh action undo nahi ho sakta.`
    );

    if (!confirmed) return;

    try {
      setDeletingId(order._id);
      setError("");
      setSuccess("");

      const response = await fetch(`${API_URL}/orders/${order._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Order delete nahi ho saka.");
      }

      setOrders((previousOrders) =>
        previousOrders.filter((item) => item._id !== order._id)
      );

      setSuccess("Order aur uske linked reviews successfully delete ho gaye.");
    } catch (err) {
      setError(err.message || "Order delete karte waqt error aaya.");
    } finally {
      setDeletingId("");
    }
  };

  const statusColors = {
    Pending: "bg-amber-100 text-amber-800",
    Confirmed: "bg-blue-100 text-blue-800",
    Processing: "bg-purple-100 text-purple-800",
    Shipped: "bg-indigo-100 text-indigo-800",
    Delivered: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800",
  };

  const totalRevenue = orders
    .filter((order) => order.orderStatus !== "Cancelled")
    .reduce((total, order) => total + Number(order.total || 0), 0);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-sm text-gray-500">Orders load ho rahe hain...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f7f5] p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.25em] text-[#6f5c3d]">
              Store Administration
            </p>
            <h1 className="text-3xl font-semibold text-[#191919]">
              Orders Management
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Customers ke orders aur delivery status manage karo.
            </p>
          </div>

          <button
            type="button"
            onClick={fetchOrders}
            className="border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-[#191919] transition hover:bg-gray-100"
          >
            Refresh Orders
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-md border border-green-200 bg-green-50 p-4 text-sm text-green-800">
            {success}
          </div>
        )}

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">Total Orders</p>
            <p className="mt-3 text-3xl font-semibold text-[#191919]">
              {orders.length}
            </p>
          </div>

          <div className="border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">Pending Orders</p>
            <p className="mt-3 text-3xl font-semibold text-[#191919]">
              {
                orders.filter((order) => order.orderStatus === "Pending")
                  .length
              }
            </p>
          </div>

          <div className="border border-gray-200 bg-white p-5">
            <p className="text-sm text-gray-500">Order Value</p>
            <p className="mt-3 break-words text-2xl font-semibold text-[#191919]">
              {formatPrice(totalRevenue)}
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Cancelled orders excluded
            </p>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="border border-gray-200 bg-white px-6 py-16 text-center">
            <h2 className="text-xl font-medium text-[#191919]">
              No orders found
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Customer orders yahan nazar aayenge.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <section
                key={order._id}
                className="overflow-hidden border border-gray-200 bg-white"
              >
                <div className="flex flex-col gap-4 border-b border-gray-200 bg-[#f0eee8] p-5 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-500">
                      Order ID
                    </p>
                    <p className="mt-1 break-all text-sm font-semibold text-[#191919]">
                      {order._id}
                    </p>
                    <p className="mt-2 text-xs text-gray-500">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <span
                      className={`w-fit rounded-full px-3 py-1.5 text-xs font-medium ${
                        statusColors[order.orderStatus] ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {order.orderStatus || "Pending"}
                    </span>

                    <select
                      value={order.orderStatus || "Pending"}
                      disabled={
                        updatingId === order._id ||
                        deletingId === order._id
                      }
                      onChange={(event) =>
                        updateStatus(order._id, event.target.value)
                      }
                      className="min-w-40 border border-gray-300 bg-white px-3 py-2.5 text-sm text-[#191919] outline-none focus:border-[#6f5c3d] disabled:opacity-50"
                      aria-label="Update order status"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>

                    {updatingId === order._id && (
                      <span className="text-xs text-gray-500">
                        Updating...
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => deleteOrder(order)}
                      disabled={
                        deletingId === order._id ||
                        updatingId === order._id
                      }
                      className="border border-red-200 bg-white px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingId === order._id
                        ? "Deleting..."
                        : "Delete Order"}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 p-5 lg:grid-cols-3">
                  <div>
                    <h2 className="mb-3 text-sm font-semibold text-[#191919]">
                      Customer Details
                    </h2>
                    <p className="text-sm text-gray-700">
                      {order.customerName || "N/A"}
                    </p>
                    <p className="mt-1 break-all text-sm text-gray-500">
                      {order.email || "N/A"}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      {order.phone || "N/A"}
                    </p>
                    <p className="mt-2 text-sm text-gray-600">
                      {order.address || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {order.city || "N/A"}
                    </p>
                  </div>

                  <div>
                    <h2 className="mb-3 text-sm font-semibold text-[#191919]">
                      Products ({order.items?.length || 0})
                    </h2>

                    <div className="space-y-4">
                      {(order.items || []).map((item, index) => {
                        const product =
                          item.product && typeof item.product === "object"
                            ? item.product
                            : null;

                        const image =
                          item.image ||
                          product?.images?.[0] ||
                          product?.image ||
                          "";

                        return (
                          <div
                            key={`${
                              item.product?._id || item.product || "item"
                            }-${index}`}
                            className="flex gap-3"
                          >
                            <div className="h-16 w-16 shrink-0 bg-[#f5f3ee]">
                              {image && (
                                <img
                                  src={image}
                                  alt={item.title || "Product"}
                                  className="h-full w-full object-cover"
                                />
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="text-sm font-medium text-[#191919]">
                                {item.title || product?.title || "Product"}
                              </p>
                              <p className="mt-1 text-xs text-gray-500">
                                Qty: {item.quantity}
                                {item.size ? ` | Size: ${item.size}` : ""}
                              </p>
                              {item.color && (
                                <p className="mt-1 text-xs text-gray-500">
                                  Color: {item.color}
                                </p>
                              )}
                              <p className="mt-1 text-sm text-[#191919]">
                                {formatPrice(item.price)}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h2 className="mb-3 text-sm font-semibold text-[#191919]">
                      Payment Summary
                    </h2>

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between gap-3">
                        <span className="text-gray-500">Subtotal</span>
                        <span className="text-[#191919]">
                          {formatPrice(order.subtotal)}
                        </span>
                      </div>

                      <div className="flex justify-between gap-3">
                        <span className="text-gray-500">Shipping</span>
                        <span className="text-[#191919]">
                          {formatPrice(order.shipping)}
                        </span>
                      </div>

                      <div className="flex justify-between gap-3 border-t border-gray-200 pt-3 font-semibold">
                        <span className="text-[#191919]">Total</span>
                        <span className="text-[#191919]">
                          {formatPrice(order.total)}
                        </span>
                      </div>

                      <div className="border-t border-gray-200 pt-3">
                        <p className="text-xs text-gray-500">
                          Payment Method
                        </p>
                        <p className="mt-1 font-medium text-[#191919]">
                          {order.paymentMethod || "COD"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  );
};

export default AdminOrders;