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
        relative
        overflow-hidden
        bg-blue-50
        py-12
        sm:py-14
        lg:py-16
      "
    >
      <div
        className="
          max-w-[1500px]
          mx-auto
          px-4
          sm:px-6
          md:px-8
          lg:px-16
          xl:px-28
        "
      >
        {/* =====================================================
            TOP SECTION
        ====================================================== */}

        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-2
            gap-10
            sm:gap-12
            lg:gap-16
            xl:gap-20
            items-center
          "
        >
          {/* ================= LEFT CONTENT ================= */}

          <div>
            {/* BADGE */}

            <span
              className="
                inline-flex
                items-center
                gap-2
                bg-[#0B4EA2]
                text-white
                px-3
                sm:px-5
                py-1.5
                sm:py-2
                rounded-full
                text-xs
                sm:text-sm
                font-semibold
              "
            >
              <CheckCircle
                size={15}
                className="sm:w-4 sm:h-4"
              />

              Why Choose MegaClick
            </span>

            {/* HEADING */}

            <h2
              className="
                mt-5
                sm:mt-6
                text-3xl
                sm:text-4xl
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

            {/* DESCRIPTION */}

            <p
              className="
                mt-4
                sm:mt-6
                text-gray-600
                leading-7
                sm:leading-8
                text-sm
                sm:text-base
                lg:text-lg
                max-w-xl
              "
            >
              MegaClick provides complete company registration,
              GST registration, compliance, taxation, trademark
              and financial solutions with expert guidance and
              fast processing.
            </p>

            {/* STATS */}

            <div
              className="
                flex
                gap-8
                sm:gap-12
                md:gap-16
                mt-7
                sm:mt-10
              "
            >
              <div>
                <h3
                  className="
                    text-3xl
                    sm:text-4xl
                    lg:text-5xl
                    font-bold
                    text-[#0B4EA2]
                  "
                >
                  15K+
                </h3>

                <p
                  className="
                    mt-1
                    text-sm
                    sm:text-base
                    text-gray-600
                  "
                >
                  Happy Clients
                </p>
              </div>

              <div>
                <h3
                  className="
                    text-3xl
                    sm:text-4xl
                    lg:text-5xl
                    font-bold
                    text-green-600
                  "
                >
                  99%
                </h3>

                <p
                  className="
                    mt-1
                    text-sm
                    sm:text-base
                    text-gray-600
                  "
                >
                  Success Rate
                </p>
              </div>
            </div>
          </div>

          {/* ================= RIGHT FEATURES ================= */}

          <div>
            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                gap-5
                sm:gap-6
                lg:gap-x-10
                lg:gap-y-7
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
                      min-w-0
                    "
                  >
                    {/* DIAMOND */}

                    <div
                      className="
                        relative
                        z-20
                        flex-shrink-0
                        w-14
                        h-14
                        sm:w-16
                        sm:h-16
                        lg:w-18
                        lg:h-18
                        bg-blue-400
                        rotate-45
                        rounded-xl
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
                          size={24}
                          className="text-white sm:w-7 sm:h-7"
                        />
                      </div>
                    </div>

                    {/* RIBBON */}

                    <div
                      className="
                        -ml-6
                        flex-1
                        min-w-0
                        h-14
                        sm:h-16
                        lg:h-18
                        bg-green-500
                        text-white
                        flex
                        items-center
                        pl-11
                        sm:pl-13
                        lg:pl-14
                        pr-3
                        sm:pr-5
                        shadow-lg
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
                          text-xs
                          sm:text-sm
                          lg:text-base
                          font-semibold
                          leading-5
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

        {/* =====================================================
            PROFESSIONAL SERVICES / IMAGE CARDS
        ====================================================== */}

        <div
          className="
            mt-12
            sm:mt-14
            lg:mt-16
          "
        >
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-4
              gap-4
              sm:gap-5
              lg:gap-6
              max-w-[1200px]
              mx-auto
            "
          >
            {images.map((item, index) => (
              <div
                key={index}
                className="
                  w-full
                  bg-white
                  rounded-2xl
                  overflow-hidden
                  shadow-md
                  border
                  border-gray-200
                  hover:-translate-y-1
                  hover:shadow-xl
                  transition-all
                  duration-300
                  group
                "
              >
                {/* IMAGE */}

                <div
                  className="
                    overflow-hidden
                    h-[140px]
                    sm:h-[150px]
                    md:h-[160px]
                    lg:h-[145px]
                    xl:h-[155px]
                  "
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="
                      w-full
                      h-full
                      object-cover
                      group-hover:scale-105
                      transition
                      duration-700
                    "
                  />
                </div>

                {/* CONTENT */}

                <div
                  className="
                    p-4
                    sm:p-4
                    lg:p-5
                  "
                >
                  <h4
                    className="
                      text-base
                      sm:text-lg
                      font-bold
                      text-gray-900
                    "
                  >
                    {item.title}
                  </h4>

                  <p
                    className="
                      mt-2
                      text-xs
                      sm:text-sm
                      text-gray-700
                      leading-5
                      sm:leading-6
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

      {/* ================= BACKGROUND BLUR ================= */}

      <div
        className="
          absolute
          -top-32
          -left-32
          w-72
          h-72
          rounded-full
          bg-blue-200/40
          blur-3xl
          pointer-events-none
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
          bg-green-200/30
          blur-3xl
          pointer-events-none
        "
      />
    </section>
  );
};

export default WhyChoose;