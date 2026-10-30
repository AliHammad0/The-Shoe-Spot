import React from "react";
import { Clock, CreditCard, ShoppingBag, CalendarCheck } from "lucide-react";

const BuyNowPayLater = () => {
  return (
    <main className="min-h-screen bg-white px-5 py-14 font-[Arial,sans-serif] text-gray-800 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 border-b border-gray-200 pb-7">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
            Payment Services
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Buy Now, Pay Later
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
            Shop for your favourite products today and enjoy flexible payment
            options in the future.
          </p>
        </header>

        <section className="border border-gray-200 p-6 sm:p-10">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <CreditCard size={30} strokeWidth={1.5} />
          </div>

          <h2 className="mt-6 text-2xl font-bold text-gray-900 sm:text-3xl">
            Flexible Payments Are Coming Soon
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
            We're working to bring you convenient payment options that may
            allow you to shop now and pay later. This service is not available
            yet. Please check back for updates.
          </p>

          <div className="mt-8 inline-flex items-center gap-2 border border-gray-200 bg-gray-50 px-5 py-3">
            <Clock size={17} />
            <span className="text-xs font-semibold uppercase tracking-[0.15em]">
              Coming Soon
            </span>
          </div>
        </section>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="border border-gray-200 p-5">
            <ShoppingBag size={24} strokeWidth={1.5} />
            <h3 className="mt-4 font-bold text-gray-900">Shop Your Style</h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Explore products you love and find your perfect fit.
            </p>
          </div>

          <div className="border border-gray-200 p-5">
            <CreditCard size={24} strokeWidth={1.5} />
            <h3 className="mt-4 font-bold text-gray-900">
              Payment Flexibility
            </h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              We're exploring more convenient ways to pay.
            </p>
          </div>

          <div className="border border-gray-200 p-5">
            <CalendarCheck size={24} strokeWidth={1.5} />
            <h3 className="mt-4 font-bold text-gray-900">Stay Updated</h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">
              Visit us again to learn when this service becomes available.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
};

export default BuyNowPayLater;
