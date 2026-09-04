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
    <section className="py-6 sm:py-8 bg-slate-50/60 popular-section font-['Inter',sans-serif]">
      {/* GOOGLE FONTS */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hedvig+Letters+Serif:opsz@12..24&family=Inter:wght@400;500;600;700&display=swap');

        /* Large Desktop (1920px Full HD) */
        @media (min-width: 1920px) {
          .popular-section { padding-top: 2rem !important; padding-bottom: 2rem !important; }
          .popular-heading { font-size: 1.35rem !important; margin-bottom: 1.5rem !important; }
          .popular-grid { gap: 1.5rem !important; }
          .popular-icon-box { width: 4.5rem !important; height: 4.5rem !important; border-radius: 1.25rem !important; }
          .popular-card-title { font-size: 0.95rem !important; margin-top: 0.75rem !important; }
        }

        /* 4K Ultra-Wide Desktop (3840px) */
        @media (min-width: 3840px) {
          .popular-section { padding-top: 4rem !important; padding-bottom: 4rem !important; }
          .popular-heading { font-size: 2.25rem !important; margin-bottom: 2.5rem !important; }
          .popular-grid { gap: 3rem !important; }
          .popular-icon-box { width: 8rem !important; height: 8rem !important; border-radius: 2rem !important; }
          .popular-card-title { font-size: 1.5rem !important; margin-top: 1.5rem !important; }
        }
      `}</style>

      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 min-[1440px]:px-10">
        {/* =========================================
            CONSISTENT HEADING
        ========================================== */}
        <div className="mb-5 sm:mb-6 flex items-center justify-between">
          <h2
            style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
            className="popular-heading text-lg sm:text-xl font-bold text-black flex items-center gap-2 text-left"
          >
            <span className="text-amber-500 text-lg">⚡</span>
            Popular <span className="text-[#0B4EA2]">Services</span>
          </h2>
        </div>

        {/* =========================================
            SERVICES ICON GRID
        ========================================== */}
        <div className="popular-grid grid grid-cols-2 sm:grid-cols-5 md:grid-cols-5 gap-3 sm:gap-5">
          {popularServices.map((service, index) => (
            <div
              key={index}
              onClick={() => handleServiceClick(service.title)}
              className="group flex flex-col items-center cursor-pointer py-1.5 transition-transform duration-200"
            >
              {/* CARD IMAGE CONTAINER */}
              <div className="popular-icon-box w-13 h-13 sm:w-16 sm:h-16 rounded-2xl bg-white border border-gray-200/80 shadow-xs flex items-center justify-center p-2.5 transition-all duration-300 group-hover:scale-105 group-hover:shadow-md group-hover:border-blue-200 overflow-hidden">
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
              <h3
                style={{ fontFamily: "'Inter', sans-serif" }}
                className="popular-card-title mt-2.5 text-xs font-semibold text-gray-800 text-center leading-snug line-clamp-2 group-hover:text-[#0B4EA2] transition-colors"
              >
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