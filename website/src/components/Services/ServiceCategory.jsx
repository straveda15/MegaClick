import React from "react";
import ServiceCard from "./ServiceCard";

const ServiceCategory = ({ category }) => {
  if (!category) return null;

  return (
    <section className="mb-8 sm:mb-10 font-['Inter',sans-serif]">
      {/* GOOGLE FONTS */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hedvig+Letters+Serif:opsz@12..24&family=Inter:wght@400;500;600;700&display=swap');
      `}</style>

      <div
        className="
          bg-white
          rounded-3xl
          border border-gray-200/80
          shadow-sm
          p-5
          sm:p-6
          lg:p-8
        "
      >
        {/* ================= CATEGORY HEADER ================= */}
        <div
          className="
            flex
            flex-col
            sm:flex-row
            sm:items-center
            sm:justify-between
            gap-4
            mb-6
            sm:mb-8
            pb-4
            border-b border-gray-100
          "
        >
          {/* LEFT SIDE */}
          <div className="flex items-center gap-4 text-left">
            <div
              className="
                w-12
                h-12
                sm:w-14
                sm:h-14
                shrink-0
                rounded-2xl
                bg-blue-50
                border border-blue-100
                flex
                items-center
                justify-center
                text-2xl
                sm:text-3xl
                shadow-2xs
              "
            >
              {category.emoji || "📁"}
            </div>

            <div>
              <h2
                style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
                className="
                  text-xl
                  sm:text-2xl
                  lg:text-3xl
                  font-bold
                  text-black
                  leading-[1.18]
                  tracking-tight
                "
              >
                {category.title}
              </h2>

              <p
                style={{ fontFamily: "'Inter', sans-serif" }}
                className="
                  mt-1
                  text-xs
                  sm:text-sm
                  text-gray-500
                  font-normal
                "
              >
                {category.description || "Complete professional solutions"}
              </p>
            </div>
          </div>

          {/* SERVICE COUNT BADGE */}
          <div
            style={{ fontFamily: "'Inter', sans-serif" }}
            className="
              self-start
              sm:self-auto
              inline-flex
              items-center
              rounded-full
              bg-blue-50
              border border-blue-200/80
              px-3.5
              py-1.5
              text-xs
              sm:text-sm
              font-bold
              text-[#0B4EA2]
              shadow-xs
            "
          >
            {category.services?.length || 0} Services
          </div>
        </div>

        {/* ================= SERVICES GRID ================= */}
        {category.services?.length > 0 && (
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              gap-4
              lg:gap-5
            "
          >
            {category.services.map((service, index) => (
              <ServiceCard
                key={service.slug || service.title || index}
                service={service}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ServiceCategory;