
import {
  FiArrowUpRight,
  FiCheck,
  FiHeart,
  FiShield,
  FiTruck,
} from "react-icons/fi";

const values = [
  {
    number: "01",
    title: "Quality first",
    description:
      "Footwear selected with attention to materials, finishing, and everyday comfort.",
    icon: FiCheck,
  },
  {
    number: "02",
    title: "Comfort in every step",
    description:
      "Versatile styles designed to complement your routine and personal taste.",
    icon: FiHeart,
  },
  {
    number: "03",
    title: "Shopping made simple",
    description:
      "Clear product details and a straightforward way to discover your next pair.",
    icon: FiShield,
  },
];

const storyImages = [
  {
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSAPcx-zQbeIjuPjS8iwGO-7HWIC_9I2gg3kSWMfCSZ4g&s=10",
    alt: "Modern everyday sneakers",
  },
  {
    src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4IljQhEmTYIEIRD0Y-4kMVfQtemkNhSsp38QULApC_A&s=10",
    alt: "Footwear with a timeless design",
  },
];

const imageLoadingProps = {
  loading: "lazy",
  decoding: "async",
};

export default function About() {
  return (
    <main
      className="overflow-hidden bg-white text-[#171717]"
      style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
    >
      {/* Hero */}
      <section className="grid min-h-[520px] bg-[#f5f4f0] md:min-h-[570px] md:grid-cols-2">
        <div className="flex items-center px-6 py-16 sm:px-10 md:px-12 lg:px-16 xl:px-24">
          <div className="mx-auto w-full max-w-xl">
            <p className="mb-6 text-[10px] font-semibold uppercase tracking-[3px] text-[#77746e]">
              About The Shoe Spot
            </p>

            <h1 className="text-[42px] font-medium leading-[1.08] tracking-[-2px] sm:text-5xl lg:text-[64px] lg:tracking-[-3px]">
              Find your style.
              <br />
              Walk your way.
            </h1>

            <p className="mt-6 max-w-md text-sm leading-7 text-[#65635f] sm:text-base sm:leading-8">
              The Shoe Spot brings together footwear for everyday life.
              Discover styles that match your personality, complement your
              wardrobe, and keep you moving with confidence.
            </p>

            <a
              href="/"
              className="mt-8 inline-flex min-h-12 items-center justify-center gap-5 bg-[#171717] px-6 py-4 text-[10px] font-semibold uppercase tracking-[1.5px] text-white transition-colors duration-300 hover:bg-[#454545]"
            >
              Explore collection
              <FiArrowUpRight size={17} />
            </a>
          </div>
        </div>

        <div className="relative min-h-[330px] overflow-hidden sm:min-h-[430px] md:min-h-full">
          <img
            src="https://seeandwears.com/cdn/shop/files/Gemini_Generated_Image_dq4jvjdq4jvjdq4j_1200x.png?v=1784187968"
            alt="Sneakers for modern everyday style"
            width="1200"
            height="800"
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-black/[0.03]" />

          <div className="absolute bottom-6 left-6 bg-white/90 px-4 py-3 backdrop-blur-sm sm:bottom-8 sm:left-8">
            <p className="text-[9px] font-semibold uppercase tracking-[2px] text-[#77746e]">
              The Shoe Spot
            </p>
            <p className="mt-1 text-sm font-medium">
              Made for your everyday.
            </p>
          </div>
        </div>
      </section>

      {/* Brand story */}
      <section className="px-6 py-20 sm:px-10 sm:py-24 lg:px-16 lg:py-32">
        <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-2 md:gap-16 lg:gap-24">
          <div className="max-w-lg">
            <p className="mb-6 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[2.5px] text-[#77746e]">
              Our approach
              <span className="h-px w-8 bg-[#c8c5be]" />
            </p>

            <h2 className="text-3xl font-medium leading-tight tracking-[-1.5px] sm:text-4xl lg:text-[50px]">
              More than what you wear.
            </h2>

            <p className="mt-6 text-sm leading-7 text-[#696761] sm:text-base sm:leading-8">
              The right pair can complete an outfit, express your personality,
              and become part of your everyday journey.
            </p>

            <p className="mt-4 text-sm leading-7 text-[#696761] sm:text-base sm:leading-8">
              From casual sneakers to formal footwear, sandals, and boots,
              our aim is to bring different styles together in one place.
              Find options that work with your wardrobe, your routine, and
              the way you choose to express yourself.
            </p>

            <a
              href="/"
              className="mt-8 inline-flex items-center gap-3 border-b border-[#171717] pb-2 text-[10px] font-semibold uppercase tracking-[1.5px] transition-colors hover:text-[#77746e]"
            >
              Discover the collection
              <FiArrowUpRight size={16} />
            </a>
          </div>

          <div className="grid grid-cols-[1.15fr_0.85fr] items-center gap-3 sm:gap-5">
            <div className="overflow-hidden bg-[#f2f0ec]">
              <img
                src={storyImages[0].src}
                alt={storyImages[0].alt}
                width="480"
                height="600"
                {...imageLoadingProps}
                className="aspect-[4/5] h-full w-full object-cover transition-transform duration-700 hover:scale-[1.04]"
              />
            </div>

            <div className="mt-12 overflow-hidden bg-[#f2f0ec] sm:mt-16">
              <img
                src={storyImages[1].src}
                alt={storyImages[1].alt}
                width="400"
                height="533"
                {...imageLoadingProps}
                className="aspect-[3/4] h-full w-full object-cover transition-transform duration-700 hover:scale-[1.04]"
              />

              <p className="bg-[#f5f4f0] px-3 py-4 text-xs leading-5 text-[#65635f] sm:px-5 sm:py-6">
                Thoughtful styles for the way you move.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-[#f6f5f2] px-6 py-20 sm:px-10 sm:py-24 lg:px-16 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-[0.85fr_1.15fr] md:items-end md:gap-12">
            <div>
              <p className="mb-5 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[2.5px] text-[#77746e]">
                What matters to us
                <span className="h-px w-8 bg-[#c8c5be]" />
              </p>

              <h2 className="max-w-md text-3xl font-medium leading-tight tracking-[-1.5px] sm:text-4xl lg:text-[46px]">
                The details make the difference.
              </h2>
            </div>

            <p className="max-w-lg text-sm leading-7 text-[#696761] sm:text-base sm:leading-8 md:justify-self-end">
              Our approach is simple: make discovering your next pair feel
              easy, thoughtful, and personal.
            </p>
          </div>

          <div className="mt-12 grid border-t border-[#dedbd4] sm:mt-16 md:grid-cols-3">
            {values.map((value) => {
              const Icon = value.icon;

              return (
                <article
                  key={value.number}
                  className="border-b border-[#dedbd4] py-8 sm:py-9 md:border-b-0 md:border-r md:px-7 md:first:pl-0 md:last:border-r-0 md:last:pr-0 lg:py-10 lg:pr-10"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-semibold tracking-[2px] text-[#77746e]">
                      {value.number}
                    </span>

                    <Icon size={21} strokeWidth={1.4} />
                  </div>

                  <h3 className="mt-8 text-lg font-medium tracking-[-0.3px] sm:text-xl">
                    {value.title}
                  </h3>

                  <p className="mt-3 max-w-xs text-sm leading-7 text-[#696761]">
                    {value.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Shopping experience */}
      <section className="px-6 py-20 sm:px-10 sm:py-24 lg:px-16 lg:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-[1.05fr_0.95fr] md:gap-16 lg:gap-24">
          <div className="overflow-hidden bg-[#f2f0ec]">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQlHuCDlz_WJvRTECR20mPV8P88ezngL47mYZL3QgOZtg&s=10"
              alt="Sport-inspired footwear"
              width="800"
              height="640"
              {...imageLoadingProps}
              className="aspect-[5/4] h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
            />
          </div>

          <div className="py-2">
            <p className="mb-5 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[2.5px] text-[#77746e]">
              Your shopping experience
              <span className="h-px w-8 bg-[#c8c5be]" />
            </p>

            <h2 className="max-w-lg text-3xl font-medium leading-tight tracking-[-1.5px] sm:text-4xl lg:text-[48px]">
              Find the pair that feels right.
            </h2>

            <p className="mt-6 max-w-lg text-sm leading-7 text-[#696761] sm:text-base sm:leading-8">
              Explore different designs, compare your options, and choose
              footwear that works for your day. From the first look to your
              final choice, discovering a pair that fits your style should
              feel straightforward.
            </p>

            <a
              href="/"
              className="mt-8 inline-flex items-center gap-3 border-b border-[#171717] pb-2 text-[10px] font-semibold uppercase tracking-[1.5px] transition-colors hover:text-[#77746e]"
            >
              Discover our footwear
              <FiArrowUpRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* Minimal call to action */}
      <section className="relative overflow-hidden bg-[#171717] px-6 py-20 text-white sm:px-10 sm:py-24 lg:px-16 lg:py-28">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[2.5px] text-white/55">
              Your next favourite pair
            </p>

            <h2 className="text-3xl font-medium leading-tight tracking-[-1.5px] sm:text-4xl lg:text-[54px]">
              Every step starts
              <br className="hidden sm:block" /> with a choice.
            </h2>

            <p className="mt-5 max-w-lg text-sm leading-7 text-white/65 sm:text-base">
              Explore the collection and find footwear that fits your
              everyday style.
            </p>
          </div>

          <a
            href="/"
            className="inline-flex min-h-12 shrink-0 items-center gap-5 bg-white px-6 py-4 text-[10px] font-semibold uppercase tracking-[1.5px] text-[#171717] transition-colors hover:bg-[#e8e6e1]"
          >
            Shop now
            <FiArrowUpRight size={17} />
          </a>
        </div>
      </section>

      {/* Service highlights */}
      <section className="border-b border-[#e9e7e2] bg-white px-6 py-8 sm:px-10 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-7 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-center gap-4">
            <FiTruck size={21} strokeWidth={1.4} />

            <div>
              <p className="text-xs font-medium">Delivery information</p>
              <p className="mt-1 text-xs text-[#77746e]">
                Check delivery details at checkout.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <FiShield size={21} strokeWidth={1.4} />

            <div>
              <p className="text-xs font-medium">Shop with confidence</p>
              <p className="mt-1 text-xs text-[#77746e]">
                Review product details before ordering.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <FiHeart size={21} strokeWidth={1.4} />

            <div>
              <p className="text-xs font-medium">Your style, your choice</p>
              <p className="mt-1 text-xs text-[#77746e]">
                Explore footwear for different occasions.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
