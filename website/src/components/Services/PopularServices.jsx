import React from "react";

const popularServices = [
  { title: "Marriage Registration", icon: "💍" },
  { title: "GST Registration & Filing", icon: "🧾" },
  { title: "Trademark Registration", icon: "™️" },
  { title: "Company Registration & Annual Compliance", icon: "🏢" },
  { title: "Income Tax Services", icon: "💰" },
  { title: "MSME / UDYAM Registration", icon: "🏭" },
  { title: "Leave & Licence / Rent Agreement", icon: "🏠" },
  { title: "Digital Marketing", icon: "📢" },
  { title: "Passport Services", icon: "✈️" },
  { title: "Accounting / Audit Services", icon: "📊" },
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
    <section className="py-5 bg-slate-50/60 popular-section font-['Inter',sans-serif]">
      <style>{`
        /* Large Desktop (1920px Full HD) */
        @media (min-width: 1920px) {
          .popular-section {
            padding-top: 1.75rem !important;
            padding-bottom: 1.75rem !important;
          }
          .popular-heading {
            font-size: 1.15rem !important;
            margin-bottom: 1.25rem !important;
          }
          .popular-grid {
            gap: 1.5rem !important;
          }
          .popular-icon-box {
            width: 4.25rem !important;
            height: 4.25rem !important;
            font-size: 2rem !important;
            border-radius: 1.15rem !important;
          }
          .popular-card-title {
            font-size: 0.85rem !important;
            margin-top: 0.65rem !important;
          }
        }

        /* 4K Ultra-Wide Desktop (3840px) */
        @media (min-width: 3840px) {
          .popular-section {
            padding-top: 3.5rem !important;
            padding-bottom: 3.5rem !important;
          }
          .popular-heading {
            font-size: 1.85rem !important;
            margin-bottom: 2.25rem !important;
          }
          .popular-grid {
            gap: 2.75rem !important;
          }
          .popular-icon-box {
            width: 7.5rem !important;
            height: 7.5rem !important;
            font-size: 3.5rem !important;
            border-radius: 1.85rem !important;
          }
          .popular-card-title {
            font-size: 1.45rem !important;
            margin-top: 1.25rem !important;
          }
        }
      `}</style>

      <div className="app-container">
        <div className="mb-4 flex items-center">
          <h2
            style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
            className="popular-heading text-sm sm:text-base font-bold text-gray-800 flex items-center gap-1.5 text-left"
          >
            <span className="text-amber-500 text-base">⚡</span>
            Popular Services
          </h2>
        </div>

        <div className="popular-grid grid grid-cols-2 sm:grid-cols-5 md:grid-cols-5 gap-3 sm:gap-5">
          {popularServices.map((service, index) => (
            <div
              key={index}
              onClick={() => handleServiceClick(service.title)}
              className="group flex flex-col items-center cursor-pointer py-1"
            >
              <div className="popular-icon-box w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-white border border-gray-200/80 shadow-xs flex items-center justify-center text-xl sm:text-2xl transition-all duration-300 group-hover:scale-105 group-hover:shadow-md">
                <span className="transition-transform duration-300">{service.icon}</span>
              </div>
              <h3 className="popular-card-title mt-2 text-xs font-medium text-gray-700 text-center leading-tight">
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