import React from "react";

const serviceFeatures = [
  { icon: "💯", title: "Service Guaranteed", subtitle: "100% Refund" },
  { icon: "⏱️", title: "Apply in 2 Minutes", subtitle: "Hassle Free Process through WhatsApp" },
  { icon: "🔐", title: "Safe and Secure", subtitle: "Cashfree Payment Gateway" },
];

const ServiceOverview = ({ service }) => {
  if (!service) return null;

  // Helper to color the first part in black and the last word in blue (#0B4EA2)
  const renderStyledTitle = (title) => {
    if (!title) return null;
    const words = title.trim().split(" ");
    if (words.length <= 1) {
      return <span className="text-[#0B4EA2]">{title}</span>;
    }
    const lastWord = words.pop();
    const firstPart = words.join(" ");
    return (
      <>
        <span className="text-black">{firstPart} </span>
        <span className="text-[#0B4EA2]">{lastWord}</span>
      </>
    );
  };

  return (
    <section className="w-full bg-white font-['Inter',sans-serif] py-8 sm:py-10 lg:py-12">
      {/* GOOGLE FONTS */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hedvig+Letters+Serif:opsz@12..24&family=Inter:wght@400;500;600;700&display=swap');

        @media (min-width: 1920px) {
          .so-container  { max-width: 1800px !important; padding-left: 4rem !important; padding-right: 4rem !important; }
          .so-heading    { font-size: 3rem !important; }
          .so-desc       { font-size: 1.2rem !important; }
          .so-card-icon  { width: 3.5rem !important; height: 3.5rem !important; font-size: 1.75rem !important; }
          .so-card-title { font-size: 1.1rem !important; }
          .so-card-sub   { font-size: 1rem !important; }
        }
        @media (min-width: 3840px) {
          .so-container  { max-width: 3200px !important; padding-left: 6rem !important; padding-right: 6rem !important; }
          .so-heading    { font-size: 5rem !important; }
          .so-desc       { font-size: 2rem !important; line-height: 3rem !important; }
          .so-card-icon  { width: 6rem !important; height: 6rem !important; font-size: 3rem !important; border-radius: 1.25rem !important; }
          .so-card-title { font-size: 2rem !important; }
          .so-card-sub   { font-size: 1.5rem !important; }
        }
      `}</style>

      <div
        className="
          so-container
          max-w-[1380px] mx-auto
          px-4 sm:px-6 min-[1440px]:px-10
        "
      >
        {/* =========================================
            OVERVIEW HEADING & DESCRIPTION (Centered in Middle with Black & Blue text)
        ========================================== */}
        <div className="w-full text-center mb-8 sm:mb-10">
          <h2
            style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
            className="
              so-heading
              text-2xl
              sm:text-3xl
              md:text-3xl
              lg:text-4xl
              font-bold
              leading-[1.18]
              text-center
              mb-2.5
              sm:mb-4
            "
          >
            {renderStyledTitle(service.title)}
          </h2>

          {service.description && (
            <p
              style={{ fontFamily: "'Inter', sans-serif" }}
              className="
                so-desc
                mt-3 sm:mt-4 mx-auto max-w-4xl
                text-sm
                sm:text-base
                text-gray-500
                font-normal
                leading-relaxed
                text-center
              "
            >
              {service.description}
            </p>
          )}
        </div>

        {/* =========================================
            FEATURE CARDS
        ========================================== */}
        <div
          className="
            mt-6 sm:mt-8 min-[1920px]:mt-14 min-[3840px]:mt-20
            grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3
            gap-4 lg:gap-6 min-[1920px]:gap-8 min-[3840px]:gap-14
          "
        >
          {serviceFeatures.map((feature, index) => (
            <div
              key={index}
              className="
                group relative overflow-hidden
                flex items-center gap-4
                rounded-2xl border border-gray-100
                bg-green-100
                px-5 py-4 sm:px-6 sm:py-5
                min-[1920px]:px-8 min-[1920px]:py-6
                min-[3840px]:px-12 min-[3840px]:py-10
                transition-all duration-300
                hover:-translate-y-1 hover:border-[#0B4EA2]/20
                hover:shadow-[0_10px_30px_rgba(11,78,162,0.08)]
              "
            >
              {/* Green left strip */}
              <span className="absolute left-0 top-0 bottom-0 w-1 bg-green-600 transition-all duration-300 group-hover:w-1.5" />

              {/* Icon */}
              <div
                className="
                  so-card-icon
                  flex h-12 w-12 shrink-0 items-center justify-center
                  rounded-xl bg-white text-2xl
                  shadow-sm border border-gray-100
                  transition-transform duration-300 group-hover:scale-105
                "
              >
                {feature.icon}
              </div>

              {/* Text */}
              <div className="text-left">
                <h3
                  style={{ fontFamily: "'Inter', sans-serif" }}
                  className="so-card-title text-sm sm:text-base font-bold text-gray-900"
                >
                  {feature.title}
                </h3>
                <p
                  style={{ fontFamily: "'Inter', sans-serif" }}
                  className="so-card-sub mt-1 text-xs sm:text-sm leading-5 text-gray-500"
                >
                  {feature.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceOverview;