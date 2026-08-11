import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

const UdyamRegistrationFAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: "What is Udyam Registration?",
      answer:
        "Udyam Registration is the official registration process for Micro, Small and Medium Enterprises (MSMEs) in India. It provides businesses with a unique Udyam Registration Number and certificate."
    },
    {
      question: "Who can apply for Udyam Registration?",
      answer:
        "Micro, Small and Medium Enterprises engaged in manufacturing, processing, preservation of goods or providing services can apply for Udyam Registration."
    },
    {
      question: "Is Udyam Registration mandatory?",
      answer:
        "Udyam Registration is not mandatory for every business, but it is highly beneficial for eligible MSMEs because it helps them access various government schemes, benefits and support."
    },
    {
      question: "What documents are required for Udyam Registration?",
      answer:
        "The registration process primarily requires Aadhaar details and business-related information. PAN and GST details may also be required depending on the type and nature of the business."
    },
    {
      question: "How long does Udyam Registration take?",
      answer:
        "The registration process can generally be completed online within a short period once all the required information is available and verified."
    },
    {
      question: "What are the benefits of Udyam Registration?",
      answer:
        "Udyam Registration can help MSMEs access government schemes, subsidies, credit facilities, tender opportunities, and other benefits available to eligible enterprises."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-5xl mx-auto px-6 lg:px-8">

        {/* Heading */}
        <div className="text-center mb-10">
          <span className="inline-block text-sm font-semibold text-[#0B4EA2] bg-blue-50 px-4 py-2 rounded-full mb-3">
            Udyam Registration FAQ
          </span>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Frequently Asked Questions
          </h2>

          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions about Udyam Registration and
            MSME registration.
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  className="w-full flex items-center justify-between gap-4 text-left px-6 py-5"
                >
                  <span className="font-semibold text-gray-900">
                    {faq.question}
                  </span>

                  <span className="flex-shrink-0 text-[#0B4EA2]">
                    {isOpen ? (
                      <Minus size={20} />
                    ) : (
                      <Plus size={20} />
                    )}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-6 pb-5">
                    <p className="text-gray-600 leading-7">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default UdyamRegistrationFAQ;