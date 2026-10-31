
import {
  FiPhone,
  FiMail,
  FiClock,
  FiInstagram,
  FiFacebook,
  FiYoutube,
  FiArrowUpRight,
} from "react-icons/fi";

const informationLinks = [
  { name: "About Us", href: "/about" },
  { name: "Payment Options", href: "/payment-options" },
  { name: "Blogs", href: "/blogs" },
  { name: "Happy Customers", href: "/happy-customers" },
  { name: "Store Locator", href: "/store-locator" },
];

const helpLinks = [
  { name: "Return & Exchange", href: "/return-exchange" },
  { name: "Shoe Size Guide", href: "/size-guide" },
  { name: "Shipping Policy", href: "/shipping-policy" },
  { name: "Claim Policy", href: "/claim-policy" },
  { name: "Cancellation Policy", href: "/cancellation-policy" },
  { name: "Privacy Policy", href: "/privacy-policy" },
  { name: "Buy Now, Pay Later", href: "/buy-now" },
  { name: "FAQ's", href: "/faqs" },
];

export default function Footer() {
  const handleSubscribe = (e) => {
    e.preventDefault();

    const form = e.currentTarget;
    const email = form.elements.email.value.trim();

    if (!email) return;

    alert("Thank you for subscribing!");
    form.reset();
  };

  return (
    <footer
      className="border-t border-gray-200 bg-white text-gray-800"
      style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
    >
      <div className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 lg:px-10 lg:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.9fr_1.1fr] lg:gap-12">
          {/* Brand and Newsletter */}
          <div>
            <a
              href="/"
              className="inline-block text-[26px] font-bold tracking-tight text-black sm:text-[30px]"
            >
              The Shoe Spot
            </a>

            <p className="mt-4 max-w-sm text-sm leading-7 text-gray-600">
              THE SHOE SPOT in UK since 1998. Premium leather and everyday
              comfort — delivered across UK, the PAK and the Gulf.
            </p>

            <div className="mt-8">
              <h3 className="text-lg font-bold text-black">
                Stay a step ahead
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                New drops, restocks and member-only deals. No spam.
              </p>

              <form
                onSubmit={handleSubscribe}
                className="mt-4 flex max-w-md flex-col gap-2 sm:flex-row"
              >
                <input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  aria-label="Email address"
                  autoComplete="email"
                  required
                  className="min-w-0 flex-1 rounded border border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-black"
                />

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
                >
                  Sign up
                  <FiArrowUpRight size={16} aria-hidden="true" />
                </button>
              </form>
            </div>
          </div>

          {/* Information */}
          <div>
            <h3 className="mb-5 text-base font-bold text-black">
              Information
            </h3>

            <ul className="space-y-4">
              {informationLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-600 transition hover:text-black"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3 className="mb-5 text-base font-bold text-black">
              Help
            </h3>

            <ul className="space-y-4">
              {helpLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-gray-600 transition hover:text-black"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-5 text-base font-bold text-black">
              Get in touch
            </h3>

            <a
              href="https://api.whatsapp.com/send/?phone=123456&text=Hello&type=phone_number&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 rounded bg-gray-100 px-4 py-3 text-sm text-black transition hover:bg-gray-200"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12.04 2a9.85 9.85 0 0 0-8.5 14.83L2 22l5.34-1.4A9.94 9.94 0 1 0 12.04 2Zm0 18.15a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-3.17.83.85-3.09-.2-.32a8.15 8.15 0 1 1 7 3.9Zm4.48-6.11c-.25-.13-1.48-.73-1.71-.81-.23-.08-.4-.13-.57.13-.17.25-.65.81-.8.98-.15.17-.3.19-.55.06-.25-.12-1.06-.39-2.02-1.23-.75-.67-1.25-1.49-1.4-1.74-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.32-.02-.44-.06-.13-.57-1.37-.78-1.87-.2-.49-.41-.42-.57-.43h-.49c-.17 0-.44.06-.67.32-.23.25-.88.86-.88 2.1s.9 2.44 1.03 2.61c.12.17 1.77 2.7 4.28 3.78.6.26 1.07.42 1.43.53.6.19 1.15.16 1.58.1.48-.07 1.48-.61 1.69-1.2.21-.59.21-1.1.15-1.2-.06-.1-.23-.17-.48-.29Z" />
              </svg>
              Chat on WhatsApp
            </a>

            <div className="mt-6 space-y-4">
              <a
                href="tel:12345678"
                className="flex items-center gap-3 text-sm text-gray-600 transition hover:text-black"
              >
                <FiPhone size={17} className="shrink-0 text-black" />
                <span>12345678</span>
              </a>

              <a
                href="mailto:customercare@urbansole.com.pk"
                className="flex items-start gap-3 break-all text-sm text-gray-600 transition hover:text-black"
              >
                <FiMail size={17} className="mt-0.5 shrink-0 text-black" />
                <span>abc@thespot.com.uk</span>
              </a>

              <div className="flex items-center gap-3 text-sm text-gray-600">
                <FiClock size={17} className="shrink-0 text-black" />
                <span>Mon to Sat, 4:00 AM – 1:00 PM UK</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="mt-7 flex items-center gap-5 border-t border-gray-200 pt-6">
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-black transition hover:text-gray-500"
              >
                <FiInstagram size={23} />
              </a>

              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-black transition hover:text-gray-500"
              >
                <FiFacebook size={23} />
              </a>

              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="text-black transition hover:text-gray-500"
              >
                <FiYoutube size={24} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 border-t border-gray-200 pt-6 sm:mt-14">
          <div className="flex flex-col gap-3 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} Urbansole. All rights reserved.
            </p>

            <a href="/" className="transition hover:text-black">
              Crafted for everyday comfort.
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
