
import { useCallback, useEffect, useState } from "react";
import {
  FiPackage,
  FiTrash2,
  FiRefreshCw,
  FiBox,
  FiAlertCircle,
  FiEdit2,
  FiX,
  FiSave,
} from "react-icons/fi";

const API_URL =
  "https://the-shoe-spot-backend.vercel.app/api/v1";

const CATEGORIES = [
  "Sneakers",
  "Formal Shoes",
  "Loafers",
  "Boots",
  "Casual Shoes",
  "Sliders",
  "Sports Shoes",
  "Sandals",
];

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const [editingProduct, setEditingProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    brand: "",
    category: "Sneakers",
    price: "",
    discount: "",
    stock: "",
    description: "",
    images: "",
    sizes: "",
    colors: "",
    isActive: true,
    newArrival: false,
  });

  const [saving, setSaving] = useState(false);
  const [editError, setEditError] = useState("");
  const [editMessage, setEditMessage] = useState("");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/products`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Products load nahi ho sake.");
      }

      setProducts(
        Array.isArray(data) ? data : data.products || []
      );
    } catch (err) {
      setError(err.message || "Backend se connection nahi ho saka.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleEdit = (product) => {
    setEditingProduct(product);
    setEditError("");
    setEditMessage("");

    setEditForm({
      title: product.title || "",
      brand: product.brand || "",
      category: product.category || "Sneakers",
      price: product.price ?? "",
      discount: product.discount ?? "",
      stock: product.stock ?? "",
      description: product.description || "",
      images: Array.isArray(product.images)
        ? product.images.join("\n")
        : "",
      sizes: Array.isArray(product.sizes)
        ? product.sizes.join(", ")
        : "",
      colors: Array.isArray(product.colors)
        ? product.colors.join(", ")
        : "",
      isActive: product.isActive !== false,
      newArrival: Boolean(product.newArrival),
    });
  };

  const handleFormChange = (event) => {
    const { name, value, type, checked } = event.target;

    setEditForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleUpdate = async (event) => {
    event.preventDefault();

    if (!editingProduct?._id) return;

    setSaving(true);
    setEditError("");
    setEditMessage("");

    const payload = {
      title: editForm.title.trim(),
      brand: editForm.brand.trim(),
      category: editForm.category,
      price: Number(editForm.price),
      discount: Number(editForm.discount || 0),
      stock: Number(editForm.stock),
      description: editForm.description.trim(),
      images: editForm.images
        .split("\n")
        .map((image) => image.trim())
        .filter(Boolean),
      sizes: editForm.sizes
        .split(",")
        .map((size) => Number(size.trim()))
        .filter((size) => Number.isFinite(size) && size > 0),
      colors: editForm.colors
        .split(",")
        .map((color) => color.trim())
        .filter(Boolean),
      isActive: editForm.isActive,
      newArrival: editForm.newArrival,
    };

    if (
      !payload.title ||
      !payload.brand ||
      !payload.description ||
      !Number.isFinite(payload.price) ||
      payload.price < 0 ||
      !Number.isFinite(payload.stock) ||
      payload.stock < 0
    ) {
      setEditError("Product ki details aur price/stock check karein.");
      setSaving(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/products/${editingProduct._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || "Product update nahi hua.");
      }

      const updatedProduct = data.product || {
        ...editingProduct,
        ...payload,
      };

      setProducts((currentProducts) =>
        currentProducts.map((product) =>
          product._id === editingProduct._id
            ? { ...product, ...updatedProduct }
            : product
        )
      );

      setEditMessage("Product successfully update ho gaya.");

      setTimeout(() => {
        setEditingProduct(null);
        setEditMessage("");
      }, 900);
    } catch (err) {
      setEditError(
        err.message || "Product update karte waqt error aaya."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Kya aap waqai is product ko delete karna chahte hain?"
    );

    if (!confirmed) return;

    setDeletingId(id);
    setError("");

    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || "Product delete nahi hua.");
      }

      setProducts((currentProducts) =>
        currentProducts.filter((product) => product._id !== id)
      );
    } catch (err) {
      setError(err.message || "Product delete karte waqt error aaya.");
    } finally {
      setDeletingId(null);
    }
  };

  const activeProducts = products.filter(
    (product) => product.isActive !== false
  ).length;

  const inputClass =
    "mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#191919] outline-none transition focus:border-[#b69a68] focus:ring-2 focus:ring-[#b69a68]/15";

  const labelClass =
    "block text-sm font-semibold text-gray-700";

  if (loading) {
    return (
      <div className="flex min-h-[350px] items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#e8e0d2] border-t-black" />
          <p className="text-sm font-medium text-gray-500">
            Loading products...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white px-4 py-6 text-[#191919] sm:px-6 lg:px-8">
      {/* Heading */}
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#9b825d]">
            Inventory Management
          </p>

          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            All Products
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Apne store ke tamam products manage karein.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchProducts}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-semibold transition-all duration-300 hover:-translate-y-1 hover:border-[#b69a68] hover:bg-[#faf8f4] hover:shadow-lg"
        >
          <FiRefreshCw size={17} />
          Refresh
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <FiAlertCircle className="mt-0.5 shrink-0" size={18} />
          <p>{error}</p>
        </div>
      )}

      {/* Summary */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Products</p>
              <h3 className="mt-2 text-3xl font-bold">
                {products.length}
              </h3>
            </div>
            <div className="rounded-2xl bg-[#f3eee5] p-4 text-[#6f5c3d] transition-transform group-hover:scale-110">
              <FiPackage size={24} />
            </div>
          </div>
        </div>

        <div className="group rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Products</p>
              <h3 className="mt-2 text-3xl font-bold">
                {activeProducts}
              </h3>
            </div>
            <div className="rounded-2xl bg-green-50 p-4 text-green-700 transition-transform group-hover:scale-110">
              <FiBox size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-gray-100 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <h3 className="text-lg font-bold">Products List</h3>
            <p className="mt-1 text-sm text-gray-500">
              View and manage your inventory.
            </p>
          </div>

          <span className="w-fit rounded-full bg-[#f3eee5] px-4 py-2 text-xs font-bold text-[#806944]">
            {products.length} Products
          </span>
        </div>

        {products.length === 0 ? (
          <div className="flex min-h-[260px] flex-col items-center justify-center px-5 py-12 text-center">
            <div className="mb-4 rounded-2xl bg-[#f7f4ee] p-5 text-[#9b825d]">
              <FiPackage size={34} />
            </div>
            <h4 className="text-lg font-semibold">No Products Found</h4>
            <p className="mt-2 text-sm text-gray-500">
              Abhi koi product available nahi hai.
            </p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[950px] border-collapse text-left">
              <thead>
                <tr className="bg-[#faf9f6]">
                  {[
                    "Product",
                    "Category",
                    "Price",
                    "Stock",
                    "Status",
                    "Actions",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="whitespace-nowrap px-5 py-4 text-xs font-bold uppercase tracking-wider text-gray-500 sm:px-6"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {products.map((product) => (
                  <tr
                    key={product._id}
                    className="transition-colors hover:bg-[#fcfbf8]"
                  >
                    <td className="px-5 py-4 sm:px-6">
                      <div className="flex items-center gap-4">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.title || "Product"}
                            loading="lazy"
                            className="h-16 w-16 shrink-0 rounded-xl border border-gray-100 bg-[#faf9f6] object-cover"
                          />
                        ) : (
                          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#f3eee5] text-[#9b825d]">
                            <FiPackage size={25} />
                          </div>
                        )}

                        <div className="max-w-[220px]">
                          <p className="font-semibold">
                            {product.title || "Untitled Product"}
                          </p>
                          <p className="mt-1 text-xs text-gray-400">
                            ID: {product._id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 sm:px-6">
                      <span className="inline-block rounded-lg border border-gray-100 px-3 py-2 text-sm text-gray-600">
                        {product.category || "Uncategorized"}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 font-semibold sm:px-6">
                      Rs. {Number(product.price || 0).toLocaleString("en-PK")}
                    </td>

                    <td className="px-5 py-4 sm:px-6">
                      <span
                        className={`inline-flex min-w-10 justify-center rounded-lg px-3 py-2 text-sm font-semibold ${
                          Number(product.stock || 0) <= 0
                            ? "bg-red-50 text-red-600"
                            : Number(product.stock) <= 5
                              ? "bg-amber-50 text-amber-700"
                              : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {product.stock ?? 0}
                      </span>
                    </td>

                    <td className="px-5 py-4 sm:px-6">
                      <span
                        className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold ${
                          product.isActive === false
                            ? "bg-red-50 text-red-700"
                            : "bg-green-50 text-green-700"
                        }`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full ${
                            product.isActive === false
                              ? "bg-red-500"
                              : "bg-green-500"
                          }`}
                        />
                        {product.isActive === false ? "Inactive" : "Active"}
                      </span>
                    </td>

                    <td className="px-5 py-4 sm:px-6">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(product)}
                          className="inline-flex items-center gap-2 rounded-xl border border-[#b69a68]/40 bg-[#faf8f4] px-4 py-2.5 text-sm font-semibold text-[#806944] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#b69a68] hover:text-white hover:shadow-md"
                        >
                          <FiEdit2 size={16} />
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(product._id)}
                          disabled={deletingId === product._id}
                          className="inline-flex items-center gap-2 rounded-xl border border-red-100 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition-all duration-300 hover:-translate-y-0.5 hover:border-red-600 hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deletingId === product._id ? (
                            "Deleting..."
                          ) : (
                            <>
                              <FiTrash2 size={16} />
                              Delete
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {products.length > 0 && (
          <div className="border-t border-gray-100 bg-[#faf9f6] px-5 py-4 sm:px-6">
            <p className="text-xs text-gray-500">
              Showing{" "}
              <span className="font-semibold text-[#191919]">
                {products.length}
              </span>{" "}
              products in your inventory.
            </p>
          </div>
        )}
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !saving) {
              setEditingProduct(null);
            }
          }}
        >
          <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-7">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9b825d]">
                  Inventory Management
                </p>
                <h3 className="mt-1 text-xl font-bold">Edit Product</h3>
              </div>

              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                disabled={saving}
                aria-label="Close edit form"
                className="rounded-xl border border-gray-200 p-2.5 text-gray-500 transition hover:bg-gray-100 hover:text-black disabled:opacity-50"
              >
                <FiX size={20} />
              </button>
            </div>

            <form
              onSubmit={handleUpdate}
              className="overflow-y-auto px-5 py-6 sm:px-7"
            >
              {editError && (
                <div className="mb-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  <FiAlertCircle className="mt-0.5 shrink-0" size={17} />
                  {editError}
                </div>
              )}

              {editMessage && (
                <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-3 text-sm font-medium text-green-700">
                  {editMessage}
                </div>
              )}

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <label className={labelClass}>
                  Product Name *
                  <input
                    name="title"
                    value={editForm.title}
                    onChange={handleFormChange}
                    required
                    className={inputClass}
                    placeholder="Product name"
                  />
                </label>

                <label className={labelClass}>
                  Brand *
                  <input
                    name="brand"
                    value={editForm.brand}
                    onChange={handleFormChange}
                    required
                    className={inputClass}
                    placeholder="Brand name"
                  />
                </label>

                <label className={labelClass}>
                  Category *
                  <select
                    name="category"
                    value={editForm.category}
                    onChange={handleFormChange}
                    required
                    className={inputClass}
                  >
                    {!CATEGORIES.includes(editForm.category) && (
                      <option value={editForm.category}>
                        {editForm.category}
                      </option>
                    )}
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </label>

                <label className={labelClass}>
                  Price (PKR) *
                  <input
                    type="number"
                    name="price"
                    value={editForm.price}
                    onChange={handleFormChange}
                    min="0"
                    required
                    className={inputClass}
                    placeholder="Price"
                  />
                </label>

                <label className={labelClass}>
                  Discount (%)
                  <input
                    type="number"
                    name="discount"
                    value={editForm.discount}
                    onChange={handleFormChange}
                    min="0"
                    max="100"
                    className={inputClass}
                    placeholder="0"
                  />
                </label>

                <label className={labelClass}>
                  Stock Quantity *
                  <input
                    type="number"
                    name="stock"
                    value={editForm.stock}
                    onChange={handleFormChange}
                    min="0"
                    required
                    className={inputClass}
                    placeholder="Available stock"
                  />
                </label>

                <label className={`${labelClass} sm:col-span-2`}>
                  Description *
                  <textarea
                    name="description"
                    value={editForm.description}
                    onChange={handleFormChange}
                    required
                    rows={4}
                    className={`${inputClass} resize-y`}
                    placeholder="Product description"
                  />
                </label>

                <label className={`${labelClass} sm:col-span-2`}>
                  Image URLs
                  <textarea
                    name="images"
                    value={editForm.images}
                    onChange={handleFormChange}
                    rows={3}
                    className={`${inputClass} resize-y`}
                    placeholder={"Har image ka URL alag line par likhein"}
                  />
                  <span className="mt-1 block text-xs font-normal text-gray-400">
                    Har line par ek image URL.
                  </span>
                </label>

                <label className={labelClass}>
                  Sizes
                  <input
                    name="sizes"
                    value={editForm.sizes}
                    onChange={handleFormChange}
                    className={inputClass}
                    placeholder="40, 41, 42, 43"
                  />
                </label>

                <label className={labelClass}>
                  Colors
                  <input
                    name="colors"
                    value={editForm.colors}
                    onChange={handleFormChange}
                    className={inputClass}
                    placeholder="Black, White, Beige"
                  />
                </label>
              </div>

              <div className="mt-6 flex flex-col gap-4 rounded-xl bg-[#faf9f6] p-4 sm:flex-row sm:gap-8">
                <label className="flex cursor-pointer items-center gap-3 text-sm font-medium">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={editForm.isActive}
                    onChange={handleFormChange}
                    className="h-4 w-4 accent-[#6f5c3d]"
                  />
                  Product Active
                </label>

                <label className="flex cursor-pointer items-center gap-3 text-sm font-medium">
                  <input
                    type="checkbox"
                    name="newArrival"
                    checked={editForm.newArrival}
                    onChange={handleFormChange}
                    className="h-4 w-4 accent-[#6f5c3d]"
                  />
                  New Arrival
                </label>
              </div>

              <div className="mt-7 flex flex-col-reverse gap-3 border-t border-gray-100 pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  disabled={saving}
                  className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#191919] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#383838] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FiSave size={17} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllProducts;
