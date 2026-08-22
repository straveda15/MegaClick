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

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative overflow-hidden py-8 sm:py-10 lg:py-14 xl:py-16 bg-blue-50 faq-section">
      {/* UNIFIED APP-CONTAINER + BALANCED RESPONSIVE SCALING */}
      <style>{`
        .app-container {
          width: 100%;
          max-width: 1500px;
          margin-left: auto;
          margin-right: auto;
          padding-left: 1.25rem;
          padding-right: 1.25rem;
        }

        @media (min-width: 640px) {
          .app-container {
            padding-left: 2rem;
            padding-right: 2rem;
          }
        }

        @media (min-width: 1024px) {
          .app-container {
            padding-left: 4rem;
            padding-right: 4rem;
          }
        }

        @media (min-width: 1280px) {
          .app-container {
            padding-left: 6rem;
            padding-right: 6rem;
          }
        }

        /* Standard Desktop (1440px x 900px) */
        @media (min-width: 1440px) {
          .app-container {
            max-width: 1440px !important;
            padding-left: 5rem !important;
            padding-right: 5rem !important;
          }
          .faq-title {
            font-size: 2.25rem !important;
            line-height: 1.2 !important;
          }
          .faq-desc {
            font-size: 0.95rem !important;
            line-height: 1.65 !important;
            max-width: 28rem !important;
          }
          .faq-question {
            font-size: 1.1rem !important;
          }
          .faq-answer {
            font-size: 0.95rem !important;
            line-height: 1.65 !important;
          }
        }

        /* Large Desktop (1920px x 1080px Full HD) */
        @media (min-width: 1920px) {
          .app-container {
            max-width: 1800px !important;
            padding-left: 6rem !important;
            padding-right: 6rem !important;
          }
          .faq-section {
            padding-top: 4.5rem !important;
            padding-bottom: 4.5rem !important;
          }
          .faq-title {
            font-size: 2.5rem !important;
            line-height: 1.2 !important;
          }
          .faq-desc {
            font-size: 1.05rem !important;
            line-height: 1.75 !important;
            max-width: 32rem !important;
          }
          .faq-question {
            font-size: 1.2rem !important;
            padding-top: 1.35rem !important;
            padding-bottom: 1.35rem !important;
          }
          .faq-answer {
            font-size: 1.05rem !important;
            line-height: 1.75 !important;
          }
        }

        /* QHD / 2K Ultra-Wide (2560px Desktop) */
        @media (min-width: 2560px) {
          .app-container {
            max-width: 2400px !important;
            padding-left: 8rem !important;
            padding-right: 8rem !important;
          }
          .faq-section {
            padding-top: 5.5rem !important;
            padding-bottom: 5.5rem !important;
          }
          .faq-title {
            font-size: 3rem !important;
            line-height: 1.2 !important;
          }
          .faq-desc {
            font-size: 1.2rem !important;
            line-height: 1.8 !important;
            max-width: 38rem !important;
          }
          .faq-question {
            font-size: 1.35rem !important;
            padding-top: 1.6rem !important;
            padding-bottom: 1.6rem !important;
          }
          .faq-answer {
            font-size: 1.2rem !important;
            line-height: 1.8 !important;
          }
          .faq-chevron {
            width: 1.5rem !important;
            height: 1.5rem !important;
          }
        }

        /* 4K Ultra-Wide Desktop (3840px x 2160px) */
        @media (min-width: 3840px) {
          .app-container {
            max-width: 3400px !important;
            padding-left: 10rem !important;
            padding-right: 10rem !important;
          }
          .faq-section {
            padding-top: 6.5rem !important;
            padding-bottom: 6.5rem !important;
          }
          .faq-title {
            font-size: 3.75rem !important;
            line-height: 1.15 !important;
          }
          .faq-desc {
            font-size: 1.5rem !important;
            line-height: 1.8 !important;
            max-width: 48rem !important;
          }
          .faq-question {
            font-size: 1.75rem !important;
            padding-top: 2rem !important;
            padding-bottom: 2rem !important;
          }
          .faq-answer {
            font-size: 1.5rem !important;
            line-height: 1.8 !important;
            padding-bottom: 2rem !important;
          }
          .faq-chevron {
            width: 2rem !important;
            height: 2rem !important;
          }
        }
      `}</style>

      {/* MAIN CONTAINER */}
      <div className="app-container">
        
        {/* TWO COLUMN LAYOUT (STICKY HEADING LEFT, FAQ LIST RIGHT) */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] gap-6 lg:gap-14 xl:gap-16 items-start">
          
          {/* LEFT: HEADING SHIFTED HIGHER FLUSH AT TOP */}
          <div className="lg:sticky lg:top-8 lg:self-start mt-0 pt-0">
            {/* MAIN HEADING */}
            <h2
              style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
              className="
                faq-title
                text-2xl
                sm:text-3xl
                md:text-3xl
                lg:text-3xl
                xl:text-4xl
                font-bold
                leading-[1.18]
                text-black
                text-left
              "
            >
              Frequently asked{" "}
              <span className="text-[#0B4EA2] block sm:inline lg:block">
                questions
              </span>
            </h2>

            {/* DESCRIPTION */}
            <p className="faq-desc mt-3 sm:mt-3.5 text-slate-600 font-normal text-sm sm:text-base leading-relaxed max-w-md text-left">
              Find answers to common questions about our business, legal,
              financial, and registration services. Our experts are here to
              provide clear guidance and reliable support.
            </p>
          </div>

          {/* RIGHT: FAQ LIST (DIVIDER STYLE) */}
          <div className="divide-y divide-slate-200 border-t border-slate-200">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <div key={index} className="group">
                  {/* QUESTION */}
                  <button
                    type="button"
                    onClick={() => toggleFAQ(index)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-4 py-4 sm:py-5 text-left focus:outline-none cursor-pointer"
                  >
                    <h3
                      className={`faq-question text-base sm:text-lg font-semibold transition-colors duration-200 ${
                        isOpen ? "text-[#0B4EA2]" : "text-[#0f172a] group-hover:text-[#0B4EA2]"
                      }`}
                    >
                      {faq.question}
                    </h3>

                    {/* CHEVRON ICON */}
                    <ChevronDown
                      size={19}
                      strokeWidth={2}
                      className={`faq-chevron flex-shrink-0 text-slate-400 transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-[#0B4EA2]" : ""
                      }`}
                    />
                  </button>

                  {/* ANSWER */}
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="faq-answer text-slate-600 font-normal text-sm sm:text-base leading-relaxed pb-4 sm:pb-5 max-w-2xl text-left">
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