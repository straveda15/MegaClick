import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Star } from "lucide-react";

const ServiceHero = ({ service }) => {
  const navigate = useNavigate();

  if (!service) return null;

  const title = service.heroTitle || service.title || "Service Details";

  return (
    <section className="w-full bg-slate-50 pt-0 pb-6 sm:pb-8 font-['Inter',sans-serif]">
      {/* GOOGLE FONTS & RESPONSIVE STYLES */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hedvig+Letters+Serif:opsz@12..24&family=Inter:wght@400;500;600;700&display=swap');

        .service-hero-title {
          word-spacing: 0.18em;
          letter-spacing: 0.01em;
        }

        @media (min-width: 1920px) {
          .service-hero-container { max-width: 1800px !important; padding-left: 4rem !important; padding-right: 4rem !important; }
          .service-hero-title { font-size: 3rem !important; word-spacing: 0.2em !important; }
          .service-hero-desc  { font-size: 1.2rem !important; line-height: 2rem !important; }
          .service-hero-img-wrap { width: 20rem !important; }
        }
        @media (min-width: 3840px) {
          .service-hero-container { max-width: 3200px !important; padding-left: 6rem !important; padding-right: 6rem !important; }
          .service-hero-title { font-size: 5rem !important; word-spacing: 0.25em !important; }
          .service-hero-desc  { font-size: 2rem !important; line-height: 3rem !important; }
          .service-hero-img-wrap { width: 34rem !important; }
        }
      `}</style>

      <div className="service-hero-container max-w-[1380px] mx-auto px-4 sm:px-6 min-[1440px]:px-10 pt-1">
        {/* OUTSIDE BACK ARROW (CLEAN / NO CIRCLE) */}
        <div className="flex items-center justify-start mb-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="
              group
              inline-flex items-center justify-center
              text-slate-600 hover:text-[#0B4EA2]
              transition-colors duration-200
              p-1 -ml-1
              cursor-pointer
            "
          >
            <ArrowLeft
              size={24}
              strokeWidth={2.4}
              className="group-hover:-translate-x-1 transition-transform duration-200"
            />
          </button>
        </div>

        {/* HERO CARD */}
        <div
          className="
            relative overflow-hidden
            rounded-2xl sm:rounded-3xl
            bg-gradient-to-r from-[#0B4EA2] via-[#093e82] to-[#0A8F55]
            px-6 sm:px-10 lg:px-12
            py-6 sm:py-9 lg:py-11
            shadow-xl border border-blue-900/40
          "
        >
          {/* Background Blobs */}
          <div className="absolute -left-20 -top-20 w-72 h-72 rounded-full bg-white/5 blur-3xl pointer-events-none" />
          <div className="absolute left-1/3 bottom-0 w-64 h-64 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />

          {/* CONTENT ROW */}
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-10">

            {/* LEFT — TEXT */}
            <div className="flex-1 min-w-0 text-left">
              <h1
                style={{
                  fontFamily: "'Hedvig Letters Serif', serif",
                  wordSpacing: "0.18em",
                }}
                className="
                  service-hero-title
                  text-2xl sm:text-3xl md:text-3xl lg:text-4xl
                  font-bold text-white
                  leading-[1.28] tracking-normal
                "
              >
                {title}
              </h1>

              {service.description && (
                <p
                  style={{ fontFamily: "'Inter', sans-serif" }}
                  className="
                    service-hero-desc
                    mt-3 sm:mt-4
                    text-sm sm:text-base lg:text-[1.05rem]
                    text-blue-50/90
                    font-normal
                    leading-7 sm:leading-8
                    max-w-none
                    w-full
                    break-words
                  "
                >
                  {service.description}
                </p>
              )}

              {/* GOOGLE RATING BADGE */}
              <div
                className="
                  mt-5 sm:mt-6
                  inline-flex items-center gap-3
                  bg-white/10 backdrop-blur-md
                  border border-white/15
                  rounded-xl px-3 py-2 sm:px-4 sm:py-2.5
                  shadow-md
                "
              >
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-white flex items-center justify-center shrink-0">
                  <span
                    style={{ fontFamily: "'Inter', sans-serif" }}
                    className="text-sm font-extrabold text-blue-800"
                  >
                    G
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span
                      style={{ fontFamily: "'Inter', sans-serif" }}
                      className="text-sm font-extrabold text-white"
                    >
                      4.9
                    </span>
                    {/* 🟢 Emerald Green Stars */}
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={12}
                          className="fill-emerald-400 text-emerald-400"
                        />
                      ))}
                    </div>
                  </div>
                  <p
                    style={{ fontFamily: "'Inter', sans-serif" }}
                    className="text-[10px] sm:text-xs text-blue-200/90 font-medium mt-0.5"
                  >
                    Google Rating
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT — FLOATING IMAGE */}
            <div
              className="
                service-hero-img-wrap
                hidden lg:flex
                items-center justify-center
                shrink-0
                w-56 xl:w-64
              "
            >
              {service.image ? (
                <img
                  src={service.image}
                  alt={title}
                  loading="lazy"
                  className="w-full h-auto object-contain drop-shadow-2xl"
                />
              ) : (
                <span className="text-8xl select-none">
                  {service.emoji || "📋"}
                </span>
              )}
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceHero;