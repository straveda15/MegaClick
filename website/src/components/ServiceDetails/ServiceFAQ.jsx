import React, { useState } from "react";
import { ChevronDown } from "lucide-react";



const ServiceFAQ = ({ service }) => {
  // null = all closed initially; user opens manually
  const [openIndex, setOpenIndex] = useState(null);

  const specificFaqs = service?.faqs || service?.faq || [];
  // If there are specific FAQs, show them (optionally with defaults). If none, show only an empty state.
  const faqs = specificFaqs.length > 0 ? [...specificFaqs] : [];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full bg-blue-50 py-10 sm:py-12 lg:py-16 font-['Inter',sans-serif]">
      {/* GOOGLE FONTS */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hedvig+Letters+Serif:opsz@12..24&family=Inter:wght@400;500;600;700&display=swap');

        @media (min-width: 1920px) {
          .service-faq-container { max-width: 1800px !important; padding-left: 4rem !important; padding-right: 4rem !important; }
          .service-faq-heading { font-size: 3rem !important; }
          .service-faq-question { font-size: 1.25rem !important; line-height: 1.75rem !important; }
          .service-faq-answer { font-size: 1.125rem !important; line-height: 2rem !important; }
        }
        @media (min-width: 3840px) {
          .service-faq-container { max-width: 3200px !important; padding-left: 6rem !important; padding-right: 6rem !important; }
          .service-faq-heading { font-size: 5rem !important; }
          .service-faq-question { font-size: 2.25rem !important; line-height: 3rem !important; }
          .service-faq-answer { font-size: 2rem !important; line-height: 3.25rem !important; }
        }
      `}</style>

      <div className="service-faq-container w-full max-w-[1380px] mx-auto px-4 sm:px-6 min-[1440px]:px-10">
        {/* =========================================
            HEADER (Consistent Typography)
        ========================================== */}
        <div className="mb-8 sm:mb-10 text-left">
          <h2
            style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
            className="
              service-faq-heading
              text-2xl
              sm:text-3xl
              md:text-3xl
              lg:text-4xl
              font-bold
              leading-[1.18]
              text-black
              text-left
              mb-2.5
              sm:mb-4
            "
          >
            Frequently Asked{" "}
            <span className="text-[#0B4EA2]">Questions</span>
          </h2>

        </div>

        {faqs.length === 0 && (
          <p className="text-sm text-gray-600">No FAQs available for this service.</p>
        )}

        {/* ========================================= ACCORDION LIST ========================================== */}
        <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="py-4 sm:py-5 lg:py-5.5 transition-colors duration-200"
              >
                {/* QUESTION BUTTON */}
                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  className="
                    w-full
                    flex
                    items-center
                    justify-between
                    gap-4
                    text-left
                    focus:outline-none
                    cursor-pointer
                  "
                  aria-expanded={isOpen}
                >
                  <span
                    style={{ fontFamily: "'Inter', sans-serif" }}
                    className={`
                      service-faq-question
                      text-sm
                      sm:text-base
                      lg:text-lg
                      font-semibold
                      leading-snug
                      transition-colors
                      duration-200
                      ${
                        isOpen
                          ? "text-[#0B4EA2]"
                          : "text-gray-900 hover:text-[#0B4EA2]"
                      }
                    `}
                  >
                    {faq.question}
                  </span>

                  {/* CHEVRON ICON */}
                  <div
                    className={`
                      shrink-0
                      w-8
                      h-8
                      rounded-full
                      flex
                      items-center
                      justify-center
                      transition-all
                      duration-300
                      ${
                        isOpen
                          ? "bg-[#0B4EA2] text-white rotate-180 shadow-xs"
                          : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-100"
                      }
                    `}
                  >
                    <ChevronDown size={18} strokeWidth={2.5} />
                  </div>
                </button>

                {/* ANSWER COLLAPSIBLE */}
                <div
                  className={`
                    grid
                    transition-all
                    duration-300
                    ease-in-out
                    ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100 mt-2.5 sm:mt-3.5"
                        : "grid-rows-[0fr] opacity-0"
                    }
                  `}
                >
                  <div className="overflow-hidden">
                    <p
                      style={{ fontFamily: "'Inter', sans-serif" }}
                      className="
                        service-faq-answer
                        text-xs
                        sm:text-sm
                        lg:text-base
                        text-gray-600
                        leading-relaxed
                        font-normal
                        text-left
                      "
                    >
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServiceFAQ;