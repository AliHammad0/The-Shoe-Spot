
import { useState } from "react";
import axios from "axios";
import {
  FiUser,
  FiMail,
  FiShoppingBag,
  FiPackage,
  FiMessageSquare,
  FiCheckCircle,
} from "react-icons/fi";

const initialForm = {
  name: "",
  email: "",
  orderType: "Single Order",
  category: "",
  quantity: "1",
  message: "",
};

const categories = [
  "Sneakers",
  "Formal Shoes",
  "Loafers",
  "Boots",
  "Casual Shoes",
  "Sandals",
  "Sliders",
  "Sports Shoes",
];

const API_URL = "http://localhost:8080/api/v1/contact";

export default function Contact() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!Number.isInteger(Number(form.quantity)) || Number(form.quantity) < 1) {
      setError("Quantity kam az kam 1 honi chahiye.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(API_URL, {
        fullName: form.name,
        email: form.email,
        orderType: form.orderType,
        shoeCategory: form.category,
        quantity: Number(form.quantity),
        additionalRequirements: form.message,
      });

      if (response.data.ok) {
        setSuccess("Your inquiry has been submitted successfully!");
        setForm(initialForm);
      } else {
        setError(response.data.message || "Failed to submit inquiry.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen bg-[#faf9f6] text-[#191919]"
      style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
    >
      <section className="border-b border-[#e9e5dc] px-5 py-16 text-center sm:py-20">
        <p className="mb-4 text-[11px] font-medium uppercase tracking-[0.25em] text-[#8c7650]">
          We're Here To Help
        </p>

        <h1 className="text-4xl font-normal tracking-tight sm:text-5xl lg:text-6xl">
          Get In Touch
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-gray-500 sm:text-base">
          Have a question or planning a bulk shoe order?
          Tell us what you need and our team will be happy to assist.
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-7 sm:py-16">
        <div className="bg-white p-5 shadow-[0_10px_50px_rgba(0,0,0,0.04)] sm:p-10 lg:p-12">
          <div className="mb-9">
            <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-[#8c7650]">
              Contact Form
            </p>

            <h2 className="text-2xl font-normal sm:text-3xl">
              Send Us Your Inquiry
            </h2>

            <p className="mt-3 text-sm text-gray-500">
              Fill in the details below to discuss your shoe requirements.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-7">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-xs font-medium">
                  Full Name *
                </label>

                <div className="relative">
                  <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    required
                    className="w-full border border-gray-200 bg-white py-3 pl-10 pr-3 text-sm outline-none transition focus:border-[#8c7650]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-xs font-medium">
                  Email Address *
                </label>

                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                    className="w-full border border-gray-200 bg-white py-3 pl-10 pr-3 text-sm outline-none transition focus:border-[#8c7650]"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="mb-3 block text-xs font-medium">
                Order Type *
              </label>

              <div className="grid grid-cols-2 gap-3">
                {["Single Order", "Bulk Order"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() =>
                      setForm((previous) => ({
                        ...previous,
                        orderType: type,
                      }))
                    }
                    className={`border px-4 py-4 text-sm transition ${
                      form.orderType === type
                        ? "border-black bg-black text-white"
                        : "border-gray-200 bg-white text-gray-600 hover:border-black"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium">
                Which Shoe Category Do You Need? *
              </label>

              <div className="relative">
                <FiShoppingBag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  className="w-full appearance-none border border-gray-200 bg-white py-3 pl-10 pr-10 text-sm outline-none focus:border-[#8c7650]"
                >
                  <option value="">Select Shoe Category</option>

                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium">
                Required Quantity *
              </label>

              <div className="relative">
                <FiPackage className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                  type="number"
                  name="quantity"
                  min="1"
                  step="1"
                  value={form.quantity}
                  onChange={handleChange}
                  required
                  placeholder="Enter required quantity"
                  className="w-full border border-gray-200 bg-white py-3 pl-10 pr-3 text-sm outline-none focus:border-[#8c7650]"
                />
              </div>

              <p className="mt-2 text-[11px] text-gray-400">
                Enter any quantity from 1 onwards.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-xs font-medium">
                Additional Requirements
              </label>

              <div className="relative">
                <FiMessageSquare className="absolute left-3 top-4 text-gray-400" />

                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows="5"
                  placeholder="Tell us about sizes, colors, designs or any other requirements..."
                  className="w-full resize-none border border-gray-200 bg-white py-3 pl-10 pr-3 text-sm outline-none focus:border-[#8c7650]"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            {success && (
              <p className="flex items-center gap-2 text-sm text-green-700">
                <FiCheckCircle />
                {success}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#191919] px-6 py-4 text-xs font-medium uppercase tracking-[0.18em] text-white transition hover:bg-[#8c7650] disabled:opacity-50"
            >
              {loading ? "Please Wait..." : "Submit Inquiry"}
            </button>

            <p className="text-center text-[11px] text-gray-400">
              Our team will review your inquiry and get back to you.
            </p>
          </form>
        </div>
      </section>
    </main>
  );
}
