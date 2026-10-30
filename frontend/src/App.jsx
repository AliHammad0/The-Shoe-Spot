
import React from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./Pages/Header";
import Footer from "./Pages/Footer";
import Product from "./Pages/Product";
import BestSelling from "./Pages/BestSelling";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Cart from "./Pages/Cart";
import Checkout from "./Pages/Checkout";
import Hero from "./Pages/Hero";
import Reviews from "./Pages/Reviews";
import About from "./Pages/About";
import ReturnExchangePolicy from "./components/ReturnExchangePolicy";
import ShoeSizeGuide from "./components/ShoeSizeGuide";
import ShippingPolicy from "./components/ShippingPolicy";
import ClaimPolicy from "./components/ClaimPolicy";
import CancellationPolicy from "./components/CancellationPolicy";
import PaymentOptions from "./components/PaymentOptions";
import HappyCustomer from "./components/HappyCustomer";
import BuyNowPayLater from "./components/BuyNowPayLater";
import FAQ from "./components/FAQ";
import PrivacyPolicy from "./components/PrivacyPolicy";
import StoreLocator from "./components/StoreLocator";
import Blog from "./components/Blog";
import ProductDetails from "./Pages/ProductDetails";
import AdminDashboard from "./Admin/AdminDashboard";
import ProtectedAdminRoute from "./Admin/ProtectedAdminRoute";
import Search from "./Pages/Search";
import Profile from "./Pages/Profile";
import MyOrders from "./Pages/MyOrders";
import AdminOrders from "./Admin/AdminOrders";
import NewArrivals from "./Pages/NewArrivals";
import WishList from "./Pages/WishList";
import Category from "./Pages/Category";
import Contact from "./Pages/Contact";
import CategoryProducts from "./Pages/CategoryProducts";

const App = () => {
  return (
    <>
      <Header />

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

        {/* CATEGORY PRODUCTS */}
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

      <Footer />
    </>
  );
};

export default App;
