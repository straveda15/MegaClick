import React, { useState } from "react";

import {
  ChevronDown,
  CheckCircle,
} from "lucide-react";

const faqs = [
  {
    question: "What services does MegaClick provide?",
    answer:
      "MegaClick provides complete business solutions including company registration, GST registration, trademark registration, ISO certification, financial services and business compliance support.",
  },
  {
    question: "How long does the registration process take?",
    answer:
      "The timeline depends on the selected service. Our experts keep you updated throughout the process and complete your work as quickly as possible.",
  },
  {
    question: "What documents are required?",
    answer:
      "The required documents depend on the selected service. Our team provides a complete checklist before starting your application.",
  },
  {
    question: "Do you provide consultation before starting?",
    answer:
      "Yes. We provide professional consultation to understand your business requirements and recommend the most suitable solution.",
  },
  {
    question: "Why should I choose MegaClick?",
    answer:
      "MegaClick offers transparent processes, professional expertise, secure documentation and complete support from start to finish.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

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
      {/* =====================================================
          BACKGROUND BLUR
      ====================================================== */}

      <div
        className="
          absolute
          -top-24
          -left-24
          w-64
          h-64
          sm:w-80
          sm:h-80
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
          w-64
          h-64
          sm:w-80
          sm:h-80
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
            HEADING
        ====================================================== */}

        <div
          className="
            max-w-2xl
            mb-8
            sm:mb-10
            lg:mb-12
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
              py-1.5
              sm:py-2
              rounded-full
              text-xs
              font-semibold
              shadow-sm
              mb-4
            "
          >
            <CheckCircle
              size={15}
              className="text-green-300"
            />

            Frequently Asked Questions
          </span>

          {/* HEADING */}

          <h2
            className="
              text-3xl
              sm:text-4xl
              lg:text-5xl
              font-bold
              leading-tight
              text-black
            "
          >
            Frequently Asked{" "}

            <span
              className="
                bg-gradient-to-r
                from-blue-600
                to-green-500
                bg-clip-text
                text-transparent
              "
            >
              Questions
            </span>
          </h2>

          {/* DESCRIPTION */}

          <p
            className="
              mt-4
              text-gray-600
              leading-6
              sm:leading-7
              text-sm
              sm:text-base
              text-left
              sm:text-justify
              max-w-xl
            "
          >
            Find answers to the most common questions about our
            business registration, legal documentation, financial
            services and consultation process. Our experts are
            always ready to guide you with reliable solutions.
          </p>
        </div>

        {/* =====================================================
            FAQ LIST
        ====================================================== */}

        <div className="space-y-3 sm:space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="
                group
                bg-white
                rounded-xl
                border
                border-blue-200
                shadow-md
                hover:shadow-lg
                hover:border-blue-400
                overflow-hidden
              "
            >
              {/* =================================================
                  QUESTION
              ================================================== */}

              <button
                type="button"
                onClick={() => toggleFAQ(index)}
                className="
                  w-full
                  flex
                  items-center
                  justify-between
                  gap-4
                  px-4
                  sm:px-5
                  py-4
                  sm:py-5
                  text-left
                "
              >
                <h3
                  className="
                    text-sm
                    sm:text-base
                    lg:text-lg
                    font-semibold
                    text-gray-900
                    group-hover:text-blue-600
                    transition-colors
                    duration-200
                  "
                >
                  {faq.question}
                </h3>

                {/* ARROW */}

                <div
                  className="
                    flex-shrink-0
                    w-8
                    h-8
                    rounded-full
                    bg-green-50
                    flex
                    items-center
                    justify-center
                  "
                >
                  <ChevronDown
                    size={18}
                    className="text-green-600"
                  />
                </div>
              </button>

              {/* =================================================
                  ANSWER
                  NO ANIMATION
              ================================================== */}

              {openIndex === index && (
                <div
                  className="
                    border-t
                    border-blue-100
                    px-4
                    sm:px-5
                    py-4
                    bg-blue-50/40
                  "
                >
                  <p
                    className="
                      text-gray-600
                      leading-6
                      sm:leading-7
                      text-sm
                      sm:text-base
                      text-left
                    "
                  >
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* =====================================================
            CTA
        ====================================================== */}

        <div className="mt-8 sm:mt-10 lg:mt-12">
          <div
            className="
              relative
              overflow-hidden
              rounded-2xl
              bg-gradient-to-r
              from-blue-500
              to-blue-600
              px-5
              py-6
              sm:p-7
              lg:p-8
              shadow-xl
            "
          >
            {/* SOFT SHAPES */}

            <div
              className="
                absolute
                -top-12
                -right-12
                w-32
                h-32
                sm:w-40
                sm:h-40
                rounded-full
                bg-white/15
                pointer-events-none
              "
            />

            <div
              className="
                absolute
                -bottom-12
                -left-12
                w-36
                h-36
                sm:w-44
                sm:h-44
                rounded-full
                bg-white/15
                pointer-events-none
              "
            />

            <div
              className="
                relative
                z-10
                flex
                flex-col
                lg:flex-row
                lg:items-center
                lg:justify-between
                gap-6
              "
            >
              {/* LEFT */}

              <div className="max-w-2xl">
                <span
                  className="
                    inline-flex
                    items-center
                    gap-2
                    px-3
                    sm:px-4
                    py-1.5
                    sm:py-2
                    rounded-full
                    bg-white/20
                    text-white
                    text-xs
                    font-semibold
                    mb-3
                  "
                >
                  <CheckCircle
                    size={14}
                    className="text-green-300"
                  />

                  Need More Help?
                </span>

                <h3
                  className="
                    text-xl
                    sm:text-2xl
                    lg:text-3xl
                    font-bold
                    text-white
                  "
                >
                  Still Have Questions?
                </h3>

                <p
                  className="
                    mt-2
                    sm:mt-3
                    text-blue-50
                    leading-6
                    text-xs
                    sm:text-sm
                    max-w-xl
                  "
                >
                  Our experts are always available to guide you
                  through registrations, documentation, GST,
                  trademark, compliance and every business
                  requirement with complete transparency.
                </p>
              </div>

              {/* =================================================
                  STATS
              ================================================== */}

              <div
                className="
                  flex
                  items-center
                  justify-center
                  lg:justify-end
                  gap-6
                  sm:gap-8
                  flex-shrink-0
                "
              >
                {/* CLIENTS */}

                <div className="text-center">
                  <h4
                    className="
                      text-2xl
                      sm:text-3xl
                      font-extrabold
                      text-white
                    "
                  >
                    15K+
                  </h4>

                  <p
                    className="
                      text-[11px]
                      sm:text-xs
                      text-blue-50
                      mt-1
                    "
                  >
                    Happy Clients
                  </p>
                </div>

                {/* DIVIDER */}

                <div
                  className="
                    h-8
                    sm:h-10
                    w-px
                    bg-white/30
                  "
                />

                {/* SERVICES */}

                <div className="text-center">
                  <h4
                    className="
                      text-2xl
                      sm:text-3xl
                      font-extrabold
                      text-green-300
                    "
                  >
                    25+
                  </h4>

                  <p
                    className="
                      text-[11px]
                      sm:text-xs
                      text-blue-50
                      mt-1
                    "
                  >
                    Services
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;