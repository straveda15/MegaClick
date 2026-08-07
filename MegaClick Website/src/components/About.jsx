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
      py-10
    bg-white
      from-blue-100
      via-blue-50
      to-green-50
    "
    >
      <div
        className="
        max-w-[1500px]
        mx-auto
        px-6
        lg:px-24
      "
      >
        <div
          className="
          grid
          lg:grid-cols-2
          gap-20
          items-center
        "
        >
          {/* LEFT */}

          <div
            className="
            relative
            grid
            grid-cols-2
            gap-5
          "
          >
            {/* IMAGE 1 */}

            <div
              className="
              h-[250px]
              rounded-[28px]
              overflow-hidden
              shadow-lg
              group
            "
            >
              <img
                src={img1}
                alt=""
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
              h-[250px]
              rounded-[28px]
              overflow-hidden
              shadow-lg
              group
            "
            >
              <img
                src={img2}
                alt=""
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
              h-[250px]
              rounded-[28px]
              overflow-hidden
              shadow-lg
              group
            "
            >
              <img
                src={img3}
                alt=""
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

            {/* IMAGE 4 */}

            <div
              className="
              relative
              h-[250px]
              rounded-[28px]
              overflow-hidden
              shadow-lg
              group
            "
            >
              <img
                src={img4}
                alt=""
                className="
                w-full
                h-full
                object-cover
                transition-all
                duration-500
                group-hover:scale-110
              "
              />

              <div
                className="
                absolute
                inset-0
                bg-gradient-to-br
                from-blue-700/80
                to-green-500/80
              "
              />

              <div
                className="
                absolute
                inset-0
                flex
                flex-col
                justify-center
                items-center
                text-white
              "
              >
                <h2 className="text-6xl font-bold">10+</h2>

                <p
                  className="
                  text-xl
                  font-semibold
                  mt-2
                "
                >
                  Years Experience
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT */}

          <div>
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
              font-semibold
              mb-5
            "
            >
              <Building2
                size={15}
                className="text-green-300"
              />

              About MegaClick
            </span>

            {/* HEADING */}

            <h2
              className="
              text-3xl
              md:text-4xl
              font-bold
              leading-snug
              text-black
              mt-5
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

            {/* DESCRIPTION */}

            <p
              className="
              mt-5
              text-black
              text-base
              text-justify
              leading-8
              max-w-xl
            "
            >
              MegaClick provides professional business services that simplify
              registrations, compliance, taxation and financial management.
              We help startups, entrepreneurs and established businesses with
              complete end-to-end support, transparent processes and expert
              guidance so you can focus on growing your business.
            </p>

            {/* STATS */}

            <div
              className="
              grid
              sm:grid-cols-2
              gap-5
              mt-10
            "
            >
              {stats.map((item, index) => (
                <div
                  key={index}
                  className="
                  bg-white
                  border
                  border-blue-300
                  rounded-2xl
                  p-6
                  shadow-md
                  hover:shadow-xl
                  hover:-translate-y-1
                  transition-all
                  duration-300
                "
                >
                  <div
                    className="
                    w-12
                    h-12
                    rounded-xl
                    bg-blue-50
                    border
                    border-blue-200
                    flex
                    items-center
                    justify-center
                    mb-4
                  "
                  >
                    {index === 0 ? (
                      <Users
                        size={24}
                        className="text-[#0B4EA2]"
                      />
                    ) : (
                      <BriefcaseBusiness
                        size={24}
                        className="text-[#0B4EA2]"
                      />
                    )}
                  </div>

                  <h3
                    className="
                    text-4xl
                    font-bold
                    text-[#0B4EA2]
                  "
                  >
                    {item.number}
                  </h3>

                  <p
                    className="
                    mt-2
                    text-black
                    font-medium
                  "
                  >
                    {item.title}
                  </p>
                </div>
              ))}
            </div>

            {/* BUTTON */}

            <button
              onClick={() => navigate("/about")}
              className="
              mt-10
              inline-flex
              items-center
              gap-2
              bg-[#0B4EA2]
              hover:bg-blue-700
              text-white
              px-8
              py-3.5
              rounded-xl
              font-semibold
              transition-all
              duration-300
              hover:scale-105
            "
            >
              Learn More
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Background Blur */}

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