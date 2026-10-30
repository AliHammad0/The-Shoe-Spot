
import { useState } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiMinus, FiArrowUpRight } from "react-icons/fi";

const faqSections = [
  {
    title: "Orders & Payments",
    questions: [
      {
        question: "How can I place an order?",
        answer:
          "Browse our collection, select your favourite product, and follow the checkout instructions to place your order. Please provide accurate contact and delivery details.",
      },
      {
        question: "Which payment methods do you accept?",
        answer:
          "Cash on Delivery is available for eligible orders. Any additional payment methods will be displayed on our website when they become available.",
      },
      {
        question: "Can I cancel my order?",
        answer:
          "You may request cancellation before your order is processed. Once an order has been dispatched, cancellation may no longer be possible. Please review our Cancellation Policy for details.",
      },
      {
        question: "How do I know if my order is confirmed?",
        answer:
          "Please check your email, SMS, or phone for order confirmation. We may contact you to verify your order before dispatch.",
      },
    ],
  },
  {
    title: "Shipping & Delivery",
    questions: [
      {
        question: "How long does delivery take?",
        answer:
          "Orders are generally dispatched within 1–2 working days, with delivery typically taking 4–5 working days. Delivery times may vary depending on your location and courier service.",
      },
      {
        question: "How can I track my order?",
        answer:
          "When tracking information is available, it will be shared through the contact details provided with your order. You can use the tracking number on the relevant courier's website.",
      },
      {
        question: "Do you offer free delivery?",
        answer:
          "Delivery charges depend on the payment method and current shipping offer. Please check the Shipping Policy or the checkout page for the applicable charges.",
      },
    ],
  },
  {
    title: "Products & Claims",
    questions: [
      {
        question: "How do I choose the right size?",
        answer:
          "Check the available size options on the product page before ordering. If you need assistance, contact our support team before completing your purchase.",
      },
      {
        question: "What should I do if my product arrives damaged?",
        answer:
          "Contact our support team and explain the issue. Include your order details and clear photographs of the product so the claim can be reviewed under our Claim Policy.",
      },
      {
        question: "Can I claim a discounted product?",
        answer:
          "Products offered at a discount of 50% or more are not eligible for claims under our current Claim Policy. Please review the complete policy for other eligibility conditions.",
      },
    ],
  },
  {
    title: "Returns & Support",
    questions: [
      {
        question: "How can I contact customer support?",
        answer:
          "You can contact our support team on WhatsApp at 03460000128 for assistance with orders and product claims.",
      },
      {
        question: "Do you offer cash refunds?",
        answer:
          "Cash refunds are not provided under the current Claim Policy. Eligible major-defect claims may qualify for a voucher, subject to quality inspection and policy conditions.",
      },
    ],
  },
];

export default function FAQ() {
  const [openQuestion, setOpenQuestion] = useState("0-0");

  return (
    <main
      className="min-h-screen bg-white text-[#171717]"
      style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
    >
      {/* Breadcrumb */}
      <div className="mx-auto max-w-[1200px] px-4 pt-5 sm:px-7 lg:px-10">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Link to="/" className="hover:text-black">
            Home
          </Link>
          <span>/</span>
          <span className="text-black">FAQs</span>
        </div>
      </div>

      {/* Page Heading */}
      <section className="mx-auto max-w-[1200px] px-4 pb-10 pt-12 sm:px-7 sm:pb-14 sm:pt-16 lg:px-10">
        <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500 sm:text-xs">
          Need a little help?
        </p>

        <h1 className="text-4xl font-normal leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          Frequently asked
          <br />
          questions<span className="text-gray-400">.</span>
        </h1>

        <p className="mt-5 max-w-xl text-sm leading-7 text-gray-500 sm:text-base">
          Find answers to common questions about ordering, payments, delivery,
          and our product policies.
        </p>
      </section>

      {/* FAQ Content */}
      <section className="mx-auto max-w-[1200px] px-4 pb-16 sm:px-7 lg:px-10 lg:pb-24">
        <div className="grid gap-10 md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] lg:gap-16">
          {/* Sidebar */}
          <aside className="h-fit border-t border-black pt-5">
            <p className="text-xs font-semibold uppercase tracking-[0.15em]">
              On this page
            </p>

            <div className="mt-5 flex flex-wrap gap-2 md:flex-col">
              {faqSections.map((section, index) => (
                <a
                  key={section.title}
                  href={`#faq-section-${index}`}
                  className="border border-gray-200 px-3 py-2 text-xs text-gray-600 transition hover:border-black hover:text-black md:border-0 md:px-0 md:py-2"
                >
                  {section.title}
                </a>
              ))}
            </div>

            <div className="mt-8 hidden border-t border-gray-200 pt-5 md:block">
              <p className="text-sm font-medium">Still need help?</p>
              <p className="mt-2 text-xs leading-5 text-gray-500">
                Our support team can help with your questions.
              </p>

              <a
                href="https://wa.me/923460000128"
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-xs font-semibold hover:underline"
              >
                Contact support
                <FiArrowUpRight size={14} />
              </a>
            </div>
          </aside>

          {/* Questions */}
          <div className="min-w-0">
            {faqSections.map((section, sectionIndex) => (
              <div
                key={section.title}
                id={`faq-section-${sectionIndex}`}
                className="mb-10 scroll-mt-6 last:mb-0"
              >
                <div className="mb-2 border-b border-black pb-4">
                  <h2 className="text-xl font-medium sm:text-2xl">
                    {section.title}
                  </h2>
                </div>

                {section.questions.map((item, questionIndex) => {
                  const id = `${sectionIndex}-${questionIndex}`;
                  const isOpen = openQuestion === id;

                  return (
                    <div
                      key={item.question}
                      className="border-b border-gray-200"
                    >
                      <button
                        type="button"
                        aria-expanded={isOpen}
                        onClick={() =>
                          setOpenQuestion(isOpen ? null : id)
                        }
                        className="flex w-full items-center justify-between gap-4 py-5 text-left"
                      >
                        <span className="text-sm font-medium leading-6 sm:text-base">
                          {item.question}
                        </span>

                        <span className="flex h-7 w-7 shrink-0 items-center justify-center border border-gray-200">
                          {isOpen ? (
                            <FiMinus size={15} />
                          ) : (
                            <FiPlus size={15} />
                          )}
                        </span>
                      </button>

                      {isOpen && (
                        <div className="pb-5 pr-8 text-sm leading-7 text-gray-500">
                          {item.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Mobile Support */}
            <div className="mt-10 border-t border-black pt-6 md:hidden">
              <h2 className="text-lg font-medium">Still need help?</h2>
              <p className="mt-2 text-sm leading-6 text-gray-500">
                Get in touch with our support team.
              </p>

              <a
                href="https://wa.me/923460000128"
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold hover:underline"
              >
                Contact us on WhatsApp
                <FiArrowUpRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
