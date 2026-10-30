import React from "react";

const CancellationPolicy = () => {
  return (
    <main className="min-h-screen bg-white px-5 py-14 font-[Arial,sans-serif] text-gray-800 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-4xl">
        <header className="mb-10 border-b border-gray-200 pb-7">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
            Customer Support
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Cancellation Policy
          </h1>

          <p className="mt-4 text-sm leading-7 text-gray-600 sm:text-base">
            Please review our order cancellation terms before requesting a
            cancellation.
          </p>
        </header>

        <section className="mb-8">
          <h2 className="mb-4 text-xl font-bold text-gray-900 sm:text-2xl">
            Order Cancellation
          </h2>

          <div className="space-y-5 text-sm leading-7 text-gray-600 sm:text-base">
            <p>
              You may cancel your order at any time before the order has been
              processed.
            </p>

            <p>
              Once your order has been shipped, you will receive a shipping
              confirmation via email containing your tracking information.
              After the product has been shipped, our exchange policy will
              apply.
            </p>

            <p>
              The company reserves the right to cancel orders for reasons
              including, but not limited to, the item being out of stock,
              pricing errors, or credit card payments being declined by the
              issuing financial institution.
            </p>
          </div>
        </section>

        <section className="border-l-4 border-gray-900 bg-gray-50 p-5 sm:p-6">
          <h2 className="mb-3 text-lg font-bold text-gray-900">
            Important Note
          </h2>

          <p className="text-sm leading-7 text-gray-600 sm:text-base">
            The company's decision regarding order cancellations will be
            considered final in all scenarios.
          </p>
        </section>
      </div>
    </main>
  );
};

export default CancellationPolicy;
