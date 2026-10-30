import { useCallback, useEffect, useState } from "react";
import { FiUsers, FiRefreshCw, FiMail, FiCopy } from "react-icons/fi";

const API_URL = "http://localhost:8080/api/v1";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchUsers = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Please login first. Login token nahi mila.");
      }

      const response = await fetch(`${API_URL}/users`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.status === 401) {
        throw new Error(
          "Login session expire ho gaya. Logout karke dobara login karein."
        );
      }

      if (response.status === 403) {
        throw new Error("Admin access required. Apna admin account check karein.");
      }

      if (!response.ok || data.ok === false) {
        throw new Error(data.message || "Users load nahi ho sake.");
      }

      const userList = Array.isArray(data.users)
        ? data.users
        : Array.isArray(data)
          ? data
          : [];

      setUsers(userList);
    } catch (err) {
      setError(err.message || "Backend se connection nahi ho saka.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const copyUserId = async (id) => {
    try {
      await navigator.clipboard.writeText(id);
    } catch {
      setError("Account ID copy nahi ho saki.");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-72 flex-col items-center justify-center gap-4 bg-white">
        <div className="h-11 w-11 animate-spin rounded-full border-4 border-gray-200 border-t-black" />
        <p className="text-sm font-medium text-gray-500">
          Loading registered users...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-4 text-black sm:p-6 lg:p-8">
      {/* Page Header */}
      <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <p className="mb-2 text-xs font-bold uppercase tracking-[3px] text-[#9a8057]">
            Customer Management
          </p>

          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            All Users
          </h2>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            Website par registered customers ki details manage karein.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fetchUsers(true)}
          disabled={refreshing}
          className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-black shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#c8b28e] hover:bg-[#faf7f1] hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 sm:self-auto"
        >
          <FiRefreshCw
            size={16}
            className={refreshing ? "animate-spin" : ""}
          />
          {refreshing ? "Refreshing..." : "Refresh Users"}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <span>{error}</span>

          <button
            type="button"
            onClick={() => fetchUsers(true)}
            disabled={refreshing}
            className="font-bold underline disabled:opacity-50"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Summary Card */}
      <div className="group relative mb-8 overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-[#f7f3eb] p-6 shadow-[0_6px_24px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:p-7">
        <div className="absolute -right-8 -top-10 h-36 w-36 rounded-full bg-[#e9dfcd]/50 transition-transform duration-500 group-hover:scale-125" />

        <div className="relative flex items-center gap-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-[#e5d8c1] bg-white text-[#806b48] shadow-md transition-transform duration-300 group-hover:rotate-3 group-hover:scale-110">
            <FiUsers size={29} />
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-500">
              Total Registered Users
            </p>

            <h3 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl">
              {users.length}
            </h3>

            <p className="mt-1 text-xs text-gray-500">
              Customer accounts retrieved from your backend
            </p>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-[0_6px_25px_rgba(0,0,0,0.04)] transition-shadow duration-300 hover:shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 bg-gradient-to-r from-white to-[#faf8f4] px-5 py-5 sm:px-7">
          <div>
            <h3 className="text-lg font-extrabold sm:text-xl">
              Registered Customers
            </h3>

            <p className="mt-1 text-xs text-gray-500">
              User information and account details
            </p>
          </div>

          <span className="rounded-full border border-[#e8dcc7] bg-[#f7f3eb] px-4 py-2 text-xs font-bold text-black">
            {users.length} Users
          </span>
        </div>

        {users.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#f7f3eb] text-[#806b48]">
              <FiUsers size={30} />
            </div>

            <h4 className="text-lg font-bold">
              {error ? "Users Load Nahi Hue" : "No Users Found"}
            </h4>

            <p className="max-w-sm text-sm leading-6 text-gray-500">
              {error
                ? "Error fix karke dobara users load karein."
                : "Abhi koi registered user available nahi hai."}
            </p>

            <button
              type="button"
              onClick={() => fetchUsers(true)}
              disabled={refreshing}
              className="mt-1 rounded-lg bg-black px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#333333] hover:shadow-lg disabled:opacity-60"
            >
              {refreshing ? "Loading..." : "Reload Users"}
            </button>
          </div>
        ) : (
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr className="border-b border-gray-200 bg-[#faf9f6]">
                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                    #
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                    Customer
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                    Email Address
                  </th>

                  <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-gray-500">
                    Account ID
                  </th>
                </tr>
              </thead>

              <tbody>
                {users.map((user, index) => (
                  <tr
                    key={user._id || user.email || index}
                    className="border-b border-gray-100 transition-colors duration-200 last:border-0 hover:bg-[#fcfaf6]"
                  >
                    <td className="px-6 py-5 text-sm font-semibold text-gray-400">
                      {String(index + 1).padStart(2, "0")}
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#e8dcc7] bg-[#f7f3eb] text-sm font-extrabold uppercase text-[#806b48] transition-transform duration-300 hover:scale-110">
                          {(user.name || user.email || "U")
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div>
                          <p className="font-bold text-black">
                            {user.name || "Unnamed User"}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            {user.isAdmin ? "Administrator" : "Registered Customer"}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <FiMail
                          size={15}
                          className="shrink-0 text-[#9a8057]"
                        />
                        <span>{user.email || "No email available"}</span>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <span className="max-w-36 truncate rounded-lg bg-gray-100 px-3 py-2 font-mono text-xs text-gray-600">
                          {user._id || "—"}
                        </span>

                        {user._id && (
                          <button
                            type="button"
                            title="Copy account ID"
                            aria-label="Copy account ID"
                            onClick={() => copyUserId(user._id)}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-all duration-200 hover:border-[#c8b28e] hover:bg-[#f7f3eb] hover:text-black"
                          >
                            <FiCopy size={15} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {users.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 bg-[#fdfdfc] px-5 py-4 sm:px-7">
            <p className="text-xs text-gray-500">
              Showing {users.length} registered users
            </p>

            <span className="text-xs font-semibold text-gray-600">
              The Shoe Spot
            </span>
          </div>
        )}
      </section>
    </div>
  );
};

export default AllUsers;