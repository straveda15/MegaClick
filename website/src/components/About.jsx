import React, { useEffect } from "react";

const About = () => {
  // SCROLL TO TOP
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section
      className="
        relative
        overflow-hidden
        bg-white
        py-8
        sm:py-12
        lg:py-14
        font-['Inter',sans-serif]
      "
    >
      {/* =========================================================
          RESPONSIVE CSS
      ========================================================= */}
      <style>{`
        /* =========================================================
           STANDARD DESKTOP — 1440px
        ========================================================= */
        @media (min-width: 1440px) {
          .about-container {
            max-width: 1600px !important;
            padding-left: 48px !important;
            padding-right: 48px !important;
          }

          .about-top {
            gap: 70px !important;
          }

          .about-tagline {
            font-size: 14px !important;
            letter-spacing: 0.22em !important;
            margin-bottom: 12px !important;
          }

          .about-heading {
            font-size: 58px !important;
            line-height: 1.12 !important;
          }

          .about-desc {
            font-size: 17px !important;
            line-height: 1.8 !important;
            max-width: 680px !important;
          }

          .about-cards {
            max-width: 1500px !important;
            column-gap: 50px !important;
            row-gap: 22px !important;
            margin-top: 48px !important;
          }

          .about-card {
            max-width: 440px !important;
          }

          .about-card-text {
            font-size: 15px !important;
          }
        }

        /* =========================================================
           LARGE DESKTOP — 1920px
        ========================================================= */
        @media (min-width: 1920px) {
          .about-container {
            max-width: 2100px !important;
            padding-left: 60px !important;
            padding-right: 60px !important;
          }

          .about-top {
            gap: 100px !important;
          }

          .about-tagline {
            font-size: 17px !important;
            letter-spacing: 0.24em !important;
            margin-bottom: 16px !important;
          }

          .about-heading {
            font-size: 72px !important;
            line-height: 1.1 !important;
          }

          .about-desc {
            font-size: 20px !important;
            line-height: 1.85 !important;
            max-width: 800px !important;
          }

          .about-cards {
            max-width: 1950px !important;
            column-gap: 70px !important;
            row-gap: 28px !important;
            margin-top: 60px !important;
          }

          .about-card {
            max-width: 570px !important;
            padding: 16px 28px !important;
          }

          .about-card-text {
            font-size: 18px !important;
          }
        }

        /* =========================================================
           4K — 3840px
           Keep the same visual composition but scale it up.
        ========================================================= */
        @media (min-width: 3840px) {
          .about-container {
            max-width: 3200px !important;
            padding-left: 100px !important;
            padding-right: 100px !important;
          }

          .about-top {
            gap: 180px !important;
          }

          .about-tagline {
            font-size: 26px !important;
            letter-spacing: 0.25em !important;
            margin-bottom: 22px !important;
          }

          .about-heading {
            font-size: 112px !important;
            line-height: 1.1 !important;
            letter-spacing: -0.025em !important;
          }

          .about-desc {
            font-size: 30px !important;
            line-height: 1.8 !important;
            max-width: 1050px !important;
          }

          .about-cards {
            max-width: 3000px !important;
            column-gap: 110px !important;
            row-gap: 40px !important;
            margin-top: 90px !important;
          }

          .about-card {
            width: 100% !important;
            max-width: 850px !important;
            padding: 24px 40px !important;
          }

          .about-card-text {
            font-size: 26px !important;
            line-height: 1.4 !important;
          }
        }

        /* =========================================================
           VERY LARGE ULTRA-WIDE — 5000px+
           Prevent excessive stretching.
        ========================================================= */
        @media (min-width: 5000px) {
          .about-container {
            max-width: 3500px !important;
          }

          .about-heading {
            font-size: 120px !important;
          }

          .about-desc {
            font-size: 32px !important;
          }

          .about-cards {
            max-width: 3300px !important;
          }
        }
      `}</style>

      {/* =========================================================
          MAIN CONTAINER
      ========================================================= */}
      <div
        className="
          about-container
          w-full
          max-w-[1380px]
          mx-auto
          px-4
          sm:px-6
          min-[1440px]:px-10
        "
      >
        {/* =========================================================
            TOP AREA
        ========================================================= */}
        <div
          className="
            about-top
            grid
            grid-cols-1
            lg:grid-cols-2
            gap-8
            lg:gap-12
            items-start
          "
        >
          {/* =====================================================
              LEFT — ABOUT + HEADING
          ===================================================== */}
          <div className="w-full">
            <p
              style={{ fontFamily: "'Inter', sans-serif" }}
              className="
                about-tagline
                text-xs
                sm:text-sm
                font-semibold
                tracking-[0.2em]
                uppercase
                text-[#0B4EA2]
                mb-2
                sm:mb-3
                text-left
              "
            >
              ABOUT US
            </p>

            <h2
              style={{ fontFamily: "'Poppins', sans-serif" }}
              className="
                about-heading
                text-2xl
                sm:text-3xl
                md:text-3xl
                lg:text-5xl
                font-bold
                leading-[1.18]
                tracking-[-0.02em]
                text-black
                text-left
              "
            >
              Helping Businesses
              <br />
              <span className="text-[#0B4EA2]">
                With Smart Solutions
              </span>
            </h2>
          </div>

          {/* =====================================================
              RIGHT — DESCRIPTION
          ===================================================== */}
          <div
            className="
              w-full
              flex
              justify-center
              lg:justify-end
              lg:pt-8
            "
          >
            <p
              style={{ fontFamily: "'Inter', sans-serif" }}
              className="
                about-desc
                text-slate-600
                text-sm
                sm:text-base
                lg:text-base
                leading-relaxed
                text-left
                sm:text-justify
                max-w-2xl
              "
            >
              MegaClick provides professional business services that
              simplify registrations, compliance, taxation and financial
              management. We help businesses with complete support,
              transparent processes and expert guidance. Our goal is to
              make every business process simple, reliable and hassle-free.
            </p>
          </div>
        </div>

        {/* =========================================================
            SIX CARDS
        ========================================================= */}
        <div
          className="
            relative
            w-full
            flex
            justify-center
            mt-12
            sm:mt-14
            lg:mt-12
          "
        >
          <div
            className="
              about-cards
              relative
              z-10
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              items-center
              justify-items-center
              gap-6
              sm:gap-8
              lg:gap-6
              w-full
            "
          >
            {/* ===================================================
                CARD 1
            =================================================== */}
            <div
              className="
                about-card
                relative
                z-20
                w-[220px]
                sm:w-[360px]
                bg-[#0B4EA2]
                text-white
                px-4
                sm:px-6
                py-3
                sm:py-3.5
                rounded-full
                shadow-md
                -rotate-4
              "
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <span
                className="
                  about-card-text
                  block
                  text-[11px]
                  sm:text-sm
                  font-semibold
                  text-center
                  whitespace-nowrap
                "
              >
                500+ Businesses Successfully Registered
              </span>
            </div>

            {/* ===================================================
                CARD 2
            =================================================== */}
            <div
              className="
                about-card
                relative
                z-10
                w-[250px]
                sm:w-[330px]
                bg-slate-100
                text-slate-700
                px-4
                sm:px-6
                py-3
                sm:py-3.5
                rounded-full
                shadow-sm
                rotate-3
              "
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <span
                className="
                  about-card-text
                  block
                  text-[11px]
                  sm:text-sm
                  font-semibold
                  text-center
                  whitespace-nowrap
                "
              >
                Expert Guidance at Every Step
              </span>
            </div>

            {/* ===================================================
                CARD 3
            =================================================== */}
            <div
              className="
                about-card
                relative
                z-10
                w-[250px]
                sm:w-[350px]
                bg-[#0B4EA2]
                text-white
                px-4
                sm:px-6
                py-3
                sm:py-3.5
                rounded-full
                shadow-sm
                rotate-4
              "
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <span
                className="
                  about-card-text
                  block
                  text-[11px]
                  sm:text-sm
                  font-semibold
                  text-center
                  whitespace-nowrap
                "
              >
                100% Transparent &amp; Hassle-Free Process
              </span>
            </div>

            {/* ===================================================
                CARD 4
            =================================================== */}
            <div
              className="
                about-card
                relative
                z-20
                w-[250px]
                sm:w-[330px]
                bg-slate-100
                text-slate-700
                px-4
                sm:px-6
                py-3
                sm:py-3.5
                rounded-full
                shadow-md
                -rotate-3
              "
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <span
                className="
                  about-card-text
                  block
                  text-[11px]
                  sm:text-sm
                  font-semibold
                  text-center
                  whitespace-nowrap
                "
              >
                Dedicated Support for Your Business
              </span>
            </div>

            {/* ===================================================
                CARD 5
            =================================================== */}
            <div
              className="
                about-card
                relative
                z-20
                w-[250px]
                sm:w-[330px]
                bg-[#0B4EA2]
                text-white
                px-4
                sm:px-6
                py-3
                sm:py-3.5
                rounded-full
                shadow-md
                -rotate-3
              "
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <span
                className="
                  about-card-text
                  block
                  text-[11px]
                  sm:text-sm
                  font-semibold
                  text-center
                  whitespace-nowrap
                "
              >
                Quick &amp; Reliable Online Services
              </span>
            </div>

            {/* ===================================================
                CARD 6
            =================================================== */}
            <div
              className="
                about-card
                relative
                z-10
                w-[260px]
                sm:w-[380px]
                bg-slate-100
                text-slate-700
                px-4
                sm:px-6
                py-3
                sm:py-3.5
                rounded-full
                shadow-sm
                rotate-4
              "
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              <span
                className="
                  about-card-text
                  block
                  text-[11px]
                  sm:text-sm
                  font-semibold
                  text-center
                  whitespace-nowrap
                "
              >
                Trusted Business Support for Growing Business
              </span>
            </div>
          </div>
        </div>

        {/* =========================================================
            LEARN MORE
        ========================================================= */}
        <div className="flex mt-8 sm:mt-10 justify-start"></div>
      </div>
    </section>
  );
};

export default About;