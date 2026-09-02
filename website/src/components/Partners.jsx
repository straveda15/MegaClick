import React, { useRef, useState } from "react";
import qci from "../assets/hero.png";
import iso from "../assets/iso.jpg";
import msme from "../assets/msme.png";
import startup from "../assets/H.png";
import india from "../assets/legal.jpg";
import gst from "../assets/process.png";

const partners = [
  { name: "QCI", image: qci },
  { name: "ISO", image: iso },
  { name: "MSME", image: msme },
  { name: "Startup India", image: startup },
  { name: "Digital India", image: india },
  { name: "GST", image: gst },
];

const Partners = () => {
  const sliderRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  const handleTouchStart = () => setIsPaused(true);
  const handleTouchEnd = () => setIsPaused(false);

  return (
    <section className="w-full py-8 sm:py-10 lg:py-12 min-[1920px]:py-16 min-[3840px]:py-24 bg-white overflow-hidden font-['Inter',sans-serif]">
      {/* DIRECT CSS RESPONSIVE RULES */}
      <style>{`
        @keyframes partners-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-partners-scroll {
          animation: partners-scroll 28s linear infinite;
        }

        /* Standard Desktop (1440px) */
        @media (min-width: 1440px) {
          .partners-container {
            max-width: 1380px !important;
            padding-left: 2.5rem !important;
            padding-right: 2.5rem !important;
          }
          .partners-heading {
            font-size: 2.25rem !important;
          }
        }

        /* Large Desktop (1920px Full HD) */
        @media (min-width: 1920px) {
          .partners-container {
            max-width: 1800px !important;
            padding-left: 4rem !important;
            padding-right: 4rem !important;
          }
          .partners-heading {
            font-size: 3rem !important;
            margin-bottom: 2rem !important;
          }
          .partner-logo-item {
            width: 10rem !important;
            height: 5.5rem !important;
          }
          .partner-logo-img {
            max-height: 4.5rem !important;
            max-width: 9rem !important;
          }
        }

        /* 4K Ultra-Wide Desktop (3840px) */
        @media (min-width: 3840px) {
          .partners-container {
            max-width: 3200px !important;
            padding-left: 6rem !important;
            padding-right: 6rem !important;
          }
          .partners-heading {
            font-size: 5rem !important;
            margin-bottom: 3.5rem !important;
          }
          .partner-logo-item {
            width: 16rem !important;
            height: 9rem !important;
          }
          .partner-logo-img {
            max-height: 7.5rem !important;
            max-width: 14rem !important;
          }
        }
      `}</style>

      {/* UNIFIED CONTAINER */}
      <div className="partners-container w-full max-w-[1380px] mx-auto px-4 sm:px-6 min-[1440px]:px-10">
        
        {/* HEADING (EXACT FONT-BOLD WEIGHT) */}
        <div className="text-center mb-6 sm:mb-8">
             <h2
            style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
            className="
              team-title
              text-2xl
              sm:text-3xl
              md:text-3xl
              lg:text-3xl
              font-bold
              leading-[1.18]
              text-black
              text-center
              mb-2.5
              sm:mb-4
            "
          >
        Trusted by Partners like

          </h2>
        </div>

        {/* LOGO SLIDER */}
        <div
          className="relative overflow-hidden w-full touch-pan-y py-2"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
        >
          {/* FADE EDGES */}
          <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <div
            ref={sliderRef}
            className="flex items-center gap-10 sm:gap-14 md:gap-16 lg:gap-20 w-max animate-partners-scroll select-none"
            style={{
              animationPlayState: isPaused ? "paused" : "running",
            }}
          >
            {[...partners, ...partners, ...partners, ...partners].map(
              (partner, index) => (
                <div
                  key={index}
                  className="partner-logo-item w-24 h-14 sm:w-28 sm:h-16 md:w-32 md:h-18 flex items-center justify-center shrink-0"
                >
                  <img
                    src={partner.image}
                    alt={partner.name}
                    loading="lazy"
                    draggable="false"
                    className="partner-logo-img max-h-12 sm:max-h-14 max-w-28 sm:max-w-32 object-contain pointer-events-none transition-transform duration-300 hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;