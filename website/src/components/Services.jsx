
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Scale,
  BarChart3,
  ClipboardList,
  Laptop,
} from "lucide-react";

const services = [
  {
    title: "Legal Services",
    slug: "legal-services",
    icon: Scale,
    short:
      "Expert legal documentation, company registrations and compliance management tailored to protect and grow your business with full regulatory confidence.",
    gradient: "from-white via-blue-50 to-blue-200",
    iconBg: "bg-blue-100",
    iconColor: "text-[#0B4EA2]",
    btnBorder:
      "border-[#0B4EA2] text-[#0B4EA2] hover:bg-[#0B4EA2] hover:text-white",
  },
  {
    title: "Business & Financial Services",
    slug: "business-financial-services",
    icon: BarChart3,
    short:
      "End-to-end taxation, accounting and financial planning solutions designed to streamline your operations and drive sustainable long-term business growth.",
    gradient: "from-white via-purple-50 to-purple-200",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    btnBorder:
      "border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white",
  },
  {
    title: "IT Services",
    slug: "it-services",
    icon: Laptop,
    short:
      "Advanced technology solutions including AI, software development, cloud infrastructure, cybersecurity, data analytics and digital experiences designed to modernize your business and accelerate growth.",
    gradient: "from-white via-amber-50 to-amber-200",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    btnBorder:
      "border-amber-500 text-amber-600 hover:bg-amber-500 hover:text-white",
  },
  {
    title: "Other Services",
    slug: "other-services",
    icon: ClipboardList,
    short:
      "Comprehensive support for licenses, MSME registrations and all essential business requirements handled with speed, accuracy and complete transparency.",
    gradient: "from-white via-emerald-50 to-emerald-200",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    btnBorder:
      "border-emerald-500 text-emerald-600 hover:bg-emerald-600 hover:text-white",
  },
];

