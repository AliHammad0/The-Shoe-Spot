
import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FiSearch,
  FiShoppingBag,
  FiUser,
  FiMenu,
  FiX,
  FiChevronDown,
  FiHeart,
} from "react-icons/fi";

import Cart from "./Cart";

const API_URL =
  "https://the-shoe-spot-backend.vercel.app/api/v1";

const shoeCategories = [
  { name: "All Shoes", path: "/" },
  { name: "Sneakers", path: "/category/sneakers" },
  { name: "Formal Shoes", path: "/category/formal-shoes" },
  { name: "Loafers", path: "/category/loafers" },
  { name: "Boots", path: "/category/boots" },
  { name: "Casual Shoes", path: "/category/casual-shoes" },
  { name: "Sandals", path: "/category/sandals" },
];

const navClass = ({ isActive }) =>
  `shrink-0 text-[13px] font-normal transition-colors duration-200 ${
    isActive ? "text-black" : "text-gray-600 hover:text-black"
  }`;

export default function Header() {
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const debounceRef = useRef(null);
  const requestIdRef = useRef(0);

  const [shopOpen, setShopOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileShopOpen, setMobileShopOpen] = useState(false);

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchProducts, setSearchProducts] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [cartOpen, setCartOpen] = useState(false);

  const cartItems = useSelector((state) => state.cart.items || []);

  const cartCount = cartItems.reduce(
    (total, item) => total + Number(item.quantity || 0),
    0
  );

  const wishlistItems = useSelector(
    (state) => state.wishlist?.items || []
  );

  const wishlistCount = wishlistItems.length;

  const savedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  })();

  const token = localStorage.getItem("token");
  const isLoggedIn = Boolean(token);
  const isAdmin = savedUser?.isAdmin === true;

  const accountPath = isLoggedIn ? "/profile" : "/login";

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      clearTimeout(debounceRef.current);
    };
  }, []);

  // Live product search
  useEffect(() => {
    const query = searchQuery.trim();
    const requestId = ++requestIdRef.current;

    clearTimeout(debounceRef.current);

    if (!searchOpen || !query) {
      setSearchProducts([]);
      setSearchLoading(false);
      setSearchError("");
      return;
    }

    setSearchLoading(true);
    setSearchError("");

    debounceRef.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `${API_URL}/products/search?q=${encodeURIComponent(query)}`
        );

        const data = await response.json();

        if (requestId !== requestIdRef.current) return;

        if (!response.ok || !data.ok) {
          throw new Error(data.message || "Products load nahi ho sake.");
        }

        setSearchProducts(
          Array.isArray(data.products) ? data.products : []
        );
      } catch (error) {
        if (requestId !== requestIdRef.current) return;

        console.error("Live product search error:", error);
        setSearchProducts([]);
        setSearchError(
          "Products load nahi ho sake. Backend aur API route check karein."
        );
      } finally {
        if (requestId === requestIdRef.current) {
          setSearchLoading(false);
        }
      }
    }, 250);

    return () => clearTimeout(debounceRef.current);
  }, [searchQuery, searchOpen]);

  const closeMobileMenu = () => {
    setMobileOpen(false);
    setMobileShopOpen(false);
  };

  const handleProductClick = (product) => {
    setShowSuggestions(false);
    setSearchOpen(false);
    setSearchQuery("");
    setSearchProducts([]);
    navigate(`/products/${product._id}`);
  };

  const handleCartClose = () => {
    setCartOpen(false);
  };

  return (
    <div style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
      {/* Announcement Bar */}
      <div className="flex min-h-[28px] items-center justify-center bg-black px-3 py-1 text-center text-[10px] tracking-wide text-white sm:min-h-[30px] sm:text-[11px]">
        Complimentary delivery on orders over Rs. 5,000
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white">
        <div className="mx-auto flex h-[56px] max-w-[1440px] items-center px-4 sm:px-6 lg:h-[64px] lg:px-10">
          {/* Mobile Menu */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-9 w-8 shrink-0 items-center justify-start text-black lg:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <FiX size={21} /> : <FiMenu size={21} />}
          </button>

          {/* Logo */}
          <Link
            to="/"
            onClick={closeMobileMenu}
            className="shrink-0 whitespace-nowrap text-[15px] font-bold tracking-[0.1em] text-black sm:text-lg lg:text-[19px]"
          >
            THE SHOE SPOT
          </Link>

          {/* Desktop Navigation */}
          <nav className="ml-12 hidden h-full items-center gap-7 lg:flex xl:ml-24 xl:gap-9 2xl:ml-28 2xl:gap-10">
            <NavLink to="/" className={navClass}>
              Home
            </NavLink>

            {/* Shop Dropdown */}
            <div
              className="relative flex h-full shrink-0 items-center"
              onMouseEnter={() => setShopOpen(true)}
              onMouseLeave={() => setShopOpen(false)}
            >
              <button
                type="button"
                onClick={() => setShopOpen(!shopOpen)}
                className="flex items-center gap-1.5 whitespace-nowrap text-[13px] font-normal text-gray-600 transition-colors hover:text-black"
                aria-expanded={shopOpen}
              >
                Shop
                <FiChevronDown
                  size={13}
                  className={`transition-transform duration-200 ${
                    shopOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {shopOpen && (
                <div className="absolute left-0 top-full z-50 w-52 border border-gray-100 bg-white py-2 shadow-lg">
                  {shoeCategories.map((category) => (
                    <Link
                      key={category.path}
                      to={category.path}
                      onClick={() => setShopOpen(false)}
                      className="block px-5 py-2.5 text-[13px] text-gray-600 transition-colors hover:bg-gray-50 hover:text-black"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <NavLink to="/about" className={navClass}>
              About
            </NavLink>

            <NavLink to="/contact" className={navClass}>
              Contact
            </NavLink>

            <NavLink to="/blog" className={navClass}>
              Blog
            </NavLink>

            <NavLink to="/store-locator" className={navClass}>
              Store Locator
            </NavLink>

            {/* My Profile */}
            {isLoggedIn && (
              <NavLink to="/profile" className={navClass}>
                My Profile
              </NavLink>
            )}

            {/* Admin Dashboard */}
            {isAdmin && (
              <NavLink to="/admin" className={navClass}>
                Admin
              </NavLink>
            )}
          </nav>

          {/* Right Side Icons */}
          <div className="ml-auto flex shrink-0 items-center gap-3 sm:gap-5 lg:pl-6 xl:pl-8">
            {/* Search */}
            <button
              type="button"
              onClick={() => {
                setSearchOpen((previous) => !previous);
                setShowSuggestions(true);
                setSearchError("");
              }}
              className="text-black transition-colors hover:text-gray-500"
              aria-label="Search products"
            >
              {searchOpen ? <FiX size={19} /> : <FiSearch size={19} />}
            </button>

            {/* Account */}
            <Link
              to={accountPath}
              className="hidden text-black transition-colors hover:text-gray-500 sm:block"
              aria-label={isLoggedIn ? "My Profile" : "Login"}
              title={isLoggedIn ? "My Profile" : "Login"}
            >
              <FiUser size={19} />
            </Link>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              onClick={closeMobileMenu}
              className="relative text-black transition-colors hover:text-red-600"
              aria-label={`Open wishlist, ${wishlistCount} products`}
              title="Wishlist"
            >
              <FiHeart size={19} />

              {wishlistCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[10px] text-white">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Drawer */}
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="relative text-black transition-colors hover:text-gray-500"
              aria-label={`Open shopping cart, ${cartCount} items`}
            >
              <FiShoppingBag size={19} />

              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-black px-1 text-[10px] text-white">
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* Live Search Dropdown */}
        {searchOpen && (
          <div
            ref={searchRef}
            className="relative z-50 border-t border-gray-100 bg-white px-4 py-4 sm:px-8"
          >
            <div className="mx-auto max-w-3xl">
              <div className="flex items-center gap-3 border-b border-gray-300">
                <FiSearch size={19} className="shrink-0 text-gray-500" />

                <input
                  type="search"
                  value={searchQuery}
                  onFocus={() => setShowSuggestions(true)}
                  onChange={(event) => {
                    setSearchQuery(event.target.value);
                    setShowSuggestions(true);
                  }}
                  placeholder="Search shoes by name or category..."
                  autoFocus
                  className="w-full border-0 bg-transparent py-3 text-sm text-black outline-none placeholder:text-gray-400"
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSearchProducts([]);
                      setSearchError("");
                      setShowSuggestions(true);
                    }}
                    className="text-xs text-gray-500 hover:text-black"
                  >
                    Clear
                  </button>
                )}
              </div>

              {showSuggestions && searchQuery.trim() && (
                <div className="absolute left-4 right-4 top-full max-h-[420px] overflow-y-auto border border-gray-100 bg-white shadow-xl sm:left-8 sm:right-8">
                  {searchLoading && (
                    <p className="px-4 py-5 text-sm text-gray-500">
                      Searching products...
                    </p>
                  )}

                  {!searchLoading && searchError && (
                    <p className="px-4 py-5 text-sm text-red-600">
                      {searchError}
                    </p>
                  )}

                  {!searchLoading &&
                    !searchError &&
                    searchProducts.length === 0 && (
                      <p className="px-4 py-5 text-sm text-gray-500">
                        Koi matching product nahi mila.
                      </p>
                    )}

                  {!searchLoading &&
                    !searchError &&
                    searchProducts.map((product) => (
                      <button
                        type="button"
                        key={product._id}
                        onClick={() => handleProductClick(product)}
                        className="flex w-full items-center gap-4 border-b border-gray-100 p-3 text-left transition-colors last:border-b-0 hover:bg-[#faf9f6]"
                      >
                        <img
                          src={product.images?.[0] || "/placeholder.png"}
                          alt={product.title}
                          className="h-16 w-16 shrink-0 bg-[#f5f3ee] object-cover"
                        />

                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-[#191919]">
                            {product.title}
                          </span>

                          {product.category && (
                            <span className="mt-1 block text-xs text-gray-500">
                              {product.category}
                            </span>
                          )}

                          <span className="mt-1 block text-sm text-black">
                            Rs.{" "}
                            {Number(product.price || 0).toLocaleString("en-PK")}
                          </span>
                        </span>
                      </button>
                    ))}
                </div>
              )}

              {showSuggestions && !searchQuery.trim() && (
                <p className="pt-3 text-xs text-gray-500">
                  Product suggestions dekhne ke liye type karna shuru karein.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Mobile Navigation */}
        {mobileOpen && (
          <div className="border-t border-gray-100 bg-white lg:hidden">
            <nav className="flex max-h-[75vh] flex-col overflow-y-auto px-5 py-2">
              <NavLink
                to="/"
                onClick={closeMobileMenu}
                className="border-b border-gray-100 py-3 text-[13px] text-gray-700"
              >
                Home
              </NavLink>

              {/* Mobile Shop Dropdown */}
              <button
                type="button"
                onClick={() => setMobileShopOpen(!mobileShopOpen)}
                className="flex items-center justify-between border-b border-gray-100 py-3 text-left text-[13px] text-gray-700"
                aria-expanded={mobileShopOpen}
              >
                Shop
                <FiChevronDown
                  size={15}
                  className={`transition-transform duration-200 ${
                    mobileShopOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {mobileShopOpen && (
                <div className="bg-gray-50 px-4 py-2">
                  {shoeCategories.map((category) => (
                    <Link
                      key={category.path}
                      to={category.path}
                      onClick={closeMobileMenu}
                      className="block py-2.5 text-[13px] text-gray-600 transition-colors hover:text-black"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}

              <NavLink
                to="/about"
                onClick={closeMobileMenu}
                className="border-b border-gray-100 py-3 text-[13px] text-gray-700"
              >
                About
              </NavLink>

              <NavLink
                to="/contact"
                onClick={closeMobileMenu}
                className="border-b border-gray-100 py-3 text-[13px] text-gray-700"
              >
                Contact
              </NavLink>

              <NavLink
                to="/blog"
                onClick={closeMobileMenu}
                className="border-b border-gray-100 py-3 text-[13px] text-gray-700"
              >
                Blog
              </NavLink>

              <NavLink
                to="/store-locator"
                onClick={closeMobileMenu}
                className="border-b border-gray-100 py-3 text-[13px] text-gray-700"
              >
                Store Locator
              </NavLink>

              {/* Mobile Wishlist */}
              <Link
                to="/wishlist"
                onClick={closeMobileMenu}
                className="flex items-center gap-3 border-b border-gray-100 py-3 text-[13px] text-gray-700"
              >
                <FiHeart size={17} />
                Wishlist ({wishlistCount})
              </Link>

              {/* Mobile My Profile / Login */}
              <Link
                to={accountPath}
                onClick={closeMobileMenu}
                className="flex items-center gap-3 border-b border-gray-100 py-3 text-[13px] text-gray-700"
              >
                <FiUser size={17} />
                {isLoggedIn ? "My Profile" : "Login"}
              </Link>

              {/* Mobile Admin Dashboard */}
              {isAdmin && (
                <NavLink
                  to="/admin"
                  onClick={closeMobileMenu}
                  className="border-b border-gray-100 py-3 text-[13px] text-gray-700"
                >
                  Admin Dashboard
                </NavLink>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Slide-over Cart */}
      <Cart isOpen={cartOpen} onClose={handleCartClose} />
    </div>
  );
}
