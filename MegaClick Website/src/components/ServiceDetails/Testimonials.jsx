import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Quote,
} from "lucide-react";

const testimonials = [
  {
    name: "Keval Barot",
    review:
      "Its a great app to solve your queries, problems occurred during any government application processes and get the job done. An impressive app with such cooperative staff. One of the staff members, Pritesh, helped me with my HSRP application and got me my booking slot. I highly recommend this app.",
  },
  {
    name: "Prakshal Jain",
    review:
      "Legit startup. Agar aapko apna kaam jaldi karwana hai toh aap Jaagruk Bharat service try kar sakte ho. Legit price and punctual time. They make sure your work is done fast and in a genuine way. Thanks Jaagruk Bharat.",
  },
  {
    name: "Prem Nair",
    review:
      "Jaagruk Bharat does a fantastic job of breaking down complex policies into easy-to-read articles and videos, ensuring accessibility for all citizens.",
  },
  {
    name: "Satyam Jha",
    review:
      "I had a great experience with Jaagruk Bharat for my PAN card application. Their service was quick, hassle-free, and highly professional. The team guided me through the entire process, ensuring all documents were in order.",
  },
  {
    name: "Sanatan Jene",
    review:
      "Excellent service of the service provider. No need to sit for hours elsewhere to get the card downloaded.",
  },
];

const Testimonials = () => {
  const [current, setCurrent] = useState(0);

  const next = () => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
  };

  const previous = () => {
    setCurrent(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  const visibleTestimonials = [
    testimonials[current % testimonials.length],
    testimonials[(current + 1) % testimonials.length],
    testimonials[(current + 2) % testimonials.length],
  ];

  return (
    <section
      className="
        w-full
        bg-white
        py-10
        sm:py-12
        lg:py-14
      "
    >
      {/* =========================================
          INDEPENDENT CONTAINER
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
            HEADER
        ========================================== */}

        <div
          className="
            mb-10
            sm:mb-12
            flex
            flex-col
            gap-5
            sm:flex-row
            sm:items-end
            sm:justify-between
          "
        >
          <div>
            <span
              className="
                inline-flex
                items-center
                rounded-full
                bg-[#EAF3FF]
                px-4
                py-1.5
                text-xs
                sm:text-sm
                font-semibold
                text-[#0B4EA2]
              "
            >
              What Our Clients Say
            </span>

            <h2
              className="
                mt-3
                text-2xl
                sm:text-3xl
                lg:text-4xl
                font-bold
                tracking-tight
                text-gray-900
              "
            >
              Testimonials
            </h2>

            <p
              className="
                mt-2
                max-w-xl
                text-sm
                sm:text-base
                leading-6
                text-gray-500
              "
            >
              Real stories from our happy customers.
            </p>
          </div>

          {/* ARROWS */}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={previous}
              aria-label="Previous testimonials"
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                border
                border-[#0B4EA2]
                bg-white
                text-[#0B4EA2]
                shadow-sm
                transition-all
                duration-300
                hover:-translate-x-1
                hover:bg-[#0B4EA2]
                hover:text-white
              "
            >
              <ChevronLeft size={20} />
            </button>

            <button
              type="button"
              onClick={next}
              aria-label="Next testimonials"
              className="
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                border
                border-[#0B4EA2]
                bg-white
                text-[#0B4EA2]
                shadow-sm
                transition-all
                duration-300
                hover:translate-x-1
                hover:bg-[#0B4EA2]
                hover:text-white
              "
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* =========================================
            TESTIMONIAL CARDS
        ========================================== */}

        <div className="relative px-2 pt-4 sm:px-3 sm:pt-5">
          <div
            key={current}
            className="
              grid
              grid-cols-1
              gap-5
              sm:grid-cols-2
              lg:grid-cols-3
              animate-[slideIn_0.4s_ease-out]
            "
          >
            {visibleTestimonials.map((testimonial, index) => (
              <article
                key={`${testimonial.name}-${current}-${index}`}
                className="
                  group
                  relative
                  w-full
                  min-w-0
                  rounded-2xl
                  border
                  border-gray-100
                  bg-blue-50
                  p-5
                  sm:p-6
                  shadow-[0_10px_30px_rgba(11,78,162,0.08)]
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-[0_18px_40px_rgba(11,78,162,0.14)]
                "
              >
                {/* =================================
                    QUOTE ICON
                ================================== */}

                <div
                  className="
                    absolute
                    -right-2
                    -top-3
                    z-10
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full
                    bg-[#0B4EA2]
                    text-white
                    shadow-md
                    transition-transform
                    duration-300
                    group-hover:rotate-6
                  "
                >
                  <Quote size={15} />
                </div>

                {/* =================================
                    USER
                ================================== */}

                <div
                  className="
                    flex
                    items-center
                    justify-between
                    gap-3
                  "
                >
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
                        bg-[#EAF3FF]
                        text-sm
                        font-bold
                        text-[#0B4EA2]
                      "
                    >
                      {testimonial.name.charAt(0)}
                    </div>

                    <div className="min-w-0">
                      <h3
                        className="
                          truncate
                          text-sm
                          font-semibold
                          text-gray-900
                        "
                      >
                        {testimonial.name}
                      </h3>

                      <p className="text-[11px] text-gray-400">
                        Verified Customer
                      </p>
                    </div>
                  </div>

                  {/* STARS */}
{/* STARS */}

<div className="flex shrink-0 gap-0.5">
  {[1, 2, 3, 4, 5].map((star) => (
    <Star
      key={star}
      size={12}
      fill="#22C55E"
      stroke="#22C55E"
    />
  ))}
</div>
                </div>

                {/* =================================
                    REVIEW
                ================================== */}

                <p
                  className="
                    mt-4
                    line-clamp-4
                    text-xs
                    leading-6
                    text-gray-500
                  "
                >
                  "{testimonial.review}"
                </p>

                {/* =================================
                    BOTTOM LINE
                ================================== */}

                <div
                  className="
                    absolute
                    bottom-0
                    left-5
                    right-5
                    h-0.5
                    origin-left
                    scale-x-0
                    rounded-full
                    bg-[#0B4EA2]
                    transition-transform
                    duration-300
                    group-hover:scale-x-100
                  "
                />
              </article>
            ))}
          </div>
        </div>

        {/* =========================================
            DOTS
        ========================================== */}

        <div className="mt-7 flex justify-center gap-1.5">
          {testimonials.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setCurrent(index)}
              aria-label={`Go to testimonial ${index + 1}`}
              className={`
                h-1.5
                rounded-full
                transition-all
                duration-300
                ${
                  current === index
                    ? "w-6 bg-[#0B4EA2]"
                    : "w-1.5 bg-gray-300"
                }
              `}
            />
          ))}
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
              transform: translateX(35px);
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