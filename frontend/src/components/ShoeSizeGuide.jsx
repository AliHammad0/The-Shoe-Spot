
import { useState } from "react";
import {
  FiArrowLeft,
  FiCheck,
  FiActivity,
} from "react-icons/fi";

const sizes = [
  { local: 39, euro: 39, us: 6, uk: 5, cm: "24.1 - 24.7", inch: "9.5 - 9.7" },
  { local: 40, euro: 40, us: 7, uk: 6, cm: "24.8 - 25.4", inch: "9.8 - 10.0" },
  { local: 41, euro: 41, us: 8, uk: 7, cm: "25.5 - 26.0", inch: "10.0 - 10.2" },
  { local: 42, euro: 42, us: 9, uk: 8, cm: "26.1 - 26.7", inch: "10.3 - 10.5" },
  { local: 43, euro: 43, us: 10, uk: 9, cm: "26.8 - 27.4", inch: "10.6 - 10.8" },
  { local: 44, euro: 44, us: 11, uk: 10, cm: "27.5 - 28.0", inch: "10.8 - 11.0" },
  { local: 45, euro: 45, us: 12, uk: 11, cm: "28.1 - 28.7", inch: "11.1 - 11.3" },
  { local: 46, euro: 46, us: 13, uk: 12, cm: "28.8 - 29.4", inch: "11.3 - 11.6" },
];

