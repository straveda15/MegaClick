import React from "react";
import { BriefcaseBusiness } from "lucide-react";
import img1 from "../../assets/img1.jpg";

const HeroSection = () => {
  return (
    <section
      className="
        relative
        overflow-hidden
        bg-[#073FA8]
        min-h-[540px]
        sm:min-h-[570px]
        md:min-h-[600px]
        lg:min-h-[620px]
        flex
        items-center
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
          from-[#063D9E]
          via-[#0847C5]
          to-[#0641A9]
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
          w-[70px]
          sm:w-[95px]
          md:w-[125px]
          lg:w-[180px]
          xl:w-[210px]
          2xl:w-[230px]
          bg-[#00A86B]
          pointer-events-none
          z-[1]
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
          w-[75px]
          sm:w-[100px]
          md:w-[125px]
          lg:w-[165px]
          xl:w-[195px]
          2xl:w-[220px]
          bg-[#00A86B]
          pointer-events-none
          z-[1]
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
          left-[22px]
          sm:left-[30px]
          lg:left-[42px]
          top-[30px]
          sm:top-[40px]
          lg:top-[48px]
          z-[2]
          opacity-50
          pointer-events-none
        "
      >
        <div className="grid grid-cols-6 gap-[6px]">
          {Array.from({ length: 24 }).map((_, index) => (
            <span
              key={index}
              className="
                w-[4px]
                h-[4px]
                rounded-full
                bg-white
              "
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
          right-[65px]
          sm:right-[85px]
          lg:right-[135px]
          xl:right-[165px]
          top-[25px]
          sm:top-[35px]
          lg:top-[42px]
          z-[2]
          opacity-20
          pointer-events-none
        "
      >
        <div className="grid grid-cols-7 gap-[7px]">
          {Array.from({ length: 28 }).map((_, index) => (
            <span
              key={index}
              className="
                w-[4px]
                h-[4px]
                rounded-full
                bg-white
              "
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
          right-[25px]
          sm:right-[40px]
          lg:right-[70px]
          xl:right-[90px]
          bottom-[45px]
          sm:bottom-[55px]
          lg:bottom-[70px]
          z-[2]
          opacity-35
          pointer-events-none
        "
      >
        <div className="grid grid-cols-6 gap-[6px]">
          {Array.from({ length: 24 }).map((_, index) => (
            <span
              key={index}
              className="
                w-[4px]
                h-[4px]
                rounded-full
                bg-white
              "
            />
          ))}
        </div>
      </div>

      {/* =====================================================
          MAIN CONTAINER
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
          md:px-8
          lg:px-14
          xl:px-20
          py-7
          sm:py-8
          md:py-9
          lg:py-10
        "
      >
        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-[0.92fr_1.08fr]
            items-center
            gap-7
            sm:gap-8
            md:gap-9
            lg:gap-8
            xl:gap-10
            min-w-0
          "
        >
          {/* =================================================
              IMAGE SECTION
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
                w-[220px]
                h-[220px]
                sm:w-[260px]
                sm:h-[260px]
                md:w-[290px]
                md:h-[290px]
                lg:w-[330px]
                lg:h-[330px]
                xl:w-[350px]
                xl:h-[350px]
              "
            >
              {/* OUTER GLOW */}

              <div
                className="
                  absolute
                  inset-[-10px]
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
                  inset-[-6px]
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
                  border-4
                  border-[#0B4EA2]
                  shadow-[0_0_22px_rgba(75,160,255,0.5)]
                "
              />

              {/* IMAGE */}

              <div
                className="
                  relative
                  z-10
                  w-[195px]
                  h-[195px]
                  sm:w-[230px]
                  sm:h-[230px]
                  md:w-[255px]
                  md:h-[255px]
                  lg:w-[290px]
                  lg:h-[290px]
                  xl:w-[310px]
                  xl:h-[310px]
                  rounded-full
                  overflow-hidden
                  border-[5px]
                  sm:border-[6px]
                  border-white
                  shadow-[0_12px_35px_rgba(0,0,0,0.35)]
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
                  md:right-2
                  top-[30px]
                  sm:top-[35px]
                  md:top-[40px]
                  w-4
                  h-4
                  sm:w-5
                  sm:h-5
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
                  md:left-2
                  bottom-[28px]
                  sm:bottom-[34px]
                  md:bottom-[38px]
                  w-4
                  h-4
                  sm:w-5
                  sm:h-5
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
                  inset-[-24px]
                  rounded-full
                  border
                  border-dashed
                  border-white/20
                  pointer-events-none
                "
              />

              {/* ORBIT ARC */}

              <div
                className="
                  absolute
                  inset-[-18px]
                  rounded-full
                  border-t-2
                  border-l-2
                  border-white/50
                  rotate-[18deg]
                  pointer-events-none
                "
              />
            </div>
          </div>

          {/* =================================================
              RIGHT CONTENT
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
            {/* =================================================
                BADGE
            ================================================== */}

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
                  gap-2
                  px-3
                  sm:px-4
                  py-1.5
                  sm:py-2
                  rounded-full
                  border
                  border-white/25
                  bg-white/5
                  shadow-[0_5px_18px_rgba(0,0,0,0.15)]
                  text-xs
                  sm:text-sm
                  font-semibold
                  whitespace-nowrap
                "
              >
                <BriefcaseBusiness
                  size={16}
                  className="
                    text-green-400
                    flex-shrink-0
                  "
                />

                <span>
                  Our Professional Services
                </span>
              </span>
            </div>

            {/* =================================================
                MAIN HEADING
            ================================================== */}

            <h1
              className="
                mt-4
                sm:mt-5
                lg:mt-6
                w-full
                max-w-full
                font-extrabold
                tracking-tight
                leading-[1.08]
                break-words
              "
            >
              <span
                className="
                  block
                  text-[28px]
                  sm:text-[35px]
                  md:text-[42px]
                  lg:text-[45px]
                  xl:text-[52px]
                  text-white
                  break-words
                "
              >
                Professional Services
              </span>

              <span
                className="
                  block
                  mt-1
                  sm:mt-2
                  text-[23px]
                  sm:text-[30px]
                  md:text-[36px]
                  lg:text-[40px]
                  xl:text-[47px]
                  text-green-300
                  break-words
                "
              >
                Designed for Every Business
              </span>
            </h1>

            {/* =================================================
                UNDERLINE
            ================================================== */}

            <div
              className="
                mt-4
                sm:mt-5
                flex
                justify-center
                lg:justify-start
                items-center
                max-w-full
              "
            >
              <div
                className="
                  h-[3px]
                  w-14
                  sm:w-20
                  bg-green-400
                  rounded-full
                  flex-shrink-0
                "
              />

              <div
                className="
                  h-[2px]
                  w-20
                  sm:w-28
                  bg-white/20
                  flex-shrink-0
                "
              />
            </div>

            {/* =================================================
                QUOTE
            ================================================== */}

            <div
              className="
                mt-4
                sm:mt-5
                lg:mt-6
                w-full
                max-w-[600px]
                mx-auto
                lg:mx-0
                overflow-hidden
              "
            >
              <p
                className="
                  text-black
                  italic
                  font-bold
                  text-[15px]
                  sm:text-[18px]
                  md:text-[20px]
                  lg:text-[22px]
                  xl:text-[24px]
                  leading-[1.55]
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
          </div>
        </div>
      </div>

      {/* =====================================================
          BOTTOM LINE
      ====================================================== */}

      <div
        className="
          absolute
          bottom-0
          left-0
          right-0
          h-px
          bg-white/20
          z-20
        "
      />

      {/* CENTER GLOW */}

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
          opacity-70
          z-20
        "
      />
    </section>
  );
};

export default HeroSection;