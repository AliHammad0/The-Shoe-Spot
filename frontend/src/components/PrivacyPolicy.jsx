
import { Link } from "react-router-dom";
import { FiArrowUpRight } from "react-icons/fi";

const policySections = [
  {
    id: "information",
    number: "01",
    title: "Information We Collect",
    content:
      "When you place an order or contact us, we may collect information such as your name, phone number, email address, delivery address, and order details. We may also collect technical information related to your use of our website, such as browser type and basic usage data, where applicable.",
  },
  {
    id: "usage",
    number: "02",
    title: "How We Use Your Information",
    content:
      "We use your information to process and deliver orders, verify order details, provide customer support, handle product claims, communicate important updates, and improve our website and services. We only use personal information for purposes that are relevant to our business and permitted by applicable law.",
  },
  {
    id: "orders",
    number: "03",
    title: "Orders & Delivery Partners",
    content:
      "To fulfil your order, relevant information may be shared with courier companies and service providers involved in payment processing, delivery, order verification, or customer support. These parties receive information needed to perform their services.",
  },
  {
    id: "cookies",
    number: "04",
    title: "Cookies & Website Data",
    content:
      "Our website or its service providers may use cookies and similar technologies to support website functionality, remember preferences, understand site usage, and improve your shopping experience. You can manage cookies through your browser settings, although disabling some cookies may affect website functionality.",
  },
  {
    id: "security",
    number: "05",
    title: "Data Protection & Security",
    content:
      "We take reasonable measures to protect personal information against unauthorised access, misuse, loss, or disclosure. However, no website or method of electronic transmission can be guaranteed to be completely secure.",
  },
  {
    id: "retention",
    number: "06",
    title: "How Long We Keep Information",
    content:
      "We retain information for as long as reasonably necessary to fulfil orders, provide support, maintain business records, resolve disputes, and meet applicable legal obligations. Retention periods depend on the type of information and the reason it was collected.",
  },
  {
    id: "rights",
    number: "07",
    title: "Your Choices & Rights",
    content:
      "You may contact us to ask about the personal information you have provided, request correction of inaccurate details, or ask questions about its use. Requests will be handled subject to identity verification and applicable legal requirements.",
  },
  {
    id: "third-party",
    number: "08",
    title: "Third-Party Websites",
    content:
      "Our website may contain links to external websites, including courier services and other providers. We do not control their privacy practices. Please review the privacy policies of those websites before sharing information with them.",
  },
  {
    id: "children",
    number: "09",
    title: "Children's Privacy",
    content:
      "Our website is intended for general shoppers and is not designed to knowingly collect personal information from children without appropriate authorisation where required by law. If you believe a child has provided personal information inappropriately, please contact us.",
  },
  {
    id: "changes",
    number: "10",
    title: "Changes to This Policy",
    content:
      "We may update this Privacy Policy when our practices or legal requirements change. The latest version will be published on this page. Please review this page periodically to stay informed about how we handle personal information.",
  },
];

export default function PrivacyPolicy() {
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
          <span className="text-black">Privacy Policy</span>
        </div>
      </div>

      {/* Header */}
      <section className="mx-auto max-w-[1200px] px-4 pb-10 pt-12 sm:px-7 sm:pb-14 sm:pt-16 lg:px-10">
        <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-gray-500 sm:text-xs">
          Your privacy matters
        </p>

        <h1 className="text-2xl font-normal leading-tight tracking-tight sm:text-3xl lg:text-6xl">
          Privacy
          <br />
          Policy<span className="text-gray-400">.</span>
        </h1>

        <p className="mt-5 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base">
          This policy explains how we collect, use, and protect your
          information when you browse our website or shop with us.
        </p>

        <p className="mt-4 text-xs text-gray-400">
          Last updated: October 2026
        </p>
      </section>

      {/* Policy Content */}
      <section className="mx-auto max-w-[1200px] px-4 pb-16 sm:px-7 lg:px-10 lg:pb-24">
        <div className="grid gap-10 md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] lg:gap-16">
          {/* Contents */}
          <aside className="h-fit border-t border-black pt-5">
            <p className="text-xs font-semibold uppercase tracking-[0.15em]">
              Contents
            </p>

            <nav className="mt-4 flex flex-wrap gap-x-4 gap-y-3 md:flex-col md:gap-0">
              {policySections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="flex items-center gap-2 py-1 text-xs text-gray-500 transition hover:text-black md:py-2"
                >
                  <span className="text-[10px] text-gray-400">
                    {section.number}
                  </span>
                  <span>{section.title}</span>
                </a>
              ))}
            </nav>
          </aside>

          {/* Policy Sections */}
          <div className="min-w-0">
            <div className="mb-8 border-b border-gray-200 pb-7">
              <h2 className="text-xl font-medium sm:text-2xl">
                Our commitment to your privacy
              </h2>
              <p className="mt-3 text-sm leading-7 text-gray-500">
                We respect your privacy and aim to handle your personal
                information responsibly. By using our website, you acknowledge
                the practices described in this policy, subject to applicable
                law.
              </p>
            </div>

            {policySections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="grid scroll-mt-6 gap-3 border-b border-gray-200 py-6 sm:grid-cols-[48px_1fr] sm:gap-5 sm:py-8"
              >
                <span className="text-xs text-gray-400">
                  {section.number}
                </span>

                <div>
                  <h2 className="text-lg font-medium sm:text-xl">
                    {section.title}
                  </h2>

                  <p className="mt-3 text-sm leading-7 text-gray-500">
                    {section.content}
                  </p>
                </div>
              </section>
            ))}

            {/* Contact */}
            <div className="mt-10 bg-[#f6f6f4] p-5 sm:mt-12 sm:p-8">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-500">
                Privacy questions
              </p>

              <h2 className="mt-3 text-xl font-medium sm:text-2xl">
                Need more information?
              </h2>

              <p className="mt-3 text-sm leading-7 text-gray-500">
                If you have questions about this policy or how your
                information is handled, contact our support team.
              </p>

              <a
                href="https://wa.me/923460000128"
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center gap-2 border-b border-black pb-2 text-xs font-semibold uppercase tracking-[0.1em]"
              >
                Contact support
                <FiArrowUpRight size={15} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
