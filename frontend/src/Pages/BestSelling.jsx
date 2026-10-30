
import { useState } from "react";
import { Link } from "react-router-dom";
import { FiShoppingBag, FiCheck } from "react-icons/fi";

const products = [
  {
    id: 1,
    name: "Men's Sports Shoes US-EX-6302",
    category: "Sports Shoes",
    price: 6559,
    oldPrice: 8199,
    image:
      "https://www.urbansole.com.pk/cdn/shop/files/US-EX-6302_navy.jpg?v=1792387739&width=1200",
    slug: "/products/mens-sports-shoes-us-ex-6302-navy",
  },
  {
    id: 2,
    name: "Men's Slippers US-WV-6351",
    category: "Slippers",
    price: 5279,
    oldPrice: 6599,
    image:
      "https://www.urbansole.com.pk/cdn/shop/files/US-WV-6351_EXPRESSO_1.jpg?width=640",
    slug: "/products/mens-slippers-us-wv-6351-expresso",
  },
  {
    id: 3,
    name: "Men's Sandals US-SI-6203",
    category: "Sandals",
    price: 7199,
    oldPrice: 8999,
    image:
      "https://www.urbansole.com.pk/cdn/shop/files/Step_in_-_Men_s_Sandals_US-SI-6203_BLACK.jpg?v=1787900655&width=640",
    slug: "/products/mens-sandals-us-si-6203-black-grey",
  },
  {
    id: 4,
    name: "Men's Slider US-BT-6305",
    category: "Sliders",
    price: 3119,
    oldPrice: 3899,
    image:
      "https://www.urbansole.com.pk/cdn/shop/files/US-BT-6305_BURGUNDY_1.jpg?width=640",
    slug: "/products/mens-slider-us-bt-6305-burgundy",
  },
];

const formatPrice = (price) => `Rs.${price.toLocaleString("en-PK")}`;

export default function BestSelling() {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((previous) =>
      previous.includes(product.id)
        ? previous
        : [...previous, product.id]
    );
  };

  return (
    <main
      className="min-h-screen bg-white text-black"
      style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
    >
      {/* Breadcrumb */}
      <div className="mx-auto max-w-[1440px] px-4 pt-6 sm:px-7 lg:px-10">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Link to="/" className="hover:text-black">
            Home
          </Link>
          <span>/</span>
          <span className="text-black">Best sellers</span>
        </div>
      </div>

      {/* Heading */}
      <section className="mx-auto max-w-[1440px] px-4 pb-7 pt-10 sm:px-7 lg:px-10 lg:pb-10 lg:pt-14">
        <p className="mb-3 text-xs font-medium uppercase tracking-[0.18em] text-gray-500">
          Best sellers
        </p>

        <h1 className="text-3xl font-normal tracking-tight sm:text-4xl lg:text-[42px]">
          What England is wearing
        </h1>

        <p className="mt-4 text-sm text-gray-500">
          Customer favourites, selected for everyday comfort.
        </p>
      </section>

      {/* Products */}
      <section className="mx-auto max-w-[1440px] px-3 pb-16 sm:px-7 lg:px-10">
        <div className="grid grid-cols-2 gap-x-3 gap-y-9 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6">
          {products.map((product) => {
            const added = cart.includes(product.id);

            const discount = Math.round(
              ((product.oldPrice - product.price) / product.oldPrice) * 100
            );

            return (
              <article key={product.id} className="flex min-w-0 flex-col">
                {/* Image */}
                <Link
                  to={product.slug}
                  className="group relative block overflow-hidden bg-[#f7f7f7]"
                >
                  <div className="aspect-[4/5] overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <span className="absolute left-2 top-2 bg-white px-2 py-1 text-[9px] font-semibold tracking-wide sm:left-3 sm:top-3 sm:text-[10px]">
                    BEST SELLER
                  </span>

                  <span className="absolute right-2 top-2 bg-black px-2 py-1 text-[10px] text-white sm:right-3 sm:top-3">
                    -{discount}%
                  </span>
                </Link>

                {/* Product Details */}
                <div className="flex flex-1 flex-col pt-4">
                  <p className="text-[10px] text-gray-500 sm:text-xs">
                    {product.category}
                  </p>

                  <Link
                    to={product.slug}
                    className="mt-1 block text-xs leading-5 text-black hover:underline sm:text-sm"
                  >
                    {product.name}
                  </Link>

                  <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="text-xs font-semibold sm:text-sm">
                      {formatPrice(product.price)}
                    </span>

                    <span className="text-[11px] text-gray-400 line-through sm:text-xs">
                      {formatPrice(product.oldPrice)}
                    </span>
                  </div>

                  {/* Equal-height button */}
                  <button
                    type="button"
                    onClick={() => addToCart(product)}
                    className={`mt-auto flex h-10 w-full min-w-0 items-center justify-center gap-1 whitespace-nowrap border px-1.5 pt-0 text-[10px] font-medium transition sm:mt-4 sm:h-11 sm:gap-2 sm:px-3 sm:text-xs ${
                      added
                        ? "border-black bg-black text-white"
                        : "border-black bg-white text-black hover:bg-black hover:text-white"
                    }`}
                  >
                    {added ? (
                      <>
                        <FiCheck className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                        <span>Added to cart</span>
                      </>
                    ) : (
                      <>
                        <FiShoppingBag className="h-3.5 w-3.5 shrink-0 sm:h-4 sm:w-4" />
                        <span>Add to cart</span>
                      </>
                    )}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
