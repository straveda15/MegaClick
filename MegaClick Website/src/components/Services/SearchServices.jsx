import React, { useState, useEffect } from "react";
import { Search, Layers3 } from "lucide-react";

// =================================================
// ROTATING PLACEHOLDER SUGGESTIONS (2.5s INTERVAL)
// =================================================
const placeholderSuggestions = [
  "Search PAN / Voter ID Services...",
  "Search GST Registration & Filing...",
  "Search Marriage Registration...",
  "Search Leave & Licence / Rent Agreement...",
  "Search Income Tax Services...",
  "Search Passport Services...",
  "Search MSME / UDYAM Registration...",
  "Search Trademark Registration...",
  "Search Company Registration & Compliance...",
  "Search Digital Marketing..."
];

const SearchServices = ({ searchTerm, setSearchTerm }) => {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  // =================================================
  // ROTATE PLACEHOLDER EVERY 2.5 SECONDS
  // =================================================
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex(
        (prevIndex) => (prevIndex + 1) % placeholderSuggestions.length
      );
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-blue-50 py-10 sm:py-12">
      <div
        className="
          max-w-[1500px]
          mx-auto
          px-6
          lg:px-24
        "
      >
        {/* Heading */}
        <div>
          <span
            className="
              inline-flex
              items-center
              gap-2
              bg-[#0B4EA2]
              text-white
              px-4
              py-2
              rounded-full
              text-xs
              font-semibold
              mb-3
            "
          >
            <Layers3
              size={16}
              className="text-green-300"
            />
            Our Services
          </span>

          <h2
            className="
              text-3xl
              md:text-4xl
              lg:text-5xl
              font-bold
              leading-snug
              text-black
            "
          >
            Explore{" "}
            <span
              className="
                bg-gradient-to-r
                from-blue-600
                to-green-500
                bg-clip-text
                text-transparent
              "
            >
              Your Services
            </span>
          </h2>
        </div>

        {/* Search Box */}
        <div className="mt-6">
          <div className="relative">
            <Search
              size={21}
              className="
                absolute
                left-5
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              type="text"
              placeholder={placeholderSuggestions[placeholderIndex]}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="
                w-full
                h-14
                rounded-xl
                border-2
                border-green-600
                bg-white
                pl-12
                pr-5
                text-base
                text-gray-700
                placeholder:text-gray-400
                placeholder:transition-opacity
                placeholder:duration-300
                outline-none
                shadow-sm
                transition-all
                duration-300
                hover:border-blue-400
                focus:border-blue-600
                focus:ring-2
                focus:ring-blue-100
              "
            />
          </div>
        </div>

      </div>
    </section>
  );
};

export default SearchServices;