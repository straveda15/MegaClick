
import React from "react";
import { BriefcaseBusiness } from "lucide-react";
import img1 from "../../assets/img1.jpg";

const HeroSection = () => {
  return (
    <section
      className="
        relative
        overflow-hidden
        bg-gradient-to-r
        from-[#0B4EA2]
        to-blue-700
        py-10
        sm:py-12
        lg:py-16
      "
    >
      {/* ================= LEFT GREEN SLANT ================= */}

      <div
        className="
          absolute
          left-0
          top-0
          h-full
          w-24
          sm:w-36
          lg:w-70
          bg-green-500
          opacity-80
        "
        style={{
          clipPath:
            "polygon(0 0, 100% 0, 60% 100%, 0 100%)",
        }}
      />

      {/* ================= RIGHT GREEN SLANT ================= */}

      <div
        className="
          absolute
          right-0
          top-0
          h-full
          w-20
          sm:w-28
          lg:w-60
          bg-green-500
          opacity-80
        "
        style={{
          clipPath:
            "polygon(40% 0, 100% 0, 100% 100%, 0 100%)",
        }}
      />

      {/* ================= MAIN CONTAINER ================= */}

      <div
        className="
          relative
          z-10
          max-w-[1500px]
          mx-auto
          px-5
          sm:px-8
          lg:px-16
          xl:px-24
        "
      >
        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-[0.9fr_1.1fr]
            items-center
            gap-10
            lg:gap-12
          "
        >

          {/* =================================================
              LEFT IMAGE
          ================================================= */}

          <div
            className="
              flex
              justify-center
              lg:justify-center
              order-1
            "
          >
            <div className="relative">

              {/* Decorative Circle */}

              <div
                className="
                  absolute
                  -inset-2
                  sm:-inset-3
                  rounded-full
                  border
                  border-white/20
                "
              />

              {/* Image */}

              <div
                className="
                  relative
                  w-48
                  h-48
                  sm:w-56
                  sm:h-56
                  md:w-64
                  md:h-64
                  lg:w-72
                  lg:h-72
                  rounded-full
                  overflow-hidden
                  border-4
                  sm:border-[6px]
                  border-white/20
                  shadow-2xl
                "
              >
                <img
                  src={img1}
                  alt="MegaClick Services"
                  className="
                    w-full
                    h-full
                    object-cover
                  "
                />
              </div>
            </div>
          </div>


          {/* =================================================
              RIGHT CONTENT
          ================================================= */}

          <div
            className="
              text-white
              text-center
              lg:text-left
              order-2
              max-w-2xl
              lg:max-w-none
              mx-auto
              lg:mx-0
            "
          >

            {/* Badge */}

            <span
              className="
                inline-flex
                items-center
                justify-center
                lg:justify-start
                gap-2
                bg-white/10
                backdrop-blur-md
                border
                border-white/10
                px-3
                sm:px-4
                py-2
                rounded-full
                text-xs
                sm:text-sm
                font-semibold
              "
            >
              <BriefcaseBusiness
                size={17}
                className="text-green-300 flex-shrink-0"
              />

              Our Professional Services
            </span>


            {/* Heading */}

            <h1
              className="
                mt-4
                sm:mt-5
                text-2xl
                sm:text-3xl
                md:text-4xl
                lg:text-[44px]
                font-bold
                leading-tight
              "
            >
              Professional Services

              <br />

              <span className="text-green-300">
                Designed for Every Business
              </span>
            </h1>


            {/* Quote */}

            <p
              className="
                mt-4
                sm:mt-5
                text-base
                sm:text-lg
                lg:text-2xl
                italic
                font-semibold
                text-black
                leading-7
                sm:leading-8
                lg:leading-relaxed
              "
            >
              “ONE PLATFORM.
              <br />
              COMPLETE SOLUTIONS FOR
              <br />
              BUSINESSES &amp; INDIVIDUALS”
            </p>

          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
