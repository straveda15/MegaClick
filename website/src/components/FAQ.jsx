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
    <section className="relative overflow-hidden py-6 sm:py-8 lg:py-10 bg-blue-50">
      {/* MAIN CONTAINER */}
      <div className="max-w-[1450px] mx-auto px-4 sm:px-8 lg:px-16 xl:px-20">
        
        {/* TWO COLUMN LAYOUT (STICKY HEADING LEFT, FAQ LIST RIGHT) */}
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] gap-6 lg:gap-16 items-start">
          
          {/* LEFT: HEADING SHIFTED HIGHER FLUSH AT TOP */}
          <div className="lg:sticky lg:top-4 lg:self-start mt-0 pt-0">
            {/* HEADING (Hedvig Letters Serif) */}
            <h2
              className="text-2xl sm:text-3xl lg:text-[40px] font-normal text-[#0f172a] leading-tight"
              style={{ fontFamily: '"Hedvig Letters Serif", Georgia, serif', fontWeight: 400 }}
            >
              Frequently{" "}
              <span className="text-[#0B4EA2]">
                asked questions
              </span>
            </h2>

            {/* DESCRIPTION (Inter) */}
            <p className="mt-3 sm:mt-3.5 text-slate-600 font-normal text-justify text-sm sm:text-base leading-relaxed max-w-md">
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
                      className={`text-base sm:text-lg font-semibold transition-colors duration-200 ${
                        isOpen ? "text-[#0B4EA2]" : "text-[#0f172a] group-hover:text-[#0B4EA2]"
                      }`}
                    >
                      {faq.question}
                    </h3>

                    {/* CHEVRON ICON */}
                    <ChevronDown
                      size={19}
                      strokeWidth={2}
                      className={`flex-shrink-0 text-slate-400 transition-transform duration-300 ${
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
                      <p className="text-slate-600 font-normal text-sm sm:text-base leading-relaxed pb-5 max-w-2xl">
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