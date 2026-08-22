import React from "react";
import teamImg from "../../assets/teamimg.png";

const HeroSection = () => {
  return (
    <section className="about-hero relative w-full overflow-hidden bg-[#0B4EA2] font-['Inter',sans-serif]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hedvig+Letters+Serif&family=Inter:wght@400;500;600;700;800&display=swap');

        /* ─────────────────────────────────────────────
           CONTAINER
        ───────────────────────────────────────────── */
        .about-hero-container {
          max-width: 1500px;
          margin-left: auto;
          margin-right: auto;
          padding-left: 1.25rem;
          padding-right: 1.25rem;
          position: relative;
          z-index: 20;
        }

        @media (min-width: 640px) {
          .about-hero-container {
            padding-left: 2rem;
            padding-right: 2rem;
          }
        }

        @media (min-width: 1024px) {
          .about-hero-container {
            padding-left: 4rem;
            padding-right: 4rem;
          }
        }

        @media (min-width: 1280px) {
          .about-hero-container {
            padding-left: 6rem;
            padding-right: 6rem;
          }
        }

        /* ─────────────────────────────────────────────
           BLUE LEFT PANEL
           Creates the < shaped edge
        ───────────────────────────────────────────── */
        .about-blue-panel {
          position: absolute;
          left: 0;
          top: 0;
          width: 58%;
          height: 100%;
          background: #0B4EA2;

          /*
             Straight left edge
             Angled < shaped right edge
          */
          clip-path: polygon(
            0 0,
            100% 0,
            86% 50%,
            100% 100%,
            0 100%
          );

          z-index: 5;
        }

        /* ─────────────────────────────────────────────
           1440px
        ───────────────────────────────────────────── */
        @media (min-width: 1440px) {
          .about-hero-container {
            max-width: 1440px !important;
            padding-left: 4rem !important;
            padding-right: 4rem !important;
          }

          .about-hero-wrap {
            min-height: 500px !important;
          }

          .about-hero-h1 {
            font-size: 3.2rem !important;
            line-height: 1.16 !important;
          }

          .about-hero-sub {
            font-size: 2rem !important;
            margin-top: 1.25rem !important;
          }

          .about-blue-panel {
            width: 58%;
          }
        }

        /* ─────────────────────────────────────────────
           1920px
        ───────────────────────────────────────────── */
        @media (min-width: 1920px) {
          .about-hero-container {
            max-width: 1800px !important;
            padding-left: 5rem !important;
            padding-right: 5rem !important;
          }

          .about-hero-wrap {
            min-height: 620px !important;
          }

          .about-hero-h1 {
            font-size: 4rem !important;
            line-height: 1.13 !important;
          }

          .about-hero-sub {
            font-size: 2.6rem !important;
            margin-top: 1.5rem !important;
          }

          .about-blue-panel {
            width: 58%;
          }
        }

        /* ─────────────────────────────────────────────
           2560px
        ───────────────────────────────────────────── */
        @media (min-width: 2560px) {
          .about-hero-container {
            max-width: 2300px !important;
            padding-left: 6rem !important;
            padding-right: 6rem !important;
          }

          .about-hero-wrap {
            min-height: 780px !important;
          }

          .about-hero-h1 {
            font-size: 5rem !important;
            line-height: 1.1 !important;
          }

          .about-hero-sub {
            font-size: 3.2rem !important;
            margin-top: 1.75rem !important;
          }

          .about-blue-panel {
            width: 59%;
          }
        }

        /* ─────────────────────────────────────────────
           4K
        ───────────────────────────────────────────── */
        @media (min-width: 3840px) {
          .about-hero-container {
            max-width: 3400px !important;
            padding-left: 8rem !important;
            padding-right: 8rem !important;
          }

          .about-hero-wrap {
            min-height: 1080px !important;
          }

          .about-hero-h1 {
            font-size: 7rem !important;
            line-height: 1.08 !important;
          }

          .about-hero-sub {
            font-size: 4.5rem !important;
            margin-top: 2rem !important;
          }

          .about-blue-panel {
            width: 60%;
          }
        }

        /* ─────────────────────────────────────────────
           MOBILE
           No angled panel — image stays below
        ───────────────────────────────────────────── */
        @media (max-width: 1023px) {
          .about-blue-panel {
            display: none;
          }
        }
      `}</style>

      {/* ─────────────────────────────────────────────
          MOBILE IMAGE
      ───────────────────────────────────────────── */}
      <div className="relative w-full h-[260px] sm:h-[320px] lg:hidden">
        <img
          src={teamImg}
          alt="MegaClick Team"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* ─────────────────────────────────────────────
          DESKTOP IMAGE
          ORIGINAL IMAGE — NO OVERLAY
        ───────────────────────────────────────────── */}
      <div className="hidden lg:block absolute right-0 top-0 w-[55%] h-full z-0">
        <img
          src={teamImg}
          alt="MegaClick Team"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* ─────────────────────────────────────────────
          BLUE < SHAPED PANEL
      ───────────────────────────────────────────── */}
      <div className="about-blue-panel hidden lg:block" />

      {/* ─────────────────────────────────────────────
          CONTENT
      ───────────────────────────────────────────── */}
      <div className="about-hero-container">
        <div className="about-hero-wrap flex items-center min-h-[400px] sm:min-h-[450px] lg:min-h-[520px] py-12 sm:py-14 lg:py-0">

          {/* LEFT TEXT */}
        <div className="relative z-30 w-full lg:w-[50%] xl:w-[52%] lg:pl-0 xl:pl-4 2xl:pl-8">
            {/* WHO WE ARE */}
            <p className="text-white/80 text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase mb-5">
              Who We Are
            </p>

            {/* HEADING */}
<h1
  style={{
    fontFamily: "'Hedvig Letters Serif', serif",
    letterSpacing: "0.01em",
    wordSpacing: "0.12em",
  }}
  className="
    about-hero-h1
    text-4xl
    sm:text-5xl
    md:text-5xl
    lg:text-[48px]
    xl:text-[52px]
    font-extrabold
    leading-[1.15]
    tracking-normal
    text-green-300
  "
>
  Simplifying Needs and
  <br />
  Problems  For 
 
   Businesses
  <br />
  & Individuals
</h1>

{/* SEPARATE SUBTEXT */}
<p
  style={{
    fontFamily: "'Hedvig Letters Serif', serif",
  }}
  className="
    about-hero-sub
    text-white
    font-semibold
    mt-6
    text-2xl
    sm:text-3xl
    md:text-3xl
    lg:text-[36px]
    xl:text-[40px]
    leading-tight
  "
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