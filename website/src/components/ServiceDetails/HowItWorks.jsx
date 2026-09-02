import React, { useState } from "react";

const HowItWorks = ({ service }) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!service?.process?.length) return null;

  const totalSteps = service.process.length;

  return (
    <section className="w-full bg-blue-100 font-['Inter',sans-serif]">
      <style>{`
        @media (min-width: 1920px) {
          .hiw-container { max-width: 1800px !important; padding-left: 4rem !important; padding-right: 4rem !important; }
          .hiw-heading   { font-size: 3rem !important; }
          .hiw-step-num  { width: 3.5rem !important; height: 3.5rem !important; font-size: 1rem !important; }
          .hiw-step-title { font-size: 1.5rem !important; }
          .hiw-step-desc  { font-size: 1.1rem !important; }
          .hiw-line { top: 1.75rem !important; }
        }
        @media (min-width: 3840px) {
          .hiw-container { max-width: 3200px !important; padding-left: 6rem !important; padding-right: 6rem !important; }
          .hiw-heading   { font-size: 5rem !important; }
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
          py-10 sm:py-12 lg:py-16
          min-[1920px]:py-20 min-[3840px]:py-32
        "
      >
        <div
          className="
            bg-white rounded-3xl
            border border-gray-200
            px-5 sm:px-8 lg:px-10
            min-[1920px]:px-16 min-[3840px]:px-24
            py-7 sm:py-9 lg:py-10
            min-[1920px]:py-14 min-[3840px]:py-20
          "
        >
          {/* HEADING + MOBILE ARROWS */}
          <div className="mb-10 sm:mb-12 min-[1920px]:mb-16 flex items-start justify-between">
            <div>
              <p
                style={{ fontFamily: "'Inter', sans-serif" }}
                className="
                  text-xs sm:text-sm min-[1920px]:text-base min-[3840px]:text-2xl
                  font-semibold text-[#0B4EA2] uppercase tracking-[0.15em] mb-3
                "
              >
                Simple Process
              </p>

              <h2
                style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
                className="
                  hiw-heading
                  text-2xl sm:text-3xl lg:text-4xl
                  font-bold text-gray-900 leading-tight
                "
              >
                How It Works
              </h2>

              <p
                style={{ fontFamily: "'Inter', sans-serif" }}
                className="
                  mt-3 max-w-2xl
                  text-sm sm:text-base min-[1920px]:text-lg min-[3840px]:text-2xl
                  text-gray-500 leading-relaxed
                "
              >
                Our process is designed to make the entire service simple, transparent, and hassle-free.
              </p>
            </div>

            {/* Mobile arrows */}
            <div className="flex items-center gap-2 lg:hidden flex-shrink-0 mt-1">
              <button
                onClick={() => setCurrentStep((p) => Math.max(0, p - 1))}
                disabled={currentStep === 0}
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
                aria-label="Previous step"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                onClick={() => setCurrentStep((p) => Math.min(totalSteps - 1, p + 1))}
                disabled={currentStep === totalSteps - 1}
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
                aria-label="Next step"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>

          {/* MOBILE — Single step */}
          <div className="flex flex-col relative lg:hidden">
            {(() => {
              const step = service.process[currentStep];
              return (
                <div className="relative flex gap-5">
                  <div
                    className="
                      hiw-step-num
                      relative z-10 flex-shrink-0
                      w-12 h-12 rounded-full
                      bg-[#0B4EA2] text-white
                      flex items-center justify-center
                      text-sm font-bold
                      shadow-[0_5px_15px_rgba(11,78,162,0.15)]
                    "
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {String(step.step || currentStep + 1).padStart(2, "0")}
                  </div>
                  <div className="pt-1 pb-2">
                    <p
                      style={{ fontFamily: "'Inter', sans-serif" }}
                      className="text-xs font-semibold uppercase tracking-[0.12em] text-[#0B4EA2] mb-1.5"
                    >
                      Step {String(currentStep + 1).padStart(2, "0")}
                    </p>
                    <h3
                      style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
                      className="text-base sm:text-lg font-bold text-gray-900 leading-snug mb-2"
                    >
                      {step.title}
                    </h3>
                    <p
                      style={{ fontFamily: "'Inter', sans-serif" }}
                      className="text-sm text-gray-600 leading-7"
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })()}

            {/* Dot indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {service.process.map((_, i) => (
                <span
                  key={i}
                  className={`h-2 rounded-full transition-all duration-200 ${
                    i === currentStep ? "bg-[#0B4EA2] w-5" : "bg-gray-300 w-2"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* DESKTOP — Horizontal timeline */}
          <div className="relative hidden lg:block">
            {/* Connecting line */}
            <div
              className="hiw-line absolute top-6 left-6 right-6 h-px bg-gray-200"
            />

            <div className="flex gap-6 min-[1920px]:gap-10 min-[3840px]:gap-16">
              {service.process.map((step, index) => (
                <div key={index} className="relative flex-1 min-w-0">
                  <div
                    className="
                      hiw-step-num
                      relative z-10
                      w-12 h-12 rounded-full
                      bg-[#0B4EA2] text-white
                      flex items-center justify-center
                      text-sm font-bold
                      ring-8 ring-white
                      shadow-[0_5px_15px_rgba(11,78,162,0.15)]
                      mb-7
                    "
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    {String(step.step || index + 1).padStart(2, "0")}
                  </div>
                  <div className="pr-4">
                    <p
                      style={{ fontFamily: "'Inter', sans-serif" }}
                      className="text-xs min-[1920px]:text-sm font-semibold uppercase tracking-[0.12em] text-[#0B4EA2] mb-2"
                    >
                      Step {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3
                      style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
                      className="hiw-step-title text-xl font-bold text-gray-900 leading-snug mb-3"
                    >
                      {step.title}
                    </h3>
                    <p
                      style={{ fontFamily: "'Inter', sans-serif" }}
                      className="hiw-step-desc text-sm text-gray-600 leading-7"
                    >
                      {step.description}
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

export default HowItWorks;