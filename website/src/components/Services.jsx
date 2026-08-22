import React from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Scale,
  BarChart3,
  ClipboardList,
} from "lucide-react";

// Sequence: 1. Legal  2. Business & Financial  3. Other
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
    <section className="w-full py-10 sm:py-12 lg:py-16 bg-white services-section">
      {/* UNIFIED APP-CONTAINER (EXACT MATCH WITH NAVBAR) */}
      <style>{`
        .app-container {
          width: 100%;
          max-width: 1500px;
          margin-left: auto;
          margin-right: auto;
          padding-left: 1.25rem;
          padding-right: 1.25rem;
        }

        @media (min-width: 640px) {
          .app-container {
            padding-left: 2rem;
            padding-right: 2rem;
          }
        }

        @media (min-width: 1024px) {
          .app-container {
            padding-left: 4rem;
            padding-right: 4rem;
          }
        }

        @media (min-width: 1280px) {
          .app-container {
            padding-left: 6rem;
            padding-right: 6rem;
          }
        }

        /* Standard Desktop (1440px x 900px) */
        @media (min-width: 1440px) {
          .app-container {
            max-width: 1440px !important;
            padding-left: 5rem !important;
            padding-right: 5rem !important;
          }
        }

        /* Large Desktop (1920px x 1080px Full HD) */
        @media (min-width: 1920px) {
          .app-container {
            max-width: 1800px !important;
            padding-left: 6rem !important;
            padding-right: 6rem !important;
          }
          .services-section {
            padding-top: 5rem !important;
            padding-bottom: 5rem !important;
          }
          .services-tagline {
            font-size: 0.95rem !important;
            margin-bottom: 1.25rem !important;
          }
          .services-title {
            font-size: 3.5rem !important;
            margin-bottom: 1.25rem !important;
          }
          .services-sub {
            font-size: 1.25rem !important;
            line-height: 2rem !important;
          }
          .services-grid {
            gap: 2.25rem !important;
          }
          .service-card-content {
            padding: 2.5rem 2rem 1.5rem !important;
          }
          .service-card-title {
            font-size: 1.75rem !important;
            min-height: 70px !important;
          }
          .service-card-desc {
            font-size: 1.05rem !important;
            line-height: 1.7 !important;
            min-height: 110px !important;
          }
          .service-card-btn {
            font-size: 1.05rem !important;
            padding: 0.65rem 1.75rem !important;
          }
          .service-icon-box {
            width: 6.5rem !important;
            height: 6.5rem !important;
          }
          .service-icon-svg {
            width: 3.25rem !important;
            height: 3.25rem !important;
          }
        }

        /* QHD / 2K Ultra-Wide (2560px Desktop) */
        @media (min-width: 2560px) {
          .app-container {
            max-width: 2400px !important;
            padding-left: 8rem !important;
            padding-right: 8rem !important;
          }
          .services-section {
            padding-top: 6.5rem !important;
            padding-bottom: 6.5rem !important;
          }
          .services-tagline {
            font-size: 1.2rem !important;
          }
          .services-title {
            font-size: 4.5rem !important;
          }
          .services-sub {
            font-size: 1.55rem !important;
            line-height: 2.4rem !important;
          }
          .services-grid {
            gap: 3rem !important;
          }
          .service-card-content {
            padding: 3rem 2.5rem 2rem !important;
          }
          .service-card-title {
            font-size: 2.25rem !important;
            min-height: 90px !important;
          }
          .service-card-desc {
            font-size: 1.3rem !important;
            line-height: 1.8 !important;
            min-height: 140px !important;
          }
          .service-card-btn {
            font-size: 1.3rem !important;
            padding: 0.85rem 2.25rem !important;
          }
          .service-icon-box {
            width: 8rem !important;
            height: 8rem !important;
          }
          .service-icon-svg {
            width: 4rem !important;
            height: 4rem !important;
          }
        }

        /* 4K Ultra-Wide Desktop (3840px x 2160px) */
        @media (min-width: 3840px) {
          .app-container {
            max-width: 3400px !important;
            padding-left: 10rem !important;
            padding-right: 10rem !important;
          }
          .services-section {
            padding-top: 9rem !important;
            padding-bottom: 9rem !important;
          }
          .services-tagline {
            font-size: 1.75rem !important;
            margin-bottom: 2rem !important;
          }
          .services-title {
            font-size: 6.25rem !important;
            margin-bottom: 2rem !important;
          }
          .services-sub {
            font-size: 2.25rem !important;
            line-height: 3.5rem !important;
          }
          .services-grid {
            gap: 4rem !important;
          }
          .service-card-content {
            padding: 4.5rem 3.5rem 2.5rem !important;
          }
          .service-card-title {
            font-size: 3.25rem !important;
            min-height: 130px !important;
          }
          .service-card-desc {
            font-size: 1.8rem !important;
            line-height: 1.85 !important;
            min-height: 200px !important;
          }
          .service-card-btn {
            font-size: 1.85rem !important;
            padding: 1.25rem 3.25rem !important;
            border-radius: 9999px !important;
          }
          .service-btn-icon {
            width: 1.75rem !important;
            height: 1.75rem !important;
          }
          .service-icon-box {
            width: 12rem !important;
            height: 12rem !important;
            border-radius: 2rem !important;
          }
          .service-icon-svg {
            width: 6rem !important;
            height: 6rem !important;
          }
        }
      `}</style>

      <div className="app-container">
        {/* ================= HEADING AREA ================= */}
        <div className="mb-8 sm:mb-10 lg:mb-12 w-full">
          {/* TOP TAGLINE */}
          <p className="services-tagline text-xs font-semibold tracking-[0.25em] uppercase text-[#0B4EA2] mb-3.5 sm:mb-4 text-left">
            WHAT WE OFFER
          </p>

          {/* MAIN HEADING */}
          <h2
            style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
            className="
              services-title
              text-3xl
              sm:text-3xl
              md:text-3xl
              lg:text-3xl
              xl:text-4xl
              font-bold
              leading-[1.18]
              text-black
              text-left
            "
          >
            Complete Business{" "}
            <span className="text-[#0B4EA2]">Solutions</span>
          </h2>

          {/* SUB PARAGRAPH */}
          <p className="services-sub mt-3.5 sm:mt-4 text-slate-600 font-normal text-sm sm:text-base leading-relaxed text-justify w-full">
            From legal registrations and financial compliance to essential
            business licenses, MegaClick delivers expert-led services with
            transparent processes and end-to-end professional support for
            every business need.
          </p>
        </div>

        {/* ================= SERVICE CARDS ================= */}
        <div className="services-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 items-start">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <div
                key={index}
                className={`
                  group flex flex-col
                  rounded-3xl overflow-hidden
                  border border-slate-100
                  shadow-sm hover:shadow-xl
                  transition-all duration-300
                  hover:-translate-y-2
                  cursor-pointer
                  bg-gradient-to-b ${service.gradient}
                `}
              >
                {/* ================= TOP CONTENT ================= */}
                <div className="service-card-content flex flex-col items-center text-center px-7 pt-9 pb-5">
                  {/* TITLE */}
                  <h3
                    style={{
                      fontFamily: "'Hedvig Letters Serif', serif",
                    }}
                    className="
                      service-card-title
                      text-xl
                      sm:text-2xl
                      font-bold
                      text-[#0f172a]
                      leading-snug
                      mb-3
                      min-h-[60px]
                      flex
                      items-center
                      justify-center
                    "
                  >
                    {service.title}
                  </h3>

                  {/* DESCRIPTION */}
                  <p className="service-card-desc text-sm sm:text-[15px] text-slate-500 leading-relaxed text-justify min-h-[96px]">
                    {service.short}
                  </p>

                  {/* READ MORE */}
                  <button
                    onClick={() =>
                      navigate(`/services?category=${service.slug}`)
                    }
                    className={`
                      service-card-btn
                      mt-5
                      inline-flex
                      items-center
                      gap-2
                      border
                      rounded-full
                      px-5
                      py-2
                      text-sm
                      font-semibold
                      transition-all
                      duration-200
                      ${service.btnBorder}
                    `}
                  >
                    <span>Read More</span>
                    <ArrowRight size={15} className="service-btn-icon" />
                  </button>
                </div>

                {/* ================= BOTTOM ICON ================= */}
                <div className="flex items-center justify-center py-8">
                  <div
                    className={`
                      service-icon-box
                      w-20
                      h-20
                      rounded-2xl
                      ${service.iconBg}
                      flex
                      items-center
                      justify-center
                      shadow-sm
                      group-hover:scale-110
                      transition-transform
                      duration-300
                    `}
                  >
                    <Icon
                      size={40}
                      className={`${service.iconColor} service-icon-svg`}
                      strokeWidth={1.5}
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