import React, { useState } from "react";
import {
  MapPin,
  Quote,
  Star,
  Sparkles,
} from "lucide-react";

const testimonials = [
  {
    name: "Keval Barot",
    service: "GST & Tax Compliance",
    location: "Nashik, Maharashtra",
    review:
      "Its a great platform to solve all business registration and tax query problems. The MegaClick staff is extremely supportive and prompt.",
  },
  {
    name: "Prakshal Jain",
    service: "Company Incorporation",
    location: "Pune, Maharashtra",
    review:
      "Genuine and reliable service provider. MegaClick made our company incorporation fast, transparent, and hassle-free.",
  },
  {
    name: "Prem Nair",
    service: "Business Advisory",
    location: "Nashik, Maharashtra",
    review:
      "MegaClick does a fantastic job of managing complex policies and filings into smooth, accessible solutions for businesses.",
  },
  {
    name: "Satyam Jha",
    service: "PAN & ROC Filings",
    location: "Nashik, Maharashtra",
    review:
      "Quick, professional, and reliable. The team guided us step-by-step through our PAN and annual ROC filings without any hassle.",
  },
  {
    name: "Sanatan Jena",
    service: "Trademark & Audit",
    location: "Pune, Maharashtra",
    review:
      "Excellent service provider! No need to run around different consultants. Everything was handled under one roof.",
  },
];

const Testimonials = () => {
  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };

  const visibleTestimonials = [
    testimonials[current % testimonials.length],
    testimonials[(current + 1) % testimonials.length],
    testimonials[(current + 2) % testimonials.length],
  ];

  return (
    <section className="w-full bg-white py-10 sm:py-12 lg:py-16">
      {/* =========================================
          MAIN CONTAINER
      ========================================== */}

      <div
        className="
          w-full
          max-w-[1500px]
          mx-auto
          px-4
          sm:px-8
          lg:px-16
          xl:px-24
        "
      >
        {/* =========================================
            GRADIENT HEADING
        ========================================== */}

        <div className="mb-8 sm:mb-10 text-left">
          {/* BADGE */}
          <span
            className="
              inline-flex
              items-center
              gap-1.5
              rounded-full
              bg-blue-700
              border
              border-blue-100
              px-3.5
              py-1
              text-xs
              font-bold
              text-white
              mb-3
            "
          >
            <Sparkles size={14} className="text-white" />
            Client Feedback
          </span>

          {/* FULL GRADIENT HEADING */}
          <br />
          <h2
            className="
              text-2xl
              sm:text-3xl
              lg:text-4xl
              font-extrabold
              tracking-tight
              bg-gradient-to-r
              from-[#0B4EA2]
              to-green-500
              bg-clip-text
              text-transparent
              inline-block
            "
          >
            What Our Clients Say
          </h2>

          <p className="mt-2 text-sm sm:text-base text-gray-500 max-w-xl">
            Real feedback from businesses trusting MegaClick for their growth.
          </p>
        </div>

        {/* =========================================
            TESTIMONIAL CARDS (PERFECTLY ALIGNED)
        ========================================== */}

        <div className="relative">
          {/* CARDS GRID */}
          <div
            key={current}
            className="
              grid
              grid-cols-1
              gap-6
              sm:grid-cols-2
              lg:grid-cols-3
              animate-[slideIn_0.35s_ease-out]
            "
          >
            {visibleTestimonials.map((testimonial, index) => (
              <article
                key={`${testimonial.name}-${current}-${index}`}
                className="
                  group
                  relative
                  flex
                  flex-col
                  justify-between
                  h-full
                  w-full
                  min-w-0
                  rounded-2xl
                  border
                  border-gray-200
                  bg-blue-50
                  p-5
                  sm:p-6
                  shadow-sm
                  transition-all
                  duration-300
                  hover:shadow-md
                  hover:border-blue-200
                "
              >
                <div>
                  {/* QUOTE ICON */}
                  <div
                    className="
                      absolute
                      right-5
                      top-5
                      text-blue-500
                      group-hover:text-[#0B4EA2]
                      transition-colors
                    "
                  >
                    <Quote size={20} />
                  </div>

                  {/* TOP USER INFO */}
                  <div className="flex items-center gap-3">
                    {/* Light BG Initial Circle */}
                    <div
                      className="
                        flex
                        h-10
                        w-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-blue-100
                        border
                        border-blue-100
                        text-base
                        font-bold
                        text-[#0B4EA2]
                      "
                    >
                      {testimonial.name.charAt(0)}
                    </div>

                    <div className="min-w-0 pr-6">
                      {/* NAME */}
                      <h3 className="truncate text-sm font-bold text-gray-900">
                        {testimonial.name}
                      </h3>

                      {/* SERVICE */}
                      <p className="truncate text-xs font-semibold text-[#0B4EA2] mt-0.5">
                        {testimonial.service}
                      </p>

                      {/* LOCATION */}
                      <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-0.5">
                        <MapPin size={11} className="shrink-0 text-gray-400" />
                        <span className="truncate">{testimonial.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* REVIEW CONTENT */}
                  <p className="mt-4 text-xs sm:text-sm text-gray-600 leading-relaxed">
                    "{testimonial.review}"
                  </p>
                </div>

                {/* BOTTOM STARS FOOTER */}
                <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between">
                  
                  <div className="flex shrink-0 gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        size={13}
                        className="fill-green-500 stroke-green-500"
                      />
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* =========================================
            SLIDE BAR (PROGRESS TRACK ONLY)
        ========================================== */}

        <div className="mt-8 flex justify-center items-center">
          <button
            onClick={next}
            className="w-full max-w-[280px] cursor-pointer focus:outline-none"
            aria-label="Next Slide"
          >
            <div className="relative w-full h-2 bg-gray-100 rounded-full overflow-hidden shadow-inner border border-gray-200/60">
              <div
                className="
                  absolute
                  top-0
                  bottom-0
                  bg-gradient-to-r
                  from-[#0B4EA2]
                  to-green-500
                  rounded-full
                  transition-all
                  duration-400
                  ease-out
                  shadow-sm
                "
                style={{
                  width: `${100 / testimonials.length}%`,
                  left: `${(current / testimonials.length) * 100}%`,
                }}
              />
            </div>
          </button>
        </div>
      </div>

      {/* =========================================
          SLIDE ANIMATION
      ========================================== */}

      <style>
        {`
          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(25px);
            }

            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}
      </style>
    </section>
  );
};

export default Testimonials;