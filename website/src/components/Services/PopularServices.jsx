import React from "react";

// =====================================================
// EXACT IMAGE IMPORTS MATCHING YOUR ASSETS
// =====================================================
import marriageRegImg from "../../assets/marriage-registration.png";
import gstRegistrationImg from "../../assets/gst-registration.jpg";
import trademarkImg from "../../assets/trademark-registration.png";
import companyRegImg from "../../assets/company-registration.png";
import incomeTaxImg from "../../assets/income-tax.png";
import msmeUdyamImg from "../../assets/msme.png";
import rentAgreementImg from "../../assets/rent-agreement.png";
import digitalMarketingImg from "../../assets/digital-marketing.png";
import passportImg from "../../assets/passport-services.png";
import accountingAuditImg from "../../assets/accounting-audit.png";

const popularServices = [
  {
    title: "Marriage Registration",
    image: marriageRegImg,
  },
  {
    title: "GST Registration & Filing",
    image: gstRegistrationImg,
  },
  {
    title: "Trademark Registration",
    image: trademarkImg,
  },
  {
    title: "Company Registration & Annual Compliance",
    image: companyRegImg,
  },
  {
    title: "Income Tax Services",
    image: incomeTaxImg,
  },
  {
    title: "MSME / UDYAM Registration",
    image: msmeUdyamImg,
  },
  {
    title: "Leave & Licence / Rent Agreement",
    image: rentAgreementImg,
  },
  {
    title: "Digital Marketing",
    image: digitalMarketingImg,
  },
  {
    title: "Passport Services",
    image: passportImg,
  },
  {
    title: "Accounting / Audit Services",
    image: accountingAuditImg,
  },
];

const PopularServices = ({ onSelectService }) => {
  const handleServiceClick = (serviceTitle) => {
    if (onSelectService) {
      onSelectService(serviceTitle);
    }
    const servicesSection = document.getElementById("services-section");
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-5 bg-slate-50/60 popular-section font-['Inter',sans-serif]">
      <style>{`
        /* Large Desktop (1920px Full HD) */
        @media (min-width: 1920px) {
          .popular-section {
            padding-top: 1.75rem !important;
            padding-bottom: 1.75rem !important;
          }
          .popular-heading {
            font-size: 1.15rem !important;
            margin-bottom: 1.25rem !important;
          }
          .popular-grid {
            gap: 1.5rem !important;
          }
          .popular-icon-box {
            width: 4.25rem !important;
            height: 4.25rem !important;
            border-radius: 1.15rem !important;
          }
          .popular-card-title {
            font-size: 0.85rem !important;
            margin-top: 0.65rem !important;
          }
        }

        /* 4K Ultra-Wide Desktop (3840px) */
        @media (min-width: 3840px) {
          .popular-section {
            padding-top: 3.5rem !important;
            padding-bottom: 3.5rem !important;
          }
          .popular-heading {
            font-size: 1.85rem !important;
            margin-bottom: 2.25rem !important;
          }
          .popular-grid {
            gap: 2.75rem !important;
          }
          .popular-icon-box {
            width: 7.5rem !important;
            height: 7.5rem !important;
            border-radius: 1.85rem !important;
          }
          .popular-card-title {
            font-size: 1.45rem !important;
            margin-top: 1.25rem !important;
          }
        }
      `}</style>

      <div className="app-container">
        <div className="mb-4 flex items-center">
          <h2
            style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
            className="popular-heading text-sm sm:text-base font-bold text-gray-800 flex items-center gap-1.5 text-left"
          >
            <span className="text-amber-500 text-base">⚡</span>
            Popular Services
          </h2>
        </div>

        <div className="popular-grid grid grid-cols-2 sm:grid-cols-5 md:grid-cols-5 gap-3 sm:gap-5">
          {popularServices.map((service, index) => (
            <div
              key={index}
              onClick={() => handleServiceClick(service.title)}
              className="group flex flex-col items-center cursor-pointer py-1"
            >
              {/* SMALL CARD IMAGE CONTAINER */}
              <div className="popular-icon-box w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white border border-gray-200/80 shadow-xs flex items-center justify-center p-2 transition-all duration-300 group-hover:scale-105 group-hover:shadow-md overflow-hidden">
                {service.image ? (
                  <img
                    src={service.image}
                    alt={service.title}
                    loading="lazy"
                    className="w-full h-full object-contain transition-transform duration-300"
                  />
                ) : (
                  <span className="text-xl sm:text-2xl">📋</span>
                )}
              </div>

              {/* CARD TITLE */}
              <h3 className="popular-card-title mt-2 text-xs font-medium text-gray-700 text-center leading-tight line-clamp-2">
                {service.title}
              </h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularServices;