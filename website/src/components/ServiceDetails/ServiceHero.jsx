
import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const ServiceHero = ({ service }) => {
  const navigate = useNavigate();

  if (!service) return null;

  const title = service.heroTitle || service.title || "Service Details";

  return (
  <section className="w-full bg-gradient-to-r from-[#0B4EA2] via-[#093e82] to-[#0A8F55] pt-0 pb-6 sm:pb-8 font-['Inter',sans-serif]">
      {/* GOOGLE FONTS & RESPONSIVE STYLES */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

        .service-hero-title {
          word-spacing: 0.18em;
          letter-spacing: 0.01em;
        }

        /* 1440px - Services.jsx reference */
        @media (min-width: 1440px) {
          .service-hero-container {
            max-width: 1380px !important;
            padding-left: 2.5rem !important;
            padding-right: 2.5rem !important;
          }

          .service-hero-title {
            font-size: 2.5rem !important;
            line-height: 1.2 !important;
            word-spacing: 0.18em !important;
          }

          .service-hero-desc {
            font-size: 0.95rem !important;
            line-height: 1.65 !important;
          }

          .service-hero-img-wrap {
            width: 18rem !important;
          }

          .service-hero-card {
            padding-left: 2rem !important;
            padding-right: 2rem !important;
            padding-top: 2rem !important;
            padding-bottom: 2rem !important;
          }
        }

        /* 1920px - Services.jsx reference */
        @media (min-width: 1920px) {
          .service-hero-container {
            max-width: 1800px !important;
            padding-left: 4rem !important;
            padding-right: 4rem !important;
          }

          .service-hero-title {
            font-size: 3.25rem !important;
            line-height: 1.18 !important;
            word-spacing: 0.2em !important;
          }

          .service-hero-desc {
            font-size: 1.15rem !important;
            line-height: 1.8 !important;
          }

          .service-hero-img-wrap {
            width: 20rem !important;
          }

          .service-hero-card {
            padding-left: 2.5rem !important;
            padding-right: 2.5rem !important;
            padding-top: 2.5rem !important;
            padding-bottom: 2.5rem !important;
          }
        }

        /* 2560px */
        @media (min-width: 2560px) {
          .service-hero-container {
            max-width: 2300px !important;
            padding-left: 5rem !important;
            padding-right: 5rem !important;
          }

          .service-hero-title {
            font-size: 3.75rem !important;
            line-height: 1.18 !important;
            word-spacing: 0.22em !important;
          }

          .service-hero-desc {
            font-size: 1.35rem !important;
            line-height: 2.15rem !important;
          }

          .service-hero-img-wrap {
            width: 26rem !important;
          }

          .service-hero-card {
            padding-left: 3rem !important;
            padding-right: 3rem !important;
            padding-top: 3rem !important;
            padding-bottom: 3rem !important;
            border-radius: 1.75rem !important;
          }
        }

        /* 3840px - Services.jsx reference */
        @media (min-width: 3840px) {
          .service-hero-container {
            max-width: 3200px !important;
            padding-left: 6rem !important;
            padding-right: 6rem !important;
          }

          .service-hero-title {
            font-size: 5rem !important;
            line-height: 1.15 !important;
            word-spacing: 0.25em !important;
          }

          .service-hero-desc {
            font-size: 1.75rem !important;
            line-height: 1.8 !important;
          }

          .service-hero-img-wrap {
            width: 32rem !important;
          }

          .service-hero-card {
            padding-left: 4rem !important;
            padding-right: 4rem !important;
            padding-top: 4rem !important;
            padding-bottom: 4rem !important;
            border-radius: 2rem !important;
          }
        }
      `}</style>

      <div
  className="
    service-hero-container
    w-full
    pt-1
  "
>
        {/* OUTSIDE BACK ARROW */}
        <div className="flex items-center justify-start mb-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="
              group
              inline-flex items-center justify-center
              text-slate-600
              hover:text-[#0B4EA2]
              transition-colors duration-200
              p-1 -ml-1
              cursor-pointer
            "
          >
            <ArrowLeft
              size={24}
              strokeWidth={2.4}
              className="
                group-hover:-translate-x-1
                transition-transform duration-200
              "
            />
          </button>
        </div>

        {/* HERO CARD */}
        <div
  className="
  service-hero-card
  relative
  w-full
  overflow-hidden
  bg-transparent
  py-8 sm:py-10 lg:py-12
"
>
          {/* Background Blobs */}
          <div className="absolute -left-20 -top-20 w-72 h-72 rounded-full bg-white/5 blur-3xl pointer-events-none" />

          <div className="absolute left-1/3 bottom-0 w-64 h-64 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />

          {/* CONTENT ROW */}
<div className="relative z-10 w-full px-6 sm:px-10 lg:px-16 flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-10">       
       <div className="flex-1 min-w-0 text-left">
              <h1
                style={{
                  fontFamily: "'Poppins', serif",
                  wordSpacing: "0.18em",
                }}
                className="
                  service-hero-title
                  text-2xl sm:text-3xl md:text-3xl lg:text-4xl
                  font-bold
                  text-white
                  leading-[1.28]
                  tracking-normal
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

</div>

{/* RIGHT — IMAGE */}
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
                  className="
                    w-full
                    h-auto
                    object-contain
                    drop-shadow-2xl
                  "
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
