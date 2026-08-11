
import React from "react";

const HowItWorks = ({ service }) => {
  if (!service?.process?.length) {
    return null;
  }

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
        {/* =========================
            MAIN SECTION
        ========================== */}
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
              HEADING
          ========================== */}
          <div className="mb-10 sm:mb-12">
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

            <h2
              className="
                text-2xl
                sm:text-3xl
                lg:text-4xl
                font-bold
                text-gray-900
                tracking-tight
              "
            >
              How It Works
            </h2>

            <p
              className="
                mt-3
                text-sm
                sm:text-base
                text-gray-600
                leading-7
                max-w-2xl
              "
            >
              Our process is designed to make the entire service
              simple, transparent, and hassle-free.
            </p>
          </div>

          {/* =========================
              HORIZONTAL TIMELINE
          ========================== */}
          <div className="relative">
            {/* CONNECTING LINE */}
            <div
              className="
                hidden
                lg:block
                absolute
                top-6
                left-6
                right-6
                h-px
                bg-gray-200
              "
            />

            {/* PROCESS ITEMS */}
            <div
              className="
                flex
                gap-8
                overflow-x-auto
                pb-4
                snap-x
                snap-mandatory
                scrollbar-thin
                scrollbar-thumb-gray-300
                scrollbar-track-transparent
                lg:gap-6
                lg:overflow-visible
              "
            >
              {service.process.map((step, index) => (
                <div
                  key={index}
                  className="
                    relative
                    flex-shrink-0
                    w-[280px]
                    sm:w-[320px]
                    lg:w-0
                    lg:flex-1
                    snap-start
                  "
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
                    {/* STEP LABEL */}
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

                    {/* TITLE */}
                    <h3
                      className="
                        text-lg
                        sm:text-xl
                        font-bold
                        text-gray-900
                        leading-snug
                        mb-3
                      "
                    >
                      {step.title}
                    </h3>

                    {/* DESCRIPTION */}
                    <p
                      className="
                        text-sm
                        sm:text-base
                        text-gray-600
                        leading-7
                        max-w-sm
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
