import React from "react";
import {
  Building2,
  ArrowRight,
  Users,
  BriefcaseBusiness,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import img1 from "../assets/img1.jpg";
import img2 from "../assets/img2.jpg";
import img3 from "../assets/img3.jpg";
import img4 from "../assets/img4.jpg";

const stats = [
  {
    number: "15000+",
    title: "Happy Clients",
  },
  {
    number: "25+",
    title: "Professional Services",
  },
];

const About = () => {
  const navigate = useNavigate();

  return (
    <section
      className="
        relative
        overflow-hidden
        bg-white
        py-10
        sm:py-12
        lg:py-14
      "
    >
      <div
        className="
          max-w-[1500px]
          mx-auto
          px-4
          sm:px-6
          md:px-8
          lg:px-12
          xl:px-24
        "
      >
        {/* =====================================================
            MOBILE / DESKTOP MAIN LAYOUT
        ====================================================== */}

        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-2
            gap-8
            sm:gap-10
            lg:gap-16
            xl:gap-20
            items-center
          "
        >
          {/* =====================================================
              RIGHT CONTENT
              MOBILE ORDER:
              1. BADGE
              2. HEADING + DESCRIPTION
              3. STATS
              4. PHOTOS
              5. BUTTON
          ====================================================== */}

          <div
            className="
              contents
              lg:block
            "
          >
            {/* ================= BADGE ================= */}

            <div
              className="
                order-1
                lg:order-none
              "
            >
              <span
                className="
                  inline-flex
                  items-center
                  gap-2
                  bg-[#0B4EA2]
                  text-white
                  px-3
                  sm:px-4
                  py-1.5
                  sm:py-2
                  rounded-full
                  text-xs
                  sm:text-sm
                  font-semibold
                "
              >
                <Building2
                  size={15}
                  className="text-green-300"
                />

                About MegaClick
              </span>
            </div>

            {/* ================= HEADING + DESCRIPTION ================= */}

            <div
              className="
                order-2
                lg:order-none
                mt-4
                lg:mt-5
              "
            >
              <h2
                className="
                  text-3xl
                  sm:text-4xl
                  lg:text-4xl
                  xl:text-5xl
                  font-bold
                  leading-tight
                  text-black
                "
              >
                Helping Businesses

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
              </h2>

              <p
                className="
                  mt-4
                  sm:mt-5
                  text-sm
                  sm:text-base
                  text-black
                  text-left
                  sm:text-justify
                  leading-6
                  sm:leading-8
                  max-w-xl
                "
              >
                MegaClick provides professional business services that
                simplify registrations, compliance, taxation and financial
                management. We help startups, entrepreneurs and established
                businesses with complete end-to-end support, transparent
                processes and expert guidance so you can focus on growing
                your business.
              </p>
            </div>

            {/* ================= STATS ================= */}

            <div
              className="
                order-3
                lg:order-none
                grid
                grid-cols-2
                gap-3
                sm:gap-5
                mt-6
                sm:mt-8
                lg:mt-10
              "
            >
              {stats.map((item, index) => (
                <div
                  key={index}
                  className="
                    bg-white
                    border
                    border-blue-200
                    rounded-xl
                    sm:rounded-2xl
                    p-3
                    sm:p-5
                    md:p-6
                    shadow-sm
                    hover:shadow-lg
                    hover:-translate-y-1
                    transition-all
                    duration-300
                  "
                >
                  {/* ICON */}

                  <div
                    className="
                      w-9
                      h-9
                      sm:w-11
                      sm:h-11
                      md:w-12
                      md:h-12
                      rounded-lg
                      sm:rounded-xl
                      bg-blue-50
                      border
                      border-blue-200
                      flex
                      items-center
                      justify-center
                      mb-3
                      sm:mb-4
                    "
                  >
                    {index === 0 ? (
                      <Users
                        size={19}
                        className="text-[#0B4EA2] sm:w-6 sm:h-6"
                      />
                    ) : (
                      <BriefcaseBusiness
                        size={19}
                        className="text-[#0B4EA2] sm:w-6 sm:h-6"
                      />
                    )}
                  </div>

                  {/* NUMBER */}

                  <h3
                    className="
                      text-2xl
                      sm:text-3xl
                      md:text-4xl
                      font-bold
                      text-[#0B4EA2]
                    "
                  >
                    {item.number}
                  </h3>

                  {/* TITLE */}

                  <p
                    className="
                      mt-1
                      sm:mt-2
                      text-xs
                      sm:text-sm
                      md:text-base
                      text-black
                      font-medium
                      leading-5
                    "
                  >
                    {item.title}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* =====================================================
              PHOTOS
              MOBILE = AFTER STATS
              DESKTOP = LEFT SIDE
          ====================================================== */}

          <div
            className="
              order-4
              lg:order-first
              relative
              grid
              grid-cols-2
              gap-3
              sm:gap-4
              md:gap-5
              w-full
            "
          >
            {/* IMAGE 1 */}

            <div
              className="
                h-[170px]
                sm:h-[210px]
                md:h-[240px]
                lg:h-[220px]
                xl:h-[250px]
                rounded-2xl
                sm:rounded-[24px]
                lg:rounded-[28px]
                overflow-hidden
                shadow-md
                sm:shadow-lg
                group
              "
            >
              <img
                src={img1}
                alt="MegaClick business"
                className="
                  w-full
                  h-full
                  object-cover
                  transition-all
                  duration-500
                  group-hover:scale-110
                "
              />
            </div>

            {/* IMAGE 2 */}

            <div
              className="
                h-[170px]
                sm:h-[210px]
                md:h-[240px]
                lg:h-[220px]
                xl:h-[250px]
                rounded-2xl
                sm:rounded-[24px]
                lg:rounded-[28px]
                overflow-hidden
                shadow-md
                sm:shadow-lg
                group
              "
            >
              <img
                src={img2}
                alt="MegaClick services"
                className="
                  w-full
                  h-full
                  object-cover
                  transition-all
                  duration-500
                  group-hover:scale-110
                "
              />
            </div>

            {/* IMAGE 3 */}

            <div
              className="
                h-[170px]
                sm:h-[210px]
                md:h-[240px]
                lg:h-[220px]
                xl:h-[250px]
                rounded-2xl
                sm:rounded-[24px]
                lg:rounded-[28px]
                overflow-hidden
                shadow-md
                sm:shadow-lg
                group
              "
            >
              <img
                src={img3}
                alt="MegaClick team"
                className="
                  w-full
                  h-full
                  object-cover
                  transition-all
                  duration-500
                  group-hover:scale-110
                "
              />
            </div>

            {/* IMAGE 4 + EXPERIENCE */}

            <div
              className="
                relative
                h-[170px]
                sm:h-[210px]
                md:h-[240px]
                lg:h-[220px]
                xl:h-[250px]
                rounded-2xl
                sm:rounded-[24px]
                lg:rounded-[28px]
                overflow-hidden
                shadow-md
                sm:shadow-lg
                group
              "
            >
              <img
                src={img4}
                alt="MegaClick experience"
                className="
                  w-full
                  h-full
                  object-cover
                  transition-all
                  duration-500
                  group-hover:scale-110
                "
              />

              {/* OVERLAY */}

              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-br
                  from-blue-700/80
                  to-green-500/80
                "
              />

              {/* EXPERIENCE TEXT */}

              <div
                className="
                  absolute
                  inset-0
                  flex
                  flex-col
                  justify-center
                  items-center
                  text-white
                  text-center
                  px-2
                "
              >
                <h2
                  className="
                    text-3xl
                    sm:text-5xl
                    lg:text-5xl
                    xl:text-6xl
                    font-bold
                  "
                >
                  10+
                </h2>

                <p
                  className="
                    text-xs
                    sm:text-base
                    lg:text-lg
                    xl:text-xl
                    font-semibold
                    mt-1
                    sm:mt-2
                  "
                >
                  Years Experience
                </p>
              </div>
            </div>
          </div>
{/* =====================================================
    LEARN MORE BUTTON
    MOBILE = CENTER
===================================================== */}

<div
  className="
    order-5
    lg:order-none
    lg:-mt-4
    flex
    justify-center
    lg:justify-end
    w-full
  "
>
  <button
    onClick={() => navigate("/about")}
    className="
      inline-flex
      items-center
      justify-center
      gap-2
      bg-[#0B4EA2]
      hover:bg-blue-700
      text-white
      px-6
      sm:px-8
      py-3
      sm:py-3.5
      rounded-xl
      font-semibold
      text-sm
      sm:text-base
      transition-all
      duration-300
      hover:scale-[1.02]
      sm:hover:scale-105
    "
  >
    Learn More

    <ArrowRight size={18} />
  </button>
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

export default About;