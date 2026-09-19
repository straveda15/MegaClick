import React from "react";

const ServiceHighlights = ({ service }) => {
  if (!service) return null;

  return (
    <section className="w-full bg-white font-['Inter',sans-serif] py-10 sm:py-14 lg:py-16">
      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 min-[1440px]:px-10">

        <div className="flex flex-col items-center text-center">

          {/* SERVICE LOGO */}
          <div className="mb-5 sm:mb-6">
            <img
              src={service.image}
              alt={service.title}
              loading="lazy"
              className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
            />
          </div>

          {/* TITLE */}
          <h2
            style={{ fontFamily: "'Poppins', serif" }}
            className="text-2xl sm:text-3xl lg:text-4xl font-bold text-black mb-3"
          >
            {service.title}
          </h2>

          {/* DESCRIPTION */}
          <p
            style={{ fontFamily: "'Inter', sans-serif" }}
            className="text-sm sm:text-base text-gray-600 leading-relaxed max-w-3xl"
          >
            {service.description}
          </p>

        </div>
      </div>
    </section>
  );
};

export default ServiceHighlights;