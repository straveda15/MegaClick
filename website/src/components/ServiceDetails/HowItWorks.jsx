import React, { useState } from "react";

const HowItWorks = ({ service }) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!service?.process?.length) return null;

  const totalSteps = service.process.length;

  return (
    <section className="w-full bg-blue-100/60 font-['Inter',sans-serif] py-10 sm:py-14 lg:py-16">
      {/* GOOGLE FONTS */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hedvig+Letters+Serif:opsz@12..24&family=Inter:wght@400;500;600;700&display=swap');

        @media (min-width: 1920px) {
          .hiw-container { max-width: 1800px !important; padding-left: 4rem !important; padding-right: 4rem !important; }
          .hiw-heading   { font-size: 3rem !important; }
          .hiw-desc      { font-size: 1.2rem !important; }
          .hiw-step-num  { width: 3.5rem !important; height: 3.5rem !important; font-size: 1rem !important; }
          .hiw-step-title { font-size: 1.5rem !important; }
          .hiw-step-desc  { font-size: 1.1rem !important; }
          .hiw-line { top: 1.75rem !important; }
        }
        @media (min-width: 3840px) {
          .hiw-container { max-width: 3200px !important; padding-left: 6rem !important; padding-right: 6rem !important; }
          .hiw-heading   { font-size: 5rem !important; }
          .hiw-desc      { font-size: 2rem !important; line-height: 3rem !important; }
          .hiw-step-num  { width: 5.5rem !important; height: 5.5rem !important; font-size: 1.6rem !important; }
          .hiw-step-title { font-size: 2.5rem !important; }
          .hiw-step-desc  { font-size: 1.75rem !important; line-height: 2.8rem !important; }
          .hiw-line { top: 2.75rem !important; }
        }
      `}</style>

      <div
        className="
          hiw-container
          max-w-[1380px] mx-auto
          px-4 sm:px-6 min-[1440px]:px-10
        "
      >
        {/* =========================================
            HEADING + DESCRIPTION (Directly on section background)
        ========================================== */}
        <div className="mb-8 sm:mb-12 lg:mb-14 flex items-start justify-between">
          <div className="text-left">
            <p
              style={{ fontFamily: "'Inter', sans-serif" }}
              className="
                text-xs sm:text-sm
                font-semibold text-[#0B4EA2] uppercase tracking-[0.15em] mb-2 sm:mb-2.5
              "
            >
              Simple Process
            </p>

            <h2
              style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
              className="
                hiw-heading
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
              How It{" "}
              <span className="text-[#0B4EA2]">Works</span>
            </h2>

            <p
              style={{ fontFamily: "'Inter', sans-serif" }}
              className="
                hiw-desc
                text-sm
                sm:text-base
                text-gray-600
                font-normal
                leading-relaxed
                max-w-2xl
                text-left
              "
            >
              Our process is designed to make the entire service simple, transparent, and hassle-free.
            </p>
          </div>

          {/* Mobile Arrows */}
          <div className="flex items-center gap-2 lg:hidden flex-shrink-0 mt-2">
            <button
              onClick={() => setCurrentStep((p) => Math.max(0, p - 1))}
              disabled={currentStep === 0}
              className="w-10 h-10 rounded-full border border-blue-200 flex items-center justify-center text-gray-700 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 bg-white shadow-xs"
              aria-label="Previous step"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <button
              onClick={() => setCurrentStep((p) => Math.min(totalSteps - 1, p + 1))}
              disabled={currentStep === totalSteps - 1}
              className="w-10 h-10 rounded-full border border-blue-200 flex items-center justify-center text-gray-700 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 bg-white shadow-xs"
              aria-label="Next step"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          </div>
        </div>

        {/* =========================================
            MOBILE TIMELINE (Single Step View)
        ========================================== */}
        <div className="flex flex-col relative lg:hidden">
          {(() => {
            const step = service.process[currentStep];
            return (
              <div className="relative flex gap-4 sm:gap-5 items-start">
                <div
                  className="
                    hiw-step-num
                    relative z-10 flex-shrink-0
                    w-11 h-11 sm:w-12 sm:h-12 rounded-full
                    bg-[#0B4EA2] text-white
                    flex items-center justify-center
                    text-sm font-bold
                    shadow-[0_4px_12px_rgba(11,78,162,0.2)]
                  "
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {String(step.step || currentStep + 1).padStart(2, "0")}
                </div>
                <div className="pt-0.5 pb-2 text-left">
                  <p
                    style={{ fontFamily: "'Inter', sans-serif" }}
                    className="text-xs font-semibold uppercase tracking-[0.12em] text-[#0B4EA2] mb-1"
                  >
                    Step {String(currentStep + 1).padStart(2, "0")}
                  </p>
                  <h3
                    style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
                    className="text-lg sm:text-xl font-bold text-gray-900 leading-snug mb-2"
                  >
                    {step.title}
                  </h3>
                  <p
                    style={{ fontFamily: "'Inter', sans-serif" }}
                    className="text-xs sm:text-sm text-gray-700 leading-relaxed font-normal"
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })()}

          {/* Dot Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {service.process.map((_, i) => (
              <span
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === currentStep ? "bg-[#0B4EA2] w-6" : "bg-blue-200 w-2"
                }`}
              />
            ))}
          </div>
        </div>

        {/* =========================================
            DESKTOP TIMELINE (Horizontal Connected Steps Direct Layout)
        ========================================== */}
        <div className="relative hidden lg:block">
          {/* Connecting Line */}
          <div
            className="hiw-line absolute top-6 left-6 right-6 h-px bg-blue-200/80"
          />

          <div className="flex gap-6 min-[1920px]:gap-10 min-[3840px]:gap-16">
            {service.process.map((step, index) => (
              <div key={index} className="relative flex-1 min-w-0 text-left">
                <div
                  className="
                    hiw-step-num
                    relative z-10
                    w-12 h-12 rounded-full
                    bg-[#0B4EA2] text-white
                    flex items-center justify-center
                    text-sm font-bold
                    ring-8 ring-blue-100/60
                    shadow-[0_4px_12px_rgba(11,78,162,0.2)]
                    mb-6
                  "
                  style={{ fontFamily: "'Inter', sans-serif" }}
                >
                  {String(step.step || index + 1).padStart(2, "0")}
                </div>
                <div className="pr-3">
                  <p
                    style={{ fontFamily: "'Inter', sans-serif" }}
                    className="text-xs min-[1920px]:text-sm font-semibold uppercase tracking-[0.12em] text-[#0B4EA2] mb-1.5"
                  >
                    Step {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3
                    style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
                    className="hiw-step-title text-lg sm:text-xl font-bold text-gray-900 leading-snug mb-2.5"
                  >
                    {step.title}
                  </h3>
                  <p
                    style={{ fontFamily: "'Inter', sans-serif" }}
                    className="hiw-step-desc text-xs sm:text-sm text-gray-700 leading-relaxed font-normal"
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;