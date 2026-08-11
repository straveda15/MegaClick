
import React from "react";
import {
  Quote,
  Star,
  MessageSquareQuote,
} from "lucide-react";

import clientImg from "../assets/client.png";

const testimonials = [
  {
    name: "Rajesh Sharma",
    service: "Private Limited Company Registration",
    location: "Nashik, Maharashtra",
    review:
      "MegaClick provided exceptional support during our company registration process. Their team handled every document professionally and ensured a hassle-free experience.",
  },
  {
    name: "Priya Enterprises",
    service: "GST Registration",
    location: "Pune, Maharashtra",
    review:
      "The entire process was smooth and transparent. We received regular updates and expert guidance throughout the business registration journey.",
  },
  {
    name: "Amit Patel",
    service: "Trademark Registration",
    location: "Mumbai, Maharashtra",
    review:
      "Excellent service with outstanding customer support. Every query was answered promptly and the team completed our work on time.",
  },
  {
    name: "Sneha Kulkarni",
    service: "MSME Registration",
    location: "Nagpur, Maharashtra",
    review:
      "MegaClick made the documentation process incredibly simple. Their professional approach exceeded our expectations.",
  },
];

const Testimonials = () => {
  return (
    <section className="w-full bg-white">
      {/* =================================
          MAIN CONTAINER
      ================================= */}

      <div
        className="
          max-w-[1500px]
          mx-auto
          px-4
          sm:px-8
          lg:px-16
          xl:px-24
          pt-8
          sm:pt-10
          lg:pt-12
          pb-10
          sm:pb-12
          lg:pb-16
        "
      >
        {/* =================================
            HEADER
        ================================= */}

        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-[1fr_auto]
            gap-8
            lg:gap-12
            items-center
            mb-10
            sm:mb-12
            lg:mb-14
          "
        >
          {/* =========================
              LEFT CONTENT
          ========================== */}

          <div>
            {/* SMALL LABEL */}

            <div className="flex items-center gap-3 mb-3">
              <span className="w-8 h-[2px] bg-[#0B4EA2]" />

              <p
                className="
                  text-xs
                  sm:text-sm
                  font-semibold
                  uppercase
                  tracking-[0.15em]
                  text-[#0B4EA2]
                "
              >
                Client Testimonials
              </p>
            </div>

            {/* HEADING */}

            <h2
              className="
                text-2xl
                sm:text-3xl
                lg:text-4xl
                font-bold
                text-gray-900
                leading-tight
                tracking-tight
              "
            >
              What Our Clients
              <span className="block text-[#0B4EA2]">
                Say About MegaClick
              </span>
            </h2>

            {/* DESCRIPTION */}

            <p
              className="
                mt-4
                max-w-2xl
                text-sm
                sm:text-base
                text-gray-600
                leading-7
              "
            >
              Thousands of businesses trust{" "}
              <span className="font-semibold">
                <span className="text-[#0B4EA2]">Mega</span>
                <span className="text-green-500">Click</span>
              </span>{" "}
              for reliable registrations, transparent guidance
              and professional support. We simplify every business
              process with experienced experts and customer-first
              service.
            </p>
          </div>

          {/* =========================
              CLIENT IMAGE
          ========================== */}

          <div className="flex justify-center lg:justify-end">
            <div
              className="
                relative
                rounded-3xl
                border
                border-[#0B4EA2]/20
                bg-blue-50
                p-3
                sm:p-4
              "
            >
              <img
                src={clientImg}
                alt="Happy MegaClick Clients"
                className="
                  w-[170px]
                  sm:w-[210px]
                  lg:w-[240px]
                  object-contain
                "
              />

              {/* RATING BADGE */}

              <div
                className="
                  absolute
                  -bottom-4
                  left-1/2
                  -translate-x-1/2
                  bg-white
                  border
                  border-gray-200
                  rounded-xl
                  shadow-md
                  px-4
                  py-2
                  whitespace-nowrap
                "
              >
                <div className="flex items-center justify-center gap-1">
                  <span className="text-sm font-bold text-gray-900">
                    4.9
                  </span>

                  <Star
                    size={14}
                    fill="currentColor"
                    className="text-yellow-400"
                  />
                </div>

                <p className="text-[10px] text-gray-500 text-center">
                  Google Rating
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* =================================
            TESTIMONIAL SLIDER
        ================================= */}

        <div className="relative overflow-hidden w-full">
          <div
            className="
              flex
              gap-5
              lg:gap-6
              w-max
              animate-testimonials
              py-3
            "
          >
            {[...testimonials, ...testimonials].map(
              (item, index) => (
                <article
                  key={index}
                  className="
                    relative
                    w-[calc(100vw-2rem)]
                    sm:w-[320px]
                    md:w-[340px]
                    lg:w-[350px]
                    flex-shrink-0
                    bg-white
                    rounded-2xl
                    border
                    border-gray-200
                    px-5
                    py-6
                    sm:p-6
                    shadow-[0_6px_25px_rgba(0,0,0,0.05)]
                    transition-all
                    duration-300
                    hover:-translate-y-1
                    hover:border-blue-200
                    hover:shadow-[0_12px_35px_rgba(11,78,162,0.10)]
                  "
                >
                  {/* TOP ACCENT */}

                  <div
                    className="
                      absolute
                      top-0
                      left-6
                      right-6
                      h-[2px]
                      bg-[#0B4EA2]
                      rounded-full
                    "
                  />

                  {/* QUOTE */}

                  <div
                    className="
                      w-10
                      h-10
                      rounded-xl
                      bg-blue-50
                      flex
                      items-center
                      justify-center
                      mb-5
                    "
                  >
                    <Quote
                      size={20}
                      className="text-[#0B4EA2]"
                    />
                  </div>

                  {/* REVIEW */}

                  <p
                    className="
                      text-sm
                      sm:text-[15px]
                      text-gray-600
                      leading-7
                      min-h-[126px]
                    "
                  >
                    "{item.review}"
                  </p>

                  {/* STARS */}

                  <div className="flex items-center gap-1 mt-5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={15}
                        fill="currentColor"
                        className="text-yellow-400"
                      />
                    ))}

                    <span className="ml-2 text-xs text-gray-500">
                      5.0
                    </span>
                  </div>

                  {/* DIVIDER */}

                  <div className="my-5 h-px bg-gray-100" />

                  {/* CLIENT */}

                  <div className="flex items-start gap-3">
                    {/* AVATAR */}

                    <div
                      className="
                        w-10
                        h-10
                        shrink-0
                        rounded-full
                        bg-[#0B4EA2]
                        text-white
                        flex
                        items-center
                        justify-center
                        font-bold
                        text-sm
                      "
                    >
                      {item.name.charAt(0)}
                    </div>

                    {/* DETAILS */}

                    <div className="min-w-0">
                      <h3
                        className="
                          text-sm
                          sm:text-base
                          font-bold
                          text-gray-900
                          truncate
                        "
                      >
                        {item.name}
                      </h3>

                      <p
                        className="
                          mt-1
                          text-xs
                          sm:text-sm
                          font-medium
                          text-[#0B4EA2]
                          leading-5
                        "
                      >
                        {item.service}
                      </p>

                      <p
                        className="
                          mt-0.5
                          text-xs
                          text-gray-500
                        "
                      >
                        {item.location}
                      </p>
                    </div>
                  </div>
                </article>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
