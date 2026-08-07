import React from "react";
import { Star } from "lucide-react";

const ServiceHero = ({ service }) => {
  return (
    <section className="bg-white py-10 lg:py-14">
      <div className="max-w-7xl mx-auto px-6 lg:px-20">
        <div
          className="
          relative
          overflow-hidden
          rounded-3xl
          bg-gradient-to-r
          from-[#0B4EA2]
          via-[#1565C0]
          to-[#0B4EA2]
          border
          border-blue-300/20
          shadow-[0_20px_60px_rgba(11,78,162,0.18)]
          p-6
          lg:p-8
        "
        >
          {/* Background Decoration */}

          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/10 blur-3xl" />

          <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-cyan-300/10 blur-3xl" />

          {/* Content */}

          <div className="relative flex flex-col lg:flex-row items-start lg:items-center gap-5">
            {/* Icon */}

            <div
              className="
              w-18
              h-18
              md:w-20
              md:h-20
              rounded-2xl
              bg-white/15
              backdrop-blur-lg
              border
              border-white/20
              flex
              items-center
              justify-center
              text-4xl
              shrink-0
              shadow-lg
            "
            >
              {service.emoji}
            </div>

            {/* Text */}

            <div className="flex-1">
              <h1
                className="
                text-3xl
                md:text-4xl
                font-bold
                text-white
                leading-tight
              "
              >
                {service.heroTitle}
              </h1>

              <p
                className="
                mt-3
                max-w-3xl
                text-base
                leading-7
                text-blue-100
              "
              >
                {service.description}
              </p>

              {/* Google Rating */}

              <div
                className="
                mt-5
                inline-flex
                items-center
                gap-3
                rounded-xl
                bg-white/10
                backdrop-blur-lg
                border
                border-white/15
                px-4
                py-2.5
              "
              >
                <div
                  className="
                  w-10
                  h-10
                  rounded-full
                  bg-white
                  flex
                  items-center
                  justify-center
                  shadow-md
                "
                >
                  ⭐
                </div>

                <div>
                  <h4 className="text-white font-semibold text-sm">
                    4.9 Google Rating
                  </h4>

                  <div className="flex items-center gap-0.5 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={13}
                        className="fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceHero;