import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

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
          bg-white
          p-5
          sm:p-6
          shadow-[0_8px_30px_rgba(0,0,0,0.06)]
          transition-all
          duration-300
          hover:-translate-y-1.5
          hover:border-[#0B4EA2]/20
          hover:shadow-[0_16px_40px_rgba(11,78,162,0.12)]
        "
      >
        {/* ================= TOP ACCENT ================= */}

        <div
          className="
            absolute
            left-0
            top-0
            h-1
            w-0
            bg-gradient-to-r
            from-[#0B4EA2]
            to-[#22A447]
            transition-all
            duration-300
            group-hover:w-full
          "
        />

        {/* ================= ICON ================= */}

        <div className="flex items-start justify-between">
          <div
            className="
              flex
              h-14
              w-14
              shrink-0
              items-center
              justify-center
              rounded-2xl
              bg-[#EAF3FF]
              text-2xl
              transition-all
              duration-300
              group-hover:bg-[#0B4EA2]
              group-hover:scale-105
            "
          >
            {service.emoji || "📋"}
          </div>

          {/* ARROW */}

          <div
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              border
              border-gray-200
              text-gray-400
              transition-all
              duration-300
              group-hover:border-[#0B4EA2]
              group-hover:bg-[#0B4EA2]
              group-hover:text-white
            "
          >
            <ArrowUpRight size={17} />
          </div>
        </div>

        {/* ================= TITLE ================= */}

        <h3
          className="
            mt-5
            text-base
            sm:text-lg
            font-bold
            leading-6
            text-gray-900
            transition-colors
            duration-300
            group-hover:text-[#0B4EA2]
          "
        >
          {service.title}
        </h3>

        {/* ================= SMALL DESCRIPTION ================= */}

        <p
          className="
            mt-2
            text-sm
            leading-6
            text-gray-500
          "
        >
          {service.description ||
            "Get professional assistance with complete support."}
        </p>

        {/* ================= BOTTOM ================= */}

        <div className="mt-5 flex items-center justify-between">
          <span
            className="
              inline-flex
              items-center
              rounded-full
              bg-green-50
              px-3
              py-1.5
              text-[11px]
              font-semibold
              text-green-700
            "
          >
            Professional Support
          </span>

          <span
            className="
              text-xs
              font-semibold
              text-gray-400
              transition-colors
              duration-300
              group-hover:text-[#0B4EA2]
            "
          >
            View Details
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;