import React, { useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  // SCROLL TO TOP
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="relative overflow-hidden bg-white py-8 sm:py-12 lg:py-14 min-[1920px]:py-24 min-[3840px]:py-36 font-['Inter',sans-serif]">

      {/* DIRECT RESPONSIVE CSS BREAKPOINTS */}
      <style>{`
        /* 1920px Full HD */
        @media (min-width: 1920px) {
          .about-container {
            max-width: 1800px !important;
            padding-left: 4rem !important;
            padding-right: 4rem !important;
          }

          .about-tagline {
            font-size: 1rem !important;
            letter-spacing: 0.25em !important;
          }

          .about-heading {
            font-size: 3.25rem !important;
            line-height: 1.2 !important;
          }

          .about-desc {
            font-size: 1.15rem !important;
            line-height: 2rem !important;
          }

          .about-btn {
            font-size: 1.15rem !important;
            padding: 1rem 2.25rem !important;
          }
        }

        /* 3840px 4K Ultra-Wide */
        @media (min-width: 3840px) {
          .about-container {
            max-width: 3200px !important;
            padding-left: 6rem !important;
            padding-right: 6rem !important;
          }

          .about-tagline {
            font-size: 1.75rem !important;
            letter-spacing: 0.3em !important;
            margin-bottom: 1.5rem !important;
          }

          .about-heading {
            font-size: 5.5rem !important;
            line-height: 1.2 !important;
          }

          .about-desc {
            font-size: 2rem !important;
            line-height: 3.25rem !important;
          }

          .about-btn {
            font-size: 2rem !important;
            padding: 1.5rem 3.5rem !important;
            border-radius: 9999px !important;
            margin-top: 3.5rem !important;
          }

          .about-btn svg {
            width: 2rem !important;
            height: 2rem !important;
          }
        }
      `}</style>

      {/* MAIN CONTAINER */}
      <div className="about-container w-full max-w-[1380px] mx-auto px-4 sm:px-6 min-[1440px]:px-10">

        {/* TOP AREA */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

          {/* LEFT : ABOUT + HEADING */}
          <div className="w-full">

            <p
              style={{ fontFamily: "'Inter', sans-serif" }}
              className="about-tagline text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-[#0B4EA2] mb-2 sm:mb-3 text-left"
            >
              ABOUT US
            </p>

            <h2
              style={{ fontFamily: "'Poppins', serif" }}
              className="
                about-heading
                text-2xl
                sm:text-3xl
                md:text-3xl
                lg:text-5xl
                font-bold
                leading-[1.18]
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

          {/* RIGHT : PARAGRAPH */}
          <div className="w-full flex justify-center lg:justify-end lg:pt-8">

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
              MegaClick provides professional business services that simplify
              registrations, compliance, taxation and financial management.
              We help businesses with complete support, transparent processes
              and expert guidance.Our goal is to make every business process
              simple, reliable and hassle-free.
            </p>

          </div>

        </div>

        {/* CENTER SIX CARDS */}
        <div className="relative w-full flex justify-center mt-12 sm:mt-14 lg:mt-12">

          {/* CARDS - 3 COLUMNS */}
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 items-center justify-items-center gap-6 sm:gap-8 lg:gap-6">

            {/* CARD 1 */}
            <div
              className="
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
              <span className="block text-[11px] sm:text-sm font-semibold text-center whitespace-nowrap">
                500+ Businesses Successfully Registered
              </span>
            </div>

            {/* CARD 2 */}
            <div
              className="
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
              <span className="block text-[11px] sm:text-sm font-semibold text-center whitespace-nowrap">
                Expert Guidance at Every Step
              </span>
            </div>

            {/* CARD 3 */}
            <div
              className="
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
              <span className="block text-[11px] sm:text-sm font-semibold text-center whitespace-nowrap">
                100% Transparent & HAssle-Free Process
              </span>
            </div>

            {/* CARD 4 */}
            <div
              className="
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
              <span className="block text-[11px] sm:text-sm font-semibold text-center whitespace-nowrap">
                Dedicated Support for Your Business
              </span>
            </div>

            {/* CARD 5 */}
            <div
              className="
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
              <span className="block text-[11px] sm:text-sm font-semibold text-center whitespace-nowrap">
                Quick & Reliable Online Services
              </span>
            </div>

            {/* CARD 6 */}
            <div
              className="
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
              <span className="block text-[11px] sm:text-sm font-semibold text-center whitespace-nowrap">
                Trusted Business Support for Growing Business
              </span>
            </div>

          </div>
        </div>

        {/* LEARN MORE */}
        <div className="flex mt-8 sm:mt-10 justify-start">
        </div>

      </div>
    </section>
  );
};

export default About;