import React from "react";
import ServiceCard from "./ServiceCard";

const ServicesGrid = ({
  services,
  selectedCategory
}) => {
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
          p-6
        "
      >

        {/* Heading inside card */}

        <div
          className="
            flex
            items-center
            justify-between
            mb-6
          "
        >

          <div>

            <h2
              className="
                text-2xl
                font-bold
                text-gray-800
              "
            >
              {
                selectedCategory === "All Services"
                  ? "All Services"
                  : selectedCategory
              }
            </h2>

            <p
              className="
                text-sm
                text-gray-500
                mt-1
              "
            >
              Explore our professional services
            </p>

          </div>

          {/* Count */}

          <div
            className="
              bg-blue-50
              px-4
              py-2
              rounded-xl
              text-blue-700
              font-semibold
              text-sm
            "
          >
            {services.length} Services
          </div>

        </div>

        {/* SUB SERVICE CARDS */}

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            gap-5
          "
        >
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              service={service}
            />
          ))}
        </div>

      </div>

    </div>
  );
};

export default ServicesGrid;