import React from "react";
import ServiceCard from "./ServiceCard";

const ServicesGrid = ({ services, selectedCategory }) => {
  return (
    <div className="space-y-10">
      {/* MAIN CATEGORY CARD */}
      <div
        className="
          bg-blue-50
          rounded-3xl
          border
          border-gray-200
          shadow-[0_8px_30px_rgba(0,0,0,0.08)]
          p-4
          sm:p-6
        "
      >
        {/* HEADING */}
        <div
          className="
            flex
            items-center
            justify-between
            gap-3
            mb-5
            sm:mb-6
          "
        >
          <div className="min-w-0">
            <h2
              className="
                text-xl
                sm:text-2xl
                font-bold
                text-gray-800
                truncate
              "
            >
              {selectedCategory === "All Services"
                ? "All Services"
                : selectedCategory}
            </h2>

            <p
              className="
                text-xs
                sm:text-sm
                text-gray-500
                mt-1
              "
            >
              Explore our professional services
            </p>
          </div>

          {/* COUNT */}
          <div
            className="
              flex-shrink-0
              bg-blue-100
              px-3
              sm:px-4
              py-1.5
              sm:py-2
              rounded-xl
              text-blue-700
              font-semibold
              text-xs
              sm:text-sm
            "
          >
            {services.length} Services
          </div>
        </div>

        {/* SERVICE CARDS */}
        <div
          className="
            grid
            grid-cols-2
            gap-3
            sm:gap-4
            lg:grid-cols-3
            lg:gap-5
          "
        >
          {services.map((service, index) => (
            <ServiceCard
              key={service.slug || index}
              service={service}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServicesGrid;