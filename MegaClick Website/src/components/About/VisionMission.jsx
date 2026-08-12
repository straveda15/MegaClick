import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Eye,
  Target,
  CheckCircle2,
} from "lucide-react";

const VisionMission = () => {
  const sectionRef = useRef(null);

  const isInView = useInView(sectionRef, {
    once: false,
    amount: 0.2,
  });

  return (
    <section
      ref={sectionRef}
      className="
        relative
        overflow-hidden
        py-12
        sm:py-14
        lg:py-20
        bg-blue-50
      "
    >
      {/* ================= BACKGROUND SHAPES ================= */}

      <div
        className="
          absolute
          -top-32
          -right-32
          w-80
          h-80
          rounded-full
          bg-blue-200
          blur-3xl
          opacity-50
          pointer-events-none
        "
      />

      <div
        className="
          absolute
          -bottom-32
          -left-32
          w-80
          h-80
          rounded-full
          bg-green-100
          blur-3xl
          opacity-40
          pointer-events-none
        "
      />

      <div
        className="
          max-w-[1500px]
          mx-auto
          px-4
          sm:px-8
          lg:px-16
          xl:px-24
          pt-2
          sm:pt-3
          lg:pt-4
          pb-6
          sm:pb-8
          lg:pb-10
        "
      >
        {/* =================================================
            HEADER
            NO ANIMATION HERE
        ================================================= */}

        <div className="mb-10 lg:mb-14">

          {/* BADGE - STATIC */}

          <span
            className="
              inline-flex
              items-center
              gap-2
              bg-[#0B4EA2]
              text-white
              px-4
              sm:px-5
              py-2
              rounded-full
              text-xs
              sm:text-sm
              font-semibold
            "
          >
            <CheckCircle2
              size={16}
              className="text-green-300"
            />

            OUR PURPOSE
          </span>

          {/* HEADING - STATIC */}

          <h2
            className="
              mt-5
              text-3xl
              sm:text-4xl
              lg:text-5xl
              font-bold
              leading-tight
            "
          >
            <span className="text-[#0B4EA2]">
              Vision
            </span>

            <span className="text-gray-900">
              {" & "}
            </span>

            <span className="text-green-500">
              Mission
            </span>
          </h2>

        </div>

        {/* =================================================
            VISION + MISSION
            CARDS ANIMATION REMAINS
        ================================================= */}

        <div
          className="
            grid
            lg:grid-cols-2
            gap-6
            lg:gap-8
          "
        >

          {/* ================= VISION ================= */}

          <motion.div
            initial={{
              opacity: 0,
              x: -50,
            }}
            animate={
              isInView
                ? {
                    opacity: 1,
                    x: 0,
                  }
                : {
                    opacity: 0,
                    x: -50,
                  }
            }
            transition={{
              duration: 0.8,
              delay: 0.15,
            }}
            className="
              group
              relative
              overflow-hidden
              rounded-2xl
              border
              border-blue-100
              bg-[#D6E9FF]
              p-6
              sm:p-8
              lg:p-10
              hover:border-blue-300
              hover:shadow-xl
              transition-all
              duration-500
            "
          >

            {/* BLUE SIDE LINE */}

            <div
              className="
                absolute
                top-0
                left-0
                w-1
                h-full
                bg-[#0B4EA2]
              "
            />

            <div
              className="
                flex
                flex-col
                sm:flex-row
                gap-6
              "
            >

              {/* LEFT TITLE */}

              <div
                className="
                  sm:w-[150px]
                  lg:w-[170px]
                  flex-shrink-0
                "
              >

                <div
                  className="
                    flex
                    sm:flex-col
                    items-center
                    sm:items-start
                    gap-3
                  "
                >

                  <motion.div
                    whileHover={{
                      scale: 1.08,
                      rotate: 5,
                    }}
                    transition={{
                      duration: 0.3,
                    }}
                    className="
                      w-14
                      h-14
                      rounded-xl
                      bg-white
                      border
                      border-blue-100
                      flex
                      items-center
                      justify-center
                      shadow-sm
                    "
                  >
                    <Eye
                      size={28}
                      className="text-[#0B4EA2]"
                    />
                  </motion.div>

                  <div>

                    <p
                      className="
                        text-xs
                        font-semibold
                        uppercase
                        tracking-widest
                        text-gray-400
                      "
                    >
                      Our
                    </p>

                    <h3
                      className="
                        text-2xl
                        sm:text-3xl
                        font-bold
                        text-[#0B4EA2]
                      "
                    >
                      Vision
                    </h3>

                  </div>

                </div>

              </div>

              {/* RIGHT CONTENT */}

              <div className="flex-1">

                <p
                  className="
                    text-gray-600
                    text-base
                    sm:text-lg
                    leading-7
                    sm:leading-8
                  "
                >
                  To become India's most trusted digital
                  platform for legal, business and financial
                  services by empowering entrepreneurs with
                  innovative, transparent and hassle-free
                  solutions.
                </p>

                <div
                  className="
                    mt-6
                    flex
                    items-center
                    gap-2
                    text-sm
                    font-semibold
                    text-[#0B4EA2]
                  "
                >
                  <span
                    className="
                      w-8
                      h-[2px]
                      bg-[#0B4EA2]
                    "
                  />

                  Building a trusted future
                </div>

              </div>

            </div>

          </motion.div>

          {/* ================= MISSION ================= */}

          <motion.div
            initial={{
              opacity: 0,
              x: 50,
            }}
            animate={
              isInView
                ? {
                    opacity: 1,
                    x: 0,
                  }
                : {
                    opacity: 0,
                    x: 50,
                  }
            }
            transition={{
              duration: 0.8,
              delay: 0.3,
            }}
            className="
              group
              relative
              overflow-hidden
              rounded-2xl
              border
              border-green-100
              bg-[#D9F7E5]
              p-6
              sm:p-8
              lg:p-10
              hover:border-green-300
              hover:shadow-xl
              transition-all
              duration-500
            "
          >

            {/* GREEN SIDE LINE */}

            <div
              className="
                absolute
                top-0
                left-0
                w-1
                h-full
                bg-green-500
              "
            />

            <div
              className="
                flex
                flex-col
                sm:flex-row
                gap-6
              "
            >

              {/* LEFT TITLE */}

              <div
                className="
                  sm:w-[150px]
                  lg:w-[170px]
                  flex-shrink-0
                "
              >

                <div
                  className="
                    flex
                    sm:flex-col
                    items-center
                    sm:items-start
                    gap-3
                  "
                >

                  <motion.div
                    whileHover={{
                      scale: 1.08,
                      rotate: -5,
                    }}
                    transition={{
                      duration: 0.3,
                    }}
                    className="
                      w-14
                      h-14
                      rounded-xl
                      bg-white
                      border
                      border-green-100
                      flex
                      items-center
                      justify-center
                      shadow-sm
                    "
                  >
                    <Target
                      size={28}
                      className="text-green-600"
                    />
                  </motion.div>

                  <div>

                    <p
                      className="
                        text-xs
                        font-semibold
                        uppercase
                        tracking-widest
                        text-gray-400
                      "
                    >
                      Our
                    </p>

                    <h3
                      className="
                        text-2xl
                        sm:text-3xl
                        font-bold
                        text-green-600
                      "
                    >
                      Mission
                    </h3>

                  </div>

                </div>

              </div>

              {/* RIGHT CONTENT */}

              <div className="flex-1">

                <p
                  className="
                    text-gray-600
                    text-base
                    sm:text-lg
                    leading-7
                    sm:leading-8
                  "
                >
                  Deliver affordable, reliable and
                  technology-driven legal, taxation and
                  compliance services while ensuring
                  transparency, efficiency and customer
                  satisfaction.
                </p>

                <div
                  className="
                    mt-6
                    flex
                    items-center
                    gap-2
                    text-sm
                    font-semibold
                    text-green-600
                  "
                >
                  <span
                    className="
                      w-8
                      h-[2px]
                      bg-green-500
                    "
                  />

                  Making business simpler
                </div>

              </div>

            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
};

export default VisionMission;