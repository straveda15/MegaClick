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

            <h2 className="section-heading text-gray-900">
              How It Works
            </h2>

            <p className="section-text mt-3 max-w-2xl">
              Our process is designed to make the entire service simple,
              transparent, and hassle-free.
            </p>
          </div>

          {/* ===================================================
              MOBILE / TABLET — VERTICAL TIMELINE (below lg)
          ==================================================== */}
          <div className="flex flex-col relative lg:hidden">
            {/* VERTICAL CONNECTING LINE */}
            <div
              className="
                absolute
                left-[23px]
                top-6
                bottom-6
                w-px
                bg-gray-200
              "
            />

            {service.process.map((step, index) => (
              <div
                key={index}
                className="relative flex gap-5 pb-10 last:pb-0"
              >
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
                    ring-8
                    ring-white
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
            ))}
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
            <div
              className="
                flex
                gap-6
              "
            >
              {service.process.map((step, index) => (
                <div
                  key={index}
                  className="
                    relative
                    flex-1
                    min-w-0
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
                        text-xl
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