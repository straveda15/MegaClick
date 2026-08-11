
import React from "react";
import { Star, ShieldCheck } from "lucide-react";

const ServiceHero = ({ service }) => {
  return (
    <section className="w-full bg-gray-50">
      <div
        className="
          max-w-[1500px]
          mx-auto
          px-4
          sm:px-8
          lg:px-16
          xl:px-24
          pt-6
          sm:pt-8
          lg:pt-10
          pb-6
          sm:pb-8
          lg:pb-10
        "
      >
        {/* =========================
            HERO
        ========================== */}
        <div
          className="
            relative
            overflow-hidden
            rounded-3xl
            bg-[#0B4EA2]
            border
            border-[#0B4EA2]
            px-5
            sm:px-8
            lg:px-10
            py-7
            sm:py-9
            lg:py-10
          "
        >
          {/* Subtle Background Shape */}
          <div
            className="
              absolute
              -right-20
              -top-20
              w-56
              h-56
              rounded-full
              border
              border-white/10
            "
          />

          <div
            className="
              absolute
              -right-10
              -top-10
              w-36
              h-36
              rounded-full
              border
              border-white/10
            "
          />

          {/* CONTENT */}
          <div
            className="
              relative
              flex
              flex-col
              lg:flex-row
              lg:items-center
              gap-6
              lg:gap-8
            "
          >
            {/* =========================
                ICON
            ========================== */}
            <div
              className="
                w-16
                h-16
                sm:w-20
                sm:h-20
                shrink-0
                rounded-2xl
                bg-white
                flex
                items-center
                justify-center
                text-3xl
                sm:text-4xl
                shadow-[0_8px_25px_rgba(0,0,0,0.12)]
              "
            >
              {service.emoji}
            </div>

            {/* =========================
                TEXT CONTENT
            ========================== */}
            <div className="flex-1 min-w-0">
              {/* TITLE */}
              <h1
                className="
                  text-2xl
                  sm:text-3xl
                  lg:text-4xl
                  font-bold
                  text-white
                  leading-tight
                  tracking-tight
                "
              >
                {service.heroTitle}
              </h1>

              {/* DESCRIPTION */}
              <p
                className="
                  mt-3
                  max-w-4xl
                  text-sm
                  sm:text-base
                  lg:text-lg
                  text-blue-100
                  leading-7
                "
              >
                {service.description}
              </p>

              {/* =========================
                  RATING
              ========================== */}
              <div
                className="
                  mt-5
                  inline-flex
                  items-center
                  gap-3
                  bg-white
                  rounded-xl
                  px-3
                  sm:px-4
                  py-2.5
                  shadow-[0_6px_20px_rgba(0,0,0,0.10)]
                "
              >
                {/* GOOGLE */}
                <div
                  className="
                    w-9
                    h-9
                    rounded-lg
                    bg-gray-50
                    flex
                    items-center
                    justify-center
                    shrink-0
                  "
                >
                  <span className="text-lg">G</span>
                </div>

                {/* RATING CONTENT */}
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="
                        text-sm
                        font-bold
                        text-gray-900
                      "
                    >
                      4.9
                    </span>

                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={13}
                          className="
                            fill-yellow-400
                            text-yellow-400
                          "
                        />
                      ))}
                    </div>
                  </div>

                  <p
                    className="
                      text-[11px]
                      sm:text-xs
                      text-gray-500
                      mt-0.5
                    "
                  >
                    Google Rating
                  </p>
                </div>
              </div>
            </div>

            {/* =========================
                TRUST BADGE
            ========================== */}
            <div
              className="
                hidden
                lg:flex
                items-center
                gap-2
                shrink-0
                self-start
                bg-white/10
                border
                border-white/15
                rounded-xl
                px-4
                py-3
                text-white
              "
            >
              <ShieldCheck size={20} />

              <div>
                <p className="text-xs font-semibold">
                  Trusted Service
                </p>

                <p className="text-[11px] text-blue-100 mt-0.5">
                  Professional Support
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceHero;
