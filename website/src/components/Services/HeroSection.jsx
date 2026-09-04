import React from "react";
import img1 from "../../assets/img1.jpg";

const HeroSection = () => {
  return (
    <section
      className="
        hero-section
        relative
        overflow-hidden
        bg-[#073FA8]
        min-h-[460px]
        sm:min-h-[500px]
        lg:min-h-[560px]
        flex
        items-center
        py-8
        sm:py-10
        lg:py-12
        font-['Inter',sans-serif]
      "
    >
      {/* GOOGLE FONTS & ULTRA-WIDE MEDIA QUERIES */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hedvig+Letters+Serif:opsz@12..24&family=Inter:wght@400;500;600;700&display=swap');

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

        @media (min-width: 1440px) {
          .app-container {
            max-width: 1440px !important;
            padding-left: 5rem !important;
            padding-right: 5rem !important;
          }
        }

        @media (min-width: 1920px) {
          .app-container {
            max-width: 1800px !important;
            padding-left: 6rem !important;
            padding-right: 6rem !important;
          }

          .hero-section {
            min-height: 620px !important;
            padding-top: 4rem !important;
            padding-bottom: 4rem !important;
          }

          .hero-image-outer {
            width: 400px !important;
            height: 400px !important;
          }

          .hero-image-inner {
            width: 350px !important;
            height: 350px !important;
          }

          .hero-heading-1 {
            font-size: 3.6rem !important;
          }

          .hero-heading-2 {
            font-size: 3rem !important;
          }

          .hero-quote {
            font-size: 1.45rem !important;
            line-height: 1.55 !important;
            max-width: 750px !important;
          }
        }

        @media (min-width: 2560px) {
          .app-container {
            max-width: 2400px !important;
            padding-left: 8rem !important;
            padding-right: 8rem !important;
          }

          .hero-section {
            min-height: 720px !important;
            padding-top: 5rem !important;
            padding-bottom: 5rem !important;
          }

          .hero-image-outer {
            width: 480px !important;
            height: 480px !important;
          }

          .hero-image-inner {
            width: 420px !important;
            height: 420px !important;
          }

          .hero-heading-1 {
            font-size: 4.4rem !important;
          }

          .hero-heading-2 {
            font-size: 3.7rem !important;
          }

          .hero-quote {
            font-size: 1.85rem !important;
            line-height: 1.6 !important;
            max-width: 900px !important;
          }
        }

        @media (min-width: 3840px) {
          .app-container {
            max-width: 3400px !important;
            padding-left: 10rem !important;
            padding-right: 10rem !important;
          }

          .hero-section {
            min-height: 860px !important;
            padding-top: 7rem !important;
            padding-bottom: 7rem !important;
          }

          .hero-image-outer {
            width: 620px !important;
            height: 620px !important;
          }

          .hero-image-inner {
            width: 540px !important;
            height: 540px !important;
          }

          .hero-heading-1 {
            font-size: 5.5rem !important;
          }

          .hero-heading-2 {
            font-size: 4.6rem !important;
          }

          .hero-quote {
            font-size: 2.45rem !important;
            line-height: 1.6 !important;
            max-width: 1100px !important;
          }
        }
      `}</style>

      {/* BLUE BACKGROUND */}
      <div
        className="
          absolute
          inset-0
          bg-gradient-to-br
          from-[#053285]
          via-[#0747C9]
          to-[#053BA1]
          pointer-events-none
        "
      />

      {/* LEFT GREEN SLANT */}
      <div
        className="
          absolute
          left-0
          top-0
          bottom-0
          w-[50px]
          sm:w-[80px]
          md:w-[110px]
          lg:w-[160px]
          xl:w-[190px]
          bg-[#00A86B]
          pointer-events-none
          z-[1]
          opacity-90
        "
        style={{
          clipPath: "polygon(0 0, 100% 0, 58% 100%, 0 100%)",
        }}
      />

      {/* RIGHT GREEN SLANT */}
      <div
        className="
          absolute
          right-0
          top-0
          bottom-0
          w-[55px]
          sm:w-[85px]
          md:w-[115px]
          lg:w-[150px]
          xl:w-[180px]
          bg-[#00A86B]
          pointer-events-none
          z-[1]
          opacity-90
        "
        style={{
          clipPath: "polygon(42% 0, 100% 0, 100% 100%, 0 100%)",
        }}
      />

      {/* TOP LEFT DOTS */}
      <div
        className="
          absolute
          left-[15px]
          sm:left-[28px]
          lg:left-[38px]
          top-[20px]
          sm:top-[32px]
          z-[2]
          opacity-40
          pointer-events-none
        "
      >
        <div className="grid grid-cols-6 gap-[5px]">
          {Array.from({ length: 24 }).map((_, index) => (
            <span
              key={index}
              className="
                w-[3px]
                h-[3px]
                sm:w-[4px]
                sm:h-[4px]
                rounded-full
                bg-white
              "
            />
          ))}
        </div>
      </div>

      {/* TOP RIGHT DOTS */}
      <div
        className="
          absolute
          right-[50px]
          sm:right-[75px]
          lg:right-[120px]
          top-[18px]
          sm:top-[28px]
          z-[2]
          opacity-20
          pointer-events-none
        "
      >
        <div className="grid grid-cols-7 gap-[6px]">
          {Array.from({ length: 28 }).map((_, index) => (
            <span
              key={index}
              className="
                w-[3px]
                h-[3px]
                sm:w-[4px]
                sm:h-[4px]
                rounded-full
                bg-white
              "
            />
          ))}
        </div>
      </div>

      {/* BOTTOM RIGHT DOTS */}
      <div
        className="
          absolute
          right-[18px]
          sm:right-[32px]
          lg:right-[60px]
          bottom-[30px]
          sm:bottom-[45px]
          z-[2]
          opacity-35
          pointer-events-none
        "
      >
        <div className="grid grid-cols-6 gap-[5px]">
          {Array.from({ length: 24 }).map((_, index) => (
            <span
              key={index}
              className="
                w-[3px]
                h-[3px]
                sm:w-[4px]
                sm:h-[4px]
                rounded-full
                bg-white
              "
            />
          ))}
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <div className="relative z-10 app-container">
        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-[0.85fr_1.15fr]
            items-center
            gap-8
            sm:gap-10
            lg:gap-12
            min-w-0
          "
        >
          {/* IMAGE SECTION */}
          <div
            className="
              relative
              flex
              justify-center
              items-center
              w-full
              min-w-0
            "
          >
            <div
              className="
                hero-image-outer
                relative
                flex
                items-center
                justify-center
                w-[190px]
                h-[190px]
                sm:w-[240px]
                sm:h-[240px]
                md:w-[280px]
                md:h-[280px]
                lg:w-[320px]
                lg:h-[320px]
                xl:w-[350px]
                xl:h-[350px]
              "
            >
              {/* OUTER GLOW */}
              <div
                className="
                  absolute
                  inset-[-8px]
                  rounded-full
                  border
                  border-white/20
                  shadow-[0_0_30px_rgba(255,255,255,0.12)]
                "
              />

              {/* OUTER WHITE RING */}
              <div
                className="
                  absolute
                  inset-[-5px]
                  rounded-full
                  border-2
                  border-white/70
                "
              />

              {/* BLUE INNER RING */}
              <div
                className="
                  absolute
                  inset-[-2px]
                  rounded-full
                  border-[3px]
                  sm:border-4
                  border-[#0B4EA2]
                  shadow-[0_0_20px_rgba(75,160,255,0.5)]
                "
              />

              {/* IMAGE */}
              <div
                className="
                  hero-image-inner
                  relative
                  z-10
                  w-[165px]
                  h-[165px]
                  sm:w-[210px]
                  sm:h-[210px]
                  md:w-[245px]
                  md:h-[245px]
                  lg:w-[280px]
                  lg:h-[280px]
                  xl:w-[305px]
                  xl:h-[305px]
                  rounded-full
                  overflow-hidden
                  border-[4px]
                  sm:border-[5px]
                  border-white
                  shadow-[0_10px_30px_rgba(0,0,0,0.35)]
                  bg-white
                "
              >
                <img
                  src={img1}
                  alt="MegaClick Professional Services"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* TOP RIGHT GREEN DOT */}
              <span
                className="
                  absolute
                  z-30
                  right-0
                  sm:right-1
                  top-[22px]
                  sm:top-[30px]
                  w-3.5
                  h-3.5
                  sm:w-4.5
                  sm:h-4.5
                  rounded-full
                  bg-green-400
                  border-2
                  border-white
                  shadow-[0_0_10px_rgba(74,222,128,0.9)]
                "
              />

              {/* BOTTOM LEFT GREEN DOT */}
              <span
                className="
                  absolute
                  z-30
                  left-0
                  sm:left-1
                  bottom-[20px]
                  sm:bottom-[28px]
                  w-3.5
                  h-3.5
                  sm:w-4.5
                  sm:h-4.5
                  rounded-full
                  bg-green-400
                  border-2
                  border-white
                  shadow-[0_0_10px_rgba(74,222,128,0.9)]
                "
              />

              {/* DOTTED ORBIT */}
              <div
                className="
                  absolute
                  inset-[-20px]
                  rounded-full
                  border
                  border-dashed
                  border-white/20
                  pointer-events-none
                "
              />

              {/* ROTATING ORBIT ARC */}
              <div
                className="
                  absolute
                  inset-[-15px]
                  rounded-full
                  border-t-2
                  border-l-2
                  border-white/60
                  pointer-events-none
                  animate-[spin_18s_linear_infinite]
                "
              />
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div
            className="
              relative
              z-20
              w-full
              min-w-0
              max-w-full
              overflow-hidden
              text-white
              text-center
              lg:text-left
            "
          >
            {/* MAIN HEADING */}
            <h1
              style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
              className="
                w-full
                max-w-full
                font-bold
                tracking-tight
                leading-[1.15]
              "
            >
              <span
                className="
                  hero-heading-1
                  block
                  text-3xl
                  sm:text-4xl
                  md:text-5xl
                  lg:text-5xl
                  xl:text-6xl
                  text-white
                  drop-shadow-sm
                "
              >
                Professional Services
              </span>

              <span
                className="
                  hero-heading-2
                  block
                  mt-2
                  sm:mt-2.5
                  text-green-300
                  text-2xl
                  sm:text-3xl
                  md:text-4xl
                  lg:text-4xl
                  xl:text-5xl
                  drop-shadow-sm
                "
              >
                Designed for Every Business
              </span>
            </h1>

            {/* QUOTE / TAGLINE */}
            <div
              className="
                mt-5
                sm:mt-6
                lg:mt-7
                w-full
                max-w-[650px]
                mx-auto
                lg:mx-0
              "
            >
              <p
                style={{ fontFamily: "'Inter', sans-serif" }}
                className="
                  hero-quote
                  text-emerald-200
                  font-semibold
                  text-sm
                  sm:text-base
                  md:text-lg
                  lg:text-xl
                  xl:text-xl
                  leading-relaxed
                  uppercase
                  tracking-wide
                  drop-shadow-xs
                  break-words
                "
              >
                “One Platform Complete Solutions For 
                <br/> Businesses &amp; Individuals”
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM LINE & GLOW */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/20 z-20" />

      <div
        className="
          absolute
          bottom-0
          left-1/2
          -translate-x-1/2
          w-24
          sm:w-32
          h-[3px]
          bg-white
          rounded-full
          blur-[4px]
          opacity-80
          z-20
        "
      />
    </section>
  );
};

export default HeroSection;