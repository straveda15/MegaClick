import React from "react";
import { Link } from "react-router-dom";

const ServiceCard = ({ service }) => {
  if (!service) return null;

  return (
    <Link
      to={`/services/${service.slug}`}
      className="group block h-full"
    >
      <div
        className="
          relative
          h-full
          min-h-[150px]
          sm:min-h-[170px]
          overflow-hidden
          rounded-xl
          sm:rounded-2xl
          border
          border-gray-200
          bg-gray-50
          p-3
          sm:p-5
          transition-all
          duration-300
          hover:bg-white
          hover:-translate-y-1
          hover:shadow-xl
        "
      >
        {/* GREEN HOVER STRIP */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            rounded-xl
            sm:rounded-2xl
            border
            border-[#00A878]
            border-l-[4px]
            opacity-0
            transition-opacity
            duration-300
            group-hover:opacity-100
            z-10
          "
        />

        {/* ICON / EMOJI */}

        <div
          className="
            w-9
            h-9
            sm:w-12
            sm:h-12
            rounded-lg
            sm:rounded-xl
            bg-white
            shadow-sm
            flex
            items-center
            justify-center
            text-xl
            sm:text-3xl
            mb-2
            sm:mb-4
            transition-transform
            duration-300
            group-hover:scale-110
          "
        >
          {service.emoji || "📋"}
        </div>

        {/* TITLE */}

        <h3
          className="
            font-semibold
            text-gray-800
            text-sm
            sm:text-base
            leading-5
            line-clamp-2
          "
        >
          {service.title}
        </h3>

        {/* DESCRIPTION */}

        <p
          className="
            text-[10px]
            sm:text-xs
            text-gray-500
            mt-1
            sm:mt-2
            line-clamp-2
          "
        >
          Get professional assistance
        </p>
      </div>
    </Link>
  );
};

export default ServiceCard;