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
    <section className="w-full py-10 sm:py-12 lg:py-16 bg-white">
      <div className="max-w-[1450px] mx-auto px-4 sm:px-8 lg:px-16 xl:px-20">

        {/* ================= HEADING AREA ================= */}
        <div className="mb-8 sm:mb-10 lg:mb-12 w-full">

          {/* ====================== TOP TAGLINE ====================== */}
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-[#0B4EA2] mb-3.5 sm:mb-4 text-left">
            WHAT WE OFFER
          </p>

          {/* MAIN HEADING */}
          <h2
            className="text-2xl sm:text-3xl lg:text-[40px] font-normal text-[#0f172a] leading-tight"
            style={{
              fontFamily: '"Hedvig Letters Serif", Georgia, serif',
              fontWeight: 400,
            }}
          >
            Complete Business <span className="text-[#0B4EA2]">Solutions</span>
          </h2>

          {/* SUB PARAGRAPH — full width spread, justified */}
          <p className="mt-3.5 sm:mt-4 text-slate-600 font-normal text-sm sm:text-base leading-relaxed text-justify w-full">
            From legal registrations and financial compliance to essential business
            licenses, MegaClick delivers expert-led services with transparent
            processes and end-to-end professional support for every business need.
          </p>
        </div>

        {/* ================= SERVICE CARDS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 items-start">
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
                {/* ── TOP: Text Content ── */}
                <div className="flex flex-col items-center text-center px-7 pt-9 pb-5">

                  {/* TITLE */}
                  <h3 className="text-xl sm:text-2xl font-bold text-[#0f172a] leading-snug mb-3 min-h-[60px] flex items-center justify-center">
                    {service.title}
                  </h3>

                  {/* DESCRIPTION */}
                  <p className="text-sm sm:text-[15px] text-slate-500 leading-relaxed text-justify min-h-[96px]">
                    {service.short}
                  </p>

                  {/* READ MORE BUTTON */}
                  <button
                    onClick={() => navigate("/services")}
                    className={`
                      mt-5 inline-flex items-center gap-2
                      border rounded-full
                      px-5 py-2
                      text-sm font-semibold
                      transition-all duration-200
                      ${service.btnBorder}
                    `}
                  >
                    Read More <ArrowRight size={15} />
                  </button>
                </div>

                {/* ── BOTTOM: Large Icon on Gradient ── */}
                <div className="flex items-center justify-center py-8">
                  <div
                    className={`
                      w-20 h-20 rounded-2xl
                      ${service.iconBg}
                      flex items-center justify-center
                      shadow-sm
                      group-hover:scale-110
                      transition-transform duration-300
                    `}
                  >
                    <Icon size={40} className={service.iconColor} strokeWidth={1.5} />
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