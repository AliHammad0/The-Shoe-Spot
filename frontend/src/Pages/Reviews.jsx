
import { useEffect, useRef, useState } from "react";
import { FiStar, FiArrowUpRight, FiCheckCircle } from "react-icons/fi";

const reviews = [
  {
    name: "Salman Azam",
    product: "Xceed Sonic Force 1 EX-SN-5201",
    time: "1 hour ago",
    title: "I love it",
    review: "Awesome 👍",
    initials: "SA",
  },
  {
    name: "Irfan Khan",
    product: "Men's Sliders US-BT-6304",
    time: "5 hours ago",
    title: "Good quality",
    review: "Good quality",
    initials: "IK",
  },
  {
    name: "Irfan Khan",
    product: "Men's Formal Shoes US-BY-6306",
    time: "5 hours ago",
    title: "Nice quality",
    review: "Nice quality",
    initials: "IK",
  },
  {
    name: "SIRAJ Bahadar",
    product: "Men's Casual Shoes US-RF-5102",
    time: "8 hours ago",
    title: "Comfortable wear",
    review: "It's always good to wear it",
    initials: "SB",
  },
  {
    name: "Shah Shb",
    product: "Men's Boots TR-1103",
    time: "13 hours ago",
    title: "Comfort matters",
    review: "Inner lining should be leather. Inner sole is comfortable.",
    initials: "SS",
  },
  {
    name: "shafiq noonari",
    product: "Men's Sandal US-PY-5101",
    time: "19 hours ago",
    title: "Recommended",
    review: "Recommended first choice",
    initials: "SN",
  },
  {
    name: "shafiq noonari",
    product: "Men's Moccasins US-TE-4302",
    time: "19 hours ago",
    title: "Very comfortable",
    review: "Comfortable",
    initials: "SN",
  },
  {
    name: "Azam Mirza",
    product: "Men's Casual Shoes US-MD-5105",
    time: "Yesterday",
    title: "Excellent",
    review: "Very comfortable",
    initials: "AM",
  },
  {
    name: "zakir iqbal",
    product: "Men's Casual Shoes US-RC-5103",
    time: "2 days ago",
    title: "Best choice",
    review: "Best and comfortable",
    initials: "ZI",
  },
];

function Stars() {
  return (
    <span
      className="flex items-center gap-1"
      role="img"
      aria-label="5 out of 5 stars"
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <FiStar
          key={star}
          aria-hidden="true"
          className="fill-[#C6A66B] text-[#C6A66B]"
          size={13}
        />
      ))}
    </span>
  );
}

function ReviewCard({ review }) {
  return (
    <article className="group flex h-full min-h-[265px] flex-col rounded-2xl border border-[#e9e5df] bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#c6a66b]/60 hover:shadow-[0_18px_45px_rgba(30,25,18,0.07)] sm:p-6">
      <div className="mb-6 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            aria-hidden="true"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f2eee7] text-xs font-bold tracking-wide text-[#65533a]"
          >
            {review.initials}
          </div>

          <div>
            <p className="text-sm font-semibold text-[#191919]">
              {review.name}
            </p>
            <p className="mt-1 text-xs text-[#92908b]">{review.time}</p>
          </div>
        </div>

        <span
          aria-hidden="true"
          className="rounded-full border border-[#e8e4dc] p-2 text-[#a08a64] transition-colors group-hover:bg-[#f7f3ec]"
        >
          <FiArrowUpRight size={15} />
        </span>
      </div>

      <Stars />

      <h3 className="mt-4 text-[17px] font-semibold tracking-[-0.3px] text-[#202020]">
        {review.title}
      </h3>

      <p className="mt-2 flex-1 text-sm leading-7 text-[#66645f]">
        “{review.review}”
      </p>

      <div className="mt-6 border-t border-[#efede8] pt-4">
        <p className="line-clamp-1 text-[11px] font-medium uppercase tracking-[1.2px] text-[#92908b]">
          {review.product}
        </p>
      </div>
    </article>
  );
}