export default function ShoeSizeGuide() {
  const [selectedSize, setSelectedSize] = useState("");
  const [unit, setUnit] = useState("cm");

  const selected = sizes.find(
    (size) => size.local === Number(selectedSize)
  );

  return (
    <main
      className="min-h-screen bg-white text-[#171717]"
      style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
    >
      {/* Hero */}
      <section className="bg-[#f5f4f0] px-5 py-14 sm:px-8 sm:py-20 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <a
            href="/"
            className="mb-12 inline-flex items-center gap-2 text-xs text-[#77746e] transition hover:text-black"
          >
            <FiArrowLeft size={15} />
            Back to home
          </a>

          <div className="grid items-end gap-10 md:grid-cols-[1.2fr_0.8fr] md:gap-16">
            <div>
              <p className="mb-5 text-[10px] font-semibold uppercase tracking-[3px] text-[#77746e]">
                The Shoe Spot / Fit guide
              </p>

              <h1 className="max-w-3xl text-4xl font-medium leading-[1.08] tracking-[-1.8px] sm:text-5xl lg:text-[68px] lg:tracking-[-3px]">
                Find your
                <br />
                perfect fit.
              </h1>

              <p className="mt-6 max-w-xl text-sm leading-7 text-[#68665f] sm:text-base sm:leading-8">
                The right fit makes every step better. Use our men's shoe
                size chart to compare international sizes and find the
                measurement that works for you.
              </p>
            </div>

            <div className="flex items-center gap-5 border-t border-[#d9d6ce] pt-6 md:justify-self-end md:border-l md:border-t-0 md:pl-8 md:pt-0">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white">
                <FiActivity size={24} strokeWidth={1.4} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Size Finder */}
      <section className="px-5 py-12 sm:px-8 sm:py-16 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[0.8fr_1.2fr] md:gap-16">
          <div>
            <p className="mb-4 text-[10px] font-semibold uppercase tracking-[2.5px] text-[#77746e]">
              Quick size finder
            </p>

            <h2 className="text-2xl font-medium tracking-[-0.8px] sm:text-3xl">
              Already know your size?
            </h2>

            <p className="mt-4 text-sm leading-7 text-[#77746e]">
              Select your Shoe Spot size to see the corresponding US, UK,
              Euro, and foot-length measurements.
            </p>

            <label
              htmlFor="shoe-size"
              className="mt-7 block text-xs font-semibold"
            >
              Select shoe size
            </label>

            <select
              id="shoe-size"
              value={selectedSize}
              onChange={(event) => setSelectedSize(event.target.value)}
              className="mt-3 h-12 w-full border border-[#dedbd4] bg-white px-4 text-sm outline-none transition focus:border-[#171717]"
            >
              <option value="">Choose your size</option>

              {sizes.map((size) => (
                <option key={size.local} value={size.local}>
                  Size {size.local}
                </option>
              ))}
            </select>
          </div>

          <div className="border border-[#e7e5df] p-5 sm:p-8">
            {selected ? (
              <>
                <div className="flex items-start justify-between gap-4 border-b border-[#e7e5df] pb-6">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[2px] text-[#77746e]">
                      Your selected size
                    </p>

                    <h3 className="mt-2 text-4xl font-medium">
                      {selected.local}
                    </h3>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f3f2ee]">
                    <FiCheck size={19} />
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-4">
                  {[
                    ["Euro", selected.euro],
                    ["US", selected.us],
                    ["UK", selected.uk],
                    ["Shoe Spot", selected.local],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <p className="text-xs text-[#77746e]">{label}</p>
                      <p className="mt-2 text-2xl font-medium">{value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-7 border-t border-[#e7e5df] pt-6">
                  <p className="text-xs text-[#77746e]">Foot length</p>

                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setUnit("cm")}
                      className={`px-4 py-2 text-xs transition ${
                        unit === "cm"
                          ? "bg-[#171717] text-white"
                          : "border border-[#dedbd4] text-[#696761]"
                      }`}
                    >
                      Centimetres
                    </button>

                    <button
                      type="button"
                      onClick={() => setUnit("inch")}
                      className={`px-4 py-2 text-xs transition ${
                        unit === "inch"
                          ? "bg-[#171717] text-white"
                          : "border border-[#dedbd4] text-[#696761]"
                      }`}
                    >
                      Inches
                    </button>
                  </div>

                  <p className="mt-4 text-2xl font-medium">
                    {unit === "cm" ? selected.cm : selected.inch}
                    <span className="ml-2 text-sm font-normal text-[#77746e]">
                      {unit === "cm" ? "cm" : "in"}
                    </span>
                  </p>
                </div>
              </>
            ) : (
              <div className="flex min-h-[260px] flex-col items-center justify-center text-center">
                <FiActivity size={30} strokeWidth={1.2} />

                <h3 className="mt-5 text-lg font-medium">
                  Your size, at a glance
                </h3>

                <p className="mt-2 max-w-xs text-sm leading-6 text-[#77746e]">
                  Select a size to view its international equivalents and
                  recommended foot-length range.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Men's Size Chart */}
      <section className="bg-[#f6f5f2] px-5 py-14 sm:px-8 sm:py-20 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="mb-4 text-[10px] font-semibold uppercase tracking-[2.5px] text-[#77746e]">
                Men's footwear
              </p>

              <h2 className="text-3xl font-medium tracking-[-1px] sm:text-4xl">
                Men's shoe size chart
              </h2>

              <p className="mt-3 text-sm text-[#77746e]">
                Compare all available sizes in one place.
              </p>
            </div>

            <p className="text-xs text-[#77746e]">Sizes 39–46</p>
          </div>

          <div className="mt-8 overflow-x-auto border border-[#e5e2dc] bg-white">
            <table className="w-full min-w-[700px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#e5e2dc] bg-[#faf9f7]">
                  {[
                    "Shoe Spot",
                    "Euro",
                    "US",
                    "UK",
                    "Foot length (cm)",
                    "Foot length (inch)",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="px-5 py-5 text-[10px] font-semibold uppercase tracking-[1px] text-[#77746e]"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {sizes.map((size) => (
                  <tr
                    key={size.local}
                    onClick={() => setSelectedSize(String(size.local))}
                    className={`cursor-pointer border-b border-[#eeece7] last:border-b-0 transition-colors hover:bg-[#f7f6f3] ${
                      Number(selectedSize) === size.local
                        ? "bg-[#f3f1eb]"
                        : ""
                    }`}
                  >
                    <td className="px-5 py-5 text-sm font-semibold">
                      {size.local}
                    </td>
                    <td className="px-5 py-5 text-sm">{size.euro}</td>
                    <td className="px-5 py-5 text-sm">{size.us}</td>
                    <td className="px-5 py-5 text-sm">{size.uk}</td>
                    <td className="px-5 py-5 text-sm text-[#696761]">
                      {size.cm}
                    </td>
                    <td className="px-5 py-5 text-sm text-[#696761]">
                      {size.inch}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-xs leading-6 text-[#77746e]">
            Tip: Click any row to select that size and view its details
            above. Measurements are based on the ranges supplied in this guide.
          </p>
        </div>
      </section>
    </main>
  );
}
