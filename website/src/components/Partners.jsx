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
    <section className="relative overflow-hidden py-8 sm:py-10 lg:py-12 bg-white partners-section">
      {/* UNIFIED APP-CONTAINER (EXACT MATCH WITH NAVBAR & OTHER SECTIONS) */}
      <style>{`
        .app-container {
          width: 100%;
          max-width: 1500px;
          margin-left: auto;
          margin-right: auto;
          padding-left: 1.25rem;
          padding-right: 1.25rem;
        }

        @media (min-width: 640px) {
          .app-container {
            padding-left: 2rem;
            padding-right: 2rem;
          }
        }

        @media (min-width: 1024px) {
          .app-container {
            padding-left: 4rem;
            padding-right: 4rem;
          }
        }

        @media (min-width: 1280px) {
          .app-container {
            padding-left: 6rem;
            padding-right: 6rem;
          }
        }

        /* Standard Desktop (1440px x 900px) */
        @media (min-width: 1440px) {
          .app-container {
            max-width: 1440px !important;
            padding-left: 5rem !important;
            padding-right: 5rem !important;
          }
        }

        /* Large Desktop (1920px x 1080px Full HD) */
        @media (min-width: 1920px) {
          .app-container {
            max-width: 1800px !important;
            padding-left: 6rem !important;
            padding-right: 6rem !important;
          }
          .partners-section {
            padding-top: 4.5rem !important;
            padding-bottom: 4.5rem !important;
          }
          .partners-title {
            font-size: 3.25rem !important;
            margin-bottom: 2.5rem !important;
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

        /* QHD / 2K Ultra-Wide (2560px Desktop) */
        @media (min-width: 2560px) {
          .app-container {
            max-width: 2400px !important;
            padding-left: 8rem !important;
            padding-right: 8rem !important;
          }
          .partners-section {
            padding-top: 6rem !important;
            padding-bottom: 6rem !important;
          }
          .partners-title {
            font-size: 4.25rem !important;
            margin-bottom: 3.5rem !important;
          }
          .partner-logo-item {
            width: 13rem !important;
            height: 7rem !important;
          }
          .partner-logo-img {
            max-height: 5.5rem !important;
            max-width: 11.5rem !important;
          }
        }

        /* 4K Ultra-Wide Desktop (3840px x 2160px) */
        @media (min-width: 3840px) {
          .app-container {
            max-width: 3400px !important;
            padding-left: 10rem !important;
            padding-right: 10rem !important;
          }
          .partners-section {
            padding-top: 8rem !important;
            padding-bottom: 8rem !important;
          }
          .partners-title {
            font-size: 6rem !important;
            margin-bottom: 5rem !important;
          }
          .partner-logo-item {
            width: 18rem !important;
            height: 10rem !important;
          }
          .partner-logo-img {
            max-height: 8rem !important;
            max-width: 16rem !important;
          }
        }
      `}</style>

      <div className="app-container">
        {/* ================= HEADING ================= */}
        <div className="text-center mb-6 sm:mb-8">
          <h2
            style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
            className="
              partners-title
              text-3xl
              sm:text-3xl
              md:text-3xl
              lg:text-3xl
              xl:text-4xl
              font-bold
              leading-[1.18]
              text-black
              text-center
            "
          >
            Trusted by Partners like
          </h2>
        </div>

        {/* ================= CLEAN LOGO SLIDER ================= */}
        <div
          className="relative overflow-hidden w-full touch-pan-y"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
        >
          <div
            ref={sliderRef}
            className="flex items-center gap-10 sm:gap-14 md:gap-16 lg:gap-20 w-max animate-scroll select-none"
            style={{
              animationPlayState: isPaused ? "paused" : "running",
            }}
          >
            {[...partners, ...partners, ...partners].map((partner, index) => (
              <div
                key={index}
                className="partner-logo-item w-24 h-14 sm:w-28 sm:h-16 md:w-32 md:h-18 flex items-center justify-center flex-shrink-0"
              >
                <img
                  src={partner.image}
                  alt={partner.name}
                  loading="lazy"
                  draggable="false"
                  className="partner-logo-img max-h-12 sm:max-h-14 max-w-28 sm:max-w-32 object-contain pointer-events-none"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;