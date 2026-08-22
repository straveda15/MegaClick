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
  "Search Digital Marketing...",
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
    <section className="bg-blue-50 py-8 sm:py-10 lg:py-12 search-services-section">
      {/* UNIFIED APP-CONTAINER + RESPONSIVE SCALING */}
      <style>{`
        .app-container {
          width: 100%;
          max-width: 1500px;
          margin-left: auto;
          margin-right: auto;
          padding-left: 1.25rem;
          padding-right: 1.25rem;
        }

        @media (min-width: 640px) {
          .app-container {
            padding-left: 2rem;
            padding-right: 2rem;
          }
        }

        @media (min-width: 1024px) {
          .app-container {
            padding-left: 4rem;
            padding-right: 4rem;
          }
        }

        @media (min-width: 1280px) {
          .app-container {
            padding-left: 6rem;
            padding-right: 6rem;
          }
        }

        /* Standard Desktop (1440px x 900px) */
        @media (min-width: 1440px) {
          .app-container {
            max-width: 1440px !important;
            padding-left: 5rem !important;
            padding-right: 5rem !important;
          }
          .search-heading {
            font-size: 2.25rem !important;
            line-height: 1.2 !important;
          }
          .search-input {
            height: 3.5rem !important;
            font-size: 1rem !important;
          }
        }

        /* Large Desktop (1920px x 1080px Full HD) */
        @media (min-width: 1920px) {
          .app-container {
            max-width: 1800px !important;
            padding-left: 6rem !important;
            padding-right: 6rem !important;
          }
          .search-services-section {
            padding-top: 3.5rem !important;
            padding-bottom: 3.5rem !important;
          }
          .search-badge {
            font-size: 0.85rem !important;
            padding: 0.5rem 1.1rem !important;
            margin-bottom: 0.85rem !important;
          }
          .search-heading {
            font-size: 2.5rem !important;
            line-height: 1.2 !important;
          }
          .search-input-box {
            margin-top: 2rem !important;
          }
          .search-input {
            height: 4rem !important;
            font-size: 1.1rem !important;
            padding-left: 3.5rem !important;
            border-radius: 0.95rem !important;
          }
          .search-icon {
            left: 1.25rem !important;
            width: 1.4rem !important;
            height: 1.4rem !important;
          }
        }

        /* QHD / 2K Ultra-Wide (2560px Desktop) */
        @media (min-width: 2560px) {
          .app-container {
            max-width: 2400px !important;
            padding-left: 8rem !important;
            padding-right: 8rem !important;
          }
          .search-services-section {
            padding-top: 4.5rem !important;
            padding-bottom: 4.5rem !important;
          }
          .search-badge {
            font-size: 1rem !important;
            padding: 0.6rem 1.35rem !important;
            margin-bottom: 1rem !important;
          }
          .search-heading {
            font-size: 3rem !important;
            line-height: 1.2 !important;
          }
          .search-input-box {
            margin-top: 2.5rem !important;
          }
          .search-input {
            height: 4.75rem !important;
            font-size: 1.3rem !important;
            padding-left: 4.25rem !important;
            border-radius: 1.15rem !important;
          }
          .search-icon {
            left: 1.5rem !important;
            width: 1.65rem !important;
            height: 1.65rem !important;
          }
        }

        /* 4K Ultra-Wide Desktop (3840px x 2160px) */
        @media (min-width: 3840px) {
          .app-container {
            max-width: 3400px !important;
            padding-left: 10rem !important;
            padding-right: 10rem !important;
          }
          .search-services-section {
            padding-top: 6rem !important;
            padding-bottom: 6rem !important;
          }
          .search-badge {
            font-size: 1.35rem !important;
            padding: 0.85rem 1.85rem !important;
            margin-bottom: 1.35rem !important;
            border-radius: 9999px !important;
          }
          .search-badge-icon {
            width: 1.5rem !important;
            height: 1.5rem !important;
          }
          .search-heading {
            font-size: 3.75rem !important;
            line-height: 1.15 !important;
          }
          .search-input-box {
            margin-top: 3.5rem !important;
          }
          .search-input {
            height: 5.75rem !important;
            font-size: 1.65rem !important;
            padding-left: 5.5rem !important;
            border-radius: 1.5rem !important;
            border-width: 3px !important;
          }
          .search-icon {
            left: 1.85rem !important;
            width: 2.25rem !important;
            height: 2.25rem !important;
          }
        }
      `}</style>

      <div className="app-container">
        {/* Heading */}
        <div className="text-left">
        

          <h2
            style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
            className="
              search-heading
              text-2xl
              sm:text-3xl
              md:text-3xl
              lg:text-4xl
              font-bold
              leading-[1.18]
              text-black
              text-left
            "
          >
            Explore{" "}
            <span className="text-[#0B4EA2]">
              Your Services
            </span>
          </h2>
        </div>

        {/* Search Box */}
        <div className="search-input-box mt-5 sm:mt-6">
          <div className="relative">
            <Search
              size={21}
              className="
                search-icon
                absolute
                left-4
                sm:left-5
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
                search-input
                w-full
                h-13
                sm:h-14
                rounded-xl
                border-2
                border-green-600
                bg-white
                pl-11
                sm:pl-12
                pr-5
                text-sm
                sm:text-base
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