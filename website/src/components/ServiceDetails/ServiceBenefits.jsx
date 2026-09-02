import React from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";

const ServiceBenefits = ({ service }) => {
  if (!service?.benefits?.length) return null;

  return (
    <section className="w-full bg-white overflow-hidden font-['Inter',sans-serif]">
      <style>{`
        @media (min-width: 1920px) {
          .sb-container { max-width: 1800px !important; padding-left: 4rem !important; padding-right: 4rem !important; }
          .sb-heading   { font-size: 3rem !important; }
          .sb-benefit-text { font-size: 1.1rem !important; }
        }
        @media (min-width: 3840px) {
          .sb-container { max-width: 3200px !important; padding-left: 6rem !important; padding-right: 6rem !important; }
          .sb-heading   { font-size: 5rem !important; }
          .sb-benefit-text { font-size: 2rem !important; }
          .sb-benefit-num  { font-size: 1.5rem !important; }
        }
      `}</style>

      <div
        className="
          sb-container
          max-w-[1380px] mx-auto
          px-4 sm:px-6 min-[1440px]:px-10
          py-12 sm:py-16 lg:py-20
          min-[1920px]:py-24 min-[3840px]:py-36
        "
      >
        {/* HEADER */}
        <div className="mb-10 sm:mb-12 min-[1920px]:mb-16">
          

          <h2
            style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
            className="
              sb-heading
              text-2xl sm:text-3xl lg:text-4xl
              font-bold text-gray-900 leading-tight mt-1
            "
          >
            Why Choose{" "}
            <span className="text-[#0B4EA2]">Our Services?</span>
          </h2>

          <p
            style={{ fontFamily: "'Inter', sans-serif" }}
            className="
              mt-3 max-w-2xl
              text-sm sm:text-base min-[1920px]:text-lg min-[3840px]:text-2xl
              text-gray-500 leading-relaxed
            "
          >
            Key benefits you receive with our service, designed to make the entire process simple, fast, and reliable.
          </p>
        </div>

        {/* BENEFITS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 min-[1920px]:gap-8 min-[3840px]:gap-12">
          {service.benefits.map((item, index) => (
            <div
              key={index}
              className="
                group relative
                flex items-center justify-between gap-4
                pl-5 pr-4
                py-4 sm:py-5 min-[1920px]:py-6 min-[3840px]:py-10
                bg-slate-100 border border-slate-200/60
                hover:bg-[#F0F6FF] hover:border-blue-200/80
                border-l-4 border-l-gray-400 hover:border-l-[#0B4EA2]
                rounded-r-2xl
                transition-all duration-300 cursor-pointer
              "
            >
              <div className="flex items-center gap-3.5">
                <span
                  style={{ fontFamily: "'Inter', sans-serif" }}
                  className="
                    sb-benefit-num
                    text-xs sm:text-sm
                    font-extrabold text-gray-500
                    group-hover:text-[#0B4EA2] transition-colors
                  "
                >
                  {String(index + 1).padStart(2, "0")}.
                </span>
                <p
                  style={{ fontFamily: "'Inter', sans-serif" }}
                  className="
                    sb-benefit-text
                    text-sm sm:text-base
                    font-bold text-gray-800
                    group-hover:text-gray-950 transition-colors leading-snug
                  "
                >
                  {item}
                </p>
              </div>
              <div className="shrink-0 text-gray-400 group-hover:text-[#0B4EA2] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 pr-1">
                <ArrowUpRight size={18} strokeWidth={2.5} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceBenefits;