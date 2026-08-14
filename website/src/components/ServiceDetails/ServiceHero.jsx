import React from "react";
import { useNavigate } from "react-router-dom";
import { Star, ShieldCheck, ChevronLeft } from "lucide-react";

const ServiceHero = ({ service }) => {
  const navigate = useNavigate();

  return (
    <section className="w-full bg-slate-50 py-4 sm:py-6 lg:py-8">
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
            BACK BUTTON
        ========================================== */}
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="Go back"
          className="
            mb-4
            sm:mb-6
            w-11
            h-11
            sm:w-12
            sm:h-12
            flex
            items-center
            justify-center
            rounded-full
            border-2
            border-[#0B4EA2]
            text-[#0B4EA2]
            bg-white
            transition-all
            duration-200
            hover:bg-[#0B4EA2]
            hover:text-white
            hover:shadow-md
            cursor-pointer
          "
        >
          <ChevronLeft size={22} strokeWidth={2.5} />
        </button>

        {/* =========================================
            HERO CONTAINER (RICH GRADIENT & GLOWS)
        ========================================== */}
        <div
          className="
            relative
            overflow-hidden
            rounded-3xl
            bg-gradient-to-r
            from-[#0B4EA2]
            via-[#093e82]
            to-[#0A8F55]
            px-6
            sm:px-10
            lg:px-12
            py-8
            sm:py-12
            lg:py-14
            shadow-xl
            border
            border-blue-900/40
          "
        >
          {/* Glowing Background Blobs */}
          <div
            className="
              absolute
              -right-16
              -top-16
              w-72
              h-72
              rounded-full
              bg-white/10
              blur-3xl
              pointer-events-none
            "
          />
          <div
            className="
              absolute
              right-1/4
              -bottom-20
              w-64
              h-64
              rounded-full
              bg-emerald-500/20
              blur-3xl
              pointer-events-none
            "
          />

          {/* CONTENT GRID */}
          <div
            className="
              relative
              z-10
              flex
              flex-col
              lg:flex-row
              lg:items-center
              gap-6
              lg:gap-10
            "
          >
            {/* =========================================
                ICON (WITH PREMIUM GLOW & SCALE)
            ========================================== */}
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
                shadow-[0_12px_30px_rgba(0,0,0,0.15)]
                ring-4
                ring-white/10
                transition-all
                duration-300
                hover:scale-105
                hover:rotate-3
              "
            >
              {service.emoji}
            </div>

            {/* =========================================
                TEXT CONTENT
            ========================================== */}
            <div className="flex-1 min-w-0">
              {/* TITLE */}
              <h1
                className="
                  text-2xl
                  sm:text-3xl
                  lg:text-4xl
                  font-extrabold
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
                  text-blue-50/90
                  font-medium
                  leading-relaxed
                "
              >
                {service.description}
              </p>

              {/* =========================================
                  GLASSMORPHIC RATING BADGE
              ========================================== */}
              <div
                className="
                  mt-6
                  inline-flex
                  items-center
                  gap-3.5
                  bg-white/10
                  backdrop-blur-md
                  border
                  border-white/15
                  rounded-xl
                  px-4
                  py-2.5
                  shadow-lg
                "
              >
                {/* Google "G" Icon Badge */}
                <div
                  className="
                    w-8
                    h-8
                    rounded-lg
                    bg-white
                    flex
                    items-center
                    justify-center
                    shrink-0
                    shadow-xs
                  "
                >
                  <span className="text-base font-extrabold text-blue-800">G</span>
                </div>

                {/* Rating Content */}
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="
                        text-sm
                        font-extrabold
                        text-white
                      "
                    >
                      4.9
                    </span>

                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
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
                      text-[10px]
                      sm:text-xs
                      text-blue-200/90
                      font-semibold
                      mt-0.5
                    "
                  >
                    Google Rating
                  </p>
                </div>
              </div>
            </div>

            {/* =========================================
                TRUST BADGE (RESPONSIVE ALIGNMENT)
            ========================================== */}
            <div
              className="
                flex
                items-center
                gap-2.5
                shrink-0
                self-start
                lg:self-center
                bg-white/10
                border
                border-white/15
                rounded-xl
                px-4
                py-3
                text-white
                shadow-xs
                transition-all
                duration-300
                hover:bg-white/15
              "
            >
              <ShieldCheck size={20} className="text-emerald-400" />

              <div>
                <p className="text-xs font-bold tracking-wide uppercase">
                  Trusted Service
                </p>

                <p className="text-[10px] text-blue-100/80 mt-0.5 font-medium">
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