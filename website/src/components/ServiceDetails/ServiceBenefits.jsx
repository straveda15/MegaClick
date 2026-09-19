
import React from "react";
import {
  Scale,
  BarChart3,
  ClipboardCheck,
  ShieldCheck,
  Zap,
  Headphones,
} from "lucide-react";

// 6 Distinct Cards
const benefitsList = [
  {
    title: "Legal Accuracy",
    bgGradient:
      "bg-gradient-to-b from-white via-blue-50/40 to-[#DBEAFE]/80",
    border: "border-blue-100 hover:border-blue-300",
    iconBg: "bg-white border-blue-100 shadow-sm",
    titleHover: "group-hover:text-blue-600",
    icon: (
      <Scale
        className="w-8 h-8 sm:w-9 sm:h-9 text-blue-600"
        strokeWidth={2.2}
      />
    ),
  },
  {
    title: "Financial Guidance",
    bgGradient:
      "bg-gradient-to-b from-white via-purple-50/40 to-[#F3E8FF]/80",
    border: "border-purple-100 hover:border-purple-300",
    iconBg: "bg-white border-purple-100 shadow-sm",
    titleHover: "group-hover:text-purple-600",
    icon: (
      <BarChart3
        className="w-8 h-8 sm:w-9 sm:h-9 text-purple-600"
        strokeWidth={2.2}
      />
    ),
  },
  {
    title: "Govt Approvals",
    bgGradient:
      "bg-gradient-to-b from-white via-emerald-50/40 to-[#DCFCE7]/80",
    border: "border-emerald-100 hover:border-emerald-300",
    iconBg: "bg-white border-emerald-100 shadow-sm",
    titleHover: "group-hover:text-emerald-600",
    icon: (
      <ClipboardCheck
        className="w-8 h-8 sm:w-9 sm:h-9 text-emerald-600"
        strokeWidth={2.2}
      />
    ),
  },
  {
    title: "Data Security",
    bgGradient:
      "bg-gradient-to-b from-white via-amber-50/40 to-[#FEF3C7]/80",
    border: "border-amber-100 hover:border-amber-300",
    iconBg: "bg-white border-amber-100 shadow-sm",
    titleHover: "group-hover:text-amber-600",
    icon: (
      <ShieldCheck
        className="w-8 h-8 sm:w-9 sm:h-9 text-amber-600"
        strokeWidth={2.2}
      />
    ),
  },
  {
    title: "Express Process",
    bgGradient:
      "bg-gradient-to-b from-white via-rose-50/40 to-[#FFE4E6]/80",
    border: "border-rose-100 hover:border-rose-300",
    iconBg: "bg-white border-rose-100 shadow-sm",
    titleHover: "group-hover:text-rose-600",
    icon: (
      <Zap
        className="w-8 h-8 sm:w-9 sm:h-9 text-rose-500"
        strokeWidth={2.2}
      />
    ),
  },
  {
    title: "24/7 Support",
    bgGradient:
      "bg-gradient-to-b from-white via-cyan-50/40 to-[#CFFAFE]/80",
    border: "border-cyan-100 hover:border-cyan-300",
    iconBg: "bg-white border-cyan-100 shadow-sm",
    titleHover: "group-hover:text-cyan-600",
    icon: (
      <Headphones
        className="w-8 h-8 sm:w-9 sm:h-9 text-cyan-600"
        strokeWidth={2.2}
      />
    ),
  },
];

