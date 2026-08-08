import React from "react";
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

  return (
    <section
      id="services"
      className="
      relative
      overflow-hidden
      py-5
      bg-white
    "
    >
      <div
        className="
        max-w-[1500px]
        mx-auto
        px-6
        lg:px-24
        py-1
      "
      >
        {/* Heading */}

        <div className="mb-10">
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
            mb-4
          "
          >
            <Layers3
              size={16}
              className="text-green-300"
            />

            Our Services
          </span>

          <h2
            className="
            text-3xl
            md:text-4xl
            font-bold
            leading-snug
            text-black
          "
          >
            Complete Business Solutions
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
              Under One Roof
            </span>
          </h2>

          <p
            className="
            mt-4
            text-black
            text-base
            leading-7
            max-w-full
          "
          >
            We provide reliable legal, business and financial solutions with
            expert guidance to simplify your business journey. MegaClick
            provides professional assistance for registrations, agreements,
            documentation and compliance requirements with simple and
            transparent processes.
          </p>
        </div>

        {/* Service Cards */}

        <div
          className="
          grid
          grid-cols-1
          md:grid-cols-2
          lg:grid-cols-3
          gap-6
        "
        >
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <div
                key={index}
                className="
                bg-white
                border
                border-blue-300
                rounded-2xl
                overflow-hidden
                shadow-md
                hover:shadow-xl
                hover:-translate-y-2
                transition-all
                duration-300
              "
              >
                {/* Image */}

                <div className="overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="
                    w-full
                    h-56
                    object-cover
                    transition-all
                    duration-500
                    hover:scale-105
                  "
                  />
                </div>

                {/* Content */}

                <div className="p-6">
                  {/* Icon */}

                  {/* Icon + Title */}

<div className="flex items-center gap-4 mb-5">
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
    flex-shrink-0
    "
  >
    <Icon
      size={26}
      className="text-[#0B4EA2]"
    />
  </div>

  <h3
    className="
    text-2xl
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
                    text-base
                    text-black
                    leading-7
                  "
                  >
                    {service.short}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Services Button */}

        <div className="flex justify-center mt-12">
          <button
            onClick={() => navigate("/services")}
            className="
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
            View All Services
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Services;