import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const defaultFAQs = [
  {
    question: "What is Udyam Registration, and is it mandatory?",
    answer:
      "Udyam Registration is the official registration process for Micro, Small, and Medium Enterprises (MSMEs) in India. It is not mandatory for every business, but it is very useful for getting government benefits, subsidies, and MSME support schemes.",
  },
  {
    question:
      "What is the difference between Udyam Registration and Udyog Aadhaar?",
    answer:
      "Udyog Aadhaar was the old MSME registration system, while Udyam Registration is the updated and official system introduced by the government with automatic verification through Aadhaar and PAN.",
  },
  {
    question: "What are the updated MSME classification limits for 2026?",
    answer:
      "MSME classification is based on business investment and annual turnover. Micro, small, and medium businesses are categorised according to limits fixed by the government for machinery investment and yearly sales.",
  },
  {
    question: "How long does Udyam Registration take?",
    answer:
      "Udyam Registration is usually completed within a few hours to a few working days if all details and documents are submitted correctly.",
  },
  {
    question: "What documents are required for Udyam Registration?",
    answer:
      "You generally need an Aadhaar number, a PAN card, business details, a mobile number, bank details, and GST information if applicable.",
  },
  {
    question: "Is Udyam registration free?",
    answer:
      "The government registration process is free on the official portal. However, some people choose paid assistance services for help with documentation, filing, corrections, and avoiding mistakes.",
  },
  {
    question: "Does the Udyam Certificate expire? Does it need renewal?",
    answer:
      "No, the Udyam Certificate does not usually expire and does not require regular renewal unless business details need to be updated.",
  },
  {
    question: "How do I download my Udyam certificate?",
    answer:
      "You can download your Udyam Certificate from the official Udyam portal by entering your registration number and registered mobile number.",
  },
  {
    question: "What is a Udyam Registration Number (URN)?",
    answer:
      "The Udyam Registration Number is a unique identification number given to every registered MSME business after successful registration.",
  },
  {
    question: "Can I apply for Udyam Registration without GST?",
    answer:
      "Yes, small businesses that are not required to register under GST can still apply for Udyam Registration using Aadhaar and PAN details.",
  },
  {
    question: "Which businesses can register under Udyam?",
    answer:
      "Manufacturing businesses, service providers, startups, proprietorships, partnerships, companies, and small enterprises can apply under the MSME category if they meet eligibility conditions.",
  },
  {
    question:
      "Can I have multiple Udyam Registrations for different businesses?",
    answer:
      "No, one business entity can generally have only one Udyam Registration, but multiple activities and branches can be added under the same registration.",
  },
  {
    question:
      "What are the benefits of Udyam Registration for getting bank loans?",
    answer:
      "Registered MSMEs may get easier loan approvals, lower interest rates, collateral-free loan benefits, and support under government credit guarantee schemes.",
  },
  {
    question: "How do I check my Udyam Registration status?",
    answer:
      "You can check your Udyam Registration status online through the official Udyam portal using your registration number or Aadhaar-linked details.",
  },
  {
    question: "What happens if I make a mistake in my Udyam Registration?",
    answer:
      "If there is any mistake in your Udyam Registration, you can log in to the portal and update or correct the details through the modification option.",
  },
  {
    question: "What is the use of the Udyam Registration certificate?",
    answer:
      "The Udyam Registration Certificate confirms that a business is recognised as an MSME by the Government of India.",
  },
  {
    question: "Is the Udyam certificate free of cost?",
    answer:
      "Yes, registration on the official portal is completely free. No government fee is charged for applying for the certificate.",
  },
  {
    question: "Who is eligible for Udyam registration?",
    answer:
      "Any micro, small, or medium enterprise engaged in manufacturing, services, retail, or wholesale trade can apply.",
  },
  {
    question: "How long is the Udyam certificate valid?",
    answer:
      "The Udyam certificate has lifetime validity once issued. Businesses do not need to renew it.",
  },
  {
    question: "What are the benefits of Udyam number?",
    answer:
      "The Udyam number helps businesses access MSME schemes, easier bank loans, and government tender opportunities.",
  },
  {
    question: "Is GST mandatory for Udyam registration?",
    answer:
      "GST is required only for businesses that fall under the GST rules. If applicable, the GST number must be provided during registration.",
  },
  {
    question: "What is the turnover limit for Udyam?",
    answer:
      "MSME classification depends on turnover and investment. Micro enterprises up to ₹5 crore, small up to ₹50 crore, and medium up to ₹250 crore turnover.",
  },
  {
    question: "Can I get a loan on a Udyam certificate?",
    answer:
      "Yes, MSMEs with Udyam registration can apply for business loans from banks and financial institutions.",
  },
  {
    question: "What is the interest rate of the Udyam loan?",
    answer:
      "Interest rates vary by bank and loan scheme. MSMEs may receive lower rates under government-supported programs.",
  },
  {
    question: "What are the tax benefits of Udyam?",
    answer:
      "Registered MSMEs may receive tax rebates, subsidies, and government support programs. Benefits depend on applicable schemes.",
  },
  {
    question: "Is the Udyam certificate proof of business?",
    answer:
      "Yes, it serves as official proof that the enterprise is registered as an MSME. It is often used when applying for loans or schemes.",
  },
  {
    question:
      "How do I update or change details (address, turnover, etc.) in my Udyam certificate?",
    answer:
      "You can update business details directly on the official Udyam portal. Changes appear after verification.",
  },
  {
    question: "Can I cancel or deregister my Udyam registration?",
    answer:
      "Yes, businesses can cancel their registration through the official portal if they close or no longer qualify as MSMEs.",
  },
  {
    question:
      "What happens if my turnover or investment exceeds the prescribed limit after I’ve registered?",
    answer:
      "The system automatically updates the enterprise category using GST and income tax data.",
  },
  {
    question:
      "Does the registration cover retailers and traders or only manufacturing/service enterprises?",
    answer:
      "Retail and wholesale traders are also eligible for Udyam registration under the MSME category.",
  },
];

const ServiceFAQ = ({ service }) => {
  // null = all closed initially; user opens manually
  const [openIndex, setOpenIndex] = useState(null);

  const specificFaqs = service?.faqs || service?.faq || [];
  const faqs =
    specificFaqs.length > 0
      ? [...specificFaqs, ...defaultFAQs]
      : defaultFAQs;

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

        {/* =========================================
            ACCORDION LIST
        ========================================== */}
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