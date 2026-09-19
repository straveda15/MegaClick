import React from "react";
import VisionMission from "./VisionMission";

const HeroSection = () => {
  return (
    <>
      <section className="about-hero relative w-full overflow-hidden font-['Inter',sans-serif]">

        {/* GOOGLE FONTS */}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800&display=swap');

          .about-hero-container {
            width: 100%;
            max-width: 1380px;
            margin-left: auto;
            margin-right: auto;
            padding-left: 1rem;
            padding-right: 1rem;
          }

          @media (min-width: 640px) {
            .about-hero-container {
              padding-left: 1.5rem;
              padding-right: 1.5rem;
            }
          }

          /* ── Standard Desktop 1440px ── */
          @media (min-width: 1440px) {
            .about-hero-container {
              max-width: 1380px !important;
              padding-left: 2.5rem !important;
              padding-right: 2.5rem !important;
            }

            .about-hero-wrap {
              min-height: 360px !important;
            }

            .about-hero-h1 {
              font-size: 3.1rem !important;
              line-height: 1.18 !important;
            }

            .about-hero-sub {
              font-size: 1.85rem !important;
              margin-top: 1.25rem !important;
            }
          }

          /* ── Large Desktop 1920px ── */
          @media (min-width: 1920px) {
            .about-hero-container {
              max-width: 1800px !important;
              padding-left: 4rem !important;
              padding-right: 4rem !important;
            }

            .about-hero-wrap {
              min-height: 580px !important;
            }

            .about-hero-h1 {
              font-size: 3.75rem !important;
              line-height: 1.18 !important;
            }

            .about-hero-sub {
              font-size: 2.4rem !important;
              margin-top: 1.5rem !important;
            }
          }

          /* ── 4K Ultra-Wide 3840px ── */
          @media (min-width: 3840px) {
            .about-hero-container {
              max-width: 3200px !important;
              padding-left: 6rem !important;
              padding-right: 6rem !important;
            }

            .about-hero-wrap {
              min-height: 900px !important;
            }

            .about-hero-h1 {
              font-size: 6rem !important;
              line-height: 1.15 !important;
            }

            .about-hero-sub {
              font-size: 4rem !important;
              margin-top: 2.5rem !important;
            }
          }
        `}</style>


        {/* CONTENT */}
        <div className="about-hero-container">

          <div
            className="
              about-hero-wrap
              flex
              items-start
              justify-center
              pt-5
              sm:pt-8
              lg:pt-14
              pb-6
              sm:pb-8
              lg:pb-12
              min-h-0
              sm:min-h-[300px]
              lg:min-h-[380px]
            "
          >

            <div className="relative z-30 w-full text-center">

              {/* MAIN TITLE */}
              <h1
                style={{
                  fontFamily: "'Poppins', serif",
                }}
                className="
                  about-hero-h1
                  text-[22px]
                  xs:text-2xl
                  sm:text-3xl
                  lg:text-4xl
                  xl:text-[48px]
                  font-bold
                  leading-[1.18]
                  text-black
                  whitespace-nowrap
                "
              >
                Simplifying Needs and Problems For Businesses
                <br />
             <span className="text-[#0B4EA2]">  &amp; Individuals</span> 
              </h1>


              {/* SUBTITLE */}
              <p
                style={{
                  fontFamily: "'Poppins', serif",
                }}
                className="
                  about-hero-sub
                  text-black
                  font-semibold
                  mt-2.5
                  sm:mt-4
                  text-base
                  xs:text-lg
                  sm:text-2xl
                  lg:text-[32px]
                  xl:text-[36px]
                  leading-tight
                "
              >
                All Under One Roof
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* VISION & MISSION */}
      <VisionMission />

    </>
  );
};

export default HeroSection;