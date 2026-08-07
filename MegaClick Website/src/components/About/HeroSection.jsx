import React from "react";
import teamImg from "../../assets/teamimg.png";

const HeroSection = () => {
  return (
    <section className="relative w-full overflow-hidden bg-[#0B4EA2]">

      <div
        className="
          max-w-[1300px]
          mx-auto
          relative
          h-[520px]
        "
      >

        {/* ================= IMAGE RIGHT SIDE ================= */}

        <div
          className="
            absolute
            right-0
            top-0
            w-[65%]
            h-full
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



        {/* ================= LEFT BLUE SHAPE ================= */}

        <div
          className="
            absolute
            left-0
            top-0
            h-full
            w-[52%]
            bg-[#0B4EA2]
            z-10
          "
          style={{
            clipPath:
              "polygon(0 0, 82% 0, 68% 50%, 82% 100%, 0 100%)",
          }}
        >

    <div
  className="
    h-full
    flex
    flex-col
    justify-center
    -ml-2
    lg:-ml-6
    pl-6
    pr-4
  "
>


            {/* Small Heading */}

            <p
  className="
    text-white/90
    text-base
    mb-3
    font-semibold
    tracking-[0.18em]
    uppercase
    flex
    items-center
    gap-3
  "
>
  <span className="w-10 h-[2px] bg-green-500"></span>
  Who We Are
</p>



            {/* Main Heading */}
<h1
  className="
    text-3xl
    md:text-4xl
    lg:text-[42px]
    font-extrabold
    leading-[1.15]
    max-w-[500px]
    tracking-tight
  "
>

              <span
                className="
                  bg-gradient-to-r
                  from-blue-200
                  to-green-400
                  bg-clip-text
                  text-transparent
                "
              >
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
                "
              >
                All Under One Roof
              </span>

            </h1>



            {/* Description */}

            <p
              className="
                mt-4
                text-white/80
                text-sm
                max-w-[420px]
                leading-relaxed
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