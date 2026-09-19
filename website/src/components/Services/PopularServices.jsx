import React from "react";

// =====================================================
// EXACT IMAGE IMPORTS MATCHING YOUR ASSETS
// =====================================================

import marriageRegImg from "../../assets/marrige_registration_logo.png";
import gstRegistrationImg from "../../assets/gst-registration.jpg";
import trademarkImg from "../../assets/trademark-registration.png";
import companyRegImg from "../../assets/company-registration.png";
import incomeTaxImg from "../../assets/income-tax.png";
import msmeUdyamImg from "../../assets/msme.png";
import rentAgreementImg from "../../assets/rent-agreement.png";
import digitalMarketingImg from "../../assets/digital-marketing.png";
import passportImg from "../../assets/passport-services.png";
import accountingAuditImg from "../../assets/accounting-audit.png";


// =====================================================
// POPULAR SERVICES DATA
// =====================================================

const popularServices = [
  {
    title: "Marriage Registration",
    description: "Complete assistance with marriage registration and documentation.",
    image: marriageRegImg,
    description:
      "Complete assistance for marriage registration and required documentation.",
  },
  {
    title: "GST Registration & Filing",
    description: "GST registration and filing support for businesses.",
    image: gstRegistrationImg,
    description:
      "GST registration and filing support for businesses and professionals.",
  },
  {
    title: "Trademark Registration",
    description: "Professional assistance for trademark registration.",
    image: trademarkImg,
    description:
      "Protect your brand with professional trademark registration assistance.",
  },
  {
    title: "Company Registration & Annual Compliance",
    description: "Company incorporation and annual compliance support.",
    image: companyRegImg,
    description:
      "Company incorporation and annual compliance support for businesses.",
  },
  {
    title: "Income Tax Services",
    description: "Income tax filing and compliance assistance.",
    image: incomeTaxImg,
    description:
      "Income tax filing and compliance assistance for individuals and businesses.",
  },
  {
    title: "MSME / UDYAM Registration",
    description: "Assistance with MSME and UDYAM registration.",
    image: msmeUdyamImg,
    description:
      "Quick assistance with MSME and UDYAM registration documentation.",
  },
  {
    title: "Leave & Licence / Rent Agreement",
    description: "Rental agreement preparation and registration support.",
    image: rentAgreementImg,
    description:
      "Prepare and register rental agreements with complete documentation support.",
  },
  {
    title: "Digital Marketing",
    description: "Digital marketing support to grow your online presence.",
    image: digitalMarketingImg,
    description:
      "Build your online presence with practical digital marketing support.",
  },
  {
    title: "Passport Services",
    description: "Assistance with passport applications and documentation.",
    image: passportImg,
    description:
      "Assistance with passport applications, documentation and related services.",
  },
  {
    title: "Accounting / Audit Services",
    description: "Accounting, bookkeeping and audit support.",
    image: accountingAuditImg,
    description:
      "Bookkeeping, accounting and audit support for accurate financial records.",
  },
];

