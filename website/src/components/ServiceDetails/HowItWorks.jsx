import React, { useState } from "react";

const HowItWorks = ({ service }) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!service?.process?.length) {
    return null;
  }

  const totalSteps = service.process.length;

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(totalSteps - 1, prev + 1));
  };

  return (
    <section className="w-full bg-blue-100">
      <div
        className="
          max-w-[1500px]
          mx-auto
          px-4
          sm:px-8
          lg:px-16
          xl:px-24
          py-10
          sm:py-12
          lg:py-16
        "
      >
        <div
          className="
            bg-white
            rounded-3xl
            border
            border-gray-200
            px-5
            sm:px-8
            lg:px-10
            py-7
            sm:py-9
            lg:py-10
          "
        >
          {/* =========================
              HEADING + MOBILE ARROWS
          ========================== */}
          <div className="mb-10 sm:mb-12 flex items-start justify-between">
            {/* LEFT — Heading text */}
            <div>
              <p
                className="
                  text-xs
                  sm:text-sm
                  font-semibold
                  text-[#0B4EA2]
                  uppercase
                  tracking-[0.15em]
                  mb-3
                "
              >
                Simple Process
              </p>

              <h2 className="section-heading text-gray-900">
                How It Works
              </h2>

              <p className="section-text mt-3 max-w-2xl">
                Our process is designed to make the entire service simple,
                transparent, and hassle-free.
              </p>
            </div>

            {/* RIGHT — Mobile-only navigation arrows */}
            <div className="flex items-center gap-2 lg:hidden flex-shrink-0 mt-1">
              <button
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="
                  w-10
                  h-10
                  rounded-full
                  border
                  border-gray-200
                  flex
                  items-center
                  justify-center
                  text-gray-600
                  transition-all
                  duration-200
                  disabled:opacity-30
                  disabled:cursor-not-allowed
                  active:scale-95
                "
                aria-label="Previous step"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>

              <button
                onClick={handleNext}
                disabled={currentStep === totalSteps - 1}
                className="
                  w-10
                  h-10
                  rounded-full
                  border
                  border-gray-200
                  flex
                  items-center
                  justify-center
                  text-gray-600
                  transition-all
                  duration-200
                  disabled:opacity-30
                  disabled:cursor-not-allowed
                  active:scale-95
                "
                aria-label="Next step"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>

          {/* ===================================================
              MOBILE / TABLET — SINGLE STEP WITH ARROWS (below lg)
          ==================================================== */}
          <div className="flex flex-col relative lg:hidden">
            {/* Show only the current step */}
            {(() => {
              const step = service.process[currentStep];
              const index = currentStep;
              return (
                <div className="relative flex gap-5">
                  {/* STEP NUMBER CIRCLE */}
                  <div
                    className="
                      relative
                      z-10
                      flex-shrink-0
                      w-12
                      h-12
                      rounded-full
                      bg-[#0B4EA2]
                      text-white
                      flex
                      items-center
                      justify-center
                      text-sm
                      font-bold
                      shadow-[0_5px_15px_rgba(11,78,162,0.15)]
                    "
                  >
                    {String(step.step || index + 1).padStart(2, "0")}
                  </div>

                  {/* STEP CONTENT */}
                  <div className="pt-1 pb-2">
                    {/* STEP LABEL */}
                    <p
                      className="
                        text-xs
                        font-semibold
                        uppercase
                        tracking-[0.12em]
                        text-[#0B4EA2]
                        mb-1.5
                      "
                    >
                      Step {String(index + 1).padStart(2, "0")}
                    </p>

                    {/* TITLE */}
                    <h3
                      className="
                        text-base
                        sm:text-lg
                        font-bold
                        text-gray-900
                        leading-snug
                        mb-2
                      "
                    >
                      {step.title}
                    </h3>

                    {/* DESCRIPTION */}
                    <p
                      className="
                        text-sm
                        text-gray-600
                        leading-7
                      "
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })()}

            {/* DOT INDICATORS */}
            <div className="flex justify-center gap-2 mt-6">
              {service.process.map((_, i) => (
                <span
                  key={i}
                  className={`
                    w-2 h-2 rounded-full transition-all duration-200
                    ${i === currentStep ? "bg-[#0B4EA2] w-5" : "bg-gray-300"}
                  `}
                />
              ))}
            </div>
          </div>

          {/* ===================================================
              DESKTOP — HORIZONTAL TIMELINE (lg and above)
          ==================================================== */}
          <div className="relative hidden lg:block">
            {/* HORIZONTAL CONNECTING LINE */}
            <div
              className="
                absolute
                top-6
                left-6
                right-6
                h-px
                bg-gray-200
              "
            />

            {/* PROCESS ITEMS */}
            <div className="flex gap-6">
              {service.process.map((step, index) => (
                <div
                  key={index}
                  className="relative flex-1 min-w-0"
                >
                  {/* STEP NUMBER */}
                  <div
                    className="
                      relative
                      z-10
                      w-12
                      h-12
                      rounded-full
                      bg-[#0B4EA2]
                      text-white
                      flex
                      items-center
                      justify-center
                      text-sm
                      font-bold
                      ring-8
                      ring-white
                      shadow-[0_5px_15px_rgba(11,78,162,0.15)]
                      mb-7
                    "
                  >
                    {String(step.step || index + 1).padStart(2, "0")}
                  </div>

                  {/* STEP CONTENT */}
                  <div className="pr-4">
                    <p
                      className="
                        text-xs
                        font-semibold
                        uppercase
                        tracking-[0.12em]
                        text-[#0B4EA2]
                        mb-2
                      "
                    >
                      Step {String(index + 1).padStart(2, "0")}
                    </p>

                    <h3
                      className="
                        text-xl
                        font-bold
                        text-gray-900
                        leading-snug
                        mb-3
                      "
                    >
                      {step.title}
                    </h3>

                    <p
                      className="
                        text-sm
                        text-gray-600
                        leading-7
                      "
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