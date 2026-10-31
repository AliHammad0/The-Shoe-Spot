
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FiSliders, FiX } from "react-icons/fi";

const API_URL =
  "https://the-shoe-spot-backend.vercel.app/api/v1/products/new?limit=36";

const formatPrice = (price) =>
  `Rs. ${Number(price || 0).toLocaleString("en-PK")}`;

const PLACEHOLDER_IMAGE =
  "https://placehold.co/600x700/f2eee7/191919?text=New+Arrival";

const getImage = (product) => {
  if (Array.isArray(product.images) && product.images.length > 0) {
    const image = product.images[0];

    if (typeof image === "string") return image;
    if (image?.url) return image.url;
  }

  if (typeof product.image === "string") return product.image;
  if (product.image?.url) return product.image.url;

  return PLACEHOLDER_IMAGE;
};

const getColors = (colors) => {
  if (!Array.isArray(colors)) return [];

  return colors
    .map((color) => {
      if (typeof color === "string") return color.toUpperCase();

      return String(color?.name || color?.value || "").toUpperCase();
    })
    .filter(Boolean);
};

const NewArrivals = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedColors, setSelectedColors] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const fetchNewArrivals = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL, {
          signal: controller.signal,
        });

        const data = await response.json();

        if (!response.ok || data.ok === false) {
          throw new Error(
            data.message || "New arrivals load nahi ho sake."
          );
        }

        const fetchedProducts = Array.isArray(data.products)
          ? data.products
          : Array.isArray(data.data)
            ? data.data
            : [];

        const newArrivalsOnly = fetchedProducts.filter(
          (product) =>
            (product.newArrival === true ||
              product.isNewArrival === true) &&
            product.isActive !== false
        );

        setProducts(newArrivalsOnly);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(
            err.message ||
              "Products load nahi ho sake. Backend connection check karein."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchNewArrivals();

    return () => controller.abort();
  }, []);

  const availableColors = useMemo(
    () => [
      ...new Set(
        products.flatMap((product) => getColors(product.colors))
      ),
    ],
    [products]
  );

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      if (
        selectedColors.length > 0 &&
        !getColors(product.colors).some((color) =>
          selectedColors.includes(color)
        )
      ) {
        return false;
      }

      const price = Number(product.specialPrice ?? product.price ?? 0);

      if (minPrice !== "" && price < Number(minPrice)) {
        return false;
      }

      if (maxPrice !== "" && price > Number(maxPrice)) {
        return false;
      }

      return true;
    });

    result = [...result];

    if (sortBy === "price-low") {
      result.sort(
        (a, b) =>
          Number(a.specialPrice ?? a.price ?? 0) -
          Number(b.specialPrice ?? b.price ?? 0)
      );
    } else if (sortBy === "price-high") {
      result.sort(
        (a, b) =>
          Number(b.specialPrice ?? b.price ?? 0) -
          Number(a.specialPrice ?? a.price ?? 0)
      );
    } else {
      result.sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      );
    }

    return result;
  }, [products, selectedColors, minPrice, maxPrice, sortBy]);

  const toggleColor = (color) => {
    setSelectedColors((previous) =>
      previous.includes(color)
        ? previous.filter((item) => item !== color)
        : [...previous, color]
    );
  };

  const clearFilters = () => {
    setSelectedColors([]);
    setMinPrice("");
    setMaxPrice("");
    setSortBy("newest");
  };

  return (
    <main className="min-h-screen bg-[#faf9f6] text-[#191919]">
      {/* Page Heading */}
      <section className="px-5 pb-10 pt-12 text-center sm:px-8 sm:pt-16">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-[#6b5738]">
          The Latest Collection
        </p>

        <h1 className="text-3xl font-medium tracking-tight sm:text-5xl">
          New Arrivals
        </h1>

        <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-gray-600 sm:text-base">
          Discover the latest men's footwear, crafted for timeless style
          and everyday confidence.
        </p>
      </section>

      {/* Products Section */}
      <section className="mx-auto max-w-[1600px] px-4 pb-16 sm:px-8 lg:px-12">
        {/* Toolbar */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-y border-[#e7e2d9] py-4">
          <p className="text-sm text-gray-600">
            <span className="font-medium text-[#191919]">
              {loading ? "..." : filteredProducts.length}
            </span>{" "}
            styles
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setFiltersOpen(!filtersOpen)}
              aria-expanded={filtersOpen}
              className="flex items-center gap-2 border border-[#ded8ce] px-4 py-2.5 text-sm transition hover:bg-[#eee9e0] lg:hidden"
            >
              {filtersOpen ? (
                <FiX size={16} />
              ) : (
                <FiSliders size={16} />
              )}
              Filters
            </button>

            <label className="flex items-center gap-2 text-sm">
              <span className="hidden text-gray-500 sm:inline">
                Sort by
              </span>

              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                className="max-w-[165px] bg-transparent py-2 text-sm outline-none"
              >
                <option value="newest">Date, new to old</option>
                <option value="price-low">Price, low to high</option>
                <option value="price-high">Price, high to low</option>
              </select>
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-10">
          {/* Filters Sidebar */}
          <aside
            className={`${
              filtersOpen ? "block" : "hidden"
            } space-y-8 lg:block`}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider">
                Filters
              </h2>

              <button
                type="button"
                onClick={clearFilters}
                className="text-xs text-gray-500 underline underline-offset-4 hover:text-black"
              >
                Clear all
              </button>
            </div>

            {/* Category */}
            <div className="border-b border-[#e7e2d9] pb-6">
              <h3 className="mb-4 text-sm font-medium">Category</h3>
              <p className="text-sm text-gray-600">New Arrivals</p>
            </div>

            {/* Colors */}
            <div className="border-b border-[#e7e2d9] pb-6">
              <h3 className="mb-4 text-sm font-medium">Color</h3>

              {availableColors.length > 0 ? (
                <div className="space-y-3">
                  {availableColors.map((color) => (
                    <label
                      key={color}
                      className="flex cursor-pointer items-center gap-3 text-sm text-gray-700"
                    >
                      <input
                        type="checkbox"
                        checked={selectedColors.includes(color)}
                        onChange={() => toggleColor(color)}
                        className="h-4 w-4 accent-[#8c7650]"
                      />
                      {color}
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  No color filters available.
                </p>
              )}
            </div>

            {/* Price */}
            <div className="pb-6">
              <h3 className="mb-4 text-sm font-medium">
                Price (PKR)
              </h3>

              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  value={minPrice}
                  onChange={(event) => setMinPrice(event.target.value)}
                  placeholder="Min"
                  className="w-full min-w-0 border border-[#ded8ce] bg-transparent px-3 py-2 text-sm outline-none focus:border-[#8c7650]"
                />

                <input
                  type="number"
                  min="0"
                  value={maxPrice}
                  onChange={(event) => setMaxPrice(event.target.value)}
                  placeholder="Max"
                  className="w-full min-w-0 border border-[#ded8ce] bg-transparent px-3 py-2 text-sm outline-none focus:border-[#8c7650]"
                />
              </div>
            </div>
          </aside>

          {/* Products */}
          <div className="min-w-0">
            {loading ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className="animate-pulse">
                    <div className="aspect-[4/5] bg-[#eeeae3]" />
                    <div className="mt-4 h-3 w-2/3 bg-[#e7e2d9]" />
                    <div className="mt-3 h-4 w-full bg-[#e7e2d9]" />
                    <div className="mt-3 h-4 w-1/3 bg-[#e7e2d9]" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="py-16 text-center">
                <h2 className="text-xl font-medium">
                  Unable to load new arrivals
                </h2>

                <p className="mt-3 text-sm text-gray-600">{error}</p>

                <p className="mt-2 text-xs text-gray-500">
                  API: {API_URL}
                </p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="py-20 text-center">
                <h2 className="text-xl font-medium">
                  No new arrivals found
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Products with newArrival enabled will appear here.
                </p>

                {(selectedColors.length > 0 ||
                  minPrice !== "" ||
                  maxPrice !== "") && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-5 border border-black px-5 py-3 text-sm hover:bg-black hover:text-white"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="new-arrivals-mobile-slider grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                {filteredProducts.map((product, index) => {
                  const colors = getColors(product.colors);
                  const productId = product._id || product.id;
                  const productName = product.title || product.name || "Men's shoes";

                  return (
                    <article key={productId} className="group min-w-0">
                      {/* Product Image */}
                      <Link
                        to={`/products/${productId}`}
                        className="relative block overflow-hidden bg-[#eeeae3]"
                        aria-label={`View ${productName}`}
                      >
                        <img
                          src={getImage(product)}
                          alt={productName}
                          width="400"
                          height="500"
                          loading="lazy"
                          decoding="async"
                          fetchPriority="low"
                          className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                        />

                        <span className="absolute left-2 top-2 bg-white px-2 py-1 text-[10px] font-medium uppercase tracking-wider sm:left-3 sm:top-3 sm:px-3 sm:text-xs">
                          New
                        </span>
                      </Link>

                      {/* Product Information */}
                      <div className="pt-4">
                        <p className="mb-1 text-[10px] uppercase tracking-[0.16em] text-[#8c7650] sm:text-xs">
                          {product.category || "Shoes"}
                        </p>

                        <h2 className="text-xs font-medium leading-5 sm:text-sm">
                          <Link
                            to={`/products/${productId}`}
                            className="transition hover:text-[#8c7650]"
                          >
                            {productName}
                          </Link>
                        </h2>

                        {/* Price */}
                        <p className="mt-2 text-sm font-semibold sm:text-base">
                          {formatPrice(
                            product.specialPrice ?? product.price
                          )}
                        </p>

                        {/* Colors */}
                        {colors.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {colors.map((color) => (
                              <span
                                key={color}
                                className="border border-[#ded8ce] px-2 py-1 text-[9px] tracking-wider text-gray-600 sm:text-[10px]"
                              >
                                {color}
                              </span>
                            ))}
                          </div>
                        )}

                        {/* View Details */}
                        <Link
                          to={`/products/${productId}`}
                          className="mt-4 inline-block border-b border-[#191919] pb-1 text-[10px] font-medium uppercase tracking-[0.15em] transition hover:border-[#8c7650] hover:text-[#8c7650] sm:text-xs"
                        >
                          View Details
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mobile Slider Styling */}
      <style>{`
        @media (max-width: 639px) {
          .new-arrivals-mobile-slider {
            display: flex;
            flex-wrap: nowrap;
            overflow-x: auto;
            overflow-y: hidden;
            scroll-snap-type: x mandatory;
            scroll-behavior: smooth;
            -webkit-overflow-scrolling: touch;
            scrollbar-width: none;
            padding-bottom: 8px;
          }

          .new-arrivals-mobile-slider::-webkit-scrollbar {
            display: none;
          }

          .new-arrivals-mobile-slider > article {
            flex: 0 0 72%;
            width: 72%;
            scroll-snap-align: start;
          }
        }
      `}</style>
    </main>
  );
};

export default NewArrivals;
