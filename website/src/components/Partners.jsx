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
    <section className="relative overflow-hidden py-8 sm:py-10 lg:py-12 bg-white">
      <div className="max-w-[1450px] mx-auto px-4 sm:px-8 lg:px-16 xl:px-20">

        {/* ================= HEADING (Hedvig Letters Serif — Black, Centered) ================= */}
        <div className="text-center mb-6 sm:mb-8">
          <h1
            className="text-2xl sm:text-3xl lg:text-[40px] font-medium text-[#0f172a] tracking-tight"
            style={{ fontFamily: '"Hedvig Letters Serif", Georgia, serif', fontWeight: 500 }}
          >
            Trusted by Partners like
          </h1>
        </div>

        {/* ================= CLEAN LOGO SLIDER (No Border / No Card / No Shadow) ================= */}
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
                className="w-24 h-14 sm:w-28 sm:h-16 md:w-32 md:h-18 flex items-center justify-center flex-shrink-0"
              >
                <img
                  src={partner.image}
                  alt={partner.name}
                  loading="lazy"
                  draggable="false"
                  className="max-h-12 sm:max-h-14 max-w-28 sm:max-w-32 object-contain pointer-events-none"
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