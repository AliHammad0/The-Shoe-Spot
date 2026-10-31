
import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./Pages/Header";
import Footer from "./Pages/Footer";

import Hero from "./Pages/Hero";
import Category from "./Pages/Category";
import Product from "./Pages/Product";
import NewArrivals from "./Pages/NewArrivals";
import BestSelling from "./Pages/BestSelling";
import Reviews from "./Pages/Reviews";

const Login = lazy(() => import("./Pages/Login"));
const Signup = lazy(() => import("./Pages/Signup"));
const Cart = lazy(() => import("./Pages/Cart"));
const Checkout = lazy(() => import("./Pages/Checkout"));
const ProductDetails = lazy(() => import("./Pages/ProductDetails"));
const Search = lazy(() => import("./Pages/Search"));
const Profile = lazy(() => import("./Pages/Profile"));
const MyOrders = lazy(() => import("./Pages/MyOrders"));
const WishList = lazy(() => import("./Pages/WishList"));
const About = lazy(() => import("./Pages/About"));
const Contact = lazy(() => import("./Pages/Contact"));

const ReturnExchangePolicy = lazy(() =>
  import("./components/ReturnExchangePolicy")
);
const ShoeSizeGuide = lazy(() => import("./components/ShoeSizeGuide"));
const ShippingPolicy = lazy(() => import("./components/ShippingPolicy"));
const ClaimPolicy = lazy(() => import("./components/ClaimPolicy"));
const CancellationPolicy = lazy(() =>
  import("./components/CancellationPolicy")
);
const PaymentOptions = lazy(() => import("./components/PaymentOptions"));
const HappyCustomer = lazy(() => import("./components/HappyCustomer"));
const BuyNowPayLater = lazy(() => import("./components/BuyNowPayLater"));
const FAQ = lazy(() => import("./components/FAQ"));
const PrivacyPolicy = lazy(() => import("./components/PrivacyPolicy"));
const StoreLocator = lazy(() => import("./components/StoreLocator"));
const Blog = lazy(() => import("./components/Blog"));

const AdminDashboard = lazy(() =>
  import("./Admin/AdminDashboard")
);
const ProtectedAdminRoute = lazy(() =>
  import("./Admin/ProtectedAdminRoute")
);
const AdminOrders = lazy(() => import("./Admin/AdminOrders"));
const CategoryProducts = lazy(() =>
  import("./Pages/CategoryProducts")
);

const PageLoader = () => (
  <div className="min-h-[50vh] flex items-center justify-center">
    <div className="h-8 w-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
  </div>
);

const App = () => {
  return (
    <>
      <Header />

      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* HOME */}
          <Route
            path="/"
            element={
              <>
                <Hero />
                <Category />
                <Product />
                <NewArrivals />
                <BestSelling />
                <Reviews />
              </>
            }
          />

          {/* AUTH */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* SHOPPING */}
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/search" element={<Search />} />
          <Route path="/new" element={<NewArrivals />} />
          <Route path="/wishlist" element={<WishList />} />

          {/* CATEGORY */}
          <Route
            path="/category/:categorySlug"
            element={<CategoryProducts />}
          />

          {/* ACCOUNT */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-orders" element={<MyOrders />} />

          {/* PAGES */}
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/return-exchange" element={<ReturnExchangePolicy />} />
          <Route path="/size-guide" element={<ShoeSizeGuide />} />
          <Route path="/shipping-policy" element={<ShippingPolicy />} />
          <Route path="/claim-policy" element={<ClaimPolicy />} />
          <Route
            path="/cancellation-policy"
            element={<CancellationPolicy />}
          />
          <Route path="/payment-options" element={<PaymentOptions />} />
          <Route path="/happy-customers" element={<HappyCustomer />} />
          <Route path="/buy-now" element={<BuyNowPayLater />} />
          <Route path="/faqs" element={<FAQ />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/store-locator" element={<StoreLocator />} />
          <Route path="/blogs" element={<Blog />} />

          {/* ADMIN */}
          <Route element={<ProtectedAdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
          </Route>
        </Routes>
      </Suspense>

      <Footer />
    </>
  );
};

export default App;
