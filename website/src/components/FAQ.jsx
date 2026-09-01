import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const faqs = [
  { question: "What services does MegaClick provide?", answer: "MegaClick provides complete business solutions including company registration, GST registration, trademark registration, ISO certification, financial services and business compliance support." },
  { question: "How long does the registration process take?", answer: "The timeline depends on the selected service. Our experts keep you updated throughout the process and complete your work as quickly as possible." },
  { question: "What documents are required?", answer: "The required documents depend on the selected service. Our team provides a complete checklist before starting your application." },
  { question: "Do you provide consultation before starting?", answer: "Yes. We provide professional consultation to understand your business requirements and recommend the most suitable solution." },
  { question: "Why should I choose MegaClick?", answer: "MegaClick offers transparent processes, professional expertise, secure documentation and complete support from start to finish." },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const toggleFAQ = (index) => setOpenIndex(openIndex === index ? null : index);

  return (
    <section className="relative overflow-hidden py-8 sm:py-10 min-[1440px]:py-16 min-[1920px]:py-20 min-[3840px]:py-32 bg-blue-50/50 font-['Inter',sans-serif]">
      <div className="w-full max-w-[1380px] min-[1920px]:max-w-[1800px] min-[3840px]:max-w-[3200px] mx-auto px-4 sm:px-6 min-[1440px]:px-10 min-[1920px]:px-16 min-[3840px]:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] gap-6 lg:gap-14 min-[1920px]:gap-16 min-[3840px]:gap-24 items-start">
          
          {/* LEFT: HEADING */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <h2
              style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
              className="text-3xl sm:text-4xl min-[1920px]:text-5xl min-[3840px]:text-7xl font-bold leading-[1.18] text-black text-left"
            >
              Frequently asked <span className="text-[#0B4EA2] block sm:inline lg:block">questions</span>
            </h2>

            <p className="mt-3 sm:mt-4 text-slate-600 font-normal text-sm sm:text-base min-[1920px]:text-lg min-[3840px]:text-2xl leading-relaxed max-w-md min-[3840px]:max-w-xl text-left">
              Find answers to common questions about our business, legal, financial, and registration services.
            </p>
          </div>

          {/* RIGHT: FAQ LIST */}
          <div className="divide-y divide-slate-200 border-t border-slate-200">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <div key={index} className="group">
                  <button
                    type="button"
                    onClick={() => toggleFAQ(index)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-4 py-4 sm:py-5 min-[1920px]:py-6 min-[3840px]:py-10 text-left focus:outline-none cursor-pointer"
                  >
                    <h3 className={`text-base sm:text-lg min-[1920px]:text-xl min-[3840px]:text-3xl font-semibold transition-colors duration-200 ${isOpen ? "text-[#0B4EA2]" : "text-[#0f172a] group-hover:text-[#0B4EA2]"}`}>
                      {faq.question}
                    </h3>
                    <ChevronDown size={19} className={`flex-shrink-0 text-slate-400 transition-transform duration-300 min-[3840px]:w-8 min-[3840px]:h-8 ${isOpen ? "rotate-180 text-[#0B4EA2]" : ""}`} />
                  </button>

                  <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                    <div className="overflow-hidden">
                      <p className="text-slate-600 font-normal text-sm sm:text-base min-[1920px]:text-lg min-[3840px]:text-2xl leading-relaxed pb-4 sm:pb-5 min-[3840px]:pb-8 max-w-2xl min-[3840px]:max-w-4xl text-left">
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