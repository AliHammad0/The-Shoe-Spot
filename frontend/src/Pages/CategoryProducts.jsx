
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_URL =
  "https://the-shoe-spot-backend.vercel.app/api/v1";

const categories = {
  sneakers: "Sneakers",
  "formal-shoes": "Formal Shoes",
  loafers: "Loafers",
  boots: "Boots",
  "casual-shoes": "Casual Shoes",
  sandals: "Sandals",
  sliders: "Sliders",
  "sports-shoes": "Sports Shoes",
};

export default function CategoryProducts() {
  const { categorySlug } = useParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categoryName = categories[categorySlug];

  useEffect(() => {
    const fetchProducts = async () => {
      if (!categoryName) {
        setProducts([]);
        setError("Category not found.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/products/search?category=${encodeURIComponent(categoryName)}`
        );

        const data = await response.json();

        if (!response.ok || !data.ok) {
          throw new Error(data.message || "Failed to load products.");
        }

        setProducts(data.products || []);
      } catch (err) {
        setError(err.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categorySlug, categoryName]);

  return (
    <section
      className="min-h-screen bg-white px-5 py-12 sm:px-8 lg:px-12"
      style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[3px] text-[#8c7650]">
            The Shoe Spot
          </p>

          <h1 className="text-3xl font-bold text-[#191919] sm:text-4xl">
            {categoryName || "Category"}
          </h1>

          <p className="mt-3 text-sm text-gray-500">
            {loading
              ? "Loading products..."
              : `${products.length} products available`}
          </p>

          <div className="mt-5 h-[3px] w-16 bg-[#b69a68]" />
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="aspect-[4/5] rounded-lg bg-gray-100" />
                <div className="mt-4 h-4 w-3/4 rounded bg-gray-100" />
                <div className="mt-3 h-4 w-1/3 rounded bg-gray-100" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-20 text-center">
            <p className="text-lg font-semibold text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-5 bg-[#191919] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#b69a68]"
            >
              Try Again
            </button>
          </div>
        ) : products.length === 0 ? (
          <div className="py-24 text-center">
            <h2 className="text-2xl font-bold text-[#191919]">
              No Products Found
            </h2>
            <p className="mt-3 text-gray-500">
              Abhi is category mein koi product available nahi hai.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <div key={product._id} className="group">
                <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-[#f5f4f1]">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-gray-400">
                      No Image Available
                    </div>
                  )}
                </div>

                <div className="pt-4">
                  <h2 className="line-clamp-2 text-sm font-semibold text-[#191919] sm:text-base">
                    {product.title}
                  </h2>

                  <p className="mt-2 font-bold text-[#191919]">
                    Rs. {Number(product.price).toLocaleString("en-PK")}
                  </p>

                  {product.stock <= 0 && (
                    <p className="mt-2 text-xs font-semibold text-red-600">
                      Out of Stock
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
