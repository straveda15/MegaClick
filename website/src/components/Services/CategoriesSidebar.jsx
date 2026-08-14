import React, { useState } from "react";

const categories = [
  {
    name: "All Services",
    icon: "🌐",
    count: 36,
    services: []
  },
  {
    name: "Legal Services",
    icon: "⚖️",
    count: 12,
    services: [
      "Marriage Registration",
      "Leave & Licence / Rent Agreement",
      "Tenant Police Verification",
      "Govt. Gazette – Name / DOB / Religion Change",
      "Partnership Deed (Notary & Registration of Firm)",
      "Sale Deed / Will / Gift Deed",
      "Mortgage Deed / Release Deed",
      "Title Search Report",
      "Trademark Registration",
      "Patent / Copyright Registration",
      "Digital 7/12 & Mutation Entries",
      "Character Certificate by Police"
    ]
  },
  {
    name: "Other Services",
    icon: "🏢",
    count: 12,
    services: [
      "Real Estate Services (Sell / Purchase / Rent / Lease)",
      "Name Transfer & Address Update in Light Bill",
      "Name Transfer in Property / Water Tax Bill / NMC Services",
      "All Types of Insurance",
      "Services for Start-Ups",
      "Digital Marketing",
      "MSME / UDYAM Registration",
      "Shop Act License",
      "FSSAI / Food License",
      "Passport Services",
      "Voter ID / PAN / TAN Services",
      "Liquor Consumption License"
    ]
  },
  {
    name: "Business / Financial Services",
    icon: "💼",
    count: 12,
    services: [
      "Income Tax Services",
      "GST Registration & Filing",
      "Bank Loan / Financing Consultancy",
      "Liaisoning with Govt. Offices",
      "Tender Consultancy",
      "Company Registration & Annual Compliance",
      "LLP Registration & Related Compliance",
      "Accounting / Audit Services",
      "Project Report & Financing",
      "Trust Registration & Audit",
      "Import Export Code (IEC)",
      "Digital Signature Certificate (DSC)"
    ]
  }
];

const CategoriesSidebar = ({
  selectedCategory,
  setSelectedCategory,
  setSelectedService,
  selectedService
}) => {
  const [openCategory, setOpenCategory] = useState("Legal Services");

  return (
    <aside
      className="
        sticky
        top-24
        bg-white
        rounded-3xl
        border
        border-slate-100
        shadow-xl
        shadow-slate-200/40
        p-4
        sm:p-5
        w-full
      "
    >
      {/* =================================================
          HEADER (MATCHES SCREENSHOT)
      ================================================= */}
      <div className="flex items-center gap-3 pb-3 mb-3 border-b border-slate-100">
        <div className="w-8 h-8 rounded-xl bg-amber-100/70 text-amber-700 flex items-center justify-center text-sm shadow-xs">
          📁
        </div>
        <h3 className="font-extrabold text-xs tracking-wider text-slate-800 uppercase">
          Categories
        </h3>
      </div>

      {/* =================================================
          CATEGORY LIST
      ================================================= */}
      <div className="space-y-1.5">
        {categories.map((category) => {
          const isSelected = selectedCategory === category.name;
          const isOpen = openCategory === category.name;

          return (
            <div key={category.name} className="w-full">
              
              {/* CATEGORY BUTTON */}
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory(category.name);
                  setSelectedService(null);

                  if (category.name !== "All Services") {
                    setOpenCategory(isOpen ? "" : category.name);
                  } else {
                    setOpenCategory("");
                  }
                }}
                className={`
                  w-full
                  flex
                  items-center
                  justify-between
                  px-3.5
                  py-3
                  rounded-2xl
                  transition-all
                  duration-200
                  text-left
                  ${
                    isSelected
                      ? "bg-emerald-50/80 border border-emerald-300/80 text-emerald-900 shadow-xs"
                      : "bg-transparent hover:bg-slate-50 border border-transparent text-slate-700"
                  }
                `}
              >
                <div className="flex items-center gap-3 pr-2">
                  <span className="text-lg shrink-0">{category.icon}</span>
                  <span
                    className={`text-xs sm:text-sm font-bold leading-tight ${
                      isSelected ? "text-emerald-900" : "text-slate-700"
                    }`}
                  >
                    {category.name}
                  </span>
                </div>

                {/* COUNT BADGE */}
                <span
                  className={`
                    text-xs
                    px-2.5
                    py-0.5
                    rounded-full
                    font-bold
                    shrink-0
                    transition-colors
                    ${
                      isSelected
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-500"
                    }
                  `}
                >
                  {category.count}
                </span>
              </button>

              {/* =================================================
                  SUB SERVICES DROPDOWN
              ================================================= */}
              {category.name !== "All Services" && isOpen && (
                <div className="my-2 ml-4 pl-3 border-l-2 border-emerald-300 space-y-1 transition-all">
                  {category.services.map((service) => {
                    const isServiceSelected = selectedService === service;

                    return (
                      <button
                        key={service}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(category.name);
                          setSelectedService(service);
                        }}
                        className={`
                          w-full
                          text-left
                          px-3
                          py-2
                          rounded-xl
                          text-xs
                          font-medium
                          transition-all
                          duration-200
                          flex
                          items-center
                          gap-2
                          ${
                            isServiceSelected
                              ? "bg-emerald-100/70 text-emerald-900 font-bold"
                              : "text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/60"
                          }
                        `}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            isServiceSelected
                              ? "bg-emerald-600"
                              : "bg-slate-300"
                          }`}
                        />
                        <span>{service}</span>
                      </button>
                    );
                  })}
                </div>
              )}

            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default CategoriesSidebar;