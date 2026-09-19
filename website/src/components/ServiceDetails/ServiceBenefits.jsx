import React from "react";

// 3 Benefits
const benefitsList = [
  {
    number: "1",
    title: "Legal Accuracy",
    description:
      "Accurate documentation and professional guidance to help you complete your service correctly and confidently.",
    numberColor: "text-white",
    numberBorder: "border-white",
    numberBg: "bg-[#0B4EA2]",
  },
  {
    number: "2",
    title: "Financial Guidance",
    description:
      "Clear financial guidance and support to help you understand the process, requirements, and related costs.",
    numberColor: "text-white",
    numberBorder: "border-white",
    numberBg: "bg-[#6B879B]",
  },
  {
    number: "3",
    title: "Govt Approvals",
    description:
      "Complete assistance with government approvals and documentation for a smoother and hassle-free process.",
    numberColor: "text-white",
    numberBorder: "border-white",
    numberBg: "bg-[#D1AE24]",
  },
];

const ServiceBenefits = ({ service }) => {
  return (
    <section className="w-full bg-white font-['Inter',sans-serif] py-8 sm:py-10 lg:py-12">
      {/* GOOGLE FONTS + RESPONSIVE */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

        /* 1440px */
        @media (min-width: 1440px) {
          .sb-container {
            max-width: 1380px !important;
            padding-left: 2.5rem !important;
            padding-right: 2.5rem !important;
          }

          .sb-heading {
            font-size: 2.5rem !important;
            line-height: 1.2 !important;
          }

          .sb-desc {
            font-size: 0.95rem !important;
            line-height: 1.65 !important;
          }

          .sb-grid {
            gap: 1.5rem !important;
          }

          .sb-card-title {
            font-size: 1.05rem !important;
          }
        }

        /* 1920px */
        @media (min-width: 1920px) {
          .sb-container {
            max-width: 1800px !important;
            padding-left: 4rem !important;
            padding-right: 4rem !important;
          }

          .sb-heading {
            font-size: 3.25rem !important;
            line-height: 1.18 !important;
          }

          .sb-desc {
            font-size: 1.15rem !important;
            line-height: 1.8 !important;
          }

          .sb-grid {
            gap: 1.75rem !important;
          }

          .sb-card-title {
            font-size: 1.25rem !important;
          }
        }

        /* 2560px */
        @media (min-width: 2560px) {
          .sb-container {
            max-width: 2300px !important;
            padding-left: 5rem !important;
            padding-right: 5rem !important;
          }

          .sb-heading {
            font-size: 3.75rem !important;
            line-height: 1.18 !important;
          }

          .sb-desc {
            font-size: 1.35rem !important;
            line-height: 1.8 !important;
          }

          .sb-grid {
            gap: 2rem !important;
          }

          .sb-card-title {
            font-size: 1.45rem !important;
          }
        }

        /* 3840px */
        @media (min-width: 3840px) {
          .sb-container {
            max-width: 3200px !important;
            padding-left: 6rem !important;
            padding-right: 6rem !important;
          }

          .sb-heading {
            font-size: 5rem !important;
            line-height: 1.15 !important;
          }

          .sb-desc {
            font-size: 1.75rem !important;
            line-height: 1.8 !important;
          }

          .sb-grid {
            gap: 2.5rem !important;
          }

          .sb-card-title {
            font-size: 2rem !important;
          }
        }
      `}</style>

      <div className="sb-container max-w-[1380px] mx-auto">
        {/* MAIN STRUCTURE — LEFT PANEL + RIGHT TIMELINE */}
        <div className="grid grid-cols-1 lg:grid-cols-[38%_62%] items-stretch min-h-[420px]">

          {/* LEFT */}
          <div className="relative bg-[#0B4EA2] px-6 sm:px-10 lg:px-10 xl:px-14 2xl:px-20 py-10 sm:py-12 lg:py-14 flex flex-col justify-center">
            <p
              style={{ fontFamily: "'Inter', sans-serif" }}
              className="text-xs sm:text-sm font-semibold text-white uppercase tracking-[0.15em] mb-1.5 text-left"
            >
              Key Advantages
            </p>

            <h2
              style={{ fontFamily: "'Poppins', serif" }}
              className="
                sb-heading
                text-2xl
                sm:text-3xl
                md:text-3xl
                lg:text-4xl
                font-bold
                leading-[1.18]
                text-white
                text-left
                mb-2 sm:mb-2.5
                max-w-[420px]
              "
            >
              Why Choose{" "}
              <span className="text-white">Our Services?</span>
            </h2>

            <p
              style={{ fontFamily: "'Inter', sans-serif" }}
              className="
                sb-desc
                text-xs sm:text-sm
                text-white
                max-w-3xl
                text-left
                font-normal
                leading-relaxed
              "
            >
              Experience hassle-free business compliance, guaranteed transparent
              guidance, and dedicated support.
            </p>
          </div>

          {/* RIGHT */}
          <div className="relative bg-white px-6 sm:px-10 lg:px-0 py-10 sm:py-12 lg:py-12">
            {/* CENTER VERTICAL LINE */}
            <div className="hidden lg:block absolute left-0 top-10 bottom-10 w-px bg-gray-200" />

            <div className="space-y-8 sm:space-y-10 lg:space-y-12">
              {benefitsList.map((item) => (
                <div
                  key={item.number}
                  className="relative flex items-center gap-5 sm:gap-7 lg:gap-8"
                >
                  {/* NUMBER */}
                  <div
                    className={`
                      relative z-10 shrink-0
                      -ml-1 sm:-ml-2 lg:-ml-8
                      w-16 h-16
                      sm:w-[76px] sm:h-[76px]
                      lg:w-[92px] lg:h-[92px]
                      rounded-full
                      ${item.numberBg}
                      ${item.numberColor}
                      border-[6px] sm:border-[7px]
                      ${item.numberBorder}
                      shadow-sm
                      flex items-center justify-center
                      font-bold
                      text-xl sm:text-2xl lg:text-3xl
                    `}
                    style={{ fontFamily: "'Poppins', serif" }}
                  >
                    {item.number}
                  </div>

                  {/* TITLE + DESCRIPTION */}
                  <div className="flex-1 text-left pr-4 sm:pr-6 lg:pr-10">
                    <h3
                      style={{ fontFamily: "'Poppins', serif" }}
                      className="
                        sb-card-title
                        text-sm
                        sm:text-base
                        font-medium
                        text-slate-900
                        leading-snug
                        text-left
                        w-full
                      "
                    >
                      {item.title}
                    </h3>

                    <p
                      style={{ fontFamily: "'Inter', sans-serif" }}
                      className="sb-desc mt-1 text-xs sm:text-sm text-gray-500 leading-relaxed max-w-3xl text-left"
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ServiceBenefits;
