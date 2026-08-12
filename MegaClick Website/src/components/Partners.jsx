import React, { useRef } from "react";

import qci from "../assets/hero.png";
import iso from "../assets/iso.jpg";
import msme from "../assets/msme.png";
import startup from "../assets/H.png";
import india from "../assets/legal.jpg";
import gst from "../assets/process.png";

const partners = [
  {
    name: "QCI",
    image: qci,
  },
  {
    name: "ISO",
    image: iso,
  },
  {
    name: "MSME",
    image: msme,
  },
  {
    name: "Startup India",
    image: startup,
  },
  {
    name: "Digital India",
    image: india,
  },
  {
    name: "GST",
    image: gst,
  },
];

const Partners = () => {
  const sliderRef = useRef(null);

  // Pause when finger touches the slider
  const handleTouchStart = () => {
    if (sliderRef.current) {
      sliderRef.current.style.animationPlayState = "paused";
    }
  };

  // Resume when finger is removed
  const handleTouchEnd = () => {
    if (sliderRef.current) {
      sliderRef.current.style.animationPlayState = "running";
    }
  };

  return (
    <section
      className="
        py-4
        sm:py-5
        bg-blue-50
        overflow-hidden
      "
    >
      <div
        className="
          max-w-[1500px]
          mx-auto
          px-4
          sm:px-8
          lg:px-16
          xl:px-24
          pt-2
          sm:pt-3
          lg:pt-4
          pb-3
          sm:pb-6
          lg:pb-8
        "
      >
        {/* ================= HEADING ================= */}

        <div
          className="
            text-center
            mb-6
            sm:mb-8
          "
        >
          <h2
            className="
              text-2xl
              sm:text-3xl
              md:text-5xl
              font-bold
              text-gray-800
              leading-tight
            "
          >
            Trusted by Partners like
          </h2>
        </div>

        {/* ================= LOGO SLIDER ================= */}

        <div
          className="
            relative
            overflow-hidden
            w-full
            touch-pan-y
          "
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
        >
          <div
            ref={sliderRef}
            className="
              flex
              items-center
              gap-10
              sm:gap-12
              md:gap-16
              w-max
              animate-scroll
              select-none
            "
          >
            {[...partners, ...partners].map((partner, index) => (
              <div
                key={index}
                className="
                  w-24
                  h-16
                  sm:w-28
                  sm:h-18
                  md:w-32
                  md:h-20
                  flex
                  items-center
                  justify-center
                  flex-shrink-0
                "
              >
                <img
                  src={partner.image}
                  alt={partner.name}
                  loading="lazy"
                  draggable="false"
                  className="
                    max-h-14
                    sm:max-h-16
                    max-w-24
                    sm:max-w-28
                    object-contain
                    pointer-events-none
                  "
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