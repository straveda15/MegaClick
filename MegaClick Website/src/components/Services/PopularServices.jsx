import React from "react";

// =================================================
// POPULAR SERVICES (EXACT TITLES MATCHING SERVICE CATEGORIES)
// =================================================
const popularServices = [
  {
    title: "Marriage Registration",
    icon: "💍",
  },
  {
    title: "GST Registration & Filing",
    icon: "🧾",
  },
  {
    title: "Trademark Registration",
    icon: "™️",
  },
  {
    title: "Company Registration & Annual Compliance",
    icon: "🏢",
  },
  {
    title: "Income Tax Services",
    icon: "💰",
  },
  {
    title: "MSME / UDYAM Registration",
    icon: "🏭",
  },
  {
    title: "Leave & Licence / Rent Agreement",
    icon: "🏠",
  },
  {
    title: "Digital Marketing",
    icon: "📢",
  },
  {
    title: "Passport Services",
    icon: "✈️",
  },
  {
    title: "Accounting / Audit Services",
    icon: "📊",
  },
];

const PopularServices = ({ onSelectService }) => {
  const handleServiceClick = (serviceTitle) => {
    // 1. Trigger service filter in parent component
    if (onSelectService) {
      onSelectService(serviceTitle);
    }

    // 2. Smoothly scroll down to the main services section
    const servicesSection = document.getElementById("services-section");
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-5 bg-slate-50/60">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-8 lg:px-16 xl:px-24">
        
        {/* HEADING */}
        <div className="mb-4 flex items-center">
          <h2 className="text-sm sm:text-base font-bold text-gray-800 flex items-center gap-1.5">
            <span className="text-amber-500 text-base">⚡</span>
            Popular Services
          </h2>
        </div>

        {/* SERVICES GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-5 md:grid-cols-5 gap-3 sm:gap-5">
          {popularServices.map((service, index) => (
            <div
              key={index}
              onClick={() => handleServiceClick(service.title)}
              className="group flex flex-col items-center cursor-pointer py-1"
            >
              {/* ICON BOX */}
              <div
                className="
                  w-12
                  h-12
                  sm:w-14
                  sm:h-14
                  rounded-xl
                  sm:rounded-2xl
                  bg-white
                  border
                  border-gray-200/80
                  shadow-xs
                  flex
                  items-center
                  justify-center
                  text-xl
                  sm:text-2xl
                  transition-all
                  duration-300
                  group-hover:scale-105
                  group-hover:shadow-md
                "
              >
                <span className="transition-transform duration-300">
                  {service.icon}
                </span>
              </div>

              {/* TITLE TEXT BELOW */}
              <h3
                className="
                  mt-2
                  text-xs
                  font-medium
                  text-gray-700
                  text-center
                  leading-tight
                "
              >
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