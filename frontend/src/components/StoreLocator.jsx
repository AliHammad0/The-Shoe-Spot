
import { useState } from "react";
import { MapPin, Search, ExternalLink } from "lucide-react";

export default function StoreLocator() {
  const [search, setSearch] = useState("United Kingdom");
  const [location, setLocation] = useState("United Kingdom");

  const mapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
    location
  )}&z=6&output=embed`;

  function handleSearch(e) {
    e.preventDefault();

    const place = search.trim();

    if (!place) return;

    setLocation(place);
  }

  function openGoogleMaps() {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        location
      )}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <main className="min-h-screen bg-white text-[#171717]">
      <section className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-10">
        <div className="mb-5 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-gray-500">
              Explore the map
            </p>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              United Kingdom Map
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Explore cities, streets, houses, shops and nearby places.
            </p>
          </div>

          <form
            onSubmit={handleSearch}
            className="flex w-full max-w-xl items-center gap-2 border border-gray-300 p-2 focus-within:border-black"
          >
            <MapPin size={19} className="shrink-0 text-gray-500" />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search city, street, postcode or shop"
              aria-label="Search map location"
              className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm outline-none"
            />

            <button
              type="submit"
              aria-label="Search location"
              className="flex shrink-0 items-center justify-center bg-black px-4 py-3 text-white transition hover:bg-gray-800"
            >
              <Search size={18} />
            </button>
          </form>
        </div>

        <div className="relative h-[65vh] min-h-[450px] w-full overflow-hidden border border-gray-200 bg-gray-100 sm:h-[72vh] lg:h-[78vh]">
          <iframe
            key={location}
            title={`Google Map - ${location}`}
            src={mapUrl}
            className="h-full w-full border-0"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />

          <button
            type="button"
            onClick={openGoogleMaps}
            className="absolute bottom-4 right-4 flex items-center gap-2 bg-white px-4 py-3 text-sm font-medium shadow-md transition hover:bg-gray-100"
          >
            Open Google Maps
            <ExternalLink size={16} />
          </button>
        </div>

        <p className="mt-4 text-xs leading-5 text-gray-500">
          Search any UK city, house address, street, postcode, shop or other
          place. Zoom in and move around the map to explore more details.
        </p>
      </section>
    </main>
  );
}
