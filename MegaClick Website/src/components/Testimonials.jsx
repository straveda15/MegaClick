import React from "react";

import {
  Quote,
  Star,
  MessageSquareQuote,
} from "lucide-react";

import clientImg from "../assets/client.png";

import client1 from "../assets/team1.jpg";
import client2 from "../assets/team2.jpg";
import client3 from "../assets/team3.jpg";
import client4 from "../assets/team4.jpg";

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
    <section
      className="
        relative
        overflow-hidden
        py-5
        sm:py-8
        lg:py-10
        bg-white
      "
    >
      {/* ================= BACKGROUND ================= */}

      <div
        className="
          absolute
          -top-24
          -left-24
          h-50
          w-50
          rounded-full
          bg-blue-200
          blur-3xl
          opacity-30
          pointer-events-none
        "
      />

      <div
        className="
          absolute
          -bottom-24
          -right-24
          h-80
          w-80
          rounded-full
          bg-green-200
          blur-3xl
          opacity-30
          pointer-events-none
        "
      />

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
            HEADER
        ====================================================== */}

        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-2
            gap-7
            sm:gap-10
            items-center
            mb-8
            sm:mb-12
            lg:mb-14
          "
        >
          {/* ================= LEFT ================= */}

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
                shadow-md
                mb-4
                sm:mb-5
              "
            >
              <MessageSquareQuote
                size={15}
                className="text-green-400"
              />

              Client Testimonials
            </span>

            {/* HEADING */}

            <h2
              className="
                text-3xl
                sm:text-4xl
                lg:text-5xl
                font-bold
                leading-tight
              "
            >
              What Our Clients

              <span
                className="
                  block
                  bg-gradient-to-r
                  from-[#0B4EA2]
                  to-green-500
                  bg-clip-text
                  text-transparent
                "
              >
                Say About MegaClick
              </span>
            </h2>

            {/* DESCRIPTION */}

            <p
              className="
                mt-4
                sm:mt-5
                max-w-xl
                text-sm
                sm:text-base
                text-gray-600
                leading-6
                sm:leading-7
                text-left
                sm:text-justify
              "
            >
              Thousands of businesses trust
              <span className="font-semibold">
                <span className="text-[#0B4EA2]"> Mega</span>
                <span className="text-green-500">Click</span>
              </span>
              {" "}
              for reliable registrations, transparent guidance and
              professional support. We simplify every business process
              with experienced experts and customer-first service.
            </p>
          </div>

          {/* ================= RIGHT IMAGE ================= */}

          <div
            className="
              flex
              justify-center
              lg:justify-center
            "
          >
            <div
              className="
                rounded-2xl
                sm:rounded-3xl
                border-2
                border-[#0B4EA2]
                p-2
                sm:p-3
                shadow-lg
              "
            >
              <img
                src={clientImg}
                alt="Happy Clients"
                className="
                  w-[180px]
                  sm:w-[220px]
                  lg:w-[280px]
                  object-contain
                "
              />
            </div>
          </div>
        </div>

        {/* =====================================================
            MOVING TESTIMONIALS
        ====================================================== */}

        <div
          className="
            relative
            overflow-hidden
            w-full
          "
        >
          <div
            className="
              flex
              gap-4
              sm:gap-5
              lg:gap-6
              w-max
              animate-testimonials
              py-3
            "
          >
            {[...testimonials, ...testimonials].map(
              (item, index) => (
                <div
                  key={index}
                  className="
                    w-[calc(100vw-2rem)]
                    sm:w-[330px]
                    md:w-[340px]
                    lg:w-[350px]
                    max-w-[350px]
                    flex-shrink-0
                    bg-white
                    rounded-xl
                    sm:rounded-2xl
                    border
                    border-blue-300
                    shadow-md
                    hover:shadow-xl
                    hover:-translate-y-1
                    transition-all
                    duration-300
                    px-4
                    py-5
                    sm:p-5
                    lg:p-6
                    flex
                    flex-col
                    relative
                  "
                >
                  {/* TOP BORDER */}

                  <div
                    className="
                      absolute
                      top-0
                      left-0
                      w-full
                      h-1
                      rounded-t-xl
                      sm:rounded-t-2xl
                      bg-gradient-to-r
                      from-[#0B4EA2]
                      to-green-500
                    "
                  />

                  {/* QUOTE ICON */}

                  <div
                    className="
                      w-9
                      h-9
                      sm:w-11
                      sm:h-11
                      rounded-lg
                      sm:rounded-xl
                      bg-[#0B4EA2]
                      flex
                      items-center
                      justify-center
                      mb-4
                      sm:mb-5
                    "
                  >
                    <Quote
                      size={18}
                      className="text-white sm:w-5 sm:h-5"
                    />
                  </div>

                  {/* REVIEW */}

                  <p
                    className="
                      text-sm
                      sm:text-[15px]
                      leading-6
                      sm:leading-7
                      text-gray-700
                      text-left
                      sm:text-justify
                      min-h-[120px]
                      sm:min-h-[130px]
                    "
                  >
                    "{item.review}"
                  </p>

                  {/* STARS */}

                  <div className="flex gap-1 mt-4 sm:mt-5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={15}
                        fill="currentColor"
                        className="text-green-500"
                      />
                    ))}
                  </div>

                  {/* DIVIDER */}

                  <div className="my-4 sm:my-5 h-px bg-gray-200" />

                  {/* CLIENT DETAILS */}

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="
                          flex-shrink-0
                          w-2
                          h-2
                          rounded-full
                          bg-[#0B4EA2]
                        "
                      />

                      <h3
                        className="
                          text-base
                          sm:text-lg
                          font-bold
                          text-gray-900
                          truncate
                        "
                      >
                        {item.name}
                      </h3>
                    </div>

                    <p
                      className="
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
                        text-xs
                        sm:text-sm
                        text-gray-500
                      "
                    >
                      {item.location}
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;