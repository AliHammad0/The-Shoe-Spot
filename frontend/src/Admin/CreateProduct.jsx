
import { useState } from "react";
import {
  FiSave,
  FiX,
  FiPlus,
  FiTrash2,
  FiCheckCircle,
  FiPackage,
  FiImage,
  FiTag,
  FiLayers,
  FiAlertCircle,
} from "react-icons/fi";

const API_URL = "http://localhost:8080/api/v1/products/create";

const categories = [
  "Sneakers",
  "Formal Shoes",
  "Loafers",
  "Boots",
  "Casual Shoes",
  "Sliders",
  "Sports Shoes",
  "Sandals",
];

const initialForm = {
  title: "",
  price: "",
  discount: 0,
  newArrival: false,
  category: "Sneakers",
  description: "",
  images: [""],
  brand: "The Shoe Spot",
  stock: 0,
  sizes: [],
  colors: [],
  isActive: true,
};

function CreateProduct({ onProductCreated, onCancel }) {
  const [form, setForm] = useState(initialForm);
  const [sizeInput, setSizeInput] = useState("");
  const [colorInput, setColorInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const updateField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const updateImage = (index, value) => {
    setForm((previous) => ({
      ...previous,
      images: previous.images.map((image, imageIndex) =>
        imageIndex === index ? value : image
      ),
    }));
  };

  const addImageField = () => {
    setForm((previous) => ({
      ...previous,
      images: [...previous.images, ""],
    }));
  };

  const removeImageField = (index) => {
    setForm((previous) => ({
      ...previous,
      images:
        previous.images.length === 1
          ? [""]
          : previous.images.filter((_, i) => i !== index),
    }));
  };

  const addSize = () => {
    const size = Number(sizeInput);

    if (!sizeInput.trim() || !Number.isFinite(size) || size <= 0) {
      setError("Valid shoe size enter karo.");
      return;
    }

    if (form.sizes.includes(size)) {
      setError("Yeh size pehle se add hai.");
      return;
    }

    updateField("sizes", [...form.sizes, size].sort((a, b) => a - b));
    setSizeInput("");
    setError("");
  };

  const addColor = () => {
    const color = colorInput.trim();

    if (!color) {
      setError("Color ka naam enter karo.");
      return;
    }

    if (
      form.colors.some(
        (existingColor) =>
          existingColor.toLowerCase() === color.toLowerCase()
      )
    ) {
      setError("Yeh color pehle se add hai.");
      return;
    }

    updateField("colors", [...form.colors, color]);
    setColorInput("");
    setError("");
  };

  const removeSize = (sizeToRemove) => {
    updateField(
      "sizes",
      form.sizes.filter((size) => size !== sizeToRemove)
    );
  };

  const removeColor = (colorToRemove) => {
    updateField(
      "colors",
      form.colors.filter((color) => color !== colorToRemove)
    );
  };

  const resetForm = () => {
    setForm({
      ...initialForm,
      images: [""],
      sizes: [],
      colors: [],
    });
    setSizeInput("");
    setColorInput("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    const cleanedTitle = form.title.trim();
    const price = Number(form.price);
    const discount = Number(form.discount);
    const stock = Number(form.stock);

    if (!cleanedTitle) {
      setError("Product title required hai.");
      return;
    }

    if (!Number.isFinite(price) || price <= 0) {
      setError("Valid product price enter karo.");
      return;
    }

    if (!Number.isFinite(discount) || discount < 0 || discount > 100) {
      setError("Discount 0 se 100 ke darmiyan hona chahiye.");
      return;
    }

    if (!Number.isInteger(stock) || stock < 0) {
      setError("Stock zero ya positive whole number hona chahiye.");
      return;
    }

    const invalidImage = form.images.some(
      (image) => image.trim() && !/^https?:\/\/\S+$/i.test(image.trim())
    );

    if (invalidImage) {
      setError("Images ke liye valid HTTP/HTTPS URLs enter karo.");
      return;
    }

    const productData = {
      title: cleanedTitle,
      price,
      discount,
      newArrival: form.newArrival,
      category: form.category,
      description: form.description.trim(),
      images: form.images
        .map((image) => image.trim())
        .filter(Boolean),
      brand: form.brand.trim() || "The Shoe Spot",
      stock,
      sizes: form.sizes,
      colors: form.colors,
      isActive: form.isActive,
    };

    try {
      setLoading(true);

      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      const data = await response.json();

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || "Product create nahi ho saka.");
      }

      setMessage("Product database mein successfully save ho gaya.");

      if (onProductCreated) {
        onProductCreated(data.product);
      }

      resetForm();
    } catch (err) {
      setError(
        err.message ||
          "Backend se connection nahi ho saka. Backend server check karo."
      );
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#191919] outline-none transition-all duration-300 placeholder:text-gray-400 hover:border-[#c5ae86] focus:border-[#9b825d] focus:ring-4 focus:ring-[#c5ae86]/15";

  const labelClass = "block text-sm font-semibold text-[#292929]";

  const sectionClass =
    "rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_5px_25px_rgba(0,0,0,0.035)] transition-all duration-300 hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] sm:p-6";

  const secondaryButtonClass =
    "inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-[#191919] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#c5ae86] hover:bg-[#faf8f4] hover:shadow-md active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50";

  return (
    <section className="min-h-screen bg-[#f7f7f5] px-4 py-6 text-[#191919] sm:px-6 lg:px-8">
      {/* Page Heading */}
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-[#9b825d]">
            Product Management
          </p>

          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Create Product
          </h2>

          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Naya shoe product apne store ke inventory mein add karein.
          </p>
        </div>

        {onCancel && (
          <button
            type="button"
            className={secondaryButtonClass}
            onClick={onCancel}
          >
            <FiX size={17} />
            Cancel
          </button>
        )}
      </div>

      {/* Success Message */}
      {message && (
        <div
          role="status"
          className="mb-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800"
        >
          <FiCheckCircle className="mt-0.5 shrink-0" size={19} />
          <div>
            <p className="font-semibold">Product Created</p>
            <p className="mt-1">{message}</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div
          role="alert"
          className="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <FiAlertCircle className="mt-0.5 shrink-0" size={19} />
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className={sectionClass}>
          <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f3eee5] text-[#8c7650]">
              <FiPackage size={21} />
            </div>

            <div>
              <h3 className="text-lg font-bold">Basic Information</h3>
              <p className="mt-1 text-xs text-gray-500">
                Product ka naam, category aur pricing.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <label className={labelClass}>
              Product Title <span className="text-red-500">*</span>
              <input
                type="text"
                className={inputClass}
                value={form.title}
                onChange={(event) => updateField("title", event.target.value)}
                placeholder="Premium White Sneakers"
                maxLength={150}
                required
              />
            </label>

            <label className={labelClass}>
              Category <span className="text-red-500">*</span>
              <select
                className={inputClass}
                value={form.category}
                onChange={(event) =>
                  updateField("category", event.target.value)
                }
                required
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label className={labelClass}>
              Price (PKR) <span className="text-red-500">*</span>
              <input
                type="number"
                className={inputClass}
                min="1"
                step="1"
                value={form.price}
                onChange={(event) => updateField("price", event.target.value)}
                placeholder="6500"
                required
              />
            </label>

            <label className={labelClass}>
              Discount (%)
              <input
                type="number"
                className={inputClass}
                min="0"
                max="100"
                step="1"
                value={form.discount}
                onChange={(event) =>
                  updateField("discount", event.target.value)
                }
              />
              <span className="mt-1.5 block text-xs font-normal text-gray-400">
                Discount 0 se 100 percent tak.
              </span>
            </label>

            <label className={labelClass}>
              Stock Quantity
              <input
                type="number"
                className={inputClass}
                min="0"
                step="1"
                value={form.stock}
                onChange={(event) => updateField("stock", event.target.value)}
                required
              />
            </label>

            <label className={labelClass}>
              Brand
              <input
                type="text"
                className={inputClass}
                value={form.brand}
                onChange={(event) => updateField("brand", event.target.value)}
                placeholder="The Shoe Spot"
              />
            </label>

            <label className={`${labelClass} md:col-span-2`}>
              Product Description
              <textarea
                className={`${inputClass} min-h-[130px] resize-y`}
                value={form.description}
                onChange={(event) =>
                  updateField("description", event.target.value)
                }
                placeholder="Product ki details, material, features aur comfort ke bare mein likhein..."
                rows={4}
              />
            </label>
          </div>
        </div>

        {/* Product Images */}
        <div className={sectionClass}>
          <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f3eee5] text-[#8c7650]">
              <FiImage size={21} />
            </div>

            <div>
              <h3 className="text-lg font-bold">Product Images</h3>
              <p className="mt-1 text-xs text-gray-500">
                Product images ke direct HTTP/HTTPS URLs add karein.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {form.images.map((image, index) => (
              <div
                key={index}
                className="flex items-center gap-3 rounded-xl border border-gray-100 bg-[#faf9f6] p-3 transition-colors hover:border-[#d9cbb4]"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-gray-400">
                  <FiImage size={18} />
                </div>

                <input
                  type="url"
                  className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-[#9b825d] focus:ring-4 focus:ring-[#c5ae86]/15"
                  value={image}
                  onChange={(event) =>
                    updateImage(index, event.target.value)
                  }
                  placeholder="https://example.com/shoe.jpg"
                  aria-label={`Product image URL ${index + 1}`}
                />

                <button
                  type="button"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-red-100 bg-white text-red-500 transition-all duration-300 hover:-translate-y-0.5 hover:border-red-500 hover:bg-red-500 hover:text-white hover:shadow-md"
                  onClick={() => removeImageField(index)}
                  aria-label={`Remove image ${index + 1}`}
                  title="Remove image"
                >
                  <FiTrash2 size={17} />
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            className={`${secondaryButtonClass} mt-4`}
            onClick={addImageField}
          >
            <FiPlus size={17} />
            Add Image URL
          </button>
        </div>

        {/* Sizes and Colors */}
        <div className={sectionClass}>
          <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f3eee5] text-[#8c7650]">
              <FiLayers size={21} />
            </div>

            <div>
              <h3 className="text-lg font-bold">Sizes and Colors</h3>
              <p className="mt-1 text-xs text-gray-500">
                Available shoe sizes aur colors manage karein.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
            {/* Sizes */}
            <div>
              <label
                htmlFor="product-size"
                className={labelClass}
              >
                Available Sizes
              </label>

              <div className="mt-2 flex gap-2">
                <input
                  id="product-size"
                  type="number"
                  min="1"
                  className="min-w-0 flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#9b825d] focus:ring-4 focus:ring-[#c5ae86]/15"
                  value={sizeInput}
                  onChange={(event) => setSizeInput(event.target.value)}
                  placeholder="Example: 42"
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addSize();
                    }
                  }}
                />

                <button
                  type="button"
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#191919] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#383838] hover:shadow-lg"
                  onClick={addSize}
                  aria-label="Add size"
                >
                  <FiPlus size={19} />
                </button>
              </div>

              <div className="mt-4 flex min-h-10 flex-wrap gap-2">
                {form.sizes.length > 0 ? (
                  form.sizes.map((size) => (
                    <span
                      key={size}
                      className="inline-flex items-center gap-2 rounded-lg border border-[#e7dfd1] bg-[#f7f3ec] px-3 py-2 text-sm font-semibold text-[#6e5a3c] transition-all duration-200 hover:border-[#b69a68]"
                    >
                      {size}
                      <button
                        type="button"
                        onClick={() => removeSize(size)}
                        className="text-[#8c7650] transition hover:text-red-600"
                        aria-label={`Remove size ${size}`}
                      >
                        <FiX size={15} />
                      </button>
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">
                    Abhi koi size add nahi kiya.
                  </p>
                )}
              </div>
            </div>

            {/* Colors */}
            <div>
              <label
                htmlFor="product-color"
                className={labelClass}
              >
                Available Colors
              </label>

              <div className="mt-2 flex gap-2">
                <input
                  id="product-color"
                  type="text"
                  className="min-w-0 flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#9b825d] focus:ring-4 focus:ring-[#c5ae86]/15"
                  value={colorInput}
                  onChange={(event) => setColorInput(event.target.value)}
                  placeholder="Example: Black"
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addColor();
                    }
                  }}
                />

                <button
                  type="button"
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#191919] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#383838] hover:shadow-lg"
                  onClick={addColor}
                  aria-label="Add color"
                >
                  <FiPlus size={19} />
                </button>
              </div>

              <div className="mt-4 flex min-h-10 flex-wrap gap-2">
                {form.colors.length > 0 ? (
                  form.colors.map((color) => (
                    <span
                      key={color}
                      className="inline-flex items-center gap-2 rounded-lg border border-[#e7dfd1] bg-[#f7f3ec] px-3 py-2 text-sm font-semibold text-[#6e5a3c] transition-all duration-200 hover:border-[#b69a68]"
                    >
                      {color}
                      <button
                        type="button"
                        onClick={() => removeColor(color)}
                        className="text-[#8c7650] transition hover:text-red-600"
                        aria-label={`Remove color ${color}`}
                      >
                        <FiX size={15} />
                      </button>
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-gray-400">
                    Abhi koi color add nahi kiya.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Product Status */}
        <div className={sectionClass}>
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f3eee5] text-[#8c7650]">
              <FiTag size={21} />
            </div>

            <div>
              <h3 className="text-lg font-bold">Product Status</h3>
              <p className="mt-1 text-xs text-gray-500">
                Product visibility aur arrival settings.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex cursor-pointer items-center gap-4 rounded-xl border border-gray-100 p-4 transition-all duration-300 hover:border-[#c5ae86] hover:bg-[#faf9f6]">
              <input
                type="checkbox"
                checked={form.newArrival}
                onChange={(event) =>
                  updateField("newArrival", event.target.checked)
                }
                className="h-5 w-5 shrink-0 accent-[#8c7650]"
              />

              <span>
                <span className="block text-sm font-semibold">
                  New Arrival
                </span>
                <span className="mt-1 block text-xs text-gray-500">
                  Product ko new arrival mark karein.
                </span>
              </span>
            </label>

            <label className="flex cursor-pointer items-center gap-4 rounded-xl border border-gray-100 p-4 transition-all duration-300 hover:border-[#c5ae86] hover:bg-[#faf9f6]">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(event) =>
                  updateField("isActive", event.target.checked)
                }
                className="h-5 w-5 shrink-0 accent-[#8c7650]"
              />

              <span>
                <span className="block text-sm font-semibold">
                  Active Product
                </span>
                <span className="mt-1 block text-xs text-gray-500">
                  Product ko active ya inactive rakhein.
                </span>
              </span>
            </label>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-6 sm:flex-row sm:items-center sm:justify-end">
          {onCancel && (
            <button
              type="button"
              className={secondaryButtonClass}
              onClick={onCancel}
              disabled={loading}
            >
              <FiX size={17} />
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#191919] px-7 py-3.5 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:bg-[#353535] hover:shadow-xl active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Saving Product...
              </>
            ) : (
              <>
                <FiSave size={17} />
                Save Product
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}

export default CreateProduct;
