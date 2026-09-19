import React from "react";

const About = () => {
  return (
    <section className="about-section relative overflow-hidden py-10 sm:py-14 min-[1440px]:py-16 min-[1920px]:py-20 min-[3840px]:py-32 bg-white font-['Inter',sans-serif]">

      {/* GOOGLE FONTS */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800&display=swap');

        /* ── Standard Desktop 1440px ── */
        @media (min-width: 1440px) {
          .about-container {
            max-width: 1380px !important;
            padding-left: 2.5rem !important;
            padding-right: 2.5rem !important;
          }

          .about-heading {
            font-size: 2.5rem !important;
          }

          .about-para {
            font-size: 1.rem !important;
            line-height: 1.75 !important;
          }
        }

        /* ── Large Desktop 1920px ── */
        @media (min-width: 1920px) {
          .about-container {
            max-width: 1800px !important;
            padding-left: 4rem !important;
            padding-right: 4rem !important;
          }

          .about-tagline {
            font-size: 0.95rem !important;
            letter-spacing: 0.3em !important;
          }

          .about-heading {
            font-size: 3.25rem !important;
          }

          .about-para {
            font-size: 1.25rem !important;
            line-height: 2rem !important;
          }

          .about-para-gap {
            gap: 3.5rem !important;
          }
        }

        /* ── 4K Ultra-Wide 3840px ── */
        @media (min-width: 3840px) {
          .about-container {
            max-width: 3200px !important;
            padding-left: 6rem !important;
            padding-right: 6rem !important;
          }

          .about-tagline {
            font-size: 1.75rem !important;
            letter-spacing: 0.35em !important;
            margin-bottom: 1.5rem !important;
          }

          .about-heading {
            font-size: 5.5rem !important;
            line-height: 1.15 !important;
          }

          .about-para {
            font-size: 2.25rem !important;
            line-height: 3.5rem !important;
          }

          .about-para-gap {
            gap: 3.5rem !important;
          }
        }
      `}</style>

      <div className="about-container w-full max-w-[1380px] min-[1920px]:max-w-[1800px] min-[3840px]:max-w-[3200px] mx-auto px-4 sm:px-6 min-[1440px]:px-10 min-[1920px]:px-16 min-[3840px]:px-24">

        {/* =========================================
            HEADING
        ========================================== */}

        <div className="mb-6 sm:mb-8 min-[1920px]:mb-12 min-[3840px]:mb-16 text-left">

          <p
            style={{ fontFamily: "'Inter', sans-serif" }}
            className="about-tagline text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-[#0B4EA2] mb-2 sm:mb-2.5"
          >
            About Us
          </p>

          <h2
            style={{ fontFamily: "'Poppins', serif" }}
            className="
              about-heading
              text-2xl
              sm:text-3xl
              md:text-3xl
              lg:text-4xl
              font-bold
              leading-[1.18]
              text-black
              text-left
              mb-2.5
              sm:mb-4
            "
          >
            Your Success{" "}
            <span className="text-[#0B4EA2]">
              Our Mission
            </span>
          </h2>

        </div>

        {/* =========================================
            ABOUT STEPPER
        ========================================== */}

        <div className="relative mt-10 sm:mt-12 lg:mt-14">

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-10 md:gap-4 relative">

            {[
              {
                number: "01",
                title: "Integrated Services",
                description:
                  "Legal, financial, banking, real estate, and business support services brought together in one ecosystem.",
              },
              {
                number: "02",
                title: "Simplified Access",
                description:
                  "We simplify and streamline the way individuals and businesses access professional services.",
              },
              {
                number: "03",
                title: "Trusted Foundation",
                description:
                  "Built on integrity, professionalism, customer satisfaction, and a strong commitment to excellence.",
              },
              {
                number: "04",
                title: "One Roof",
                description:
                  "Multiple professional requirements are brought together through one seamless and coordinated platform.",
              },
              {
                number: "05",
                title: "Reliable Results",
                description:
                  "Meticulous planning, continuous effort, and a strategic approach deliver transparent and result-oriented services.",
              },
            ].map((step, index) => (

              <div
                key={index}
                className="
                  group
                  relative
                  flex
                  flex-col
                  items-center
                  text-center
                  px-3
                  cursor-pointer
                "
              >

                {/* TOP HALF NUMBER */}

                <div
                  className="
                    relative
                    z-10
                    h-[42px]
                    sm:h-[46px]
                    lg:h-[52px]
                    overflow-hidden
                  "
                >
                  <div
                    style={{ fontFamily: "'Poppins', serif" }}
                    className="
                      text-[64px]
                      sm:text-[72px]
                      lg:text-[82px]
                      font-bold
                      leading-none
                      tracking-tight
                      text-gray-300
                      transition-all
                      duration-300
                      ease-out
                      group-hover:text-[#0B4EA2]
                      group-hover:scale-110
                    "
                  >
                    {step.number}
                  </div>
                </div>

                {/* HOVER LINE */}

                <div
                  className="
                    mt-3
                    h-[3px]
                    w-0
                    bg-[#0B4EA2]
                    transition-all
                    duration-300
                    group-hover:w-24
                  "
                />

                {/* TITLE */}

                <h3
                  style={{ fontFamily: "'Poppins', serif" }}
                  className="
                    mt-4
                    text-base
                    sm:text-lg
                    lg:text-xl
                    font-bold
                    text-black
                    leading-tight
                    transition-colors
                    duration-300
                    group-hover:text-[#0B4EA2]
                  "
                >
                  {step.title}
                </h3>

                {/* DESCRIPTION */}

                <p
                  className="
                    mt-2.5
                    text-xs
                    sm:text-sm
                    text-gray-600
                    leading-relaxed
                    max-w-[230px]
                  "
                >
                  {step.description}
                </p>

              </div>

            ))}

          </div>

        </div>

      </div>
    </section>
  );
};

export default About;