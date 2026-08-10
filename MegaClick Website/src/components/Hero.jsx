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
      className="
        relative
        overflow-hidden
        bg-white
      "
    >
      <div
        className="
          max-w-[1500px]
          mx-auto
          px-4
          sm:px-8
          lg:px-16
          xl:px-24
          py-6
          sm:py-8
          lg:py-10
        "
      >
        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-2
            gap-10
            lg:gap-16
            items-center
          "
        >

          {/* =====================================================
              LEFT SIDE
          ====================================================== */}

          <div
            className="
              space-y-5
              sm:space-y-6
              md:space-y-7
            "
          >

            {/* ================= BADGE ================= */}

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


            {/* ================= HEADING ================= */}

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


            {/* ================= DESCRIPTION ================= */}

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


            {/* ================= STATS ================= */}

            <div
              className="
                flex
                gap-5
                sm:gap-8
                md:gap-10
                flex-wrap
              "
            >

              {/* CLIENTS */}

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

                <p
                  className="
                    text-black
                    text-xs
                    sm:text-sm
                  "
                >
                  Happy Clients
                </p>
              </div>


              {/* SERVICES */}

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

                <p
                  className="
                    text-black
                    text-xs
                    sm:text-sm
                  "
                >
                  Services
                </p>
              </div>


              {/* EXPERIENCE */}

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

                <p
                  className="
                    text-black
                    text-xs
                    sm:text-sm
                  "
                >
                  Years Experience
                </p>
              </div>

            </div>


            {/* ================= BUTTONS ================= */}

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
              RIGHT SIDE FLOATING UI
          ====================================================== */}

          <div
            className="
              flex
              items-center
              justify-center
              w-full
              min-h-[340px]
              sm:min-h-[400px]
              lg:min-h-[450px]
              xl:min-h-[520px]
              mt-4
              lg:mt-0
            "
          >

            <div
              className="
                relative
                w-[320px]
                h-[320px]
                sm:w-[390px]
                sm:h-[370px]
                md:w-[430px]
                md:h-[400px]
                lg:w-[420px]
                lg:h-[420px]
                xl:w-[560px]
                xl:h-[480px]
              "
            >

              {/* =================================================
                  CENTER MAIN CARD
              ================================================== */}

              <div
                className="
                  absolute
                  left-1/2
                  -translate-x-1/2
                  top-[50px]
                  sm:top-[65px]
                  lg:top-[70px]
                  z-10
                  w-[270px]
                  sm:w-[330px]
                  md:w-[360px]
                  lg:w-[350px]
                  xl:w-[490px]
                "
              >

                {/* ANIMATION WRAPPER */}

                <div className="hero-float-main">

                  <div
                    className="
                      bg-white
                      rounded-2xl
                      sm:rounded-[24px]
                      border
                      border-blue-100
                      shadow-[0_20px_40px_rgba(11,78,162,0.12)]
                      p-4
                      sm:p-5
                      lg:p-6
                      xl:p-8
                    "
                  >

                    {/* CARD HEADER */}

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


                    {/* CARD STATS */}

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
                        className="sm:w-[18px] sm:h-[18px]"
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
                  left-0
                  top-[10px]
                  sm:top-[20px]
                  z-20
                  w-[125px]
                  sm:w-[150px]
                  xl:w-[180px]
                "
              >

                {/* ANIMATION WRAPPER */}

                <div className="hero-float-left">

                  <div
                    className="
                      bg-white
                      rounded-xl
                      sm:rounded-2xl
                      border
                      border-blue-100
                      shadow-[0_15px_35px_rgba(11,78,162,0.12)]
                      p-3
                      sm:p-4
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
                          w-8
                          h-8
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
                          size={18}
                          className="
                            text-[#0B4EA2]
                            sm:w-[22px]
                            sm:h-[22px]
                          "
                        />

                      </div>


                      <div>

                        <h4
                          className="
                            font-bold
                            text-gray-900
                            text-xs
                            sm:text-sm
                          "
                        >
                          15000+
                        </h4>

                        <p
                          className="
                            text-[9px]
                            sm:text-[11px]
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
                  RIGHT SECURITY CARD
              ================================================== */}

              <div
                className="
                  absolute
                  right-0
                  bottom-[45px]
                  sm:bottom-[70px]
                  lg:bottom-[90px]
                  z-20
                  w-[125px]
                  sm:w-[150px]
                  xl:w-[180px]
                "
              >

                {/* ANIMATION WRAPPER */}

                <div className="hero-float-right">

                  <div
                    className="
                      bg-white
                      rounded-xl
                      border
                      border-blue-100
                      shadow-[0_12px_25px_rgba(11,78,162,0.12)]
                      p-2.5
                      sm:p-3
                      xl:p-4
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
                          sm:w-8
                          sm:h-8
                          rounded-lg
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
                            sm:w-[18px]
                            sm:h-[18px]
                          "
                        />

                      </div>


                      <div>

                        <h4
                          className="
                            font-bold
                            text-xs
                            sm:text-sm
                            text-gray-900
                          "
                        >
                          Secure
                        </h4>

                        <p
                          className="
                            text-[9px]
                            sm:text-[11px]
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
                  TOP STATUS BADGE
              ================================================== */}

              <div
                className="
                  absolute
                  right-[5px]
                  sm:right-[20px]
                  xl:right-[50px]
                  top-[18px]
                  sm:top-[35px]
                  z-20
                "
              >

                {/* ANIMATION WRAPPER */}

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
                      text-[9px]
                      sm:text-xs
                      xl:text-sm
                      font-bold
                      text-[#0B4EA2]
                      whitespace-nowrap
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


      {/* ================= BACKGROUND BLUR ================= */}

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

    </section>
  );
};

export default Hero;