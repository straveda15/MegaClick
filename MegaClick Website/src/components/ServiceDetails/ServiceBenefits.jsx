
import React from "react";
import { ArrowUpRight } from "lucide-react";

const ServiceBenefits = ({ service }) => {
  if (!service?.benefits?.length) {
    return null;
  }

  return (
    <section className="w-full bg-white">
      <div
        className="
          max-w-[1500px]
          mx-auto
          px-4
          sm:px-8
          lg:px-16
          xl:px-24
          pt-5
          sm:pt-7
          lg:pt-9
          pb-8
          sm:pb-10
          lg:pb-12
        "
      >
        {/* =========================
            HEADER
        ========================== */}

        <div className="mb-7 sm:mb-8 lg:mb-9">
          <h2
            className="
              text-3xl
              sm:text-4xl
              lg:text-[42px]
              font-bold
              tracking-tight
              text-gray-900
              leading-tight
            "
          >
            Benefits
          </h2>

          
          <p
            className="
              mt-3
              max-w-2xl
              text-sm
              sm:text-[15px]
              leading-6
              text-gray-500
            "
          >
            Key advantages you receive with our service,
            designed to make the entire process simple and reliable.
          </p>
        </div>

        {/* =========================
            BENEFITS
        ========================== */}

        <div
          className="
            grid
            grid-cols-1
            md:grid-cols-2
            gap-x-14
            lg:gap-x-20
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
                gap-4
                py-4
                sm:py-5
                border-b
                border-gray-200/70
                transition-all
                duration-300
              "
            >
              {/* NUMBER */}

              <div
                className="
                  shrink-0
                  w-11
                  sm:w-13
                "
              >
                <span
                  className="
                    text-2xl
                    sm:text-3xl
                    font-bold
                    leading-none
                    text-green-200
                    transition-colors
                    duration-300
                    group-hover:text-[#0B4EA2]/20
                  "
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              {/* BENEFIT TEXT */}

              <div className="flex-1">
                <p
                  className="
                    text-sm
                    sm:text-[15px]
                    lg:text-base
                    font-medium
                    leading-6
                    text-[#374A59]
                    transition-all
                    duration-300
                    group-hover:text-gray-900
                    group-hover:translate-x-1
                  "
                >
                  {item}
                </p>
              </div>

              {/* ARROW */}

              <ArrowUpRight
                size={17}
                strokeWidth={1.8}
                className="
                  shrink-0
                  text-gray-300
                  opacity-0
                  -translate-x-1
                  translate-y-1
                  transition-all
                  duration-300
                  group-hover:opacity-100
                  group-hover:text-[#0B4EA2]
                  group-hover:translate-x-0
                  group-hover:translate-y-0
                "
              />

              {/* HOVER ACCENT */}

              <span
                className="
                  absolute
                  bottom-0
                  left-0
                  h-[2px]
                  w-0
                  bg-[#0B4EA2]
                  transition-all
                  duration-300
                  group-hover:w-12
                "
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceBenefits;
