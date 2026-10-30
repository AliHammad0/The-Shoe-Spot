
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiUser, FiMail, FiLogOut } from "react-icons/fi";

const API_URL =
  "https://the-shoe-spot-backend.vercel.app/api/v1";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        // Login se saved user ko temporary display ke liye read karein.
        const savedUser = localStorage.getItem("user");

        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }

        // Backend se latest profile data lene ke liye.
        const response = await fetch(`${API_URL}/users/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok || data.ok === false) {
          throw new Error(data.message || "Profile load nahi ho saka.");
        }

        const profile = data.user || data.data?.user || data.data;

        if (!profile || typeof profile !== "object") {
          throw new Error("Backend se user profile nahi mili.");
        }

        setUser(profile);
        localStorage.setItem("user", JSON.stringify(profile));
      } catch (err) {
        setError(err.message || "Profile load karne mein error aaya.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login", { replace: true });
  };

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <p className="text-sm text-gray-500">Loading your profile...</p>
      </main>
    );
  }

  return (
    <main
      className="min-h-[75vh] bg-[#faf9f6] px-4 py-12"
      style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
    >
      <div className="mx-auto max-w-2xl">
        <Link
          to="/"
          className="text-lg font-bold tracking-[0.15em] text-black"
        >
          THE SHOE SPOT
        </Link>

        <div className="mt-8 border border-gray-200 bg-white p-6 sm:p-10">
          <div className="flex items-center gap-4 border-b border-gray-200 pb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f1eee7]">
              <FiUser size={28} />
            </div>

            <div>
              <h1 className="text-2xl font-semibold">
                My Profile
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your account details
              </p>
            </div>
          </div>

          {error && (
            <div className="mt-5 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {user && (
            <div className="mt-6 space-y-5">
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500">
                  Full Name
                </p>
                <p className="mt-2 text-base font-medium text-black">
                  {user.name || user.fullName || "Not provided"}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500">
                  Email Address
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <FiMail className="text-gray-500" />
                  <p className="break-all text-sm text-black">
                    {user.email || "Not provided"}
                  </p>
                </div>
              </div>

              {user.phone && (
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500">
                    Phone Number
                  </p>
                  <p className="mt-2 text-sm text-black">
                    {user.phone}
                  </p>
                </div>
              )}

              {user.isAdmin && (
                <p className="inline-block bg-[#f1eee7] px-3 py-2 text-xs font-medium">
                  Administrator
                </p>
              )}
            </div>
          )}

          <button
            type="button"
            onClick={handleLogout}
            className="mt-8 flex w-full items-center justify-center gap-2 bg-black px-5 py-3 text-sm text-white transition hover:bg-gray-800"
          >
            <FiLogOut size={16} />
            Logout
          </button>
        </div>
      </div>
    </main>
  );
}
