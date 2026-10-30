
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";

const API_URL = "http://localhost:8080/api/v1";

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.trim() || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const searchProducts = async () => {
      if (!query) {
        setProducts([]);
        setError("");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/products/search?q=${encodeURIComponent(query)}`
        );

        const data = await response.json();

        if (!response.ok || !data.ok) {
          throw new Error(data.message || "Products search nahi ho sake.");
        }

        setProducts(data.products || []);
      } catch (err) {
        console.error("Search error:", err);
        setError(err.message || "Search nahi ho saka.");
      } finally {
        setLoading(false);
      }
    };

    searchProducts();
  }, [query]);

  return (
    <main className="min-h-screen bg-[#faf9f6] px-4 py-10 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-2 text-3xl font-semibold text-[#191919]">
          Search Results
        </h1>

        <p className="mb-8 text-sm text-gray-600">
          {query ? `Results for "${query}"` : "Search for your favourite shoes"}
        </p>

        {loading && (
          <p className="py-10 text-center text-gray-600">
            Products load ho rahe hain...
          </p>
        )}

        {!loading && error && (
          <p className="py-10 text-center text-red-600">{error}</p>
        )}

        {!loading && !error && query && products.length === 0 && (
          <p className="py-10 text-center text-gray-600">
            Koi product nahi mila. Doosra naam search karein.
          </p>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
            {products.map((product) => (
              <Link
                to={`/product/${product._id}`}
                key={product._id}
                className="group block"
              >
                <div className="aspect-[4/5] overflow-hidden bg-[#f0eee8]">
                  <img
                    src={product.images?.[0] || "/placeholder.png"}
                    alt={product.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="pt-3">
                  <h2 className="font-medium text-[#191919]">
                    {product.title}
                  </h2>

                  <p className="mt-1 text-sm text-gray-600">
                    Rs. {Number(product.price || 0).toLocaleString("en-PK")}
                  </p>

                  {product.category && (
                    <p className="mt-1 text-xs text-gray-500">
                      {product.category}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
