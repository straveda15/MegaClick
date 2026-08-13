import React from "react";

import {
  Users,
  Building2,
  ShieldCheck,
  BadgeCheck,
} from "lucide-react";

const About = () => {
  return (
    <section
      className="
        relative
        overflow-hidden
        py-4
        sm:py-10
        lg:py-14
        bg-white
      "
    >
      {/* =====================================================
          MAIN CONTAINER
      ====================================================== */}

      <div
        className="
          max-w-[1500px]
          mx-auto
          px-4
          sm:px-8
          lg:px-16
          xl:px-24
          pt-0
          sm:pt-3
          lg:pt-4
          pb-2
          sm:pb-8
          lg:pb-10
        "
      >
        {/* =====================================================
            HEADING
            STATIC - NO ANIMATION
        ====================================================== */}

        <div
          className="
            mb-4
            sm:mb-10
            lg:mb-12
          "
        >
          {/* BADGE */}

          <span
            className="
              inline-flex
              items-center
              gap-2
              bg-[#0B4EA2]
              text-white
              px-4
              py-2
              rounded-full
              text-xs
              sm:text-sm
              font-semibold
              shadow-md
            "
          >
            <Building2
              size={15}
              className="text-green-300"
            />

            ABOUT US
          </span>

          {/* HEADING */}
          <h2
            className="
              mt-2.5
              sm:mt-5
              text-2xl
              sm:text-4xl
              lg:text-5xl
              font-bold
              leading-tight
              text-gray-900
            "
          >
            Your Success,{" "}
            <span
              className="
                bg-gradient-to-r
                from-blue-600
                to-green-500
                bg-clip-text
                text-transparent
              "
            >
              Our Mission
            </span>
          </h2>
        </div>

        {/* =====================================================
            ABOUT CONTENT
            NO ANIMATION
        ====================================================== */}

        <div
          className="
            w-full
            space-y-3.5
            sm:space-y-7
            lg:space-y-8
          "
        >
          {/* PARAGRAPH 1 */}

          <p
            className="
              text-sm
              sm:text-lg
              lg:text-[22px]
              leading-6
              sm:leading-8
              lg:leading-10
              text-gray-700
              text-left
              sm:text-justify
            "
          >
            <span className="font-bold">
              <span className="text-[#0B4EA2]">
                Mega
              </span>

              <span className="text-green-500">
                Click
              </span>
            </span>{" "}
            stands as one of India's most dynamic and
            forward-thinking integrated professional
            service platforms. It is built to simplify,
            streamline, and elevate the way individuals
            and businesses access professional services.
            Founded on a foundation of integrity,
            professionalism, and customer satisfaction,
            MegaClick is not merely a professional
            service provider—it is a complete ecosystem
            designed to fulfil every personal and
            business requirement with precision,
            expertise, and an unwavering commitment
            to excellence.
          </p>

          {/* PARAGRAPH 2 */}

          <p
            className="
              text-sm
              sm:text-lg
              lg:text-[22px]
              leading-6
              sm:leading-8
              lg:leading-10
              text-gray-700
              text-left
              sm:text-justify
            "
          >
            By bringing together legal, financial,
            banking, real estate, and business
            support professional services under
            one seamlessly integrated ecosystem,

            <span className="font-bold">
              {" "}
              <span className="text-[#0B4EA2]">
                Mega
              </span>

              <span className="text-green-500">
                Click
              </span>
            </span>{" "}
            eliminates the fragmentation that has
            traditionally complicated professional
            service delivery across India.
            Individuals and businesses no longer
            need to manage multiple uncoordinated
            service providers. MegaClick brings
            everything under one roof, supported
            by meticulous planning, continuous
            effort, and a strategic approach that
            consistently delivers reliable,
            transparent, and result-oriented
            professional services.
          </p>
        </div>

        {/* =====================================================
            STATISTICS STRIP
            NO ANIMATION
        ====================================================== */}

        <div
          className="
            relative
            mt-5
            sm:mt-10
            lg:mt-14
            w-full
            overflow-hidden
            rounded-xl
            sm:rounded-2xl
            bg-gradient-to-r
            from-[#0B4EA2]
            via-blue-600
            to-[#0B4EA2]
            shadow-2xl
          "
        >
          {/* BACKGROUND PATTERN */}

          <div
            className="
              absolute
              inset-0
              opacity-[0.08]
            "
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,.9) 1.2px, transparent 1.2px)",
              backgroundSize: "26px 26px",
            }}
          />

          <div
            className="
              absolute
              inset-0
              opacity-[0.08]
            "
            style={{
              backgroundImage:
                "repeating-linear-gradient(-45deg, rgba(255,255,255,.8) 0px, rgba(255,255,255,.8) 2px, transparent 2px, transparent 42px)",
            }}
          />

          {/* =====================================================
              STATS GRID
          ====================================================== */}

          <div
            className="
              relative
              z-10
              grid
              grid-cols-2
              lg:grid-cols-4
            "
          >
            {/* =================================================
                STAT 1
            ================================================= */}

            <div
              className="
                flex
                flex-col
                items-center
                justify-center
                text-center
                px-3
                sm:px-4
                py-3.5
                sm:py-7
                lg:py-8
                border-b
                border-r
                lg:border-b-0
                lg:border-r
                border-white/10
              "
            >
              <div
                className="
                  w-9
                  h-9
                  sm:w-12
                  sm:h-12
                  lg:w-14
                  lg:h-14
                  rounded-full
                  bg-white
                  flex
                  items-center
                  justify-center
                  mb-2
                  sm:mb-4
                  shadow-lg
                "
              >
                <Users
                  className="
                    w-4
                    h-4
                    sm:w-6
                    sm:h-6
                    text-[#0B4EA2]
                  "
                />
              </div>

              <h3
                className="
                  text-xl
                  sm:text-3xl
                  lg:text-4xl
                  font-bold
                  text-white
                "
              >
                15K+
              </h3>

              <p
                className="
                  text-[11px]
                  sm:text-sm
                  text-white/80
                  mt-0.5
                  sm:mt-2
                  font-medium
                "
              >
                Happy Clients
              </p>
            </div>

            {/* =================================================
                STAT 2
            ================================================= */}

            <div
              className="
                flex
                flex-col
                items-center
                justify-center
                text-center
                px-3
                sm:px-4
                py-3.5
                sm:py-7
                lg:py-8
                border-b
                lg:border-b-0
                lg:border-r
                border-white/10
              "
            >
              <div
                className="
                  w-9
                  h-9
                  sm:w-12
                  sm:h-12
                  lg:w-14
                  lg:h-14
                  rounded-full
                  bg-white
                  flex
                  items-center
                  justify-center
                  mb-2
                  sm:mb-4
                  shadow-lg
                "
              >
                <Building2
                  className="
                    w-4
                    h-4
                    sm:w-6
                    sm:h-6
                    text-green-500
                  "
                />
              </div>

              <h3
                className="
                  text-xl
                  sm:text-3xl
                  lg:text-4xl
                  font-bold
                  text-white
                "
              >
                25+
              </h3>

              <p
                className="
                  text-[11px]
                  sm:text-sm
                  text-white/80
                  mt-0.5
                  sm:mt-2
                  font-medium
                "
              >
                Business Services
              </p>
            </div>

            {/* =================================================
                STAT 3
            ================================================= */}

            <div
              className="
                flex
                flex-col
                items-center
                justify-center
                text-center
                px-3
                sm:px-4
                py-3.5
                sm:py-7
                lg:py-8
                border-r
                border-white/10
              "
            >
              <div
                className="
                  w-9
                  h-9
                  sm:w-12
                  sm:h-12
                  lg:w-14
                  lg:h-14
                  rounded-full
                  bg-white
                  flex
                  items-center
                  justify-center
                  mb-2
                  sm:mb-4
                  shadow-lg
                "
              >
                <ShieldCheck
                  className="
                    w-4
                    h-4
                    sm:w-6
                    sm:h-6
                    text-emerald-500
                  "
                />
              </div>

              <h3
                className="
                  text-xl
                  sm:text-3xl
                  lg:text-4xl
                  font-bold
                  text-white
                "
              >
                100%
              </h3>

              <p
                className="
                  text-[11px]
                  sm:text-sm
                  text-white/80
                  mt-0.5
                  sm:mt-2
                  font-medium
                "
              >
                Trusted Process
              </p>
            </div>

            {/* =================================================
                STAT 4
            ================================================= */}

            <div
              className="
                flex
                flex-col
                items-center
                justify-center
                text-center
                px-3
                sm:px-4
                py-3.5
                sm:py-7
                lg:py-8
              "
            >
              <div
                className="
                  w-9
                  h-9
                  sm:w-12
                  sm:h-12
                  lg:w-14
                  lg:h-14
                  rounded-full
                  bg-white
                  flex
                  items-center
                  justify-center
                  mb-2
                  sm:mb-4
                  shadow-lg
                "
              >
                <BadgeCheck
                  className="
                    w-4
                    h-4
                    sm:w-6
                    sm:h-6
                    text-[#0B4EA2]
                  "
                />
              </div>

              <h3
                className="
                  text-xl
                  sm:text-3xl
                  lg:text-4xl
                  font-bold
                  text-white
                "
              >
                10+
              </h3>

              <p
                className="
                  text-[11px]
                  sm:text-sm
                  text-white/80
                  mt-0.5
                  sm:mt-2
                  font-medium
                "
              >
                Years Experience
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;