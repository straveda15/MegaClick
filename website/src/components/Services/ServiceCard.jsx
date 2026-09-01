import React from "react";
import { Link } from "react-router-dom";

const ServiceCard = ({ service }) => {
  if (!service) return null;

  const title = typeof service === "string" ? service : service.title;
  const categoryName = service.category || "Service";
  const slug =
    service.slug ||
    title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return (
    <Link to={`/services/${slug}`} className="group block h-full font-['Inter',sans-serif]">
      <style>{`
        /* 1920px Full HD */
        @media (min-width: 1920px) {
          .service-item-card {
            min-height: 230px !important;
            padding: 1.5rem !important;
          }
          .service-item-image-box {
            width: 4.5rem !important;
            height: 4.5rem !important;
            margin-bottom: 1rem !important;
          }
          .service-item-title {
            font-size: 1.05rem !important;
          }
          .service-item-tag {
            font-size: 0.75rem !important;
            padding: 0.45rem 0.85rem !important;
          }
        }

        /* 2560px 2K */
        @media (min-width: 2560px) {
          .service-item-card {
            min-height: 270px !important;
            padding: 1.75rem !important;
          }
          .service-item-image-box {
            width: 5.5rem !important;
            height: 5.5rem !important;
            margin-bottom: 1.25rem !important;
          }
          .service-item-title {
            font-size: 1.25rem !important;
          }
          .service-item-tag {
            font-size: 0.85rem !important;
            padding: 0.55rem 1rem !important;
          }
        }

        /* 3840px 4K */
        @media (min-width: 3840px) {
          .service-item-card {
            min-height: 380px !important;
            padding: 2.25rem !important;
            border-radius: 1.5rem !important;
          }
          .service-item-image-box {
            width: 7.5rem !important;
            height: 7.5rem !important;
            margin-bottom: 1.75rem !important;
          }
          .service-item-title {
            font-size: 1.65rem !important;
          }
          .service-item-tag {
            font-size: 1.15rem !important;
            padding: 0.75rem 1.35rem !important;
          }
        }
      `}</style>

      <div
        className="
          service-item-card
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

        {/* 🖼️ FLATICON / PNG IMAGE */}
        <div
          className="
            service-item-image-box
            w-12
            h-12
            sm:w-14
            sm:h-14
            flex
            items-center
            justify-center
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
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs">
              {title.charAt(0)}
            </div>
          )}
        </div>

        {/* TITLE */}
        <h3
          style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
          className="
            service-item-title
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
            service-item-tag
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