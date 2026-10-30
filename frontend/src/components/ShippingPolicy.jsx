import React from "react";

const ShippingPolicy = () => {
  return (
    <main className="min-h-screen bg-white px-5 py-14 font-[Arial,sans-serif] text-gray-800 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-4xl">
        <header className="mb-10 border-b border-gray-200 pb-7">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
            Customer Support
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Shipping Policy
          </h1>
          <p className="mt-4 text-sm leading-7 text-gray-600 sm:text-base">
            Information about delivery, order confirmation, shipping charges,
            and international orders.
          </p>
        </header>

        <section className="mb-10">
          <h2 className="mb-4 text-xl font-bold text-gray-900 sm:text-2xl">
            Delivery Within Pakistan
          </h2>

          <div className="space-y-4 text-sm leading-7 text-gray-600 sm:text-base">
            <p>
              All orders across Pakistan are shipped through trusted courier
              partners such as TCS, Leopards, Call Courier, and others. Once
              your order is dispatched, a tracking ID will be provided for
              real-time tracking.
            </p>

            <p>
              After placing an order, you will receive a confirmation call or
              SMS from our Customer Service team. If the order remains
              unverified, it will be automatically cancelled after 3 days.
              This applies only to Cash on Delivery orders.
            </p>

            <p>
              Once confirmed, your order will be processed and dispatched
              within <strong className="text-gray-900">1–2 working days</strong>{" "}
              and delivered within{" "}
              <strong className="text-gray-900">4–5 working days</strong>.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="border border-gray-200 p-5">
              <p className="text-sm text-gray-500">Prepaid Orders</p>
              <p className="mt-2 text-xl font-bold text-gray-900">
                Free Delivery
              </p>
            </div>

            <div className="border border-gray-200 p-5">
              <p className="text-sm text-gray-500">Cash on Delivery</p>
              <p className="mt-2 text-xl font-bold text-gray-900">
                PKR 200
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Standard delivery fee across Pakistan
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-gray-200 pt-8">
          <h2 className="mb-4 text-xl font-bold text-gray-900 sm:text-2xl">
            International Orders
          </h2>

          <div className="space-y-4 text-sm leading-7 text-gray-600 sm:text-base">
            <p>
              All international customers will be provided with a tracking ID
              when their order is dispatched. Customers will also receive a
              detailed sales invoice and shipping confirmation via email.
            </p>

            <div className="border-l-4 border-gray-900 bg-gray-50 p-5">
              <h3 className="mb-2 font-bold text-gray-900">Customs & Duties</h3>
              <p>
                Any customs duties, clearance fees, or additional charges
                incurred during international shipping are the responsibility
                of the customer.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ShippingPolicy;
