import { useEffect, useState } from "react";
import {
  FiPackage,
  FiUsers,
  FiShoppingBag,
  FiDollarSign,
} from "react-icons/fi";

const API_URL =
  "https://the-shoe-spot-backend.vercel.app/api/v1";

const DashboardHome = () => {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Please login first. Login token nahi mila.");
        setLoading(false);
        return;
      }

      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [productsResponse, usersResponse] = await Promise.all([
          fetch(`${API_URL}/products`, { headers }),
          fetch(`${API_URL}/users`, { headers }),
        ]);

        const productsData = await productsResponse.json();
        const usersData = await usersResponse.json();

        if (productsResponse.status === 401 || usersResponse.status === 401) {
          throw new Error(
            "Login session expire ho gaya. Logout karke dobara login karein."
          );
        }

        if (productsResponse.status === 403 || usersResponse.status === 403) {
          throw new Error(
            "Admin access nahi mila. Apne account ka isAdmin true check karein."
          );
        }

        if (!productsResponse.ok || productsData.ok === false) {
          throw new Error(
            productsData.message || "Products load nahi ho sake."
          );
        }

        if (!usersResponse.ok || usersData.ok === false) {
          throw new Error(
            usersData.message || "Users load nahi ho sake."
          );
        }

        const productList = Array.isArray(productsData)
          ? productsData
          : productsData.products || [];

        const userList = Array.isArray(usersData)
          ? usersData
          : usersData.users || [];

        setProducts(productList);
        setUsers(userList);
      } catch (err) {
        setError(err.message || "Dashboard data load nahi hua.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const totalStock = products.reduce(
    (total, product) => total + Number(product.stock || 0),
    0
  );

  const stats = [
    {
      title: "Total Products",
      value: products.length,
      icon: FiPackage,
    },
    {
      title: "Total Users",
      value: users.length,
      icon: FiUsers,
    },
    {
      title: "Total Stock",
      value: totalStock,
      icon: FiShoppingBag,
    },
    {
      title: "Orders",
      value: "—",
      icon: FiDollarSign,
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-black" />
          <p className="text-sm font-medium text-gray-500">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 text-black sm:p-6 lg:p-8">
      {/* Welcome Section */}
      <section className="mb-8 animate-[fadeIn_0.5s_ease-out]">
        <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white via-white to-[#f7f3eb] p-6 shadow-sm transition-all duration-300 hover:shadow-lg sm:p-8">
          <p className="mb-3 text-xs font-bold uppercase tracking-[3px] text-[#9a8057]">
            Admin Overview
          </p>

          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl">
            Welcome to The Shoe Spot
          </h2>

          <p className="mt-3 max-w-xl text-sm leading-7 text-gray-600 sm:text-base">
            Manage your store products and customers from one place.
          </p>
        </div>
      </section>

      {/* Error Message */}
      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Statistics Cards */}
      <section className="mb-9 grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              style={{ animationDelay: `${index * 100}ms` }}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_6px_20px_rgba(0,0,0,0.04)] transition-all duration-300 ease-out animate-[fadeIn_0.5s_ease-out_both] hover:-translate-y-2 hover:rotate-[0.5deg] hover:border-[#c8b28e] hover:shadow-[0_18px_35px_rgba(0,0,0,0.11)] sm:p-6"
            >
              <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#f5f0e7] transition-transform duration-500 group-hover:scale-150" />

              <div className="relative flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-[#e8dcc7] bg-[#f7f3eb] text-[#806b48] shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <Icon size={25} strokeWidth={1.8} />
                </div>

                <div className="min-w-0">
                  <p className="mb-2 text-xs font-semibold text-gray-500 sm:text-sm">
                    {stat.title}
                  </p>

                  <h3 className="break-words text-2xl font-extrabold tracking-tight sm:text-3xl">
                    {stat.value}
                  </h3>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Recent Products */}
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_6px_25px_rgba(0,0,0,0.04)] transition-shadow duration-300 hover:shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 bg-gradient-to-r from-white to-[#faf8f4] px-5 py-5 sm:px-7">
          <div>
            <h3 className="text-lg font-extrabold tracking-tight sm:text-xl">
              Recent Products
            </h3>

            <p className="mt-1 text-xs text-gray-500 sm:text-sm">
              Your latest store inventory
            </p>
          </div>

          <span className="rounded-full border border-[#e8dcc7] bg-[#f7f3eb] px-4 py-2 text-xs font-bold text-black">
            {products.length} Products
          </span>
        </div>

        {products.length === 0 ? (
          <div className="flex min-h-52 flex-col items-center justify-center gap-3 p-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f7f3eb] text-[#806b48]">
              <FiPackage size={27} />
            </div>

            <h4 className="font-bold">No Products Found</h4>

            <p className="text-sm text-gray-500">
              Your products will appear here once added.
            </p>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[650px] border-collapse text-left">
              <thead>
                <tr className="border-b border-gray-200 bg-[#faf9f6]">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                    Product
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                    Category
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                    Price
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                    Stock
                  </th>
                </tr>
              </thead>

              <tbody>
                {products.slice(0, 5).map((product) => (
                  <tr
                    key={product._id}
                    className="border-b border-gray-100 transition-colors duration-200 last:border-0 hover:bg-[#fcfaf6]"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.title || "Product"}
                            loading="lazy"
                            className="h-12 w-12 rounded-xl border border-gray-200 bg-gray-50 object-cover transition-transform duration-300 hover:scale-110"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-[#f7f3eb] text-[#806b48]">
                            <FiPackage size={21} />
                          </div>
                        )}

                        <span className="max-w-52 truncate text-sm font-bold text-black">
                          {product.title || "Untitled Product"}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium text-gray-700">
                        {product.category || "Uncategorized"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm font-bold text-black">
                      Rs. {Number(product.price || 0).toLocaleString("en-PK")}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1.5 text-xs font-bold ${
                          Number(product.stock || 0) > 0
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {product.stock ?? 0} units
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {products.length > 5 && (
          <div className="border-t border-gray-100 px-6 py-4 text-center text-xs text-gray-500">
            Showing 5 of {products.length} products
          </div>
        )}
      </section>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .animate-\\[fadeIn_0\\.5s_ease-out\\],
          .animate-\\[fadeIn_0\\.5s_ease-out_both\\] {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
};

export default DashboardHome;