import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import {
  Eye,
  Target,
  CheckCircle,
} from "lucide-react";

const VisionMission = () => {
  const ref = useRef(null);

  const isInView = useInView(ref, {
    once: false,
    amount: 0.35,
  });

  return (
    <section
      ref={ref}
      className="relative py-10 bg-gradient-to-br from-white via-blue-50 to-white overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute -top-32 right-0 w-[420px] h-[420px] bg-blue-100 rounded-full blur-[120px] opacity-60" />

      <div className="max-w-[1500px] mx-auto px-6 lg:px-24">

        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT CONTENT */}

          <div>

            <span className="inline-flex items-center gap-2 bg-[#0B4EA2] text-white px-5 py-2 rounded-full font-semibold">
              <CheckCircle size={18} />
              OUR PURPOSE
            </span>

            <h2 className="mt-6 text-4xl lg:text-5xl font-bold leading-tight text-[#0B4EA2]">
              Vision
              <span className="text-green-500">
                {" "} & Mission
              </span>
            </h2>

            <p className="mt-6 text-lg text-gray-600 leading-8 max-w-xl">
              MegaClick is committed to simplifying legal,
              financial and business compliance services
              through innovation, transparency and trusted
              professional support.
            </p>

            <div className="mt-10 space-y-7">

              <div className="flex gap-4">

                <div className="w-11 h-11 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle
                    size={20}
                    className="text-green-600"
                  />
                </div>

                <div>
                  <h4 className="font-semibold text-lg">
                    Trusted Professionals
                  </h4>

                  <p className="text-gray-500 mt-1">
                    Dedicated experts delivering reliable,
                    affordable and compliant business solutions.
                  </p>
                </div>

              </div>

              <div className="flex gap-4">

                <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle
                    size={20}
                    className="text-[#0B4EA2]"
                  />
                </div>

                <div>

                  <h4 className="font-semibold text-lg">
                    Transparent Process
                  </h4>

                  <p className="text-gray-500 mt-1">
                    Fast execution with complete transparency.
        
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* RIGHT SIDE */}

          <div className="relative h-[520px] flex justify-center items-center">



                  {/* ================= VISION CARD ================= */}

      <motion.div
        initial={{
          x: 0,
          y: 0,
          scale: 0.88,
          rotate: -8,
          opacity: 0,
        }}
        animate={
          isInView
            ? {
                x: "-52%",
                y: 0,
                scale: 1,
                rotate: 0,
                opacity: 1,
              }
            : {}
        }
       transition={{
  duration: 2.5,
  delay: 0.2,
  type: "spring",
  stiffness: 35,
  damping: 18,
}}
        className="absolute w-full max-w-[370px] z-20"
      >
        <div
          className="
            relative
            bg-white
            rounded-[28px]
            border-2
            border-blue-500
            shadow-xl
            hover:-translate-y-3
            hover:shadow-2xl
            transition-all
            duration-500
            p-8
            pb-16
            flex
            flex-col
          "
        >
          <div className="w-20 h-20 mx-auto rounded-full bg-blue-100 flex items-center justify-center">

            <Eye
              size={40}
              className="text-[#0B4EA2]"
            />

          </div>

          <h3 className="mt-8 text-center text-3xl font-bold text-[#0B4EA2]">
            Our Vision
          </h3>

          <p className="mt-5 text-center text-gray-600 leading-8 flex-grow">
            To become India's most trusted digital platform
            for legal, business and financial services by
            empowering entrepreneurs with innovative,
            transparent and hassle-free solutions.
          </p>

          <div
            className="
              absolute
              bottom-0
              left-1/2
              -translate-x-1/2
              w-[100%]
              h-14
              bg-blue-500
              rounded-b-[24px]
              flex
              items-center
              justify-center
              text-white
              font-semibold
              text-lg
            "
          >
            Vision
          </div>

        </div>
      </motion.div>

      {/* ================= MISSION CARD ================= */}

      <motion.div
        initial={{
          x: 0,
          y: 0,
          scale: 0.88,
          rotate: 8,
          opacity: 0,
        }}
        animate={
          isInView
            ? {
                x: "52%",
                y: 0,
                scale: 1,
                rotate: 0,
                opacity: 1,
              }
            : {}
        }
       transition={{
  duration: 2.5,
  delay: 0.5,
  type: "spring",
  stiffness: 35,
  damping: 18,
}}
        className="absolute w-full max-w-[370px] z-10"
      >
        <div
          className="
            relative
            bg-white
            rounded-[28px]
            border-2
            border-green-500
            shadow-xl
            hover:-translate-y-3
            hover:shadow-2xl
            transition-all
            duration-500
            p-8
            pb-16
            flex
            flex-col
          "
        >
          <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center">

            <Target
              size={40}
              className="text-green-600"
            />

          </div>

          <h3 className="mt-8 text-center text-3xl font-bold text-green-600">
            Our Mission
          </h3>

          <p className="mt-5 text-center text-gray-600 leading-8 flex-grow">
            Deliver affordable, reliable and technology-driven
            legal, taxation and compliance services while
            ensuring transparency, efficiency and customer
            satisfaction.
          </p>

          <div
            className="
              absolute
              bottom-0
              left-1/2
              -translate-x-1/2
              w-[100%]
              h-14
              bg-green-500
              rounded-b-[24px]
              flex
              items-center
              justify-center
              text-white
              font-semibold
              text-lg
            "
          >
            Mission
          </div>

        </div>
      </motion.div>


                </div>
          {/* END RIGHT SIDE */}

        </div>
        {/* END GRID */}

      </div>
      {/* END CONTAINER */}

    </section>
  );
};

export default VisionMission;
        