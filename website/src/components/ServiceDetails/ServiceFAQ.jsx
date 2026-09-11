
import React, { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";

/* =========================================================
   EXACT FAQS PROVIDED
   ========================================================= */

const SPECIFIC_FAQS = {
  "voter-pan-tan-services": [
    {
      question:
        "What is the minimum age to apply for a Voter ID card in India?",
      answer:
        "The minimum age for applying for a voter ID card is 18 years on the qualifying date set by the Election Commission of India.",
    },
    {
      question:
        "What documents are required for a new Voter ID card application (Form 6)?",
      answer:
        "Documents needed while applying for a new voter ID card are a proof of identity like Aadhaar, proof of address like utility bills, proof of age like a birth certificate, and a recently clicked passport-size photograph.",
    },
    {
      question:
        "Is there any fee to apply for a Voter ID card online in India?",
      answer:
        "No, the application for a voter ID card is completely free. However, nominal charges might be applicable if one is applying for a duplicate card.",
    },
    {
      question:
        "How long does it take to receive a Voter ID card after applying?",
      answer:
        "It usually takes around 2 to 4 weeks to get a voter ID card after the successful submission of the application, subject to verification and processing.",
    },
    {
      question:
        "What is e-EPIC, and how do I download my digital Voter ID card?",
      answer:
        "Electronic-EPIC (e-EPIC) is the digital or softcopy version of a voter ID card. Eligible voters can download their digital card through the official Election Commission of India voter services platform.",
    },
    {
      question: "Can I update my address on my Voter ID card online?",
      answer:
        "Yes. Eligible voters can request an address change or correction through the applicable Election Commission voter services process.",
    },
    {
      question: "Can I apply for a Voter ID card if I have recently moved?",
      answer:
        "Yes. If you have shifted your residence, you can apply for the applicable voter registration or correction process based on your current ordinary residence.",
    },
    {
      question: "What is PAN and why is it required?",
      answer:
        "PAN is a Permanent Account Number used for identification in income-tax and several financial transactions. It is commonly required for tax filings, banking and other specified financial activities.",
    },
    {
      question: "What is TAN and who needs it?",
      answer:
        "TAN is a Tax Deduction and Collection Account Number generally required by persons or entities responsible for deducting or collecting tax at source under applicable income-tax provisions.",
    },
  ],

  "gst-registration-filing": [
    {
      question: "Who is eligible for GST registration?",
      answer:
        "Any individual or business involved in supplying goods or services beyond the prescribed turnover limit, or required under special categories, can opt for GST Registration in India.",
    },
    {
      question: "Is GST registration free?",
      answer:
        "Yes, applying through the official GST Registration Government Website is free of cost. However, optional professional assistance from GST Registration Services may involve charges.",
    },
    {
      question: "What are the 4 stages of GST?",
      answer:
        "The four broad stages include registration, return filing, tax payment, and assessment, all governed under the GST compliance framework.",
    },
    {
      question: "Can we download a GST certificate?",
      answer:
        "Yes, once approved, you can log in to the GST Registration Portal and download the GST registration certificate.",
    },
    {
      question: "Can I file GST without CA?",
      answer:
        "Yes, taxpayers can file GST returns themselves if they understand the applicable GST process and compliance requirements. Professional assistance can be taken when required.",
    },
    {
      question: "How long does GST registration take?",
      answer:
        "GST registration processing time depends on the application, verification and whether any clarification is requested by the department.",
    },
    {
      question: "What documents are generally required for GST registration?",
      answer:
        "Commonly required documents include PAN, Aadhaar or other KYC documents, business address proof, bank details and entity-specific supporting documents.",
    },
    {
      question: "What are GSTR-1 and GSTR-3B?",
      answer:
        "GSTR-1 is used for reporting applicable outward supplies, while GSTR-3B is a summary return used for reporting tax liability and eligible input tax credit.",
    },
    {
      question: "Why is GST return filing important?",
      answer:
        "Timely GST return filing helps maintain compliance, accurately report transactions and reduce the risk of applicable late fees, interest or other consequences.",
    },
  ],

  "msme-registration": [
    {
      question: "What is Udyam Registration, and is it mandatory?",
      answer:
        "Udyam Registration is the official registration process for Micro, Small, and Medium Enterprises (MSMEs) in India. It is not mandatory for every business, but it can be useful for accessing government benefits, subsidies and MSME support schemes.",
    },
    {
      question: "What is the difference between Udyam Registration and Udyog Aadhaar?",
      answer:
        "Udyog Aadhaar was the earlier MSME registration system, while Udyam Registration is the current official MSME registration system introduced by the government.",
    },
    {
      question: "What are the updated MSME classification limits for 2026?",
      answer:
        "MSME classification is based on business investment and annual turnover. Micro, Small and Medium enterprises are categorised according to the classification limits prescribed by the government.",
    },
    {
      question: "How long does Udyam Registration take?",
      answer:
        "Udyam Registration is generally a digital process and may be completed quickly when the required information is correctly submitted. Processing can vary depending on verification and portal requirements.",
    },
    {
      question: "What documents are required for Udyam Registration?",
      answer:
        "You generally need an Aadhaar number, PAN, business details, a mobile number, bank details and applicable GST information.",
    },
    {
      question: "Is Udyam Registration free?",
      answer:
        "The official Udyam Registration process is available through the government portal without a government registration fee. Professional assistance, if chosen, may involve service charges.",
    },
    {
      question: "Does Udyam Registration have an expiry date?",
      answer:
        "The Udyam Registration certificate generally does not require periodic renewal. However, registered enterprises should keep their information updated as required.",
    },
    {
      question: "Can a proprietorship apply for Udyam Registration?",
      answer:
        "Eligible proprietorship businesses can apply for Udyam Registration by providing the required proprietor and enterprise information.",
    },
    {
      question: "What are the benefits of Udyam Registration?",
      answer:
        "Udyam Registration can help eligible MSMEs access applicable government schemes, procurement benefits, lending support and other benefits available under MSME-related policies.",
    },
  ],
};

/* =========================================================
   GENERIC FAQ BUILDER
   ========================================================= */

const getGenericFaqs = (service) => {
  const title = service?.title || "this service";
  const category = service?.category || "service";

  return [
    {
      question: `Who can use ${title}?`,
      answer: `${title} is intended for individuals, businesses or organisations that meet the applicable requirements for this ${category.toLowerCase()}. Eligibility can vary depending on the nature of the requirement.`,
    },
    {
      question: `What documents are required for ${title}?`,
      answer: `The documents required for ${title} depend on the applicant, type of request and applicable authority. Our team can review your requirements and help identify the relevant documents.`,
    },
    {
      question: `How does the ${title} process work?`,
      answer: `The process generally starts with collecting the required information and documents, followed by verification, application preparation or submission, and completion of the applicable formalities.`,
    },
    {
      question: `How long does ${title} take?`,
      answer: `The completion time for ${title} depends on the type of application, document verification, government or third-party processing and whether any additional clarification is required.`,
    },
    {
      question: `Can I apply for ${title} online?`,
      answer: `Where an online facility is available, the application can be submitted digitally. Our team can provide guidance on the applicable online process and documentation.`,
    },
    {
      question: `Why should I take professional assistance for ${title}?`,
      answer: `Professional assistance can help with document preparation, application accuracy, process guidance and follow-up, helping reduce avoidable errors and delays.`,
    },
    {
      question: `What happens if additional documents are requested?`,
      answer: `If the concerned authority requests additional information or documents, the requirement can be reviewed and the necessary clarification or supporting documents can be prepared and submitted.`,
    },
    {
      question: `Can I track the status of my ${title} application?`,
      answer: `Where the relevant authority provides an online tracking facility, application status can generally be checked using the applicable application or reference details.`,
    },
    {
      question: `How can I get assistance with ${title}?`,
      answer: `You can contact MegaClick with your requirement and available documents. Our team can guide you through the applicable process, documentation and next steps.`,
    },
  ];
};

/* =========================================================
   REMOVE DUPLICATE QUESTIONS
   ========================================================= */

const removeDuplicateFaqs = (faqs) => {
  const seen = new Set();

  return faqs.filter((faq) => {
    if (!faq?.question) return false;

    const key = faq.question.trim().toLowerCase();

    if (seen.has(key)) return false;

    seen.add(key);
    return true;
  });
};

/* =========================================================
   BUILD EXACTLY 9 FAQS
   ========================================================= */

const buildFaqs = (service) => {
  if (!service) return [];

  const slug = service.slug;

  if (SPECIFIC_FAQS[slug]) {
    return SPECIFIC_FAQS[slug].slice(0, 9);
  }

  const existingFaqs = Array.isArray(service.faq)
    ? service.faq
    : Array.isArray(service.faqs)
      ? service.faqs
      : [];

  const genericFaqs = getGenericFaqs(service);

  const combined = removeDuplicateFaqs([
    ...existingFaqs,
    ...genericFaqs,
  ]);

  return combined.slice(0, 9);
};

/* =========================================================
   COMPONENT
   ========================================================= */

const ServiceFAQ = ({ service }) => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = useMemo(
    () => buildFaqs(service),
    [service]
  );

  const toggleFAQ = (index) => {
    setOpenIndex((currentIndex) =>
      currentIndex === index ? null : index
    );
  };

  React.useEffect(() => {
    setOpenIndex(null);
  }, [service?.slug]);

  return (
    <section
      className="
        service-faq-section
        w-full
        bg-blue-50
        py-10
        sm:py-12
        lg:py-16
        font-['Inter',sans-serif]
      "
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hedvig+Letters+Serif:opsz@12..24&family=Inter:wght@400;500;600;700&display=swap');

        .service-faq-container {
          width: 100%;
          max-width: 1380px;
          margin-left: auto;
          margin-right: auto;
        }

        .service-faq-question,
        .service-faq-answer {
          overflow-wrap: anywhere;
          word-break: normal;
        }

        /* 1440px - Services.jsx reference */
        @media (min-width: 1440px) {
          .service-faq-container {
            max-width: 1380px !important;
            padding-left: 2.5rem !important;
            padding-right: 2.5rem !important;
          }

          .service-faq-heading {
            font-size: 2.5rem !important;
            line-height: 1.2 !important;
          }

          .service-faq-question {
            font-size: 1rem !important;
            line-height: 1.6 !important;
          }

          .service-faq-answer {
            font-size: 0.875rem !important;
            line-height: 1.6 !important;
          }

          .service-faq-icon {
            width: 2.25rem !important;
            height: 2.25rem !important;
          }

          .service-faq-icon svg {
            width: 1.1rem !important;
            height: 1.1rem !important;
          }
        }

        /* 1920px - Services.jsx reference */
        @media (min-width: 1920px) {
          .service-faq-container {
            max-width: 1800px !important;
            padding-left: 4rem !important;
            padding-right: 4rem !important;
          }

          .service-faq-heading {
            font-size: 3.25rem !important;
            line-height: 1.18 !important;
          }

          .service-faq-question {
            font-size: 1.25rem !important;
            line-height: 1.75rem !important;
          }

          .service-faq-answer {
            font-size: 1.125rem !important;
            line-height: 2rem !important;
          }

          .service-faq-icon {
            width: 2.5rem !important;
            height: 2.5rem !important;
          }

          .service-faq-icon svg {
            width: 1.25rem !important;
            height: 1.25rem !important;
          }
        }

        /* 2560px */
        @media (min-width: 2560px) {
          .service-faq-container {
            max-width: 2300px !important;
            padding-left: 5rem !important;
            padding-right: 5rem !important;
          }

          .service-faq-heading {
            font-size: 3.75rem !important;
            line-height: 1.18 !important;
          }

          .service-faq-question {
            font-size: 1.5rem !important;
            line-height: 2.1rem !important;
          }

          .service-faq-answer {
            font-size: 1.25rem !important;
            line-height: 2.2rem !important;
          }

          .service-faq-icon {
            width: 3rem !important;
            height: 3rem !important;
          }

          .service-faq-icon svg {
            width: 1.5rem !important;
            height: 1.5rem !important;
          }
        }

        /* 3840px - Services.jsx reference */
        @media (min-width: 3840px) {
          .service-faq-container {
            max-width: 3200px !important;
            padding-left: 6rem !important;
            padding-right: 6rem !important;
          }

          .service-faq-heading {
            font-size: 5rem !important;
            line-height: 1.15 !important;
          }

          .service-faq-question {
            font-size: 2.25rem !important;
            line-height: 3rem !important;
          }

          .service-faq-answer {
            font-size: 2rem !important;
            line-height: 3.25rem !important;
          }

          .service-faq-icon {
            width: 4rem !important;
            height: 4rem !important;
          }

          .service-faq-icon svg {
            width: 2rem !important;
            height: 2rem !important;
          }
        }

        /* Mobile */
        @media (max-width: 640px) {
          .service-faq-container {
            padding-left: 1rem;
            padding-right: 1rem;
          }

          .service-faq-heading {
            font-size: 1.75rem !important;
            line-height: 1.2 !important;
          }

          .service-faq-question {
            font-size: 0.9375rem !important;
            line-height: 1.45rem !important;
          }

          .service-faq-answer {
            font-size: 0.8125rem !important;
            line-height: 1.5rem !important;
          }

          .service-faq-icon {
            width: 2rem !important;
            height: 2rem !important;
          }

          .service-faq-icon svg {
            width: 1rem !important;
            height: 1rem !important;
          }
        }
      `}</style>

      <div
        className="
          service-faq-container
          w-full
          px-4
          sm:px-6
          min-[1440px]:px-10
        "
      >
        {/* HEADER */}
        <div className="mb-7 sm:mb-9 lg:mb-10 text-left">
          <h2
            style={{
              fontFamily: "'Hedvig Letters Serif', serif",
            }}
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
            <span className="text-[#0B4EA2]">
              Questions
            </span>
          </h2>
        </div>

        {/* FAQ LIST */}
        {faqs.length > 0 && (
          <div
            className="
              w-full
              divide-y
              divide-gray-200
              border-t
              border-b
              border-gray-200
            "
          >
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={`${service?.slug || "service"}-faq-${index}`}
                  className="
                    w-full
                    py-4
                    sm:py-5
                    lg:py-6
                    transition-colors
                    duration-200
                  "
                >
                  <button
                    type="button"
                    onClick={() => toggleFAQ(index)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${index}`}
                    className="
                      w-full
                      min-w-0
                      flex
                      items-center
                      justify-between
                      gap-3
                      sm:gap-5
                      lg:gap-6
                      text-left
                      focus:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-[#0B4EA2]
                      focus-visible:ring-offset-2
                      rounded-sm
                      cursor-pointer
                    "
                  >
                    <span
                      style={{
                        fontFamily: "'Inter', sans-serif",
                      }}
                      className={`
                        service-faq-question
                        min-w-0
                        flex-1
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

                    <span
                      className={`
                        service-faq-icon
                        shrink-0
                        w-8
                        h-8
                        sm:w-9
                        sm:h-9
                        rounded-full
                        flex
                        items-center
                        justify-center
                        transition-all
                        duration-300
                        ${
                          isOpen
                            ? "bg-[#0B4EA2] text-white rotate-180 shadow-sm"
                            : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-100"
                        }
                      `}
                    >
                      <ChevronDown
                        size={18}
                        strokeWidth={2.5}
                        aria-hidden="true"
                      />
                    </span>
                  </button>

                  <div
                    id={`faq-answer-${index}`}
                    className={`
                      grid
                      transition-all
                      duration-300
                      ease-in-out
                      ${
                        isOpen
                          ? "grid-rows-[1fr] opacity-100 mt-3 sm:mt-3.5"
                          : "grid-rows-[0fr] opacity-0"
                      }
                    `}
                  >
                    <div className="overflow-hidden min-w-0">
                      <p
                        style={{
                          fontFamily: "'Inter', sans-serif",
                        }}
                        className="
                          service-faq-answer
                          max-w-[1000px]
                          text-xs
                          sm:text-sm
                          lg:text-base
                          text-[#374A59]
                          leading-relaxed
                          font-normal
                          text-left
                          pr-1
                          sm:pr-10
                          lg:pr-14
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
        )}

        {/* FALLBACK */}
        {faqs.length === 0 && (
          <p className="text-sm text-gray-600">
            No FAQs available for this service.
          </p>
        )}
      </div>
    </section>
  );
};

export default ServiceFAQ;
