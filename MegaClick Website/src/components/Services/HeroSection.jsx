import React from "react";
import { BriefcaseBusiness, ArrowRight } from "lucide-react";
import img1 from "../../assets/img1.jpg";

const HeroSection = () => {
  // Smooth scroll to services section
  const scrollToServices = () => {
    const servicesSection = document.getElementById("services-section");
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      className="
        relative
        overflow-hidden
        bg-[#073FA8]
        min-h-[460px]
        sm:min-h-[500px]
        lg:min-h-[540px]
        flex
        items-center
        py-6
        sm:py-8
        lg:py-10
      "
    >
      {/* =====================================================
          BLUE BACKGROUND
      ====================================================== */}
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

      {/* =====================================================
          LEFT GREEN SLANT
      ====================================================== */}
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

      {/* =====================================================
          RIGHT GREEN SLANT
      ====================================================== */}
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

      {/* =====================================================
          TOP LEFT DOTS
      ====================================================== */}
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
              className="w-[3px] h-[3px] sm:w-[4px] sm:h-[4px] rounded-full bg-white"
            />
          ))}
        </div>
      </div>

      {/* =====================================================
          TOP RIGHT DOTS
      ====================================================== */}
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
              className="w-[3px] h-[3px] sm:w-[4px] sm:h-[4px] rounded-full bg-white"
            />
          ))}
        </div>
      </div>

      {/* =====================================================
          BOTTOM RIGHT DOTS
      ====================================================== */}
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
              className="w-[3px] h-[3px] sm:w-[4px] sm:h-[4px] rounded-full bg-white"
            />
          ))}
        </div>
      </div>

      {/* =====================================================
          MAIN CONTAINER (MOBILE SAFE & PAGE UTILIZED)
      ====================================================== */}
      <div
        className="
          relative
          z-10
          w-full
          max-w-[1500px]
          mx-auto
          px-4
          sm:px-6
          lg:px-12
          xl:px-16
        "
      >
        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-[0.9fr_1.1fr]
            items-center
            gap-6
            sm:gap-8
            lg:gap-10
            min-w-0
          "
        >
          {/* =================================================
              IMAGE SECTION (CLEAN - NO BADGES)
          ================================================== */}
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
                relative
                flex
                items-center
                justify-center
                w-[180px]
                h-[180px]
                sm:w-[230px]
                sm:h-[230px]
                md:w-[270px]
                md:h-[270px]
                lg:w-[310px]
                lg:h-[310px]
                xl:w-[330px]
                xl:h-[330px]
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
                  relative
                  z-10
                  w-[155px]
                  h-[155px]
                  sm:w-[200px]
                  sm:h-[200px]
                  md:w-[235px]
                  md:h-[235px]
                  lg:w-[270px]
                  lg:h-[270px]
                  xl:w-[290px]
                  xl:h-[290px]
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
                  className="
                    w-full
                    h-full
                    object-cover
                  "
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

          {/* =================================================
              RIGHT CONTENT (MOBILE SAFE - NO OVERFLOW)
          ================================================== */}
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
            {/* BADGE */}
            <div
              className="
                flex
                justify-center
                lg:justify-start
                w-full
              "
            >
              <span
                className="
                  inline-flex
                  max-w-full
                  items-center
                  justify-center
                  gap-1.5
                  sm:gap-2
                  px-3
                  sm:px-4
                  py-1
                  sm:py-1.5
                  rounded-full
                  border
                  border-white/25
                  bg-white/10
                  backdrop-blur-md
                  shadow-xs
                  text-[11px]
                  sm:text-xs
                  md:text-sm
                  font-semibold
                  whitespace-nowrap
                "
              >
                <BriefcaseBusiness
                  size={15}
                  className="
                    text-green-400
                    flex-shrink-0
                  "
                />
                <span>Our Professional Services</span>
              </span>
            </div>

            {/* MAIN HEADING WITH GRADIENT */}
            <h1
              className="
                mt-3
                sm:mt-4
                w-full
                max-w-full
                font-extrabold
                tracking-tight
                leading-[1.12]
                break-words
              "
            >
              <span
                className="
                  block
                  text-[22px]
                  sm:text-[30px]
                  md:text-[36px]
                  lg:text-[40px]
                  xl:text-[48px]
                  text-white
                "
              >
                Professional Services
              </span>

              <span
                className="
                  block
                  mt-1
                  bg-gradient-to-r
                  from-green-300
                  via-emerald-400
                  to-teal-200
                  bg-clip-text
                  text-transparent
                  text-[19px]
                  sm:text-[26px]
                  md:text-[32px]
                  lg:text-[36px]
                  xl:text-[42px]
                "
              >
                Designed for Every Business
              </span>
            </h1>

            {/* UNDERLINE ACCENT */}
            <div
              className="
                mt-3
                sm:mt-4
                flex
                justify-center
                lg:justify-start
                items-center
                max-w-full
              "
            >
              <div className="h-[3px] w-12 sm:w-16 bg-green-400 rounded-full flex-shrink-0" />
              <div className="h-[2px] w-16 sm:w-24 bg-white/25 flex-shrink-0" />
            </div>

            {/* QUOTE (HIGH-CONTRAST READABLE TEXT) */}
            <div
              className="
                mt-3.5
                sm:mt-4.5
                w-full
                max-w-[580px]
                mx-auto
                lg:mx-0
              "
            >
              <p
                className="
                  text-emerald-300
                  font-extrabold
                  text-[13px]
                  sm:text-[16px]
                  md:text-[18px]
                  lg:text-[20px]
                  leading-[1.4]
                  uppercase
                  tracking-wide
                  drop-shadow-xs
                  break-words
                "
              >
                <span className="block">
                  “ONE PLATFORM.
                </span>
                <span className="block">
                  COMPLETE SOLUTIONS FOR
                </span>
                <span className="block">
                  BUSINESSES &amp; INDIVIDUALS”
                </span>
              </p>
            </div>

            {/* ACTION CTA BUTTON */}
            <div className="mt-5 sm:mt-6 flex justify-center lg:justify-start">
              <button
                type="button"
                onClick={scrollToServices}
                className="
                  group
                  inline-flex
                  items-center
                  gap-2
                  bg-green-500
                  hover:bg-green-400
                  active:bg-green-600
                  text-gray-950
                  font-extrabold
                  text-xs
                  sm:text-sm
                  px-5
                  sm:px-6
                  py-2.5
                  sm:py-3
                  rounded-xl
                  shadow-md
                  shadow-green-500/25
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  cursor-pointer
                "
              >
                <span>Explore All Services</span>
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* =====================================================
          BOTTOM LINE & GLOW
      ====================================================== */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/20 z-20" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 sm:w-32 h-[3px] bg-white rounded-full blur-[4px] opacity-80 z-20" />
    </section>
  );
};

export default HeroSection;