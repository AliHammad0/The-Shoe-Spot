
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Clock3, CalendarDays } from "lucide-react";

const blogPosts = [
  {
    id: 1,
    category: "SHOES GUIDE",
    title: "How to Choose the Right Shoes for Everyday Wear",
    description:
      "Learn how to choose comfortable, versatile shoes that work with your everyday outfits and routine.",
    date: "October 20, 2026",
    readTime: "5 min read",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=85",
    slug: "choose-the-right-shoes",
  },
  {
    id: 2,
    category: "STYLE",
    title: "Simple Ways to Upgrade Your Everyday Style",
    description:
      "Build better everyday outfits with practical footwear choices, balanced colours and timeless essentials.",
    date: "October 15, 2026",
    readTime: "4 min read",
    image:
      "https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=1000&q=85",
    slug: "upgrade-everyday-style",
  },
  {
    id: 3,
    category: "SHOE CARE",
    title: "How to Keep Your Shoes Clean and Looking New",
    description:
      "Simple shoe-care habits to help protect your footwear and keep it looking its best for longer.",
    date: "October 10, 2026",
    readTime: "6 min read",
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=85",
    slug: "how-to-care-for-shoes",
  },
  {
    id: 4,
    category: "MEN'S FASHION",
    title: "Everyday Footwear Essentials for Men",
    description:
      "From casual sneakers to comfortable sandals, discover footwear options for different occasions.",
    date: "October 5, 2026",
    readTime: "5 min read",
    image:
      "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1000&q=85",
    slug: "mens-footwear-essentials",
  },
  {
    id: 5,
    category: "BUYING GUIDE",
    title: "Finding a Comfortable Fit: A Simple Shoe Guide",
    description:
      "Understand shoe sizing, toe space and fit so you can make a more confident footwear choice.",
    date: "September 28, 2026",
    readTime: "4 min read",
    image:
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1000&q=85",
    slug: "comfortable-shoe-fit-guide",
  },
  {
    id: 6,
    category: "STYLE",
    title: "Choosing Footwear for Different Occasions",
    description:
      "Explore how to match your footwear with casual outings, daily activities and special occasions.",
    date: "September 20, 2026",
    readTime: "5 min read",
    image:
      "https://images.unsplash.com/photo-1514989940723-e8e51635b782?auto=format&fit=crop&w=1000&q=85",
    slug: "footwear-for-every-occasion",
  },
];

const categories = [
  "ALL",
  "SHOES GUIDE",
  "STYLE",
  "SHOE CARE",
  "MEN'S FASHION",
  "BUYING GUIDE",
];

function BlogCard({ post }) {
  return (
    <article className="group flex h-full flex-col">
      <Link
        to={`/blog/${post.slug}`}
        aria-label={`Read ${post.title}`}
        className="relative mb-5 block aspect-[4/3] overflow-hidden bg-gray-100"
      >
        <img
          src={post.image}
          alt={post.title}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />

        <span className="absolute left-4 top-4 bg-white px-3 py-2 text-[10px] font-semibold tracking-[0.12em]">
          {post.category}
        </span>
      </Link>

      <div className="flex flex-1 flex-col">
        <div className="mb-3 flex flex-wrap items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <CalendarDays size={14} />
            {post.date}
          </span>

          <span className="flex items-center gap-1.5">
            <Clock3 size={14} />
            {post.readTime}
          </span>
        </div>

        <Link to={`/blog/${post.slug}`}>
          <h2 className="text-xl font-semibold leading-snug transition group-hover:text-gray-500">
            {post.title}
          </h2>
        </Link>

        <p className="mt-3 flex-1 text-sm leading-6 text-gray-600">
          {post.description}
        </p>

        <Link
          to={`/blog/${post.slug}`}
          className="mt-5 inline-flex w-fit border-b border-black pb-1 text-xs font-semibold uppercase tracking-wider"
        >
          Read Article
        </Link>
      </div>
    </article>
  );
}

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [search, setSearch] = useState("");

  const filteredPosts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return blogPosts.filter((post) => {
      const matchesCategory =
        activeCategory === "ALL" || post.category === activeCategory;

      const matchesSearch =
        !query ||
        post.title.toLowerCase().includes(query) ||
        post.description.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, search]);

  const featuredPost = blogPosts[0];

  return (
    <main className="min-h-screen bg-white text-[#171717]">
      <section className="border-b border-gray-200">
        <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.25em] text-gray-500">
            The Soleora Journal
          </p>

          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Stories, style
                <br />
                and better footwear.
              </h1>

              <p className="mt-5 max-w-xl text-sm leading-7 text-gray-600 sm:text-base">
                Explore footwear guides, styling ideas and practical tips to
                help you make the most of every step.
              </p>
            </div>

            <a
              href="#latest-articles"
              className="inline-flex w-fit border-b border-black pb-2 text-sm font-medium"
            >
              Explore articles
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
        <Link
          to={`/blog/${featuredPost.slug}`}
          className="group grid overflow-hidden bg-[#f5f4f1] md:grid-cols-2"
        >
          <div className="order-2 flex flex-col justify-center p-6 sm:p-10 lg:p-14">
            <span className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
              Featured Article
            </span>

            <h2 className="max-w-lg text-3xl font-semibold leading-tight sm:text-4xl">
              {featuredPost.title}
            </h2>

            <p className="mt-4 max-w-lg text-sm leading-7 text-gray-600">
              {featuredPost.description}
            </p>

            <span className="mt-7 inline-flex w-fit border-b border-black pb-2 text-sm font-semibold">
              Read the story
            </span>
          </div>

          <div className="order-1 min-h-[260px] overflow-hidden sm:min-h-[350px] md:order-2">
            <img
              src={featuredPost.image}
              alt={featuredPost.title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          </div>
        </Link>
      </section>

      <section
        id="latest-articles"
        className="mx-auto max-w-[1440px] px-5 pb-16 sm:px-8 lg:px-12 lg:pb-24"
      >
        <div className="mb-8 flex flex-col justify-between gap-5 border-b border-gray-200 pb-6 lg:flex-row lg:items-end">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
              Discover more
            </p>

            <h2 className="text-3xl font-semibold tracking-tight">
              Latest Articles
            </h2>
          </div>

          <div className="flex w-full items-center gap-3 border-b border-gray-300 pb-3 lg:max-w-xs">
            <Search size={18} className="shrink-0 text-gray-500" />

            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles..."
              aria-label="Search blog articles"
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>
        </div>

        <div className="mb-9 flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`shrink-0 border px-4 py-3 text-[10px] font-semibold tracking-[0.1em] transition ${
                activeCategory === category
                  ? "border-black bg-black text-white"
                  : "border-gray-200 bg-white text-gray-600 hover:border-black hover:text-black"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-14">
            {filteredPosts.map((post) => (
              <BlogCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <h3 className="text-xl font-semibold">No articles found</h3>

            <p className="mt-2 text-sm text-gray-500">
              Try another search or choose a different category.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setActiveCategory("ALL");
              }}
              className="mt-5 border border-black px-5 py-3 text-sm font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </section>
    </main>
  );
}
