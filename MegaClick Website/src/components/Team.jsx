import React, { useEffect, useState } from "react";

import team1 from "../assets/team1.jpg";
import team2 from "../assets/team2.jpg";
import team3 from "../assets/team3.jpg";
import team4 from "../assets/team4.jpg";

import {
  Users,
  X,
} from "lucide-react";

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
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeCard, setActiveCard] = useState(null);

  /* =====================================================
      LOCK BACKGROUND SCROLL WHEN IMAGE MODAL IS OPEN
  ===================================================== */

  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedImage]);

  /* =====================================================
      ESCAPE KEY TO CLOSE MODAL
  ===================================================== */

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setSelectedImage(null);
        setActiveCard(null);
      }
    };

    if (selectedImage) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedImage]);

  /* =====================================================
      OPEN IMAGE
  ===================================================== */

  const handleImageClick = (member, index) => {
    // Mobile animation trigger
    setActiveCard(index);

    // Small delay so animation can be seen before modal
    setTimeout(() => {
      setSelectedImage(member);
    }, 150);
  };

  /* =====================================================
      CLOSE IMAGE
  ===================================================== */

  const closeModal = () => {
    setSelectedImage(null);
    setActiveCard(null);
  };

  return (
    <>
      {/* =====================================================
          TEAM SECTION
      ===================================================== */}

      <section
        className="
          w-full
          py-5
          sm:py-8
          lg:py-10
          bg-blue-100
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
            pt-2
            sm:pt-3
            lg:pt-4
            pb-3
            sm:pb-6
            lg:pb-8
          "
        >

          {/* =====================================================
              HEADING
          ===================================================== */}

          <div
            className="
              mb-10
              sm:mb-12
              lg:mb-14
              max-w-3xl
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

            {/* HEADING */}

            <h2
              className="
                mt-4
                sm:mt-5
                text-3xl
                sm:text-4xl
                lg:text-5xl
                font-bold
                leading-tight
                text-gray-900
              "
            >
              Meet Our{" "}

              <span
                className="
                  bg-gradient-to-r
                  from-blue-600
                  to-green-500
                  bg-clip-text
                  text-transparent
                "
              >
                Experts
              </span>
            </h2>

            {/* DESCRIPTION */}

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


          {/* =====================================================
              TEAM CARDS
          ===================================================== */}

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
                className={`
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

                  ${
                    activeCard === index
                      ? "-translate-y-2 shadow-[0_15px_40px_rgba(11,78,162,0.15)]"
                      : ""
                  }

                  lg:hover:-translate-y-2
                `}
              >

                {/* =====================================================
                    IMAGE
                ===================================================== */}

                <button
                  type="button"
                  onClick={() => handleImageClick(member, index)}
                  className="
                    relative
                    block
                    w-full
                    h-64
                    sm:h-60
                    md:h-64
                    lg:h-52
                    xl:h-56
                    overflow-hidden
                    bg-gray-100
                    cursor-pointer
                    text-left
                  "
                  aria-label={`View ${member.name}'s photo`}
                >

                  <img
                    src={member.image}
                    alt={member.name}
                    loading="lazy"
                    className={`
                      w-full
                      h-full
                      object-cover
                      transition-all
                      duration-500

                      group-hover:scale-105

                      ${
                        activeCard === index
                          ? "scale-105"
                          : ""
                      }
                    `}
                  />

                  {/* =====================================================
                      OVERLAY
                  ===================================================== */}

                  <div
                    className={`
                      absolute
                      inset-0
                      bg-gradient-to-t
                      from-black/40
                      via-black/10
                      to-transparent
                      transition-opacity
                      duration-300

                      opacity-0
                      group-hover:opacity-100

                      ${
                        activeCard === index
                          ? "opacity-100"
                          : ""
                      }
                    `}
                  />

                  {/* =====================================================
                      ZOOM ICON
                  ===================================================== */}

              

                </button>


                {/* =====================================================
                    CONTENT
                ===================================================== */}

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


      {/* =====================================================
          FULL IMAGE MODAL
      ===================================================== */}

      {selectedImage && (

        <div
          className="
            fixed
            inset-0
            z-[9999]
            bg-black/80
            backdrop-blur-sm
            flex
            items-center
            justify-center
            p-4
            sm:p-6
          "
          onClick={closeModal}
        >

          {/* =====================================================
              MODAL CONTENT
          ===================================================== */}

          <div
            className="
              relative
              max-w-4xl
              w-full
              max-h-[90vh]
              flex
              items-center
              justify-center
            "
            onClick={(e) => e.stopPropagation()}
          >

            {/* CLOSE BUTTON */}

            <button
              type="button"
              onClick={closeModal}
              className="
                absolute
                -top-3
                -right-3
                sm:-top-4
                sm:-right-4
                z-20
                w-10
                h-10
                sm:w-11
                sm:h-11
                rounded-full
                bg-white
                text-gray-800
                flex
                items-center
                justify-center
                shadow-xl
                hover:bg-gray-100
                transition
              "
              aria-label="Close image"
            >
              <X size={21} />
            </button>


            {/* IMAGE */}

            <img
              src={selectedImage.image}
              alt={selectedImage.name}
              className="
                max-w-full
                max-h-[80vh]
                sm:max-h-[85vh]
                object-contain
                rounded-xl
                shadow-2xl
                animate-[fadeIn_0.25s_ease-out]
              "
            />

          </div>

        </div>

      )}

    </>
  );
};

export default Team;