export default function Reviews() {
  const sliderRef = useRef(null);
  const timerRef = useRef(null);
  const activeIndexRef = useRef(0);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToReview = (index) => {
    const slider = sliderRef.current;
    const card = slider?.children[index];

    if (!slider || !card) return;

    const left =
      card.getBoundingClientRect().left -
      slider.getBoundingClientRect().left +
      slider.scrollLeft;

    slider.scrollTo({ left, behavior: "smooth" });
    activeIndexRef.current = index;
    setActiveIndex(index);
  };

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    const updateActiveIndex = () => {
      const children = Array.from(slider.children);
      const sliderLeft = slider.getBoundingClientRect().left;

      let closestIndex = 0;
      let closestDistance = Infinity;

      children.forEach((child, index) => {
        const distance = Math.abs(
          child.getBoundingClientRect().left - sliderLeft
        );

        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      activeIndexRef.current = closestIndex;
      setActiveIndex(closestIndex);
    };

    slider.addEventListener("scroll", updateActiveIndex, {
      passive: true,
    });

    return () => {
      slider.removeEventListener("scroll", updateActiveIndex);
    };
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");

    const startSlider = () => {
      window.clearInterval(timerRef.current);

      if (!mediaQuery.matches) return;

      timerRef.current = window.setInterval(() => {
        const nextIndex = (activeIndexRef.current + 1) % reviews.length;
        scrollToReview(nextIndex);
      }, 3500);
    };

    startSlider();
    mediaQuery.addEventListener("change", startSlider);

    return () => {
      window.clearInterval(timerRef.current);
      mediaQuery.removeEventListener("change", startSlider);
    };
  }, []);

  return (
    <section
      aria-labelledby="customer-reviews-heading"
      className="min-h-screen bg-[#faf9f6] px-4 py-14 text-[#191919] sm:px-6 sm:py-20 lg:px-10 lg:py-24"
      style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
    >
      <div className="mx-auto max-w-7xl">
        <h2 id="customer-reviews-heading" className="sr-only">
          Customer Reviews
        </h2>

        <div className="mb-10 flex flex-col gap-7 border-b border-[#e8e4dc] pb-9 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-5 flex items-center gap-2">
              <span
                aria-hidden="true"
                className="h-px w-8 bg-[#b49a6a]"
              />
              <span className="text-[10px] font-bold uppercase tracking-[3px] text-[#8b7755]">
                Customer stories
              </span>
            </div>

            <p className="max-w-lg text-sm leading-7 text-[#77746e] sm:text-base">
              Honest feedback from customers sharing their experience with
              their footwear.
            </p>
          </div>

          <div className="flex items-center gap-4 self-start rounded-2xl border border-[#e8e4dc] bg-white px-5 py-4 sm:self-auto">
            <div>
              <p className="text-3xl font-bold tracking-tight">09</p>
              <p className="mt-1 text-[10px] uppercase tracking-[1.5px] text-[#88847d]">
                Customer reviews
              </p>
            </div>

            <div
              aria-hidden="true"
              className="h-10 w-px bg-[#e8e4dc]"
            />

            <div>
              <FiCheckCircle
                aria-hidden="true"
                className="mb-2 text-[#a08a64]"
                size={19}
              />
              <p className="text-xs font-semibold text-[#4b493f]">
                Real feedback
              </p>
            </div>
          </div>
        </div>

        <div
          ref={sliderRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 scroll-smooth sm:gap-5 md:grid md:grid-cols-2 md:overflow-visible md:pb-0 lg:grid-cols-3 [&::-webkit-scrollbar]:hidden"
          style={{
            scrollbarWidth: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {reviews.map((review, index) => (
            <div
              key={`${review.name}-${review.product}-${index}`}
              className="w-[88%] shrink-0 snap-start sm:w-[55%] md:w-auto"
            >
              <ReviewCard review={review} />
            </div>
          ))}
        </div>

        <div className="mt-5 flex items-center justify-between md:hidden">
          <p className="text-xs tracking-wide text-[#89857e]">
            Swipe to explore reviews
          </p>

          <div className="flex items-center gap-1.5">
            {reviews.map((review, index) => (
              <button
                key={`${review.product}-dot`}
                type="button"
                onClick={() => scrollToReview(index)}
                aria-label={`Go to review ${index + 1}`}
                aria-current={activeIndex === index ? "true" : undefined}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeIndex === index
                    ? "w-7 bg-[#9b825a]"
                    : "w-1.5 bg-[#d8d3ca]"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="mt-12 hidden items-center justify-between border-t border-[#e8e4dc] pt-6 md:flex">
          <p className="text-xs text-[#8a867e]">
            Thoughtful details. Everyday comfort.
          </p>
          <p className="text-[10px] font-semibold uppercase tracking-[2px] text-[#8b7755]">
            Customer feedback
          </p>
        </div>
      </div>
    </section>
  );
}
