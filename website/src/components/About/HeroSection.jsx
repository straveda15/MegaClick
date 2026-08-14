
import React from "react";
import teamImg from "../../assets/teamimg.png";

const HeroSection = () => {
  return (
    <section className="relative w-full overflow-hidden bg-[#0B4EA2]">

      {/* =====================================================
          DESKTOP / MOBILE CONTAINER
      ====================================================== */}

      <div
        className="
          max-w-[1300px]
          mx-auto
          relative

          min-h-0
          lg:h-[520px]
        "
      >

        {/* =====================================================
            IMAGE
            DESKTOP = RIGHT
            MOBILE = BELOW CONTENT
        ====================================================== */}

        <div
          className="
            relative
            w-full
            h-[260px]

            sm:h-[320px]

            lg:absolute
            lg:right-0
            lg:top-0
            lg:w-[65%]
            lg:h-full
          "
        >

          <img
            src={teamImg}
            alt="MegaClick Team"
            className="
              w-full
              h-full
              object-cover
              object-center

              lg:object-center
            "
          />

          {/* Image Overlay */}

          <div
            className="
              absolute
              inset-0
              bg-[#0B4EA2]/10
            "
          />

        </div>


        {/* =====================================================
            LEFT BLUE CONTENT
            DESKTOP = LEFT OVER IMAGE
            MOBILE = TOP
        ====================================================== */}

        <div
          className="
            relative
            w-full
            bg-[#0B4EA2]

            z-10

            lg:absolute
            lg:left-0
            lg:top-0
            lg:h-full
            lg:w-[52%]

            lg:[clip-path:polygon(0_0,82%_0,68%_50%,82%_100%,0_100%)]
          "
        >

          <div
            className="
              min-h-[430px]

              flex
              flex-col
              justify-center

              px-6
              py-12

              sm:px-10
              sm:py-14

              lg:h-full
              lg:min-h-0
              lg:px-8
              lg:py-0
              lg:-ml-2

              xl:-ml-6
              xl:pl-10
              xl:pr-20
            "
          >

            {/* =================================================
                SMALL HEADING
            ================================================== */}

            <p
              className="
                text-white/90
                text-sm
                sm:text-base
                mb-4

                font-semibold
                tracking-[0.14em]
                sm:tracking-[0.18em]

                uppercase

                flex
                items-center
                gap-3
              "
            >

              <span
                className="
                  w-8
                  sm:w-10
                  h-[2px]
                  bg-green-500
                  flex-shrink-0
                "
              />

              Who We Are

            </p>


            {/* =================================================
                MAIN HEADING
            ================================================== */}

            <h1
              className="
                text-3xl
                sm:text-4xl
                lg:text-[42px]

                font-extrabold
                leading-[1.15]

                tracking-tight

                max-w-[500px]
              "
            >

              <span className="text-green-300">
                Simplifying Needs
                <br />
                & Problems
                <br />
                For Businesses
                <br />
                & Individuals
              </span>


              <span
                className="
                  block
                  text-white
                  font-semibold

                  mt-3

                  text-2xl
                  sm:text-3xl
                  lg:text-[34px]
                "
              >
                All Under One Roof
              </span>

            </h1>


            {/* =================================================
                DESCRIPTION
            ================================================== */}

            <p
              className="
                mt-5

                text-white/80

                text-sm
                sm:text-base

                max-w-[430px]

                leading-7
              "
            >
              Providing smart and reliable solutions to simplify
              business needs and help organizations grow faster.
            </p>

          </div>

        </div>


      </div>

    </section>
  );
};

export default HeroSection;
