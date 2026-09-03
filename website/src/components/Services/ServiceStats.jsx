import React from "react";

const ServiceStats = () => {
  return (
    <section className="py-6 sm:py-7 bg-blue-50/70 border-y border-blue-100/60 service-stats-section font-['Inter',sans-serif]">
      {/* GOOGLE FONTS */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hedvig+Letters+Serif:opsz@12..24&family=Inter:wght@400;500;600;700&display=swap');

        /* Large Desktop (1920px Full HD) */
        @media (min-width: 1920px) {
          .service-stats-section { padding-top: 2rem !important; padding-bottom: 2rem !important; }
          .service-stats-text { font-size: 1.25rem !important; }
          .service-stats-num { font-size: 1.75rem !important; }
        }

        /* 4K Ultra-Wide Desktop (3840px) */
        @media (min-width: 3840px) {
          .service-stats-section { padding-top: 3.5rem !important; padding-bottom: 3.5rem !important; }
          .service-stats-text { font-size: 2rem !important; }
          .service-stats-num { font-size: 2.85rem !important; }
        }
      `}</style>

      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 min-[1440px]:px-10 flex justify-center">
        <p
          style={{ fontFamily: "'Inter', sans-serif" }}
          className="service-stats-text text-gray-700 text-sm sm:text-base md:text-lg text-center font-medium leading-relaxed"
        >
          <strong
            style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
            className="service-stats-num text-[#0B4EA2] text-xl sm:text-2xl font-bold"
          >
            36+
          </strong>{" "}
          Services across{" "}
          <strong
            style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
            className="service-stats-num text-[#0B4EA2] text-xl sm:text-2xl font-bold"
          >
            3
          </strong>{" "}
          Major Categories
        </p>
      </div>
    </section>
  );
};

export default ServiceStats;