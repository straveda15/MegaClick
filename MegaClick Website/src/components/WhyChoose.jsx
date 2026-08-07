import React from "react";

import {
  Users,
 ShieldCheck,
  CheckCircle,
  BadgeCheck,
  IndianRupee,
  Clock3,
  Headphones,
} from "lucide-react";

import supportImg from "../assets/support.png";
import exportImg from "../assets/export.png";
import secureImg from "../assets/secure.jpg";
import growthImg from "../assets/growth.jpg";

const features = [
  {
    icon: BadgeCheck,
    title: "Government Recognized",
  },
  {
    icon: Users,
    title: "15K+ Happy Clients",
  },
  {
    icon: ShieldCheck,
    title: "Data Security & Trust",
  },
  {
    icon: Users,
    title: "Professional Experts",
  },
  {
    icon: Clock3,
    title: "On-Time Service",
  },
  {
    icon: CheckCircle,
    title: "Fast Processing",
  },
  {
    icon: Headphones,
    title: "24×7 Support",
  },
  {
    icon: IndianRupee,
    title: "Affordable Pricing",
  },
];

const images = [
  {
    image: supportImg,
    title: "Business Support",
    text: "Complete guidance for smooth business operations.",
  },
  {
    image: exportImg,
    title: "Export Solutions",
    text: "Helping businesses expand globally with confidence.",
  },
  {
    image: secureImg,
    title: "Secure Services",
    text: "Safe documentation and reliable solutions.",
  },
  {
    image: growthImg,
    title: "Business Growth",
    text: "Strategies designed for long-term success.",
  },
];

const WhyChoose = () => {
  return (
    <section
      className="
      py-20
      bg-blue-100
      from-slate-50
      via-blue-50
      to-green-50
      overflow-hidden
      relative
      "
    >
      <div
  className="
    max-w-[1500px]
    mx-auto
    px-6
    lg:px-20
  "
>

        {/* TOP SECTION */}

        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* LEFT CONTENT */}

          <div>

            <span
              className="
              inline-flex
              items-center
              gap-2
              bg-[#0B4EA2]
              text-white
              px-5
              py-2
              rounded-full
              font-semibold
              "
            >
              <CheckCircle size={16} />
              Why Choose MegaClick
            </span>

            <h2
              className="
              mt-6
              text-4xl
              lg:text-5xl
              font-bold
              leading-tight
              "
            >
              Your Trusted Partner For

              <span
                className="
                block
                bg-gradient-to-r
                from-blue-600
                to-green-500
                bg-clip-text
                text-transparent
                "
              >
                Business Growth
              </span>

            </h2>

            <p
              className="
              mt-6
              text-gray-600
              leading-8
              text-lg
              "
            >
              MegaClick provides complete company registration,
              GST registration, compliance, taxation,
              trademark and financial solutions with expert
              guidance and fast processing.
            </p>

            <div className="flex gap-16 mt-10">

              <div>

                <h3 className="text-5xl font-bold text-[#0B4EA2]">
                  15K+
                </h3>

                <p className="text-gray-600">
                  Happy Clients
                </p>

              </div>

              <div>

                <h3 className="text-5xl font-bold text-green-600">
                  99%
                </h3>

                <p className="text-gray-600">
                  Success Rate
                </p>

              </div>

            </div>

          </div>

          {/* RIGHT FEATURES */}

          <div>

            <div
              className="
              grid
              lg:grid-cols-2
              gap-x-12
              gap-y-8
              "
            >

              {features.map((item, index) => {

                const Icon = item.icon;

                return (

                  <div
                    key={index}
                    className="
                    relative
                    flex
                    items-center
                    group
                    "
                  >

                    {/* blue Diamond */}

                  <div
  className="
  relative
  z-20
  w-16
  h-16
  lg:w-20
  lg:h-20
  bg-blue-400
  rotate-45
  rounded-2xl
  shadow-lg
  flex
  items-center
  justify-center
  group-hover:bg-[#27496D]
  group-hover:scale-105
  transition-all
  duration-300
  "
>
                      <div className="-rotate-45">

                        <Icon
                          size={30}
                          className="text-white"
                        />

                      </div>

                    </div>

                    {/* Ribbon */}

                    <div
                      className="
                      -ml-7
                      flex-1
                      h-16
                      lg:h-20
                      bg-green-500
                      text-white
                      flex
                      items-center
                     pl-14 lg:pl-16
                      pr-6
                      shadow-xl
                      group-hover:bg-green-700
                      transition
                      duration-300
                      
                      "
                      style={{
                        clipPath:
                          "polygon(0 0,92% 0,100% 50%,92% 100%,0 100%,5% 50%)",
                      }}
                    >

                      <h3
  className="
  text-base
  lg:text-lg
  font-semibold
  leading-6
  tracking-wide
  "
>
  {item.title}
</h3>

                    </div>

                  </div>

                );

              })}

            </div>

          </div>

        </div>

        {/* PROFESSIONAL SERVICES */}

        <div className="mt-20">

          <div className="text-center">


          </div>

          <div
            className="
            mt-14
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
            gap-8
            "
          >

            {images.map((item, index) => (

              <div
                key={index}
                className="
                bg-white
                rounded-3xl
                overflow-hidden
                shadow-md
                border
                border-gray-200
                hover:-translate-y-2
                hover:shadow-xl
                transition-all
                duration-300
                group
                "
              >

                <div className="overflow-hidden">

                  <img
                    src={item.image}
                    alt={item.title}
                    className="
                    w-full
                    h-50
                    object-cover
                    group-hover:scale-110
                    transition
                    duration-700
                    "
                  />

                </div>

                <div className="p-6">

                  <h4
                    className="
                    text-xl
                    font-bold
                    text-gray-900
                    "
                  >
                    {item.title}
                  </h4>

                  <p
                    className="
                    mt-3
                    text-gray-900
                    leading-7
                    "
                  >
                    {item.text}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

      </div>

    </section>
  );
};

export default WhyChoose;