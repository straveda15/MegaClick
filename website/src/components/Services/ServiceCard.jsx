import React from "react";
import { Link } from "react-router-dom";

const ServiceCard = ({ service }) => {
  if (!service) return null;

  const title = typeof service === "string" ? service : service.title;
  const categoryName = service.category || "Service";
  const slug =
    service.slug ||
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  const emoji = service.emoji || service.icon || "📋";

  return (
    <Link to={`/services/${slug}`} className="group block h-full">
      <div
        className="
          relative
          h-full
          min-h-[175px]
          sm:min-h-[195px]
          overflow-hidden
          rounded-2xl
          bg-white
          border
          border-gray-200/90
          p-4
          sm:p-5
          flex
          flex-col
          items-start
          justify-between
          text-left
          shadow-xs
          transition-all
          duration-300
          hover:-translate-y-1.5
          hover:shadow-xl
          hover:shadow-emerald-900/10
          active:scale-[0.98]
          cursor-pointer
        "
      >
        {/* GREEN ASYMMETRIC BORDER OVERLAY */}
        <div
          className="
            pointer-events-none
            absolute
            inset-0
            rounded-2xl
            border-t-[1.5px]
            border-r-[1.5px]
            border-l-[3.5px]
            border-b-[3.5px]
            border-[#00A878]
            opacity-0
            transition-opacity
            duration-300
            group-hover:opacity-100
            group-active:opacity-100
            z-10
          "
        />

        {/* BORDERLESS IMAGE OR EMOJI */}
        <div
          className="
            w-12
            h-12
            sm:w-14
            sm:h-14
            flex
            items-center
            justify-center
            text-3xl
            sm:text-4xl
            mb-3
            overflow-hidden
            transition-transform
            duration-300
            group-hover:scale-110
          "
        >
          {service.image ? (
            <img
              src={service.image}
              alt={title}
              loading="lazy"
              className="w-full h-full object-contain"
            />
          ) : (
            <span className="leading-none select-none flex items-center justify-center">
              {emoji}
            </span>
          )}
        </div>

        {/* TITLE */}
        <h3
          className="
            font-bold
            text-gray-900
            text-xs
            sm:text-sm
            leading-snug
            line-clamp-2
            my-auto
          "
        >
          {title}
        </h3>

        {/* CATEGORY TAG PILL */}
        <div
          className="
            w-full
            mt-3
            bg-gray-100
            text-[10px]
            sm:text-[11px]
            font-bold
            text-gray-500
            py-1.5
            px-3
            rounded-lg
            uppercase
            tracking-wider
            truncate
            text-left
          "
        >
          {categoryName}
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;