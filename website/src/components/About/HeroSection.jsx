import React from "react";
import teamImg from "../../assets/teamimg.png";

const HeroSection = () => {
  return (
    <section className="about-hero relative w-full overflow-hidden bg-[#0B4EA2] font-['Inter',sans-serif]">
      {/* GOOGLE FONTS */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hedvig+Letters+Serif:opsz@12..24&family=Inter:wght@400;500;600;700;800&display=swap');

        .about-hero-container {
          width: 100%;
          max-width: 1380px;
          margin-left: auto;
          margin-right: auto;
          padding-left: 1rem;
          padding-right: 1rem;
          position: relative;
          z-index: 20;
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
            min-height: 480px !important;
          }
          .about-hero-h1 {
            font-size: 3.1rem !important;
            line-height: 1.18 !important;
          }
          .about-hero-sub {
            font-size: 1.85rem !important;
            margin-top: 1.25rem !important;
          }
          .about-blue-panel {
            width: 58%;
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
          .about-blue-panel {
            width: 58%;
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
          .about-blue-panel {
            width: 60%;
          }
        }

        /* BLUE LEFT PANEL */
        .about-blue-panel {
          position: absolute;
          left: 0;
          top: 0;
          width: 58%;
          height: 100%;
          background: #0B4EA2;
          clip-path: polygon(
            0 0,
            100% 0,
            86% 50%,
            100% 100%,
            0 100%
          );
          z-index: 5;
        }

        @media (max-width: 1023px) {
          .about-blue-panel {
            display: none;
          }
        }
      `}</style>

      {/* MOBILE IMAGE */}
      <div className="relative w-full h-[260px] sm:h-[320px] lg:hidden">
        <img
          src={teamImg}
          alt="MegaClick Team"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* DESKTOP IMAGE */}
      <div className="hidden lg:block absolute right-0 top-0 w-[55%] h-full z-0">
        <img
          src={teamImg}
          alt="MegaClick Team"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* BLUE PANEL */}
      <div className="about-blue-panel hidden lg:block" />

      {/* CONTENT (Shifted Upwards) */}
      <div className="about-hero-container">
        <div className="about-hero-wrap flex items-start pt-8 sm:pt-10 lg:pt-14 pb-8 sm:pb-10 lg:pb-12 min-h-[380px] sm:min-h-[420px] lg:min-h-[480px]">
          <div className="relative z-30 w-full lg:w-[50%] xl:w-[52%] text-left">
            {/* MAIN TITLE (Hedvig Letters Serif) */}
            <h1
              style={{
                fontFamily: "'Hedvig Letters Serif', serif",
              }}
              className="about-hero-h1 text-3xl sm:text-4xl lg:text-[44px] xl:text-[48px] font-bold leading-[1.18] text-green-300"
            >
              Simplifying Needs and
              <br />
              Problems For Businesses
              <br />
              &amp; Individuals
            </h1>

            {/* SUBTITLE */}
            <p
              style={{
                fontFamily: "'Hedvig Letters Serif', serif",
              }}
              className="about-hero-sub text-white font-semibold mt-4 sm:mt-5 text-xl sm:text-2xl lg:text-[32px] xl:text-[36px] leading-tight"
            >
              All Under One Roof
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;