const PopularServices = ({ onSelectService }) => {
  const handleServiceClick = (serviceTitle) => {
    if (onSelectService) {
      onSelectService(serviceTitle);
    }

    const servicesSection =
      document.getElementById("services-section");

    if (servicesSection) {
      servicesSection.scrollIntoView({
        behavior: "smooth",
      });
    }
  };

  return (
<section className="py-6 sm:py-8 popular-section font-['Inter',sans-serif]">      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

        /* =========================================================
           STANDARD DESKTOP — 1440px
           Same responsive container scale as Services.jsx
        ========================================================= */
        @media (min-width: 1440px) {
          .popular-container {
            max-width: 1380px !important;
            padding-left: 2.5rem !important;
            padding-right: 2.5rem !important;
          }

          .popular-section {
            padding-top: 3rem !important;
            padding-bottom: 3rem !important;
          }

          .popular-heading {
            font-size: 1.2rem !important;
            margin-bottom: 1.75rem !important;
          }

          .popular-grid {
            column-gap: 3rem !important;
            row-gap: 2.25rem !important;
          }

          .popular-icon-box {
            width: 4rem !important;
            height: 4rem !important;
            border-radius: 1rem !important;
          }

          .popular-card-title {
            font-size: 0.85rem !important;
            margin-top: 0 !important;
          }

          .popular-card-description {
            font-size: 0.75rem !important;
          }
        }

        /* =========================================================
           LARGE DESKTOP — 1920px
           Same container scale as Services.jsx
        ========================================================= */
        @media (min-width: 1920px) {
          .popular-container {
            max-width: 1800px !important;
            padding-left: 4rem !important;
            padding-right: 4rem !important;
          }

          .popular-section {
            padding-top: 4rem !important;
            padding-bottom: 4rem !important;
          }

          .popular-heading {
            font-size: 1.35rem !important;
            margin-bottom: 2rem !important;
          }

          .popular-grid {
            column-gap: 4rem !important;
            row-gap: 2.75rem !important;
          }

          .popular-icon-box {
            width: 4.5rem !important;
            height: 4.5rem !important;
            border-radius: 1.1rem !important;
          }

          .popular-card-title {
            font-size: 0.95rem !important;
          }

          .popular-card-description {
            font-size: 0.82rem !important;
          }
        }

        /* =========================================================
           4K ULTRA-WIDE — 3840px
           Same container scale as Services.jsx
        ========================================================= */
        @media (min-width: 3840px) {
          .popular-container {
            max-width: 3200px !important;
            padding-left: 6rem !important;
            padding-right: 6rem !important;
          }

          .popular-section {
            padding-top: 6rem !important;
            padding-bottom: 6rem !important;
          }

          .popular-heading {
            font-size: 2.25rem !important;
            margin-bottom: 2.5rem !important;
          }

          .popular-grid {
            column-gap: 6rem !important;
            row-gap: 4.5rem !important;
          }

          .popular-icon-box {
            width: 5rem !important;
            height: 5rem !important;
            border-radius: 1.5rem !important;
          }

          .popular-card-title {
            font-size: 1.5rem !important;
          }

          .popular-card-description {
            font-size: 1.1rem !important;
            line-height: 1.7 !important;
          }
        }
      `}</style>

      <div
        className="
          popular-container
          w-full
          max-w-[1380px]
          mx-auto
          px-4
          sm:px-6
          lg:px-8
          min-[1440px]:px-10
          py-0
        "
      >
        {/* =====================================================
            HEADING
            ===================================================== */}

        <div className="mb-8 sm:mb-10">
          <h2
            style={{
              fontFamily: "'Poppins', sans-serif",
            }}
            className="popular-heading text-lg sm:text-xl font-bold text-black flex items-center gap-2 text-left"
          >
            Popular{" "}
            <span className="text-[#0B4EA2]">
              Services
            </span>
          </h2>
        </div>

        {/* =====================================================
            SERVICES GRID
            ===================================================== */}

        <div
          className="
            popular-grid
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            gap-5
            sm:gap-6
          "
        >
          {popularServices.map((service, index) => (
            <div
              key={index}
              onClick={() =>
                handleServiceClick(service.title)
              }
              className="
                group
                flex
                items-start
                gap-3
                sm:gap-4
                cursor-pointer
                py-1.5
                transition-transform
                duration-200
                min-w-0
              "
            >
              {/* IMAGE */}
              <div
                className="
                  popular-icon-box
                  shrink-0
                  w-12
                  h-12
                  sm:w-14
                  sm:h-14
                  rounded-2xl
                  bg-white
                  border
                  border-gray-200/80
                  shadow-xs
                  flex
                  items-center
                  justify-center
                  p-2.5
                  overflow-hidden
                  transition-all
                  duration-300
                  group-hover:scale-105
                  group-hover:shadow-md
                  group-hover:border-blue-200
                "
              >
                {service.image ? (
                  <img
                    src={service.image}
                    alt={service.title}
                    loading="lazy"
                    className="w-full h-full object-contain transition-transform duration-300"
                  />
                ) : (
                  <span className="text-xl sm:text-2xl">
                    📋
                  </span>
                )}
              </div>

              {/* TEXT */}
              <div className="min-w-0 pt-0.5">
                <h3
                  style={{
                    fontFamily: "'Inter', sans-serif",
                  }}
                  className="
                    popular-card-title
                    text-xs
                    sm:text-sm
                    font-semibold
                    text-gray-800
                    leading-snug
                    group-hover:text-[#0B4EA2]
                    transition-colors
                    duration-200
                  "
                >
                  {service.title}
                </h3>

                <p
                  style={{
                    fontFamily: "'Inter', sans-serif",
                  }}
                  className="
                    popular-card-description
                    mt-1
                    text-[11px]
                    sm:text-xs
                    text-gray-500
                    leading-5
                  "
                >
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PopularServices;