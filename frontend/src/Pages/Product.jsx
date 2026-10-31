
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiChevronDown, FiSliders } from "react-icons/fi";

const API_URL =
  "https://the-shoe-spot-backend.vercel.app/api/v1/products";

const getColorValue = (color) => {
  const colors = {
    Black: "#000000",
    White: "#ffffff",
    Beige: "#d6c4a4",
    Green: "#47734b",
    Olive: "#777653",
    Navy: "#202b42",
    Brown: "#795548",
    Blue: "#2563eb",
    Grey: "#808080",
    Gray: "#808080",
    Red: "#dc2626",
  };

  return colors[color] || "#d1d5db";
};

const formatPrice = (price) =>
  `Rs.${Number(price || 0).toLocaleString("en-PK")}`;

export default function Product() {
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState("featured");
  const [selectedColors, setSelectedColors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Products load nahi ho sake.");
        }

        const data = await response.json();

        const productList = Array.isArray(data)
          ? data
          : data.products || data.data || [];

        const formattedProducts = productList.map((product, index) => {
          const id = product._id || product.id || index;
          const price = Number(product.price) || 0;

          const discount = Math.min(
            100,
            Math.max(0, Number(product.discount) || 0)
          );

          const oldPrice =
            product.oldPrice !== undefined
              ? Number(product.oldPrice)
              : discount > 0
                ? Math.round(price / (1 - discount / 100))
                : price;

          const rawImages = Array.isArray(product.images)
            ? product.images
            : [];

          const image =
            product.image ||
            rawImages.find((item) => typeof item === "string") ||
            rawImages.find((item) => item?.url)?.url ||
            "";

          const colors = Array.isArray(product.colors)
            ? product.colors.map((color) => {
                if (typeof color === "string") {
                  return {
                    name: color,
                    value: getColorValue(color),
                    image,
                    slug: `/products/${id}`,
                  };
                }

                return {
                  name: color.name || color.color || "Default",
                  value:
                    color.value ||
                    getColorValue(color.name || color.color || ""),
                  image: color.image || image,
                  slug: `/products/${id}`,
                };
              })
            : [];

          return {
            id,
            name: product.title || product.name || "Men's Shoes",
            category: product.category || "Shoes",
            price,
            oldPrice,
            discount,
            newArrival: Boolean(
              product.newArrival || product.isNewArrival
            ),
            image,
            color: product.color || colors[0]?.name || "",
            slug: `/products/${id}`,
            colors,
          };
        });

        setProducts(
          formattedProducts.filter((product) => !product.newArrival)
        );
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Products load nahi ho sake.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchProducts();

    return () => controller.abort();
  }, []);

  const displayedProducts = useMemo(() => {
    const sorted = [...products];

    switch (sortBy) {
      case "price-ascending":
        return sorted.sort((a, b) => a.price - b.price);

      case "price-descending":
        return sorted.sort((a, b) => b.price - a.price);

      case "alphabetical-ascending":
        return sorted.sort((a, b) => a.name.localeCompare(b.name));

      case "alphabetical-descending":
        return sorted.sort((a, b) => b.name.localeCompare(a.name));

      case "date-old":
        return sorted.sort((a, b) =>
          String(a.id).localeCompare(String(b.id))
        );

      case "date-new":
        return sorted.sort((a, b) =>
          String(b.id).localeCompare(String(a.id))
        );

      default:
        return sorted;
    }
  }, [products, sortBy]);

  return (
    <main
      className="min-h-screen bg-white text-black"
      style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
    >
      {/* Breadcrumb */}
      <div className="mx-auto max-w-[1440px] px-4 pt-6 sm:px-7 lg:px-10">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Link to="/" className="hover:text-black">
            Home
          </Link>
          <span>/</span>
          <span className="text-black">All Products</span>
        </div>
      </div>

      {/* Collection Heading */}
      <section className="mx-auto max-w-[1440px] px-4 pb-6 pt-9 sm:px-7 lg:px-10 lg:pt-12">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.16em] text-gray-500">
          Fresh this season
        </p>

        <h1 className="text-3xl font-normal tracking-tight sm:text-4xl">
          All Products
        </h1>
      </section>

      {/* Sorting Bar */}
      <div className="sticky top-0 z-30 border-y border-gray-200 bg-white">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3 px-4 py-3 sm:px-7 lg:px-10">
          <button
            type="button"
            className="flex items-center gap-2 text-xs text-gray-700 sm:text-sm"
          >
            <FiSliders size={16} />
            Filter
          </button>

          <label className="flex items-center gap-2 text-xs text-gray-600 sm:text-sm">
            <span className="hidden sm:inline">Sort by:</span>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="max-w-[190px] appearance-none border-0 bg-transparent py-2 pr-6 text-xs text-black outline-none sm:max-w-none sm:text-sm"
              >
                <option value="featured">Featured</option>
                <option value="relevant">Most relevant</option>
                <option value="best-selling">Best selling</option>
                <option value="alphabetical-ascending">
                  Alphabetically, A-Z
                </option>
                <option value="alphabetical-descending">
                  Alphabetically, Z-A
                </option>
                <option value="price-ascending">Price, low to high</option>
                <option value="price-descending">Price, high to low</option>
                <option value="date-old">Date, old to new</option>
                <option value="date-new">Date, new to old</option>
              </select>

              <FiChevronDown
                size={14}
                className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2"
              />
            </div>
          </label>
        </div>
      </div>

      {/* Product Grid */}
      <section className="mx-auto max-w-[1440px] px-3 py-5 sm:px-7 sm:py-8 lg:px-10">
        {loading ? (
          <p className="py-12 text-center text-sm text-gray-500">
            Loading products...
          </p>
        ) : error ? (
          <p className="py-12 text-center text-sm text-red-600">
            {error}
          </p>
        ) : products.length === 0 ? (
          <p className="py-12 text-center text-sm text-gray-500">
            No products available.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-4 lg:gap-x-6">
            {displayedProducts.map((product, index) => {
              const selectedColor =
                selectedColors[product.id] ?? product.color;

              const selectedVariant = product.colors.find(
                (color) => color.name === selectedColor
              );

              const image = selectedVariant?.image || product.image;
              const productLink = product.slug;

              const discount =
                product.oldPrice > product.price
                  ? Math.round(
                      ((product.oldPrice - product.price) /
                        product.oldPrice) *
                        100
                    )
                  : product.discount;

              return (
                <article key={product.id} className="min-w-0">
                  {/* Product Image */}
                  <Link
                    to={productLink}
                    state={{
                      product,
                      selectedColor,
                    }}
                    aria-label={`View ${product.name}`}
                    className="group relative block overflow-hidden bg-[#f7f7f7]"
                  >
                    <div className="aspect-[4/5] overflow-hidden">
                      {image ? (
                        <img
                          src={image}
                          alt={`${product.name} ${selectedColor}`}
                          width="400"
                          height="500"
                          loading="lazy"
                          decoding="async"
                          fetchPriority="low"
                          className="h-full w-full object-contain p-2 transition-transform duration-500 group-hover:scale-[1.04] sm:p-3"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                          No image available
                        </div>
                      )}
                    </div>

                    {discount > 0 && (
                      <span className="absolute left-2 top-2 bg-white px-2 py-1 text-[10px] font-medium sm:left-3 sm:top-3 sm:text-xs">
                        -{discount}%
                      </span>
                    )}

                    {product.newArrival && (
                      <span className="absolute right-2 top-2 bg-white px-2 py-1 text-[10px] font-medium sm:right-3 sm:top-3 sm:text-xs">
                        New
                      </span>
                    )}
                  </Link>

                  {/* Product Details */}
                  <div className="pt-3">
                    <p className="text-[10px] text-gray-500 sm:text-xs">
                      {product.category}
                    </p>

                    <Link
                      to={productLink}
                      state={{
                        product,
                        selectedColor,
                      }}
                      className="mt-1 block text-xs leading-5 text-black hover:underline sm:text-sm"
                    >
                      {product.name}
                    </Link>

                    <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="text-xs font-semibold text-black sm:text-sm">
                        {formatPrice(product.price)}
                      </span>

                      {product.oldPrice > product.price && (
                        <span className="text-[11px] text-gray-600 line-through sm:text-xs">
                          {formatPrice(product.oldPrice)}
                        </span>
                      )}
                    </div>

                    {/* Color Variants */}
                    {product.colors.length > 0 && (
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        {product.colors.map((color) => (
                          <button
                            key={color.name}
                            type="button"
                            onClick={() =>
                              setSelectedColors((previous) => ({
                                ...previous,
                                [product.id]: color.name,
                              }))
                            }
                            title={color.name}
                            aria-label={`Select ${color.name}`}
                            className={`h-5 w-5 rounded-full border p-[2px] ${
                              selectedColor === color.name
                                ? "border-black"
                                : "border-transparent"
                            }`}
                          >
                            <span
                              className="block h-full w-full rounded-full border border-black/10"
                              style={{
                                backgroundColor: color.value,
                              }}
                            />
                          </button>
                        ))}

                        <span className="text-[10px] text-gray-500">
                          {selectedColor}
                        </span>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
