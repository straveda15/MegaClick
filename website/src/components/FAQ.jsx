import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

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
  const toggleFAQ = (index) => setOpenIndex(openIndex === index ? null : index);

  return (
    <section className="w-full py-8 sm:py-12 lg:py-16 min-[1920px]:py-20 min-[3840px]:py-32 bg-blue-50/50 font-['Inter',sans-serif] overflow-hidden">
      {/* DIRECT CSS FOR RESPONSIVE SCALING */}
      <style>{`
        /* Standard Desktop (1440px) */
        @media (min-width: 1440px) {
          .faq-container {
            max-width: 1380px !important;
            padding-left: 2.5rem !important;  /* px-10 */
            padding-right: 2.5rem !important; /* px-10 */
          }
          .faq-heading {
            font-size: 2.5rem !important;
            line-height: 1.2 !important;
          }
          .faq-sub {
            font-size: 0.95rem !important;
            line-height: 1.65 !important;
          }
          .faq-question {
            font-size: 1.1rem !important;
          }
          .faq-answer {
            font-size: 0.95rem !important;
            line-height: 1.65 !important;
          }
        }

        /* Large Desktop (1920px Full HD) */
        @media (min-width: 1920px) {
          .faq-container {
            max-width: 1800px !important;
            padding-left: 4rem !important;   /* px-16 */
            padding-right: 4rem !important;  /* px-16 */
          }
          .faq-heading {
            font-size: 3.25rem !important;
            line-height: 1.18 !important;
          }
          .faq-sub {
            font-size: 1.15rem !important;
            line-height: 1.8 !important;
          }
          .faq-question {
            font-size: 1.25rem !important;
          }
          .faq-answer {
            font-size: 1.05rem !important;
            line-height: 1.75 !important;
          }
          .faq-row-btn {
            padding-top: 1.5rem !important;
            padding-bottom: 1.5rem !important;
          }
          .faq-chevron {
            width: 1.5rem !important;
            height: 1.5rem !important;
          }
        }

        /* 4K Ultra-Wide Desktop (3840px) */
        @media (min-width: 3840px) {
          .faq-container {
            max-width: 3200px !important;
            padding-left: 6rem !important;   /* px-24 */
            padding-right: 6rem !important;  /* px-24 */
          }
          .faq-heading {
            font-size: 5.5rem !important;
            line-height: 1.15 !important;
          }
          .faq-sub {
            font-size: 2rem !important;
            line-height: 3.25rem !important;
            margin-top: 1.5rem !important;
          }
          .faq-question {
            font-size: 2.25rem !important;
          }
          .faq-answer {
            font-size: 1.75rem !important;
            line-height: 2.75rem !important;
            padding-bottom: 2rem !important;
          }
          .faq-row-btn {
            padding-top: 2.5rem !important;
            padding-bottom: 2.5rem !important;
          }
          .faq-chevron {
            width: 2.5rem !important;
            height: 2.5rem !important;
          }
        }
      `}</style>

      {/* UNIFIED CONTAINER */}
      <div className="faq-container w-full max-w-[1380px] mx-auto px-4 sm:px-6 min-[1440px]:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] gap-8 lg:gap-14 min-[1920px]:gap-16 min-[3840px]:gap-24 items-start">
          
          {/* LEFT: STICKY HEADING (EXACT FONT-BOLD WEIGHT) */}
          <div className="lg:sticky  lg:self-start text-left">
               <h2
            style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
            className="
              team-title
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
         Frequently asked {" "}
            <span className="text-[#0B4EA2]">
     questions 
            </span>
          </h2>

            <p
              style={{ fontFamily: "'Inter', sans-serif" }}
              className="faq-sub mt-3 sm:mt-4 text-slate-600 font-normal text-xs sm:text-sm lg:text-base leading-relaxed max-w-md min-[1920px]:max-w-lg min-[3840px]:max-w-2xl text-left"
            >
              Find answers to common questions about our business, legal,
              financial, and registration services.
            </p>
          </div>

          {/* RIGHT: ACCORDION LIST */}
          <div className="divide-y divide-slate-200 border-t border-slate-200 w-full">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <div key={index} className="group">
                  <button
                    type="button"
                    onClick={() => toggleFAQ(index)}
                    aria-expanded={isOpen}
                    className="faq-row-btn w-full flex items-center justify-between gap-4 py-4 sm:py-5 text-left focus:outline-none cursor-pointer"
                  >
                    <h3
                      style={{ fontFamily: "'Inter', sans-serif" }}
                      className={`faq-question text-sm sm:text-base lg:text-lg font-semibold leading-snug transition-colors duration-200 ${
                        isOpen
                          ? "text-[#0B4EA2]"
                          : "text-slate-900 group-hover:text-[#0B4EA2]"
                      }`}
                    >
                      {faq.question}
                    </h3>
                    <ChevronDown
                      size={19}
                      className={`faq-chevron shrink-0 text-slate-400 transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-[#0B4EA2]" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p
                        style={{ fontFamily: "'Inter', sans-serif" }}
                        className="faq-answer text-slate-600 font-normal text-xs sm:text-sm lg:text-base leading-relaxed pb-4 sm:pb-5 text-left max-w-2xl min-[3840px]:max-w-4xl"
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
      </div>
    </section>
  );
};

export default FAQ;