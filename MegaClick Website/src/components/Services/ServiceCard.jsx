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
          overflow-hidden
          rounded-2xl
          border
          border-gray-200
          bg-gray-50
          p-5
          transition-all
          duration-300
          hover:bg-white
          hover:-translate-y-1
          hover:shadow-xl
        "
      >
        {/* ================= GREEN HOVER STRIP ================= */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            rounded-2xl
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

        {/* ================= ICON / EMOJI ================= */}

        <div
          className="
            w-12
            h-12
            rounded-xl
            bg-white
            shadow-sm
            flex
            items-center
            justify-center
            text-3xl
            mb-4
            transition-transform
            duration-300
            group-hover:scale-110
          "
        >
          {service.emoji || "📋"}
        </div>

        {/* ================= TITLE ================= */}

        <h3
          className="
            font-semibold
            text-gray-800
            text-base
            leading-5
          "
        >
          {service.title}
        </h3>

        {/* ================= DESCRIPTION ================= */}

        <p
          className="
            text-xs
            text-gray-500
            mt-2
          "
        >
          Get professional assistance
        </p>
      </div>
    </Link>
  );
};

export default ServiceCard;