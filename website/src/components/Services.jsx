import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  ArrowRight,
  BriefcaseBusiness,
  ShieldCheck,
  TrendingUp,
  Layers3,
} from "lucide-react";

import legalImg from "../assets/legal.jpg";
import otherImg from "../assets/registration.jpg";
import businessImg from "../assets/Business.jpg";

const services = [
  {
    title: "Legal Services",
    slug: "legal-services",
    image: legalImg,
    icon: ShieldCheck,
    short:
      "Professional legal documentation, registrations and compliance support for your business.",
  },

  {
    title: "Other Services",
    slug: "other-services",
    image: otherImg,
    icon: BriefcaseBusiness,
    short:
      "Complete assistance for licenses, registrations and essential business requirements.",
  },

  {
    title: "Business & Financial Services",
    slug: "business-financial-services",
    image: businessImg,
    icon: TrendingUp,
    short:
      "Reliable taxation, accounting and financial solutions for business growth.",
  },
];

const Services = () => {
  const navigate = useNavigate();

  // Mobile / tablet card animation
  const [activeCard, setActiveCard] = useState(null);

  const handleCardClick = (index) => {
    // Trigger the same animation on touch devices
    setActiveCard(index);

    // Remove active state after animation
    setTimeout(() => {
      setActiveCard(null);
    }, 500);
  };

  return (
    <section
      className="
        w-full
        py-5
        sm:py-8
        lg:py-10
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
          pt-2
          sm:pt-3
          lg:pt-4
          pb-6
          sm:pb-8
          lg:pb-10
        "
      >
        {/* ================= HEADING ================= */}

        <div
          className="
            mb-8
            sm:mb-10
            lg:mb-12
            max-w-4xl
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
            <Layers3
              size={14}
              className="text-green-300 sm:w-4 sm:h-4"
            />

            Our Services
          </span>

          {/* Heading */}

          <h2
            className="section-heading text-black"
          >
            Complete Business Solutions{" "}

            <br className="hidden sm:block" />

            <span className="text-[#0B4EA2]">
              Under One Roof
            </span>
          </h2>

          {/* Description */}

          <p
            className="section-text mt-3 sm:mt-4 text-gray-700 max-w-4xl"
          >
            We provide reliable legal, business and financial solutions with
            expert guidance to simplify your business journey. MegaClick
            provides professional assistance for registrations, agreements,
            documentation and compliance requirements with simple and
            transparent processes.
          </p>
        </div>

        {/* ================= SERVICE CARDS ================= */}

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            gap-5
            sm:gap-6
            lg:gap-7
            xl:gap-8
          "
        >
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <div
                key={index}
                onClick={() => handleCardClick(index)}
                className={`
                  group
                  w-full
                  bg-white
                  border
                  border-blue-200
                  rounded-xl
                  sm:rounded-2xl
                  overflow-hidden
                  shadow-[0_6px_25px_rgba(0,0,0,0.06)]
                  hover:shadow-[0_15px_40px_rgba(11,78,162,0.14)]
                  transition-all
                  duration-300
                  cursor-pointer

                  lg:hover:-translate-y-2

                  ${
                    activeCard === index
                      ? "-translate-y-2 shadow-[0_15px_40px_rgba(11,78,162,0.14)]"
                      : ""
                  }
                `}
              >
                {/* ================= IMAGE ================= */}

                <div
                  className="
                    relative
                    w-full
                    h-52
                    sm:h-56
                    md:h-60
                    lg:h-56
                    xl:h-60
                    overflow-hidden
                    bg-gray-100
                  "
                >
                  <img
                    src={service.image}
                    alt={service.title}
                    loading="lazy"
                    className={`
                      w-full
                      h-full
                      object-cover
                      transition-transform
                      duration-500
                      group-hover:scale-105

                      ${
                        activeCard === index
                          ? "scale-105"
                          : ""
                      }
                    `}
                  />

                  {/* Image Overlay */}

                  <div
                    className={`
                      absolute
                      inset-0
                      bg-black/5
                      group-hover:bg-black/10
                      transition-colors
                      duration-300

                      ${
                        activeCard === index
                          ? "bg-black/10"
                          : ""
                      }
                    `}
                  />
                </div>

                {/* ================= CONTENT ================= */}

                <div
                  className="
                    p-5
                    sm:p-6
                    lg:p-6
                  "
                >
                  {/* Icon + Title */}

                  <div
                    className="
                      flex
                      items-center
                      gap-3
                      sm:gap-4
                      mb-4
                      sm:mb-5
                    "
                  >
                    {/* Icon */}

                    <div
                      className="
                        w-11
                        h-11
                        sm:w-12
                        sm:h-12
                        rounded-xl
                        bg-blue-50
                        border
                        border-blue-200
                        flex
                        items-center
                        justify-center
                        flex-shrink-0
                      "
                    >
                      <Icon
                        size={23}
                        className="
                          text-[#0B4EA2]
                          sm:w-[26px]
                          sm:h-[26px]
                        "
                      />
                    </div>

                    {/* Title */}

                    <h3
                      className="
                        text-lg
                        sm:text-xl
                        lg:text-2xl
                        font-bold
                        text-black
                        leading-tight
                      "
                    >
                      {service.title}
                    </h3>
                  </div>

                  {/* Description */}

                  <p
                    className="
                      text-sm
                      sm:text-base
                      text-gray-700
                      leading-6
                      sm:leading-7
                    "
                  >
                    {service.short}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ================= VIEW ALL BUTTON ================= */}

        <div
          className="
            flex
            justify-center
            mt-8
            sm:mt-10
            lg:mt-12
          "
        >
          <button
            onClick={() => navigate("/services")}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              w-full
              sm:w-auto
              bg-[#0B4EA2]
              hover:bg-blue-700
              text-white
              px-7
              sm:px-8
              py-3
              sm:py-3.5
              rounded-xl
              text-sm
              sm:text-base
              font-semibold
              transition-all
              duration-300
              lg:hover:scale-105
            "
          >
            View All Services

            <ArrowRight
              size={17}
              className="sm:w-[18px] sm:h-[18px]"
            />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Services;