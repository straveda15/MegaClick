import React from "react";

import {
  ArrowRight,
  CheckCircle2,
  BriefcaseBusiness,
  Users,
  ShieldCheck,
} from "lucide-react";

const Hero = () => {
  const scrollToContact = () => {
    document
      .getElementById("contact")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-white"
    >
      <div
        className="
          max-w-[1500px]
          mx-auto
          px-4
          sm:px-8
          lg:px-16
          xl:px-24
          py-8
          sm:py-10
          lg:py-12
        "
      >
        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-2
            gap-10
            lg:gap-14
            xl:gap-20
            items-center
          "
        >
          {/* =====================================================
              LEFT CONTENT
          ====================================================== */}

          <div
            className="
              space-y-5
              sm:space-y-6
              md:space-y-7
              w-full
            "
          >
            {/* BADGE */}

            <div
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
              <CheckCircle2 size={16} />
              Trusted Business Solutions
            </div>

            {/* HEADING */}

            <h1
              className="
                text-3xl
                sm:text-4xl
                md:text-5xl
                lg:text-5xl
                xl:text-6xl
                font-bold
                leading-tight
                text-black
              "
            >
              Grow Your Business
              <br />

              <span
                className="
                  bg-gradient-to-r
                  from-blue-600
                  to-green-500
                  bg-clip-text
                  text-transparent
                "
              >
                With Smart Solutions
              </span>
            </h1>

            {/* DESCRIPTION */}

            <p
              className="
                text-sm
                sm:text-base
                md:text-lg
                text-black
                leading-7
                md:leading-relaxed
                max-w-xl
              "
            >
              Complete business solutions to simplify registrations,
              compliance, finance and growth with trusted expert guidance.
            </p>

            {/* STATS */}

            <div
              className="
                flex
                gap-5
                sm:gap-8
                md:gap-10
                flex-wrap
              "
            >
              <div>
                <h3
                  className="
                    text-2xl
                    sm:text-3xl
                    font-bold
                    text-[#0B4EA2]
                  "
                >
                  15000+
                </h3>

                <p className="text-black text-xs sm:text-sm">
                  Happy Clients
                </p>
              </div>

              <div>
                <h3
                  className="
                    text-2xl
                    sm:text-3xl
                    font-bold
                    text-[#0B4EA2]
                  "
                >
                  25+
                </h3>

                <p className="text-black text-xs sm:text-sm">
                  Services
                </p>
              </div>

              <div>
                <h3
                  className="
                    text-2xl
                    sm:text-3xl
                    font-bold
                    text-[#0B4EA2]
                  "
                >
                  10+
                </h3>

                <p className="text-black text-xs sm:text-sm">
                  Years Experience
                </p>
              </div>
            </div>

            {/* BUTTONS */}

            <div
              className="
                flex
                flex-col
                sm:flex-row
                gap-3
                sm:gap-4
                pt-2
              "
            >
              <button
                onClick={scrollToContact}
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  bg-[#0B4EA2]
                  hover:bg-blue-700
                  text-white
                  px-7
                  sm:px-8
                  py-3
                  sm:py-3.5
                  rounded-xl
                  font-semibold
                  text-sm
                  sm:text-base
                  transition
                  w-full
                  sm:w-auto
                "
              >
                Get Started
                <ArrowRight size={18} />
              </button>

              <button
                onClick={scrollToContact}
                className="
                  bg-green-600
                  hover:bg-green-700
                  text-white
                  px-7
                  sm:px-8
                  py-3
                  sm:py-3.5
                  rounded-xl
                  font-semibold
                  text-sm
                  sm:text-base
                  transition
                  w-full
                  sm:w-auto
                "
              >
                Contact Us
              </button>
            </div>
          </div>

          {/* =====================================================
              RIGHT FLOATING UI
          ====================================================== */}

          <div
            className="
              relative
              w-full
              flex
              justify-center
              items-center
              mt-6
              lg:mt-0
              overflow-visible
            "
          >
            {/* =================================================
                RESPONSIVE FLOATING CONTAINER
            ================================================== */}

            <div
              className="
                relative
                flex-shrink-0

                w-[320px]
                h-[390px]

                sm:w-[390px]
                sm:h-[420px]

                md:w-[450px]
                md:h-[440px]

                lg:w-[500px]
                lg:h-[450px]

                xl:w-[560px]
                xl:h-[480px]
              "
            >

              {/* =================================================
                  MAIN CENTER CARD
              ================================================== */}

              <div
                className="
                  absolute
                  z-10

                  left-1/2
                  -translate-x-1/2

                  top-[65px]

                  sm:top-[70px]

                  md:top-[75px]

                  lg:top-[80px]

                  xl:top-[85px]

                  w-[245px]

                  sm:w-[310px]

                  md:w-[350px]

                  lg:w-[380px]

                  xl:w-[440px]
                "
              >
                <div className="hero-float-main">

                  <div
                    className="
                      bg-white
                      rounded-2xl
                      sm:rounded-[22px]

                      border
                      border-blue-100

                      shadow-[0_20px_40px_rgba(11,78,162,0.14)]

                      p-4
                      sm:p-5
                      md:p-6
                      lg:p-7
                      xl:p-8
                    "
                  >

                    {/* MAIN CARD HEADER */}

                    <div
                      className="
                        flex
                        items-center
                        gap-3
                        sm:gap-4
                      "
                    >

                      <div
                        className="
                          w-10
                          h-10

                          sm:w-12
                          sm:h-12

                          xl:w-14
                          xl:h-14

                          rounded-xl
                          sm:rounded-2xl

                          bg-blue-100

                          flex
                          items-center
                          justify-center
                          flex-shrink-0
                        "
                      >
                        <BriefcaseBusiness
                          size={23}
                          className="
                            text-[#0B4EA2]
                            sm:w-7
                            sm:h-7
                          "
                        />
                      </div>

                      <div>
                        <h3
                          className="
                            text-base
                            sm:text-lg
                            xl:text-xl
                            font-bold
                          "
                        >
                          <span className="text-[#0B4EA2]">
                            Mega
                          </span>

                          <span className="text-green-500">
                            Click
                          </span>
                        </h3>

                        <p
                          className="
                            text-[10px]
                            sm:text-xs
                            xl:text-sm
                            text-gray-500
                          "
                        >
                          Smart Business Solutions
                        </p>
                      </div>
                    </div>

                    {/* MAIN CARD STATS */}

                    <div
                      className="
                        mt-5
                        sm:mt-6
                        xl:mt-8

                        grid
                        grid-cols-3

                        gap-2
                        sm:gap-3
                        xl:gap-4
                      "
                    >

                      {/* CLIENTS */}

                      <div
                        className="
                          bg-blue-50
                          rounded-lg
                          sm:rounded-xl

                          p-2
                          sm:p-3
                          xl:p-4

                          text-center
                        "
                      >
                        <h4
                          className="
                            text-lg
                            sm:text-xl
                            xl:text-2xl
                            font-bold
                            text-[#0B4EA2]
                          "
                        >
                          15K+
                        </h4>

                        <p
                          className="
                            text-[9px]
                            sm:text-[11px]
                            xl:text-xs
                            text-gray-500
                          "
                        >
                          Clients
                        </p>
                      </div>

                      {/* SERVICES */}

                      <div
                        className="
                          bg-green-50
                          rounded-lg
                          sm:rounded-xl

                          p-2
                          sm:p-3
                          xl:p-4

                          text-center
                        "
                      >
                        <h4
                          className="
                            text-lg
                            sm:text-xl
                            xl:text-2xl
                            font-bold
                            text-green-600
                          "
                        >
                          25+
                        </h4>

                        <p
                          className="
                            text-[9px]
                            sm:text-[11px]
                            xl:text-xs
                            text-gray-500
                          "
                        >
                          Services
                        </p>
                      </div>

                      {/* YEARS */}

                      <div
                        className="
                          bg-blue-50
                          rounded-lg
                          sm:rounded-xl

                          p-2
                          sm:p-3
                          xl:p-4

                          text-center
                        "
                      >
                        <h4
                          className="
                            text-lg
                            sm:text-xl
                            xl:text-2xl
                            font-bold
                            text-[#0B4EA2]
                          "
                        >
                          10+
                        </h4>

                        <p
                          className="
                            text-[9px]
                            sm:text-[11px]
                            xl:text-xs
                            text-gray-500
                          "
                        >
                          Years
                        </p>
                      </div>

                    </div>

                    {/* TRUSTED */}

                    <div
                      className="
                        mt-4
                        sm:mt-5
                        xl:mt-6

                        flex
                        items-center
                        gap-2

                        text-xs
                        sm:text-sm

                        font-semibold
                        text-green-600
                      "
                    >
                      <CheckCircle2
                        size={16}
                        className="
                          sm:w-[18px]
                          sm:h-[18px]
                        "
                      />

                      Trusted Business Partner
                    </div>

                  </div>
                </div>
              </div>

              {/* =================================================
                  LEFT SMALL CARD
              ================================================== */}

              <div
                className="
                  absolute
                  z-20

                  left-[0px]
                  top-[15px]

                  sm:left-[5px]
                  sm:top-[10px]

                  md:left-[15px]
                  md:top-[15px]

                  lg:left-[30px]
                  lg:top-[20px]

                  xl:left-[35px]
                  xl:top-[25px]

                  w-[105px]

                  sm:w-[135px]

                  md:w-[150px]

                  lg:w-[165px]

                  xl:w-[180px]
                "
              >
                <div className="hero-float-left">

                  <div
                    className="
                      bg-white

                      rounded-xl
                      sm:rounded-2xl

                      border
                      border-blue-100

                      shadow-[0_15px_30px_rgba(11,78,162,0.13)]

                      p-2.5
                      sm:p-3.5
                      md:p-4
                      xl:p-5
                    "
                  >

                    <div
                      className="
                        flex
                        items-center
                        gap-2
                        sm:gap-3
                      "
                    >

                      <div
                        className="
                          w-7
                          h-7

                          sm:w-9
                          sm:h-9

                          xl:w-10
                          xl:h-10

                          rounded-lg
                          sm:rounded-xl

                          bg-blue-100

                          flex
                          items-center
                          justify-center

                          flex-shrink-0
                        "
                      >
                        <Users
                          size={17}
                          className="
                            text-[#0B4EA2]
                            sm:w-[21px]
                            sm:h-[21px]
                          "
                        />
                      </div>

                      <div>

                        <h4
                          className="
                            font-bold
                            text-[11px]
                            sm:text-sm
                            xl:text-base
                          "
                        >
                          15000+
                        </h4>

                        <p
                          className="
                            text-[8px]
                            sm:text-[10px]
                            xl:text-[11px]
                            text-gray-500
                          "
                        >
                          Happy Clients
                        </p>

                      </div>

                    </div>

                  </div>

                </div>
              </div>

              {/* =================================================
                  RIGHT / BOTTOM SMALL CARD
              ================================================== */}

              <div
                className="
                  absolute
                  z-20

                  right-[0px]
                  bottom-[20px]

                  sm:right-[0px]
                  sm:bottom-[35px]

                  md:right-[5px]
                  md:bottom-[45px]

                  lg:right-[5px]
                  lg:bottom-[50px]

                  xl:right-[0px]
                  xl:bottom-[55px]

                  w-[110px]

                  sm:w-[145px]

                  md:w-[160px]

                  lg:w-[175px]

                  xl:w-[200px]
                "
              >
                <div className="hero-float-right">

                  <div
                    className="
                      bg-white

                      rounded-xl
                      sm:rounded-2xl

                      border
                      border-blue-100

                      shadow-[0_15px_30px_rgba(11,78,162,0.13)]

                      p-2.5
                      sm:p-3.5
                      md:p-4
                      xl:p-5
                    "
                  >

                    <div
                      className="
                        flex
                        items-center
                        gap-2
                        sm:gap-3
                      "
                    >

                      <div
                        className="
                          w-7
                          h-7

                          sm:w-9
                          sm:h-9

                          xl:w-10
                          xl:h-10

                          rounded-lg
                          sm:rounded-xl

                          bg-green-100

                          flex
                          items-center
                          justify-center

                          flex-shrink-0
                        "
                      >
                        <ShieldCheck
                          size={16}
                          className="
                            text-green-600
                            sm:w-[19px]
                            sm:h-[19px]
                          "
                        />
                      </div>

                      <div>

                        <h4
                          className="
                            font-bold
                            text-[11px]
                            sm:text-sm
                            xl:text-base
                            text-gray-900
                          "
                        >
                          Secure
                        </h4>

                        <p
                          className="
                            text-[8px]
                            sm:text-[10px]
                            xl:text-[11px]
                            text-gray-500
                          "
                        >
                          Compliance
                        </p>

                      </div>

                    </div>

                  </div>

                </div>
              </div>

              {/* =================================================
                  SERVICE ACTIVE BADGE
              ================================================== */}

              <div
                className="
                  absolute
                  z-30

                  right-[5px]
                  top-[20px]

                  sm:right-[15px]
                  sm:top-[25px]

                  md:right-[25px]
                  md:top-[30px]

                  lg:right-[35px]
                  lg:top-[30px]

                  xl:right-[45px]
                  xl:top-[35px]
                "
              >
                <div className="hero-float-status">

                  <div
                    className="
                      flex
                      items-center
                      gap-1.5
                      sm:gap-2

                      bg-blue-50

                      border
                      border-blue-200

                      rounded-full

                      px-2.5
                      sm:px-4
                      xl:px-5

                      py-1.5
                      sm:py-2

                      text-[8px]
                      sm:text-xs
                      xl:text-sm

                      font-bold
                      text-[#0B4EA2]

                      whitespace-nowrap

                      shadow-sm
                    "
                  >

                    <span
                      className="
                        w-1.5
                        h-1.5

                        sm:w-2
                        sm:h-2

                        rounded-full

                        bg-green-500

                        shadow-[0_0_6px_rgba(34,197,94,0.8)]
                      "
                    />

                    Services Active

                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          BACKGROUND BLUR
      ====================================================== */}

      <div
        className="
          absolute
          -top-32
          -left-32
          w-72
          h-72
          rounded-full
          bg-blue-100/50
          blur-3xl
          -z-10
        "
      />

      <div
        className="
          absolute
          -bottom-40
          -right-40
          w-96
          h-96
          rounded-full
          bg-green-100/40
          blur-3xl
          -z-10
        "
      />

      {/* =====================================================
          FLOATING ANIMATIONS
      ====================================================== */}

      <style>{`
        @keyframes heroFloatA {
          0%,
          100% {
            transform: translateY(0px);
          }

          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes heroFloatB {
          0%,
          100% {
            transform: translateY(0px);
          }

          50% {
            transform: translateY(8px);
          }
        }

        @keyframes heroStatusFloat {
          0%,
          100% {
            transform: translateY(0px);
          }

          50% {
            transform: translateY(-5px);
          }
        }

        .hero-float-main {
          animation: heroFloatA 6s ease-in-out infinite;
        }

        .hero-float-left {
          animation: heroFloatB 5.2s ease-in-out 0.4s infinite;
        }

        .hero-float-right {
          animation: heroFloatA 4.8s ease-in-out 0.8s infinite;
        }

        .hero-float-status {
          animation: heroStatusFloat 5s ease-in-out 0.6s infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .hero-float-main,
          .hero-float-left,
          .hero-float-right,
          .hero-float-status {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;