const Services = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full bg-white font-['Inter',sans-serif] py-8 sm:py-12 lg:py-16 min-[1920px]:py-20 min-[3840px]:py-28">
      <style>{`
        @media (min-width: 1440px) {
          .services-container {
            max-width: 1380px !important;
            padding-left: 2.5rem !important;
            padding-right: 2.5rem !important;
          }

          .services-header {
            margin-bottom: 2.75rem !important;
          }

          .services-tagline {
            font-size: 0.85rem !important;
            margin-bottom: 0.75rem !important;
          }

          .services-title {
            font-size: 2.5rem !important;
            line-height: 1.2 !important;
          }

          .services-desc {
            font-size: 0.95rem !important;
            line-height: 1.65 !important;
            margin-top: 0.9rem !important;
          }

          .services-grid {
            gap: 1.5rem !important;
          }

          .services-card-content {
            padding: 2rem 1.5rem 1.25rem !important;
          }

          /*
            All card headings use the same fixed title area.
            This keeps every heading on the same horizontal line.
          */
          .services-card-title-wrapper {
            height: 4.5rem !important;
            min-height: 4.5rem !important;
            display: flex !important;
            align-items: flex-start !important;
            justify-content: center !important;
          }

          .services-card-title {
            font-size: 1.4rem !important;
            line-height: 1.3 !important;
            min-height: 3.5rem !important;
            margin-bottom: 0 !important;
            display: flex !important;
            align-items: flex-start !important;
            justify-content: center !important;
          }

          .services-card-description-wrapper {
            height: 8rem !important;
            margin-bottom: 1.75rem !important;
          }

          .services-card-desc {
            font-size: 0.875rem !important;
            line-height: 1.6 !important;
          }

          .services-btn {
            font-size: 0.85rem !important;
            padding: 0.5rem 1.25rem !important;
          }

          .services-read-more-wrapper {
            margin-top: 0.75rem !important;
          }

          .services-icon-section {
            padding-top: 1.25rem !important;
            padding-bottom: 1.5rem !important;
          }

          .services-icon-box {
            width: 3.75rem !important;
            height: 3.75rem !important;
            border-radius: 1rem !important;
          }

          .services-icon-box svg {
            width: 1.75rem !important;
            height: 1.75rem !important;
          }
        }

        @media (min-width: 1920px) {
          .services-container {
            max-width: 1800px !important;
            padding-left: 4rem !important;
            padding-right: 4rem !important;
          }

          .services-header {
            margin-bottom: 3.5rem !important;
          }

          .services-tagline {
            font-size: 1rem !important;
            letter-spacing: 0.3em !important;
            margin-bottom: 1rem !important;
          }

          .services-title {
            font-size: 3.25rem !important;
            line-height: 1.18 !important;
          }

          .services-desc {
            font-size: 1.15rem !important;
            line-height: 1.8 !important;
            margin-top: 1rem !important;
          }

          .services-grid {
            gap: 2rem !important;
          }

          .services-card-content {
            padding: 2.5rem 2rem 1.5rem !important;
          }

          .services-card-title-wrapper {
            height: 5rem !important;
            min-height: 5rem !important;
          }

          .services-card-title {
            font-size: 1.65rem !important;
            line-height: 1.3 !important;
            min-height: 4rem !important;
          }

          .services-card-description-wrapper {
            height: 8.5rem !important;
            margin-bottom: 2rem !important;
          }

          .services-card-desc {
            font-size: 0.98rem !important;
            line-height: 1.7 !important;
          }

          .services-btn {
            font-size: 0.95rem !important;
            padding: 0.6rem 1.5rem !important;
          }

          .services-read-more-wrapper {
            margin-top: 0.85rem !important;
          }

          .services-icon-section {
            padding-top: 1.5rem !important;
            padding-bottom: 2rem !important;
          }

          .services-icon-box {
            width: 4rem !important;
            height: 4rem !important;
            border-radius: 1.1rem !important;
          }

          .services-icon-box svg {
            width: 2rem !important;
            height: 2rem !important;
          }
        }

        @media (min-width: 3840px) {
          .services-container {
            max-width: 3200px !important;
            padding-left: 6rem !important;
            padding-right: 6rem !important;
          }

          .services-header {
            margin-bottom: 5rem !important;
          }

          .services-tagline {
            font-size: 1.5rem !important;
            letter-spacing: 0.35em !important;
            margin-bottom: 1.5rem !important;
          }

          .services-title {
            font-size: 5rem !important;
            line-height: 1.15 !important;
          }

          .services-desc {
            font-size: 1.75rem !important;
            line-height: 1.8 !important;
            margin-top: 1.5rem !important;
          }

          .services-grid {
            gap: 3rem !important;
          }

          .services-card {
            border-radius: 2rem !important;
          }

          .services-card-content {
            padding: 4rem 3rem 2rem !important;
          }

          .services-card-title-wrapper {
            height: 7rem !important;
            min-height: 7rem !important;
          }

          .services-card-title {
            font-size: 2.5rem !important;
            line-height: 1.25 !important;
            min-height: 6rem !important;
          }

          .services-card-description-wrapper {
            height: 12rem !important;
            margin-bottom: 2.5rem !important;
          }

          .services-card-desc {
            font-size: 1.4rem !important;
            line-height: 2.15rem !important;
          }

          .services-btn {
            font-size: 1.35rem !important;
            padding: 0.85rem 2rem !important;
          }

          .services-btn svg {
            width: 1.4rem !important;
            height: 1.4rem !important;
          }

          .services-read-more-wrapper {
            margin-top: 1rem !important;
          }

          .services-icon-section {
            padding-top: 1.75rem !important;
            padding-bottom: 2.5rem !important;
          }

          .services-icon-box {
            width: 5rem !important;
            height: 5rem !important;
            border-radius: 1.35rem !important;
          }

          .services-icon-box svg {
            width: 2.25rem !important;
            height: 2.25rem !important;
          }
        }
      `}</style>

      <div className="services-container w-full max-w-[1380px] mx-auto px-4 sm:px-6 lg:px-8 min-[1440px]:px-10">
        {/* SECTION HEADER */}
        <div className="services-header mb-8 sm:mb-10 lg:mb-12 w-full text-left">
          <p
            style={{ fontFamily: "'Inter', sans-serif" }}
            className="services-tagline text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-[#0B4EA2] mb-2.5 sm:mb-3 text-left"
          >
            WHAT WE OFFER
          </p>

          <h2
            style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
            className="services-title text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold leading-[1.18] text-black text-left mb-2.5 sm:mb-4"
          >
            Complete Business{" "}
            <span className="text-[#0B4EA2]">Solutions</span>
          </h2>

          <p
            style={{ fontFamily: "'Inter', sans-serif" }}
            className="services-desc mt-3 sm:mt-4 text-slate-600 font-normal text-xs sm:text-sm lg:text-base leading-relaxed text-left w-full"
          >
            From legal registrations and financial compliance to essential
            business licenses, MegaClick delivers expert-led services with
            transparent processes and end-to-end professional support.
          </p>
        </div>

        {/* SERVICE CARDS */}
        <div className="services-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 lg:gap-6 min-[1920px]:gap-8 min-[3840px]:gap-12 items-stretch w-full">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <div
                key={index}
                className={`
                  services-card
                  group flex flex-col h-full rounded-3xl overflow-hidden
                  border border-slate-100 shadow-sm hover:shadow-xl
                  transition-all duration-300 hover:-translate-y-1.5
                  cursor-pointer bg-gradient-to-b ${service.gradient}
                `}
              >
                <div className="services-card-content flex flex-col items-center text-center px-5 pt-7 pb-4 sm:px-6 sm:pt-8 min-[1920px]:px-8 min-[1920px]:pt-10 min-[3840px]:px-12 min-[3840px]:pt-16 flex-1">

                  {/* CARD TITLE */}
                  <div className="services-card-title-wrapper w-full h-[64px] sm:h-[64px] lg:h-[64px] flex items-start justify-center mb-3 shrink-0">
                    <h3
                      style={{
                        fontFamily: "'Hedvig Letters Serif', serif",
                      }}
                      className="services-card-title text-xl sm:text-[22px] lg:text-[22px] font-bold text-[#0f172a] leading-snug w-full text-center flex items-start justify-center"
                    >
                      {service.title}
                    </h3>
                  </div>

                  {/* DESCRIPTION */}
                  <div className="services-card-description-wrapper w-full h-[125px] sm:h-[125px] lg:h-[135px] min-[1440px]:h-[128px] min-[1920px]:h-[145px] min-[3840px]:h-[210px] flex items-start justify-center overflow-hidden mb-7 shrink-0">
                    <p
                      style={{ fontFamily: "'Inter', sans-serif" }}
                      className="services-card-desc w-full text-xs sm:text-sm text-slate-600 leading-relaxed text-justify hyphens-auto"
                    >
                      {service.short}
                    </p>
                  </div>

                  {/* READ MORE */}
                  <div className="services-read-more-wrapper w-full flex items-center justify-center mt-3 shrink-0">
                    <button
                      onClick={() =>
                        navigate(`/services?category=${service.slug}`)
                      }
                      style={{ fontFamily: "'Inter', sans-serif" }}
                      className={`
                        services-btn inline-flex items-center justify-center
                        gap-2 border rounded-full px-5 py-2 text-xs sm:text-sm
                        font-semibold transition-all duration-200 cursor-pointer
                        shadow-xs ${service.btnBorder}
                      `}
                    >
                      <span>Read More</span>

                      <ArrowRight
                        size={15}
                        className="shrink-0"
                      />
                    </button>
                  </div>
                </div>

                {/* BOTTOM ICON */}
                <div className="services-icon-section flex items-center justify-center py-6 sm:py-7 lg:py-7 shrink-0">
                  <div
                    className={`
                      services-icon-box w-14 h-14 sm:w-16 sm:h-16
                      lg:w-[60px] lg:h-[60px] rounded-2xl ${service.iconBg}
                      flex items-center justify-center shadow-xs
                      group-hover:scale-105 transition-transform duration-300
                    `}
                  >
                    <Icon
                      size={27}
                      className={`${service.iconColor} transition-transform duration-300`}
                      strokeWidth={1.75}
                    />
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

export default Services;
