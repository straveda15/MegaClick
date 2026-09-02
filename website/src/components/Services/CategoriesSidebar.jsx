import React, { useState } from "react";

const categories = [
  {
    name: "All Services",
    icon: "🌐",
    count: 36,
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
      "Character Certificate by Police",
    ],
  },
  {
    name: "Business & Financial Services",
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
      "Digital Signature Certificate (DSC)",
    ],
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
      "Liquor Consumption License",
    ],
  },
];

const serviceCategories = categories.filter((cat) => cat.name !== "All Services");

const CategoriesSidebar = ({
  selectedCategory,
  setSelectedCategory,
  setSelectedService,
  selectedService,
}) => {
  // Initialized to "" so All Services list is closed by default
  const [openCategory, setOpenCategory] = useState("");

  return (
    <aside className="cat-sidebar sticky top-24 bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 p-4 sm:p-5 w-full font-['Inter',sans-serif]">
      <style>{`
        /* Standard Desktop (1440px) */
        @media (min-width: 1440px) {
          .cat-sidebar {
            padding: 1.25rem !important;
          }
        }

        /* Large Desktop (1920px Full HD) */
        @media (min-width: 1920px) {
          .cat-sidebar {
            padding: 1.5rem !important;
            border-radius: 1.5rem !important;
          }
          .cat-header-title {
            font-size: 0.95rem !important;
          }
          .cat-btn {
            padding: 0.85rem 1rem !important;
          }
          .cat-btn-text {
            font-size: 0.95rem !important;
          }
          .cat-badge {
            font-size: 0.85rem !important;
            padding: 0.2rem 0.75rem !important;
          }
          .cat-group-header {
            font-size: 0.95rem !important;
            padding: 0.6rem 0.85rem !important;
          }
          .cat-sub-btn {
            font-size: 0.85rem !important;
            padding: 0.55rem 0.85rem !important;
          }
        }

        /* 4K Ultra-Wide Desktop (3840px) */
        @media (min-width: 3840px) {
          .cat-sidebar {
            padding: 2.5rem !important;
            border-radius: 2.25rem !important;
          }
          .cat-header-title {
            font-size: 1.45rem !important;
          }
          .cat-header-icon {
            width: 3.25rem !important;
            height: 3.25rem !important;
            font-size: 1.4rem !important;
          }
          .cat-btn {
            padding: 1.35rem 1.6rem !important;
            border-radius: 1.25rem !important;
          }
          .cat-btn-text {
            font-size: 1.45rem !important;
          }
          .cat-badge {
            font-size: 1.25rem !important;
            padding: 0.35rem 1.25rem !important;
          }
          .cat-group-header {
            font-size: 1.35rem !important;
            padding: 0.85rem 1.25rem !important;
            border-radius: 1.25rem !important;
          }
          .cat-sub-btn {
            font-size: 1.25rem !important;
            padding: 0.85rem 1.35rem !important;
            border-radius: 1rem !important;
          }
        }
      `}</style>

      {/* HEADER */}
      <div className="flex items-center gap-3 pb-3 mb-3 border-b border-slate-100">
        <div className="cat-header-icon w-8 h-8 rounded-xl bg-amber-100/70 text-amber-700 flex items-center justify-center text-sm shadow-xs">
          📁
        </div>
        <h3
          style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
          className="cat-header-title font-bold text-sm tracking-wider text-slate-800 uppercase"
        >
          Categories
        </h3>
      </div>

      {/* CATEGORY LIST */}
      <div className="space-y-1.5">
        {categories.map((category) => {
          const isSelected = selectedCategory === category.name;
          const isOpen = openCategory === category.name;
          const isAllServices = category.name === "All Services";

          return (
            <div key={category.name} className="w-full">
              {/* CATEGORY MAIN BUTTON */}
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory(category.name);
                  setSelectedService(null);
                  setOpenCategory(isOpen ? "" : category.name);
                }}
                className={`
                  cat-btn
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
                  cursor-pointer
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
                    className={`cat-btn-text text-xs sm:text-sm font-semibold leading-tight ${
                      isSelected ? "text-emerald-900 font-bold" : "text-slate-700"
                    }`}
                  >
                    {category.name}
                  </span>
                </div>

                <span
                  className={`
                    cat-badge
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

              {/* =========================================================
                  SUB-SERVICES UNDER "ALL SERVICES" (OPENS ON CLICK ONLY)
                  ========================================================= */}
              {isAllServices && isOpen && (
                <div className="my-3 ml-3 pl-3 border-l-2 border-emerald-300/70 space-y-5 transition-all">
                  {serviceCategories.map((group) => (
                    <div key={group.name} className="space-y-2">
                      
                      {/* PROMINENT HIGHLIGHTED GROUP HEADER */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCategory(group.name);
                          setSelectedService(null);
                        }}
                        className="cat-group-header w-full flex items-center justify-between bg-gradient-to-r from-emerald-50 to-blue-50/60 hover:from-emerald-100 hover:to-blue-100/70 border border-emerald-200/90 text-emerald-950 px-3 py-2 rounded-xl text-left transition-all duration-200 shadow-xs cursor-pointer group/hdr"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-sm shrink-0">{group.icon}</span>
                          <span
                            style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
                            className="font-bold text-xs sm:text-[13px] text-emerald-950 tracking-wide"
                          >
                            {group.name}
                          </span>
                        </div>
                        <span className="text-[10px] font-extrabold bg-white text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full shadow-2xs">
                          {group.count}
                        </span>
                      </button>

                      {/* SUB-SERVICES LIST */}
                      <div className="space-y-1 pl-1">
                        {group.services.map((service) => {
                          const isServiceSelected = selectedService === service;

                          return (
                            <button
                              key={service}
                              type="button"
                              onClick={() => {
                                setSelectedCategory(group.name);
                                setSelectedService(service);
                              }}
                              className={`
                                cat-sub-btn
                                w-full
                                text-left
                                px-2.5
                                py-1.5
                                rounded-lg
                                text-xs
                                font-medium
                                transition-all
                                duration-200
                                flex
                                items-center
                                gap-2
                                cursor-pointer
                                ${
                                  isServiceSelected
                                    ? "bg-emerald-100 text-emerald-950 font-bold"
                                    : "text-slate-600 hover:text-emerald-800 hover:bg-slate-50"
                                }
                              `}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                  isServiceSelected ? "bg-emerald-600 ring-2 ring-emerald-200" : "bg-slate-300"
                                }`}
                              />
                              <span className="truncate">{service}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* SUB-SERVICES UNDER SPECIFIC CATEGORY */}
              {!isAllServices && isOpen && (
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
                          cat-sub-btn
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
                          cursor-pointer
                          ${
                            isServiceSelected
                              ? "bg-emerald-100/70 text-emerald-900 font-bold"
                              : "text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/60"
                          }
                        `}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                            isServiceSelected ? "bg-emerald-600" : "bg-slate-300"
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