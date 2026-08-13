import React from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";

const ServiceBenefits = ({ service }) => {
  if (!service?.benefits?.length) {
    return null;
  }

  return (
    <section className="w-full bg-white py-12 sm:py-16 lg:py-20 overflow-hidden">
      <div
        className="
          max-w-[1500px]
          mx-auto
          px-4
          sm:px-8
          lg:px-16
          xl:px-24
        "
      >
        {/* =========================================
            HEADER
        ========================================== */}

        <div className="mb-10 sm:mb-12 text-left">
          {/* BADGE */}
          <span
            className="
              inline-flex
              items-center
              gap-1.5
              rounded-full
              bg-blue-600
              border
              border-blue-100
              px-3.5
              py-1
              text-xs
              font-bold
              text-white
              mb-3
            "
          >
            <Sparkles size={13} className="text-white" />
            Key Advantages
          </span>

          {/* TITLE */}
          <h2
            className="
              text-2xl
              sm:text-4xl
              font-extrabold
              tracking-tight
              text-gray-900
            "
          >
            Why Choose{" "}
            <span
              className="
                bg-gradient-to-r
                from-[#0B4EA2]
                to-green-500
                bg-clip-text
                text-transparent
              "
            >
              Our Services?
            </span>
          </h2>

          <p className="mt-2 text-sm sm:text-base text-gray-500 max-w-2xl">
            Key benefits you receive with our service, designed to make the entire process simple, fast, and reliable.
          </p>
        </div>

        {/* =========================================
            MINIMALIST LEFT-BORDER ROW GRID
        ========================================== */}

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-4
            sm:gap-6
          "
        >
          {service.benefits.map((item, index) => (
            <div
              key={index}
              className="
                group
                relative
                flex
                items-center
                justify-between
                gap-4
                pl-5
                pr-4
                py-4
                sm:py-5
                bg-slate-100
                border
                border-slate-200/60
                hover:bg-[#F0F6FF]
                hover:border-blue-200/80
                border-l-4
                border-l-gray-400
                hover:border-l-[#0B4EA2]
                rounded-r-2xl
                transition-all
                duration-300
                cursor-pointer
              "
            >
              <div className="flex items-center gap-3.5">
                {/* Number Prefix */}
                <span
                  className="
                    text-xs
                    sm:text-sm
                    font-extrabold
                    text-gray-500
                    group-hover:text-[#0B4EA2]
                    transition-colors
                  "
                >
                  {String(index + 1).padStart(2, "0")}.
                </span>

                {/* Benefit Text */}
                <p
                  className="
                    text-sm
                    sm:text-base
                    font-bold
                    text-gray-800
                    group-hover:text-gray-950
                    transition-colors
                    leading-snug
                  "
                >
                  {item}
                </p>
              </div>

              {/* Minimal Arrow Micro-Interaction */}
              <div
                className="
                  shrink-0
                  text-gray-400
                  group-hover:text-[#0B4EA2]
                  group-hover:translate-x-0.5
                  group-hover:-translate-y-0.5
                  transition-all
                  duration-300
                  pr-1
                "
              >
                <ArrowUpRight size={18} strokeWidth={2.5} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceBenefits;