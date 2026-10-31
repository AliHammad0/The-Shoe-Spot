
import { Link } from "react-router-dom";

const shoeCategories = [
  {
    name: "Sneakers",
    path: "/category/sneakers",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Formal Shoes",
    path: "/category/formal-shoes",
    image:
      "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Loafers",
    path: "/category/loafers",
    image:
      "https://images.unsplash.com/photo-1531310197839-ccf54634509e?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Boots",
    path: "/category/boots",
    image:
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Casual Shoes",
    path: "/category/casual-shoes",
    image:
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=900&q=85",
  },
  {
    name: "Sandals",
    path: "/category/sandals",
    image:
      "https://images.unsplash.com/photo-1603487742131-4160ec999306?auto=format&fit=crop&w=900&q=85",
  },
];

export default function Category() {
  return (
    <section
      className="w-full overflow-hidden bg-white px-4 py-10 sm:px-8 sm:py-12 lg:px-10 lg:py-16"
      style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
    >
      <style>
        {`
          @keyframes categoryRunningSlider {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(-50%);
            }
          }

          .category-running-track {
            animation: categoryRunningSlider 28s linear infinite;
            width: max-content;
          }

          .category-running-slider:hover .category-running-track {
            animation-play-state: paused;
          }

          @media (prefers-reduced-motion: reduce) {
            .category-running-track {
              animation: none;
            }
          }
        `}
      </style>

      {/* Heading */}
      <div className="mb-8 flex items-end justify-between gap-3 sm:mb-10">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#111111] sm:text-4xl lg:text-5xl">
            Shop by category
          </h1>

          <div className="mt-4 h-[4px] w-16 bg-[#2374ce]" />
        </div>

        <Link
          to="/shop"
          className="mb-1 shrink-0 text-xs font-semibold tracking-wide text-[#2374ce] transition-colors hover:text-black sm:text-base"
        >
          View all styles
        </Link>
      </div>

      {/* Mobile Continuous Slider */}
      <div className="category-running-slider w-full overflow-hidden md:hidden">
        <div className="category-running-track flex">
          {[0, 1].map((group) => (
            <div
              key={group}
              className="flex shrink-0 gap-3 pr-3"
              aria-hidden={group === 1}
            >
              {shoeCategories.map((category) => (
                <Link
                  key={`${group}-${category.path}`}
                  to={category.path}
                  tabIndex={group === 1 ? -1 : 0}
                  className="group relative aspect-[0.82/1] w-[calc(100vw-32px)] max-w-[360px] shrink-0 overflow-hidden rounded-[17px] bg-[#071326] shadow-[0_8px_20px_rgba(0,0,0,0.07)]"
                >
                  <img
                    src={category.image}
                    alt=""
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-[#071a33]/95 via-[#071a33]/10 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <h2 className="text-xl font-bold tracking-wide text-white">
                      {category.name}
                    </h2>

                    <div className="mt-3 h-[2px] w-0 bg-white transition-all duration-500 group-hover:w-12" />
                  </div>
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Grid */}
      <div className="hidden grid-cols-2 gap-5 md:grid lg:grid-cols-4 lg:gap-6">
        {shoeCategories.map((category) => (
          <Link
            key={category.path}
            to={category.path}
            className="group relative block aspect-[0.82/1] overflow-hidden rounded-[17px] bg-[#071326] shadow-[0_8px_20px_rgba(0,0,0,0.07)]"
          >
            <img
              src={category.image}
              alt={category.name}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#071a33]/95 via-[#071a33]/10 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
              <h2 className="text-xl font-bold tracking-wide text-white sm:text-2xl">
                {category.name}
              </h2>

              <div className="mt-3 h-[2px] w-0 bg-white transition-all duration-500 group-hover:w-12" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