const ServiceBenefits = ({ service }) => {
  return (
    <section className="w-full bg-white font-['Inter',sans-serif] py-8 sm:py-10 lg:py-12">
      {/* GOOGLE FONTS + RESPONSIVE */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

        /* 1440px - Same as Services.jsx */
        @media (min-width: 1440px) {
          .sb-container {
            max-width: 1380px !important;
            padding-left: 2.5rem !important;
            padding-right: 2.5rem !important;
          }

          .sb-heading {
            font-size: 2.5rem !important;
            line-height: 1.2 !important;
          }

          .sb-desc {
            font-size: 0.95rem !important;
            line-height: 1.65 !important;
          }

          .sb-grid {
            gap: 1.5rem !important;
          }

          .sb-card {
            padding: 1.5rem !important;
            min-height: 175px !important;
          }

          .sb-card-title {
            font-size: 1.15rem !important;
          }

          .sb-card-icon {
            width: 3.75rem !important;
            height: 3.75rem !important;
          }

          .sb-card-icon svg {
            width: 1.75rem !important;
            height: 1.75rem !important;
          }
        }

        /* 1920px - Same as Services.jsx */
        @media (min-width: 1920px) {
          .sb-container {
            max-width: 1800px !important;
            padding-left: 4rem !important;
            padding-right: 4rem !important;
          }

          .sb-heading {
            font-size: 3.25rem !important;
            line-height: 1.18 !important;
          }

          .sb-desc {
            font-size: 1.15rem !important;
            line-height: 1.8 !important;
          }

          .sb-grid {
            gap: 2rem !important;
          }

          .sb-card {
            padding: 2rem !important;
            min-height: 210px !important;
            border-radius: 1.5rem !important;
          }

          .sb-card-title {
            font-size: 1.4rem !important;
          }

          .sb-card-icon {
            width: 4rem !important;
            height: 4rem !important;
            border-radius: 1.1rem !important;
          }

          .sb-card-icon svg {
            width: 2rem !important;
            height: 2rem !important;
          }
        }

        /* 2560px */
        @media (min-width: 2560px) {
          .sb-container {
            max-width: 2300px !important;
            padding-left: 5rem !important;
            padding-right: 5rem !important;
          }

          .sb-heading {
            font-size: 3.75rem !important;
            line-height: 1.18 !important;
          }

          .sb-desc {
            font-size: 1.35rem !important;
            line-height: 1.8 !important;
          }

          .sb-grid {
            gap: 2.5rem !important;
          }

          .sb-card {
            padding: 2.5rem !important;
            min-height: 240px !important;
            border-radius: 1.75rem !important;
          }

          .sb-card-title {
            font-size: 1.7rem !important;
          }

          .sb-card-icon {
            width: 4.5rem !important;
            height: 4.5rem !important;
          }

          .sb-card-icon svg {
            width: 2.15rem !important;
            height: 2.15rem !important;
          }
        }

        /* 3840px - Same as Services.jsx */
        @media (min-width: 3840px) {
          .sb-container {
            max-width: 3200px !important;
            padding-left: 6rem !important;
            padding-right: 6rem !important;
          }

          .sb-heading {
            font-size: 5rem !important;
            line-height: 1.15 !important;
          }

          .sb-desc {
            font-size: 1.75rem !important;
            line-height: 1.8 !important;
          }

          .sb-grid {
            gap: 3rem !important;
          }

          .sb-card {
            padding: 3rem !important;
            min-height: 300px !important;
            border-radius: 2rem !important;
          }

          .sb-card-title {
            font-size: 2.25rem !important;
          }

          .sb-card-icon {
            width: 5rem !important;
            height: 5rem !important;
            border-radius: 1.35rem !important;
          }

          .sb-card-icon svg {
            width: 2.25rem !important;
            height: 2.25rem !important;
          }
        }
      `}</style>

      <div
        className="
          sb-container
          max-w-[1380px]
          mx-auto
          px-4 sm:px-6 min-[1440px]:px-10
        "
      >
        {/* HEADER */}
        <div className="mb-6 sm:mb-8 text-left">
          <p
            style={{ fontFamily: "'Inter', sans-serif" }}
            className="
              text-xs sm:text-sm
              font-semibold text-[#0B4EA2]
              uppercase tracking-[0.15em]
              mb-1.5
              text-left
            "
          >
            Key Advantages
          </p>

          <h2
            style={{ fontFamily: "'Poppins', serif" }}
            className="
              sb-heading
              text-2xl
              sm:text-3xl
              md:text-3xl
              lg:text-4xl
              font-bold
              leading-[1.18]
              text-black
              text-left
              mb-2 sm:mb-2.5
            "
          >
            Why Choose{" "}
            <span className="text-[#0B4EA2]">Our Services?</span>
          </h2>

          <p
            style={{ fontFamily: "'Inter', sans-serif" }}
            className="
              sb-desc
              text-xs sm:text-sm
              text-gray-500
              max-w-3xl
              text-left
              font-normal
              leading-relaxed
            "
          >
            Experience hassle-free business compliance, guaranteed transparent
            guidance, and dedicated support.
          </p>
        </div>

        {/* BENEFITS */}
        <div
          className="
            sb-grid
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            gap-5
            lg:gap-6
          "
        >
          {benefitsList.map((item, index) => (
            <div
              key={index}
              className="
                group
                relative
                h-[145px]
                sm:h-[155px]
                [perspective:1200px]
              "
            >
              {/* Back Paper */}
              <div
                className={`
                  absolute
                  inset-0
                  translate-x-2
                  translate-y-3
                  rounded-[24px]
                  border
                  ${item.border}
                  ${item.bgGradient}
                  opacity-50
                  transition-all
                  duration-500
                  group-hover:translate-x-4
                  group-hover:translate-y-5
                `}
              />

              {/* Middle Paper */}
              <div
                className={`
                  absolute
                  inset-0
                  translate-x-1
                  translate-y-1.5
                  rounded-[24px]
                  border
                  ${item.border}
                  ${item.bgGradient}
                  opacity-80
                  transition-all
                  duration-500
                  group-hover:translate-x-2
                  group-hover:translate-y-3
                `}
              />

              {/* Main Paper */}
              <div
                className={`
                  sb-card
                  relative
                  z-10
                  h-full
                  overflow-hidden
                  rounded-[24px]
                  border
                  ${item.border}
                  ${item.bgGradient}
                  p-3 sm:p-4
                  shadow-[0_8px_25px_rgba(15,23,42,0.07)]
                  transition-all
                  duration-500
                  group-hover:-translate-y-3
                  group-hover:shadow-[0_20px_40px_rgba(15,23,42,0.14)]
                `}
              >
                {/* Top number */}
                <div
                  className="
                    absolute
                    right-5
                    top-4
                    text-xs
                    font-semibold
                    tracking-[0.18em]
                    text-slate-400
                  "
                >
                  0{index + 1}
                </div>

                {/* Content */}
                <div className="relative z-10 flex h-full flex-col">

                  {/* Icon */}
                  <div
                    className={`
                      sb-card-icon
                      w-10 h-10
                      sm:w-12 sm:h-12
                      rounded-lg
                      ${item.iconBg}
                      border
                      flex
                      items-center
                      justify-center
                      shadow-sm
                      transition-all
                      duration-500
                      group-hover:scale-110
                      group-hover:rotate-[-4deg]
                    `}
                  >
                    {item.icon}
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontFamily: "'Poppins', serif",
                    }}
                    className={`
                      sb-card-title
                      mt-auto
                      pr-8
                      text-sm
                      sm:text-base
                      font-bold
                      text-slate-900
                      ${item.titleHover}
                      transition-colors
                      duration-300
                      leading-snug
                    `}
                  >
                    {item.title}
                  </h3>
                </div>

                {/* Bottom paper edge */}
                <div
                  className="
                    absolute
                    bottom-0
                    left-0
                    right-0
                    h-1
                    bg-white/60
                    opacity-0
                    transition-opacity
                    duration-500
                    group-hover:opacity-100
                  "
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceBenefits;
