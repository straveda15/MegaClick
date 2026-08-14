import React from "react";
import ServiceCard from "./ServiceCard";

const ServiceCategory = ({ category }) => {
  if (!category) return null;

  return (
    <section className="mb-10">
      <div
        className="
          bg-white
          rounded-3xl
          border border-gray-200
          shadow-sm
          p-5
          sm:p-6
          lg:p-7
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
            gap-5
            mb-6
          "
        >
          {/* LEFT SIDE */}

          <div className="flex items-center gap-4">
            <div
              className="
                w-14
                h-14
                shrink-0
                rounded-2xl
                bg-[#EAF3FF]
                flex
                items-center
                justify-center
                text-2xl
                sm:text-3xl
              "
            >
              {category.emoji}
            </div>

            <div>
              <h2
                className="
                  text-xl
                  sm:text-2xl
                  lg:text-3xl
                  font-bold
                  text-gray-900
                  tracking-tight
                "
              >
                {category.title}
              </h2>

              <p
                className="
                  mt-1
                  text-sm
                  text-gray-500
                "
              >
                {category.description ||
                  "Complete professional solutions"}
              </p>
            </div>
          </div>

          {/* SERVICE COUNT */}

          <div
            className="
              self-start
              sm:self-auto
              inline-flex
              items-center
              rounded-full
              bg-gray-50
              border border-gray-200
              px-4
              py-2
              text-xs
              sm:text-sm
              font-semibold
              text-gray-600
            "
          >
            {category.services?.length || 0} Services
          </div>
        </div>

        {/* ================= SERVICES ================= */}

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
                key={service.slug || index}
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