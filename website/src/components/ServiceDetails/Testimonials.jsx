import React, { useState } from "react";
import {
  MapPin,
  Quote,
  Star,
  Sparkles,
  ChevronLeft,
  ChevronRight,
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

  const goPrev = () => {
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goNext = () => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };

  const visibleTestimonials = [
    testimonials[current % testimonials.length],
    testimonials[(current + 1) % testimonials.length],
    testimonials[(current + 2) % testimonials.length],
  ];

  return (
    <section className="w-full bg-white py-10 sm:py-12 lg:py-16">
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
        {/* HEADING */}
        <div className="mb-8 sm:mb-10 text-left">
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

          <br />
          <h2 className="section-heading text-[#0B4EA2]">
            What Our Clients Say
          </h2>

          <p className="section-text mt-2 max-w-xl">
            Real feedback from businesses trusting MegaClick for their growth.
          </p>
        </div>

        {/* TESTIMONIAL CARDS */}
        <div className="relative">
          <div
            className="
              flex
              gap-5
              overflow-x-auto
              snap-x
              snap-mandatory
              pb-2
              -mx-4
              px-4
              sm:mx-0
              sm:px-0
              sm:grid
              sm:grid-cols-2
              sm:gap-6
              sm:overflow-visible
              lg:grid-cols-3
            "
          >
            {visibleTestimonials.map((testimonial, index) => (
              <article
                key={`${testimonial.name}-${current}-${index}`}
                className="
                  relative
                  flex
                  flex-col
                  justify-between
                  h-full
                  w-[82%]
                  flex-shrink-0
                  snap-center
                  sm:w-full
                  sm:flex-shrink
                  min-w-0
                  rounded-2xl
                  border
                  border-gray-200
                  bg-blue-50
                  p-5
                  sm:p-6
                  shadow-sm
                "
              >
                <div>
                  {/* QUOTE ICON */}
                  <div className="absolute right-5 top-5 text-blue-500">
                    <Quote size={20} />
                  </div>

                  {/* USER INFO */}
                  <div className="flex items-center gap-3">
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
                      <h3 className="truncate text-sm font-bold text-gray-900">
                        {testimonial.name}
                      </h3>
                      <p className="truncate text-xs font-semibold text-[#0B4EA2] mt-0.5">
                        {testimonial.service}
                      </p>
                      <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-0.5">
                        <MapPin size={11} className="shrink-0 text-gray-400" />
                        <span className="truncate">{testimonial.location}</span>
                      </div>
                    </div>
                  </div>

                  {/* REVIEW */}
                  <p className="mt-4 text-xs sm:text-sm text-gray-600 leading-relaxed">
                    "{testimonial.review}"
                  </p>
                </div>

                {/* STARS */}
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

        {/* ARROW NAVIGATION */}
        <div className="mt-8 flex justify-center items-center gap-4">
          <button
            type="button"
            onClick={goPrev}
            aria-label="Previous testimonials"
            className="
              flex
              items-center
              justify-center
              w-10
              h-10
              rounded-full
              border-2
              border-[#0B4EA2]
              text-[#0B4EA2]
              bg-white
              hover:bg-[#0B4EA2]
              hover:text-white
              transition-all
              duration-300
              cursor-pointer
              shadow-sm
            "
          >
            <ChevronLeft size={20} />
          </button>

          <button
            type="button"
            onClick={goNext}
            aria-label="Next testimonials"
            className="
              flex
              items-center
              justify-center
              w-10
              h-10
              rounded-full
              border-2
              border-[#0B4EA2]
              text-[#0B4EA2]
              bg-white
              hover:bg-[#0B4EA2]
              hover:text-white
              transition-all
              duration-300
              cursor-pointer
              shadow-sm
            "
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;