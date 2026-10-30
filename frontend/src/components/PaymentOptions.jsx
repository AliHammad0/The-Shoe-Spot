import React from "react";
import { Banknote, Clock } from "lucide-react";

const upcomingPayments = [
  {
    name: "JazzCash",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTr7IpAWxpKRdyVQGAPLmFYa67mqnL1orJPmo5bo4-f6g&s=10",
  },
  {
    name: "Easypaisa",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuhW5uXbNZSK3Qp8wlqQzLzxPMaDfrKXWMleTXONymeQ&s=10",
  },
  {
    name: "PayPal",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrXBos4Ws_kHUnwCxVYdWU5de9CMh9Rm0LSEilukOq9g&s=10",
  },
  {
    name: "Stripe",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHZBAT7H8rQl7Qc4r3afbg-YuXih0tZatI9PjbPdW8PQ&s=10",
  },
];

const PaymentOptions = () => {
  return (
    <main className="min-h-screen bg-white px-5 py-14 font-[Arial,sans-serif] text-gray-800 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-5xl">
        <header className="mb-10 border-b border-gray-200 pb-7">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
            Customer Support
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Payment Options
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
            Choose the most convenient payment method for your order. We aim
            to make your shopping experience simple and secure.
          </p>
        </header>

        <section className="border border-gray-200 p-6 sm:p-8">
          <p className="mb-7 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
            Available Payment Method
          </p>

          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gray-100">
              <Banknote size={30} strokeWidth={1.5} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 sm:text-xl">
                Cash on Delivery (COD)
              </h2>
              <p className="mt-1 text-sm text-gray-500 sm:text-base">
                Pay when your order arrives.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 border-l-4 border-gray-900 bg-gray-50 p-6 sm:p-8">
          <div className="flex items-start gap-3">
            <Clock className="mt-1 shrink-0 text-gray-700" size={23} />

            <div>
              <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">
                More Payment Options Coming Soon!
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-600 sm:text-base">
                We are working on adding JazzCash and Easypaisa for customers
                in Pakistan, along with PayPal and Stripe for international
                customers. These payment methods are not available yet.
              </p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {upcomingPayments.map((payment) => (
              <div
                key={payment.name}
                className="flex min-h-24 flex-col items-center justify-center gap-3 border border-gray-200 bg-white p-4"
              >
                <img
                  src={payment.image}
                  alt={`${payment.name} logo`}
                  className="h-9 max-w-full object-contain"
                  loading="lazy"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />

                <span className="text-sm font-semibold text-gray-800">
                  {payment.name}
                </span>

                <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                  Coming Soon
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default PaymentOptions;
