import React from "react";
import { BriefcaseBusiness } from "lucide-react";
import img1 from "../../assets/img1.jpg";

const HeroSection = () => {
  // =========================================================
  // WAVE TEXT COMPONENT
  // =========================================================
  const WaveText = ({ children }) => {
    return (
      <span
        className="inline break-words"
        aria-label={children}
      >
        {children.split("").map((char, index) => {
          if (char === " ") {
            return (
              <span
                key={index}
                className="inline"
              >
                &nbsp;
              </span>
            );
          }

          return (
            <span
              key={index}
              className="inline-block wave-letter"
              style={{
                animationDelay: `${index * 0.045}s`,
              }}
            >
              {char}
            </span>
          );
        })}
      </span>
    );
  };

  return (
    <>
      {/* =========================================================
          WAVE ANIMATION
      ========================================================= */}

      <style>
        {`
          @keyframes letterWave {
            0%,
            100% {
              transform: translate3d(0, 0, 0);
            }

            20% {
              transform: translate3d(0, -7px, 0);
            }

            40% {
              transform: translate3d(0, 0, 0);
            }

            60% {
              transform: translate3d(0, 4px, 0);
            }

            80% {
              transform: translate3d(0, 0, 0);
            }
          }

          .wave-letter {
            display: inline-block;
            animation-name: letterWave;
            animation-duration: 1.8s;
            animation-timing-function: ease-in-out;
            animation-iteration-count: infinite;
            animation-fill-mode: both;
            will-change: transform;
            transform: translate3d(0, 0, 0);
          }

          /* =====================================================
             MOBILE
             Keep the animation active on mobile
          ===================================================== */

          @media (max-width: 639px) {
            .wave-letter {
              animation-duration: 1.7s;
              will-change: transform;
            }
          }

          /* =====================================================
             TABLET
          ===================================================== */

          @media (min-width: 640px) and (max-width: 1023px) {
            .wave-letter {
              animation-duration: 1.8s;
            }
          }

          /* =====================================================
             REDUCED MOTION
          ===================================================== */

          @media (prefers-reduced-motion: reduce) {
            .wave-letter {
              animation: none !important;
              transform: none !important;
            }
          }
        `}
      </style>

      {/* =========================================================
          HERO SECTION
      ========================================================= */}

      <section
        className="
          relative
          overflow-hidden
          bg-gradient-to-r
          from-[#0B4EA2]
          to-blue-700
          py-8
          sm:py-10
          md:py-12
          lg:py-16
        "
      >

        {/* =======================================================
            LEFT GREEN SLANT
        ======================================================= */}

        <div
          className="
            absolute
            left-0
            top-0
            h-full
            w-7
            sm:w-12
            md:w-20
            lg:w-52
            xl:w-64
            bg-green-600
            opacity-80
            pointer-events-none
          "
          style={{
            clipPath:
              "polygon(0 0, 100% 0, 60% 100%, 0 100%)",
          }}
        />

        {/* =======================================================
            RIGHT GREEN SLANT
        ======================================================= */}

        <div
          className="
            absolute
            right-0
            top-0
            h-full
            w-7
            sm:w-12
            md:w-20
            lg:w-44
            xl:w-56
            bg-green-600
            opacity-80
            pointer-events-none
          "
          style={{
            clipPath:
              "polygon(40% 0, 100% 0, 100% 100%, 0 100%)",
          }}
        />

        {/* =======================================================
            MAIN CONTAINER
        ======================================================= */}

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
            lg:px-16
            xl:px-24
          "
        >

          <div
            className="
              grid
              grid-cols-1
              lg:grid-cols-[0.9fr_1.1fr]
              items-center
              gap-8
              sm:gap-9
              md:gap-10
              lg:gap-12
              min-w-0
            "
          >

            {/* =================================================
                LEFT IMAGE
                POSITION UNCHANGED
            ================================================= */}

            <div
              className="
                flex
                justify-center
                lg:justify-baseline
                items-center
                order-1
                w-full
                min-w-0
              "
            >

              <div
                className="
                  relative
                  translate-x-3
                  sm:translate-x-5
                  md:translate-x-6
                  lg:translate-x-10
                  xl:translate-x-14
                "
              >

                {/* Decorative Circle */}

                <div
                  className="
                    absolute
                    -inset-2
                    sm:-inset-3
                    md:-inset-4
                    rounded-full
                    border
                    border-white/20
                    pointer-events-none
                  "
                />

                {/* Outer Decorative Circle */}

                <div
                  className="
                    absolute
                    -inset-4
                    sm:-inset-5
                    md:-inset-6
                    rounded-full
                    border
                    border-white/10
                    pointer-events-none
                  "
                />

                {/* Image */}

                <div
                  className="
                    relative
                    w-40
                    h-40
                    sm:w-48
                    sm:h-48
                    md:w-56
                    md:h-56
                    lg:w-64
                    lg:h-64
                    xl:w-72
                    xl:h-72
                    rounded-full
                    overflow-hidden
                    border-4
                    sm:border-[6px]
                    border-white/20
                    shadow-2xl
                    bg-white/10
                  "
                >

                  <img
                    src={img1}
                    alt="MegaClick Services"
                    className="
                      w-full
                      h-full
                      object-cover
                    "
                  />

                </div>

              </div>
            </div>


            {/* =================================================
                RIGHT CONTENT
            ================================================= */}

            <div
              className="
                relative
                z-20
                order-2
                w-full
                min-w-0
                max-w-3xl
                mx-auto
                lg:mx-0
                text-white
                text-center
                lg:text-left
              "
            >

              {/* =================================================
                  BADGE
              ================================================= */}

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
                    bg-white/10
                    backdrop-blur-md
                    border
                    border-white/10
                    px-3
                    sm:px-4
                    py-2
                    rounded-full
                    text-xs
                    sm:text-sm
                    font-semibold
                    whitespace-nowrap
                  "
                >

                  <BriefcaseBusiness
                    size={17}
                    className="
                      text-green-300
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
              ================================================= */}

              <h1
                className="
                  mt-4
                  sm:mt-5
                  md:mt-6
                  text-[27px]
                  leading-[1.15]
                  sm:text-3xl
                  sm:leading-tight
                  md:text-4xl
                  lg:text-[42px]
                  lg:leading-[1.15]
                  xl:text-[48px]
                  font-bold
                  tracking-tight
                  break-words
                "
              >

                <span className="block">
                  Professional Services
                </span>

                <span
                  className="
                    block
                    mt-1
                    sm:mt-2
                    text-[23px]
                    leading-[1.2]
                    sm:text-3xl
                    md:text-4xl
                    lg:text-[40px]
                    lg:leading-[1.15]
                    xl:text-[46px]
                    text-green-300
                    break-words
                  "
                >
                  Designed for Every Business
                </span>

              </h1>


              {/* =================================================
                  QUOTE WITH WAVE ANIMATION
              ================================================= */}

              <div
                className="
                  mt-5
                  sm:mt-6
                  md:mt-7
                  w-full
                  max-w-2xl
                  mx-auto
                  lg:mx-0
                  px-1
                  sm:px-2
                  overflow-visible
                "
              >

                <p
                  className="
                    text-black
                    text-[15px]
                    leading-7
                    sm:text-lg
                    sm:leading-8
                    md:text-xl
                    md:leading-9
                    lg:text-2xl
                    lg:leading-relaxed
                    xl:text-[25px]
                    italic
                    font-semibold
                    break-words
                  "
                >

                  {/* Line 1 */}

                  <span className="block">
                    <WaveText>
                      “ONE PLATFORM.
                    </WaveText>
                  </span>


                  {/* Line 2 */}

                  <span className="block">
                    <WaveText>
                      COMPLETE SOLUTIONS FOR
                    </WaveText>
                  </span>


                  {/* Line 3 */}

                  <span className="block">
                    <WaveText>
                      BUSINESSES &amp; INDIVIDUALS”
                    </WaveText>
                  </span>

                </p>

              </div>

            </div>

          </div>

        </div>
      </section>
    </>
  );
};

export default HeroSection;