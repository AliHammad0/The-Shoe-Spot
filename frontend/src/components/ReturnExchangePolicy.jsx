
import {
  FiArrowLeft,
  FiArrowUpRight,
  FiCheckCircle,
  FiClock,
  FiGlobe,
  FiMessageCircle,
  FiPackage,
  FiRefreshCw,
  FiShield,
  FiTruck,
} from "react-icons/fi";

const standardPolicy = [
  {
    number: "01",
    title: "15-day return and exchange window",
    description:
      "Unused products in the same condition as received are eligible for return or exchange within 15 days. Fragrances and shoe care accessories cannot be returned or exchanged once their seals have been broken.",
  },
  {
    number: "02",
    title: "Sale items",
    description:
      "Products purchased during sales with a discount of 50% or more are not eligible for return or exchange.",
  },
  {
    number: "03",
    title: "Size issues or change of mind",
    description:
      "If the size does not fit or you have changed your mind, contact our customer care team for assistance with the return or exchange process.",
  },
  {
    number: "04",
    title: "Get your return documents",
    description:
      "After you contact customer care, our team will provide a return label and an exchange/return form.",
  },
  {
    number: "05",
    title: "Pack and send your parcel",
    description:
      "Print the return label and exchange/return form. Pack the item securely and drop it off at the courier office advised by our team. Obtain a receipt on a copy of the shared label and send it to customer care on WhatsApp.",
  },
  {
    number: "06",
    title: "Inspection and voucher issuance",
    description:
      "Once your parcel reaches our warehouse, our team will inspect the product. If your claim is approved, you will receive a voucher for the amount paid, minus the Rs. 200 return shipping fee. For damaged products, return shipping charges will not be deducted from the voucher.",
  },
  {
    number: "07",
    title: "Exchanges at retail stores",
    description:
      "Only size exchanges may be available at our retail stores, subject to the desired size being in stock. Product exchanges other than size exchanges and voucher redemption are not available at retail stores.",
  },
  {
    number: "08",
    title: "Voucher value",
    description:
      "The voucher value is based on the price you paid when placing your order and can be used for a future online purchase.",
  },
  {
    number: "09",
    title: "No expiry date",
    description:
      "Vouchers do not have an expiration date and can be used at any time.",
  },
  {
    number: "10",
    title: "Full voucher redemption",
    description:
      "The full voucher amount must be used in a single purchase. Partial voucher usage is not permitted.",
  },
  {
    number: "11",
    title: "No cash refunds",
    description:
      "Cash refunds are not available for orders under this policy.",
  },
  {
    number: "12",
    title: "Voucher restrictions",
    description:
      "Vouchers cannot be combined with other promotional vouchers.",
  },
];

const internationalPolicy = [
  "International orders are not eligible for standard returns or exchanges.",
  "If you receive a damaged or incorrect item, contact customer care to request a credit note, discount, or refund.",
  "Take photos of the package before and after opening to help document any issue.",
  "Report damaged or incorrect items within 7 days of receiving the order. Claims reported after this period cannot be entertained.",
  "If you refuse to accept an order upon delivery, compensation, returns, and refunds will not be provided.",
  "All claims are investigated. Compensation may be denied where misuse or false claims are suspected.",
];

const steps = [
  {
    icon: FiMessageCircle,
    title: "Contact us",
    description:
      "Reach out to customer care about your size issue or return request.",
  },
  {
    icon: FiPackage,
    title: "Prepare your parcel",
    description:
      "Print the documents supplied by our team and pack the product securely.",
  },
  {
    icon: FiTruck,
    title: "Send it back",
    description:
      "Drop off the parcel at the courier office advised by customer care.",
  },
  {
    icon: FiShield,
    title: "Inspection and voucher",
    description:
      "After warehouse inspection and approval, your eligible voucher is issued.",
  },
];

