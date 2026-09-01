import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Scale, BarChart3, ClipboardList } from "lucide-react";

const services = [
  {
    title: "Legal Services",
    slug: "legal-services",
    icon: Scale,
    short: "Expert legal documentation, company registrations and compliance management tailored to protect and grow your business with full regulatory confidence.",
    gradient: "from-white via-blue-50 to-blue-200",
    iconBg: "bg-blue-100",
    iconColor: "text-[#0B4EA2]",
    btnBorder: "border-[#0B4EA2] text-[#0B4EA2] hover:bg-[#0B4EA2] hover:text-white",
  },
  {
    title: "Business & Financial Services",
    slug: "business-financial-services",
    icon: BarChart3,
    short: "End-to-end taxation, accounting and financial planning solutions designed to streamline your operations and drive sustainable long-term business growth.",
    gradient: "from-white via-purple-50 to-purple-200",
    iconBg: "bg-purple-100",
    iconColor: "text-purple-600",
    btnBorder: "border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white",
  },
  {
    title: "Other Services",
    slug: "other-services",
    icon: ClipboardList,
    short: "Comprehensive support for licenses, MSME registrations and all essential business requirements handled with speed, accuracy and complete transparency.",
    gradient: "from-white via-emerald-50 to-emerald-200",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    btnBorder: "border-emerald-500 text-emerald-600 hover:bg-emerald-500 hover:text-white",
  },
];

const Services = () => {
  const navigate = useNavigate();

  return (
    <section className="w-full py-8 sm:py-12 min-[1440px]:py-16 min-[1920px]:py-20 min-[3840px]:py-32 bg-white font-['Inter',sans-serif]">
      <div className="w-full max-w-[1380px] min-[1920px]:max-w-[1800px] min-[3840px]:max-w-[3200px] mx-auto px-4 sm:px-6 min-[1440px]:px-10 min-[1920px]:px-16 min-[3840px]:px-24">
        
        <div className="mb-8 sm:mb-10 lg:mb-12 w-full">
          <p className="text-xs sm:text-sm min-[3840px]:text-2xl font-semibold tracking-[0.25em] uppercase text-[#0B4EA2] mb-3.5 sm:mb-4 text-left">
            WHAT WE OFFER
          </p>

          <h2
            style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
            className="text-3xl sm:text-4xl min-[1920px]:text-5xl min-[3840px]:text-7xl font-bold leading-[1.18] text-black text-left"
          >
            Complete Business <span className="text-[#0B4EA2]">Solutions</span>
          </h2>

          <p className="mt-3.5 sm:mt-4 text-slate-600 font-normal text-sm sm:text-base min-[1920px]:text-lg min-[3840px]:text-2xl leading-relaxed text-justify w-full">
            From legal registrations and financial compliance to essential business licenses, MegaClick delivers expert-led services with transparent processes and end-to-end professional support.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 min-[1920px]:gap-10 min-[3840px]:gap-16 items-start">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <div
                key={index}
                className={`group flex flex-col rounded-3xl min-[3840px]:rounded-[44px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer bg-gradient-to-b ${service.gradient}`}
              >
                <div className="flex flex-col items-center text-center px-7 pt-9 pb-5 min-[1920px]:px-8 min-[1920px]:pt-12 min-[3840px]:px-14 min-[3840px]:pt-20">
                  <h3
                    style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
                    className="text-xl sm:text-2xl min-[1920px]:text-3xl min-[3840px]:text-5xl font-bold text-[#0f172a] leading-snug mb-3 min-h-[60px] flex items-center justify-center"
                  >
                    {service.title}
                  </h3>

                  <p className="text-sm sm:text-[15px] min-[1920px]:text-base min-[3840px]:text-2xl text-slate-600 leading-relaxed text-justify min-h-[96px]">
                    {service.short}
                  </p>

                  <button
                    onClick={() => navigate(`/services?category=${service.slug}`)}
                    className={`mt-5 min-[3840px]:mt-10 inline-flex items-center gap-2 border rounded-full px-5 py-2 min-[3840px]:px-10 min-[3840px]:py-4 text-sm min-[1920px]:text-base min-[3840px]:text-2xl font-semibold transition-all duration-200 ${service.btnBorder}`}
                  >
                    <span>Read More</span>
                    <ArrowRight size={15} className="min-[3840px]:w-6 min-[3840px]:h-6" />
                  </button>
                </div>

                <div className="flex items-center justify-center py-8 min-[3840px]:py-16">
                  <div className={`w-20 h-20 min-[1920px]:w-24 min-[1920px]:h-24 min-[3840px]:w-40 min-[3840px]:h-40 rounded-2xl min-[3840px]:rounded-3xl ${service.iconBg} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={40} className={`${service.iconColor} min-[1920px]:w-12 min-[1920px]:h-12 min-[3840px]:w-24 min-[3840px]:h-24`} strokeWidth={1.5} />
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