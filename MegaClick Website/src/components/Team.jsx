import React from "react";

import team1 from "../assets/team1.jpg";
import team2 from "../assets/team2.jpg";
import team3 from "../assets/team3.jpg";
import team4 from "../assets/team4.jpg";

import { Users } from "lucide-react";

const teamMembers = [
  {
    image: team1,
    name: "Rahul Sharma",
    role: "Founder & CEO",
  },
  {
    image: team2,
    name: "Priya Deshmukh",
    role: "Legal Consultant",
  },
  {
    image: team3,
    name: "Amit Patil",
    role: "Financial Advisor",
  },
  {
    image: team4,
    name: "Neha Kulkarni",
    role: "Business Consultant",
  },
];

const Team = () => {
  return (
    <section
      className="
        w-full
        py-5
        sm:py-12
        lg:py-12
        bg-blue-50
      "
    >
      <div
        className="
          max-w-[1530px]
          mx-auto
          px-4
          sm:px-6
          md:px-10
          lg:px-16
          xl:px-24
          2xl:px-32
        "
      >
        {/* Heading */}
        <div
          className="
            mb-10
            sm:mb-12
            lg:mb-14
            max-w-3xl
          "
        >
          {/* Badge */}
          <span
            className="
              inline-flex
              items-center
              gap-2
              bg-[#0B4EA2]
              text-white
              px-3
              sm:px-4
              py-2
              rounded-full
              text-[11px]
              sm:text-xs
              font-semibold
              mb-3
              sm:mb-4
            "
          >
            <Users
              size={14}
              className="text-green-300 sm:w-[15px] sm:h-[15px]"
            />

            OUR TEAM
          </span>

          {/* Heading */}
          <h2
            className="
              mt-3
              sm:mt-4
              text-3xl
              sm:text-4xl
              lg:text-5xl
              leading-tight
              font-bold
              text-[#0B4EA2]
            "
          >
            Meet Our{" "}
            <span className="text-green-600">
              Experts
            </span>
          </h2>

          {/* Description */}
          <p
            className="
              mt-3
              sm:mt-4
              max-w-2xl
              text-sm
              sm:text-base
              text-gray-700
              leading-6
              sm:leading-7
            "
          >
            Our experienced professionals are dedicated to
            providing reliable business solutions and expert
            guidance.
          </p>
        </div>

        {/* Team Cards */}
        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
            gap-5
            sm:gap-6
            lg:gap-7
            xl:gap-8
          "
        >
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="
                group
                w-full
                bg-white
                rounded-xl
                sm:rounded-2xl
                border
                border-gray-200
                overflow-hidden
                shadow-[0_8px_30px_rgba(0,0,0,0.06)]
                hover:shadow-[0_15px_40px_rgba(11,78,162,0.15)]
                transition-all
                duration-300
                lg:hover:-translate-y-2
              "
            >
              {/* Image */}
              <div
                className="
                  relative
                  w-full
                  h-64
                  sm:h-60
                  md:h-64
                  lg:h-52
                  xl:h-56
                  overflow-hidden
                  bg-gray-100
                "
              >
                <img
                  src={member.image}
                  alt={member.name}
                  loading="lazy"
                  className="
                    w-full
                    h-full
                    object-cover
                    group-hover:scale-105
                    transition-transform
                    duration-500
                  "
                />

                {/* Overlay */}
                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-black/20
                    to-transparent
                    opacity-0
                    group-hover:opacity-100
                    transition-opacity
                    duration-300
                  "
                />
              </div>

              {/* Content */}
              <div
                className="
                  p-5
                  sm:p-6
                  text-center
                "
              >
                <h3
                  className="
                    text-lg
                    sm:text-xl
                    font-bold
                    text-gray-900
                    leading-snug
                  "
                >
                  {member.name}
                </h3>

                <p
                  className="
                    mt-2
                    text-xs
                    sm:text-sm
                    font-medium
                    text-[#0B4EA2]
                  "
                >
                  {member.role}
                </p>

                <div
                  className="
                    w-8
                    sm:w-10
                    h-[2px]
                    bg-green-500
                    mx-auto
                    mt-3
                    sm:mt-4
                  "
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;