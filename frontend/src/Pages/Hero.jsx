
import { useEffect, useRef, useState } from "react";

const slides = [
  {
    id: 1,
    desktopImage:
      "https://www.urbansole.com.pk/cdn/shop/files/Premium_product_photography_of_a_202606120233.jpg?v=1781213634&width=1200",
    mobileImage:
      "https://www.urbansole.com.pk/cdn/shop/files/Premium_product_photography_of_a_202606120223_1.jpg?v=1781213053&width=800",
    alt: "The Shoe Spot collection",
    link: "/shop",
  },
  {
    id: 2,
    desktopImage:
      "https://www.urbansole.com.pk/cdn/shop/files/Premium_product_photography_of_a_202606120233.jpg?v=1781213634&width=1200",
    mobileImage:
      "https://www.urbansole.com.pk/cdn/shop/files/Premium_product_photography_of_a_202606120233.jpg?v=1781213634&width=800",
    alt: "Explore the latest collection",
    link: "/shop",
  },
];

export default function Hero() {
  const [activeSlide, setActiveSlide] = useState(0);
  const touchStartX = useRef(0);

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 767px)");

    if (!mobileQuery.matches) return;

    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 2000);

    return () => window.clearInterval(timer);
  }, []);

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = (event) => {
    const difference =
      touchStartX.current - event.changedTouches[0].clientX;

    if (Math.abs(difference) > 50) {
      setActiveSlide((current) =>
        difference > 0
          ? (current + 1) % slides.length
          : (current - 1 + slides.length) % slides.length
      );
    }
  };

  return (
    <section className="relative w-full overflow-hidden bg-white">
      {/* Desktop Hero */}
      <picture className="hidden w-full md:block">
        <img
          src={slides[0].desktopImage}
          alt={slides[0].alt}
          width="1200"
          height="800"
          sizes="100vw"
          fetchPriority="high"
          loading="eager"
          decoding="async"
          className="block aspect-[3/2] h-auto max-h-[850px] w-full object-cover"
        />
      </picture>

      {/* Mobile Hero Slider */}
      <div
        className="relative block w-full overflow-hidden md:hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="flex transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            transform: `translate3d(-${activeSlide * 100}%, 0, 0)`,
          }}
        >
          {slides.map((slide, index) => (
            <a
              key={slide.id}
              href={slide.link}
              className="block w-full flex-none"
              aria-label={slide.alt}
            >
              <img
                src={slide.mobileImage}
                alt={slide.alt}
                width="800"
                height="533"
                sizes="100vw"
                loading={index === 0 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "low"}
                decoding="async"
                draggable="false"
                className="block aspect-[3/2] h-auto w-full select-none object-cover"
              />
            </a>
          ))}
        </div>

        {/* Slider Indicators */}
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2.5 rounded-full bg-black/15 px-3 py-2 backdrop-blur-sm">
          {slides.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              onClick={() => setActiveSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={activeSlide === index ? "true" : undefined}
              className={`h-[3px] rounded-full transition-all duration-500 ${
                activeSlide === index
                  ? "w-8 bg-white"
                  : "w-3 bg-white/55 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
