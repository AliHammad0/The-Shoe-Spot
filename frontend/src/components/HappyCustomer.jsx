import React from "react";
import { Clock, Heart } from "lucide-react";

const HappyCustomer = () => {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-white px-5 py-16 font-[Arial,sans-serif] sm:px-8">
      <div className="mx-auto w-full max-w-2xl text-center">
        <div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
          <Heart size={34} strokeWidth={1.5} className="text-gray-800" />
        </div>

        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
          Something Special Is Coming
        </p>

        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Happy Customers
        </h1>

        <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-gray-600 sm:text-base">
          We're working on this page to bring you customer experiences,
          feedback, and happy moments. Stay tuned!
        </p>

        <div className="mx-auto mt-8 inline-flex items-center gap-2 border border-gray-200 bg-gray-50 px-5 py-3">
          <Clock size={17} className="text-gray-600" />
          <span className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-700">
            Coming Soon
          </span>
        </div>
      </div>
    </main>
  );
};

export default HappyCustomer;
