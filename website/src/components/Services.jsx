import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Scale, BarChart3, ClipboardList } from "lucide-react";

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
    title: "Other Services",
    slug: "other-services",
    icon: ClipboardList,
    short:
      "Comprehensive support for licenses, MSME registrations and all essential business requirements handled with speed, accuracy and complete transparency.",
    gradient: "from-white via-emerald-50 to-emerald-200",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    btnBorder:
      "border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white",
  },
];

const Services = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full py-8 sm:py-12 lg:py-16 min-[1920px]:py-20 min-[3840px]:py-32 bg-white font-['Inter',sans-serif]">
      {/* DIRECT CSS RULES FOR 1440px, 1920px & 3840px RESPONSIVENESS */}
      <style>{`
        /* Standard Desktop (1440px) */
        @media (min-width: 1440px) {
          .services-container {
            max-width: 1380px !important;
            padding-left: 2.5rem !important;  /* px-10 */
            padding-right: 2.5rem !important; /* px-10 */
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
          }
          .services-card-title {
            font-size: 1.35rem !important;
          }
          .services-card-desc {
            font-size: 0.875rem !important;
            line-height: 1.6 !important;
          }
          .services-btn {
            font-size: 0.85rem !important;
            padding: 0.5rem 1.25rem !important;
          }
        }

        /* Large Desktop (1920px Full HD) */
        @media (min-width: 1920px) {
          .services-container {
            max-width: 1800px !important;
            padding-left: 4rem !important;   /* px-16 */
            padding-right: 4rem !important;  /* px-16 */
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
          }
          .services-card-title {
            font-size: 1.65rem !important;
          }
          .services-card-desc {
            font-size: 1rem !important;
            line-height: 1.7 !important;
          }
          .services-btn {
            font-size: 1rem !important;
            padding: 0.65rem 1.65rem !important;
          }
          .services-icon-box {
            width: 6rem !important;
            height: 6rem !important;
            border-radius: 1.25rem !important;
          }
          .services-icon-box svg {
            width: 3rem !important;
            height: 3rem !important;
          }
        }

        /* 4K Ultra-Wide Desktop (3840px) */
        @media (min-width: 3840px) {
          .services-container {
            max-width: 3200px !important;
            padding-left: 6rem !important;   /* px-24 */
            padding-right: 6rem !important;  /* px-24 */
          }
          .services-tagline {
            font-size: 1.75rem !important;
            letter-spacing: 0.35em !important;
            margin-bottom: 1.75rem !important;
          }
          .services-title {
            font-size: 5.5rem !important;
            line-height: 1.15 !important;
          }
          .services-desc {
            font-size: 2rem !important;
            line-height: 3.25rem !important;
            margin-top: 1.5rem !important;
          }
          .services-card-title {
            font-size: 2.75rem !important;
            margin-bottom: 1rem !important;
          }
          .services-card-desc {
            font-size: 1.65rem !important;
            line-height: 2.6rem !important;
          }
          .services-btn {
            font-size: 1.65rem !important;
            padding: 1rem 2.5rem !important;
            margin-top: 2rem !important;
          }
          .services-btn svg {
            width: 1.5rem !important;
            height: 1.5rem !important;
          }
          .services-icon-box {
            width: 10rem !important;
            height: 10rem !important;
            border-radius: 2rem !important;
          }
          .services-icon-box svg {
            width: 5rem !important;
            height: 5rem !important;
          }
        }
      `}</style>

      <div className="services-container w-full max-w-[1380px] mx-auto px-4 sm:px-6 min-[1440px]:px-10">
        
        {/* HEADER */}
        <div className="mb-8 sm:mb-10 lg:mb-12 w-full text-left">
          <p
            style={{ fontFamily: "'Inter', sans-serif" }}
            className="services-tagline text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-[#0B4EA2] mb-2.5 sm:mb-3 text-left"
          >
            WHAT WE OFFER
          </p>

             <h2
            style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
            className="
              team-title
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
          Complete Business{" "}
            <span className="text-[#0B4EA2]">
      Solutions
            </span>
          </h2>

          {/* SPREAD 100% FULL WIDTH FROM LEFT CARD TO RIGHT CARD */}
          <p
            style={{ fontFamily: "'Inter', sans-serif" }}
            className="services-desc mt-3 sm:mt-4 text-slate-600 font-normal text-xs sm:text-sm lg:text-base leading-relaxed text-left w-full"
          >
            From legal registrations and financial compliance to essential
            business licenses, MegaClick delivers expert-led services with
            transparent processes and end-to-end professional support.
          </p>
        </div>

        {/* 3 SERVICES CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 min-[1920px]:gap-10 min-[3840px]:gap-16 items-stretch w-full">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <div
                key={index}
                className={`group flex flex-col justify-between rounded-3xl min-[3840px]:rounded-[40px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer bg-gradient-to-b ${service.gradient}`}
              >
                <div className="flex flex-col items-center text-center px-6 pt-8 pb-4 sm:px-7 sm:pt-9 min-[1920px]:px-8 min-[1920px]:pt-10 min-[3840px]:px-12 min-[3840px]:pt-16">
                  {/* CARD TITLE */}
                  <h3
                    style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
                    className="services-card-title text-xl sm:text-2xl font-bold text-[#0f172a] leading-snug mb-3 min-h-[56px] flex items-center justify-center text-center"
                  >
                    {service.title}
                  </h3>

                  {/* CARD DESCRIPTION */}
                  <p
                    style={{ fontFamily: "'Inter', sans-serif" }}
                    className="services-card-desc text-xs sm:text-sm text-slate-600 leading-relaxed text-center min-h-[80px]"
                  >
                    {service.short}
                  </p>

                  {/* READ MORE BUTTON */}
                  <button
                    onClick={() =>
                      navigate(`/services?category=${service.slug}`)
                    }
                    style={{ fontFamily: "'Inter', sans-serif" }}
                    className={`services-btn mt-5 inline-flex items-center justify-center gap-2 border rounded-full px-5 py-2 text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer shadow-xs ${service.btnBorder}`}
                  >
                    <span>Read More</span>
                    <ArrowRight size={15} />
                  </button>
                </div>

                {/* BOTTOM ICON CONTAINER */}
                <div className="flex items-center justify-center py-7 sm:py-8 min-[3840px]:py-14">
                  <div
                    className={`services-icon-box w-16 h-16 sm:w-20 sm:h-20 rounded-2xl ${service.iconBg} flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon
                      size={36}
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