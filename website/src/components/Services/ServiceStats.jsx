import React from "react";

const ServiceStats = () => {
  return (
    <section className="py-6 bg-blue-50 service-stats-section font-['Inter',sans-serif]">
      <style>{`
        /* Large Desktop (1920px Full HD) */
        @media (min-width: 1920px) {
          .service-stats-section {
            padding-top: 2rem !important;
            padding-bottom: 2rem !important;
          }
          .service-stats-text {
            font-size: 1.25rem !important;
          }
          .service-stats-num {
            font-size: 1.75rem !important;
          }
        }

        /* 4K Ultra-Wide Desktop (3840px) */
        @media (min-width: 3840px) {
          .service-stats-section {
            padding-top: 3.5rem !important;
            padding-bottom: 3.5rem !important;
          }
          .service-stats-text {
            font-size: 2rem !important;
          }
          .service-stats-num {
            font-size: 2.85rem !important;
          }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6 flex justify-center">
        <p className="service-stats-text text-gray-700 text-base sm:text-lg text-center font-medium">
          <strong className="service-stats-num text-[#0B4EA2] text-xl sm:text-2xl font-bold">
            36+
          </strong>{" "}
          Services across{" "}
          <strong className="service-stats-num text-[#0B4EA2] text-xl sm:text-2xl font-bold">
            3
          </strong>{" "}
          Major Categories
        </p>
      </div>
    </section>
  );
};

export default ServiceStats;