export default function ReturnExchangePolicy() {
  return (
    <main
      className="min-h-screen bg-white text-[#171717]"
      style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
    >
      {/* Hero */}
      <section className="border-b border-[#eae8e3] bg-[#f6f5f2] px-5 py-14 sm:px-8 sm:py-20 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <a
            href="/"
            className="mb-12 inline-flex items-center gap-2 text-xs text-[#77746e] transition hover:text-black"
          >
            <FiArrowLeft size={15} />
            Back to home
          </a>

          <div className="grid items-end gap-10 md:grid-cols-[1.3fr_0.7fr] md:gap-16">
            <div>
              <p className="mb-5 text-[10px] font-semibold uppercase tracking-[3px] text-[#77746e]">
                Customer care / Policies
              </p>

              <h1 className="max-w-3xl text-4xl font-medium leading-[1.08] tracking-[-1.8px] sm:text-5xl lg:text-[68px] lg:tracking-[-3px]">
                Return & Exchange
                <span className="mt-1 block text-[#858178]">Policy</span>
              </h1>

              <p className="mt-6 max-w-xl text-sm leading-7 text-[#68665f] sm:text-base sm:leading-8">
                Need help with your order? Find out how our return and
                exchange process works, what qualifies, and what to expect
                before sending your parcel back.
              </p>
            </div>

            <div className="border-t border-[#d9d6ce] pt-6 md:justify-self-end md:border-l md:border-t-0 md:pl-8 md:pt-0">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white">
                  <FiRefreshCw size={19} />
                </div>
                <div>
                  <p className="text-2xl font-medium">15 days</p>
                  <p className="mt-1 text-xs text-[#77746e]">
                    Standard return window
                  </p>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white">
                  <FiClock size={19} />
                </div>
                <div>
                  <p className="text-2xl font-medium">10–15 days</p>
                  <p className="mt-1 text-xs text-[#77746e]">
                    Estimated processing time
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick information */}
      <section className="px-5 py-8 sm:px-8 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-3">
          <div className="flex items-start gap-4 border border-[#eae8e3] p-5 sm:p-6">
            <FiRefreshCw className="mt-1 shrink-0" size={20} />
            <div>
              <h2 className="text-sm font-semibold">Eligible products</h2>
              <p className="mt-2 text-xs leading-6 text-[#77746e]">
                Unused items in their original received condition, subject
                to the policy.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 border border-[#eae8e3] p-5 sm:p-6">
            <FiPackage className="mt-1 shrink-0" size={20} />
            <div>
              <h2 className="text-sm font-semibold">Online vouchers</h2>
              <p className="mt-2 text-xs leading-6 text-[#77746e]">
                Approved claims are settled through an eligible online
                shopping voucher, not a cash refund.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 border border-[#eae8e3] p-5 sm:p-6">
            <FiGlobe className="mt-1 shrink-0" size={20} />
            <div>
              <h2 className="text-sm font-semibold">International orders</h2>
              <p className="mt-2 text-xs leading-6 text-[#77746e]">
                Standard returns and exchanges are not available for
                international orders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Standard policy */}
      <section className="px-5 py-14 sm:px-8 sm:py-20 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-2xl sm:mb-14">
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[2.5px] text-[#77746e]">
              Please read carefully
            </p>
            <h2 className="text-3xl font-medium tracking-[-1.2px] sm:text-4xl">
              Return & exchange guidelines
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#77746e]">
              These guidelines explain eligibility, shipping deductions,
              vouchers, and the steps involved in processing your request.
            </p>
          </div>

          <div className="border-t border-[#e7e5df]">
            {standardPolicy.map((item) => (
              <article
                key={item.number}
                className="grid gap-3 border-b border-[#e7e5df] py-6 sm:grid-cols-[64px_0.75fr_1.25fr] sm:gap-6 sm:py-8"
              >
                <span className="text-xs font-medium tracking-[1px] text-[#99958c]">
                  {item.number}
                </span>

                <h3 className="text-base font-semibold leading-6 sm:text-[17px]">
                  {item.title}
                </h3>

                <p className="text-sm leading-7 text-[#696761]">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Return process */}
      <section className="bg-[#f6f5f2] px-5 py-16 sm:px-8 sm:py-20 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[2.5px] text-[#77746e]">
              How it works
            </p>
            <h2 className="text-3xl font-medium tracking-[-1.2px] sm:text-4xl">
              Four steps to get started.
            </h2>
            <p className="mt-4 text-sm leading-7 text-[#77746e]">
              Contact customer care before sending any parcel. Follow the
              instructions and use the documents supplied by our team.
            </p>
          </div>

          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:mt-14 lg:grid-cols-4 lg:gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <article
                  key={step.title}
                  className="border-t border-[#d9d6ce] pt-6"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs tracking-[1.5px] text-[#99958c]">
                      STEP 0{index + 1}
                    </span>
                    <Icon size={21} strokeWidth={1.4} />
                  </div>

                  <h3 className="mt-7 text-lg font-medium">{step.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#696761]">
                    {step.description}
                  </p>
                </article>
              );
            })}
          </div>

          <div className="mt-10 border border-[#e1ded6] bg-white p-5 sm:mt-14 sm:p-7">
            <div className="flex items-start gap-3">
              <FiCheckCircle className="mt-1 shrink-0" size={19} />
              <div>
                <h3 className="text-sm font-semibold">
                  Keep your courier receipt
                </h3>
                <p className="mt-2 text-sm leading-7 text-[#696761]">
                  Obtain receiving from the courier on a copy of the shared
                  return label and send a copy to customer care on WhatsApp
                  after dispatch.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* International orders */}
      <section className="px-5 py-16 sm:px-8 sm:py-20 lg:px-16 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-[0.75fr_1.25fr] md:gap-20">
          <div>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[2.5px] text-[#77746e]">
              International customers
            </p>

            <h2 className="text-3xl font-medium leading-tight tracking-[-1.2px] sm:text-4xl">
              International order policy
            </h2>

            <p className="mt-5 text-sm leading-7 text-[#696761]">
              International orders follow a separate policy. Please review
              these conditions before contacting customer care.
            </p>
          </div>

          <div className="border-t border-[#e7e5df]">
            {internationalPolicy.map((item, index) => (
              <div
                key={item}
                className="flex gap-4 border-b border-[#e7e5df] py-5"
              >
                <span className="mt-1 text-xs font-medium text-[#99958c]">
                  0{index + 1}
                </span>
                <p className="text-sm leading-7 text-[#696761]">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer support */}
      <section className="px-5 pb-16 sm:px-8 sm:pb-24 lg:px-16">
        <div className="mx-auto max-w-7xl bg-[#171717] px-6 py-10 text-white sm:px-10 sm:py-14 lg:px-16 lg:py-16">
          <div className="grid gap-8 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[2.5px] text-white/55">
                Need assistance?
              </p>

              <h2 className="text-3xl font-medium tracking-[-1px] sm:text-4xl">
                We're here to help.
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-white/65">
                Contact our customer care team for help with eligibility,
                return documents, or the status of your request.
              </p>

              <p className="mt-5 text-sm text-white/80">
                Customer care / WhatsApp
              </p>
              <p className="mt-2 text-xl font-medium tracking-wide">
                03460000128
              </p>
            </div>

            <a
              href="https://wa.me/923460000128"
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-12 items-center justify-center gap-3 bg-white px-6 py-4 text-xs font-semibold uppercase tracking-[1px] text-[#171717] transition hover:bg-[#e9e7e2]"
            >
              <FiMessageCircle size={17} />
              Contact on WhatsApp
              <FiArrowUpRight size={16} />
            </a>
          </div>
        </div>

        <p className="mx-auto mt-6 max-w-7xl text-xs leading-6 text-[#89867f]">
          Note: This policy applies to online customers only. The stated
          processing period is approximately 10–15 business days. Actual
          processing time may depend on parcel delivery, warehouse inspection,
          and claim approval.
        </p>
      </section>
    </main>
  );
}
