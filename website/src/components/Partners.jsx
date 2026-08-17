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
        relative
        overflow-hidden
        py-8
        sm:py-10
        lg:py-12
        bg-gradient-to-br
        from-blue-50
        to-white
      "
    >
      {/* ================= DECORATIVE BLUR ================= */}

      <div
        className="
          absolute
          -top-24
          -left-24
          w-72
          h-72
          rounded-full
          bg-blue-200/40
          blur-3xl
          -z-10
        "
      />

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
        {/* ================= HEADING ================= */}

        <div
          className="
            text-center
            mb-5
            sm:mb-6
          "
        >
          <h2
            className="
              text-lg
              sm:text-xl
              lg:text-2xl
              font-bold
              text-[#0B4EA2]
            "
          >
            Trusted by Partners like
          </h2>
        </div>

        {/* ================= LOGO SLIDER CARD ================= */}

        <div
          className="
            relative
            overflow-hidden
            w-full
            touch-pan-y
            bg-white
            border
            border-blue-100
            shadow-lg
            px-4
            sm:px-8
            py-6
            sm:py-8
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