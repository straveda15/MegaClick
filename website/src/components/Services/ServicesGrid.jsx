import React, { useState, useMemo } from "react";
import ServiceCard from "./ServiceCard";
import { ChevronDown } from "lucide-react";

const ServicesGrid = ({
  categoriesData = [],
  services = [],
  searchTerm = "",
  selectedCategory = "All Services",
  selectedService = null,
}) => {
  const [openCategories, setOpenCategories] = useState({});

  const categoriesList = useMemo(() => {
    if (Array.isArray(categoriesData) && categoriesData.length > 0) {
      return categoriesData;
    }
    if (Array.isArray(services) && services.length > 0) {
      const grouped = services.reduce((acc, service) => {
        const catName =
          typeof service === "string"
            ? "Legal Services"
            : service.category || "Other Services";

        if (!acc[catName]) {
          acc[catName] = { title: catName, emoji: "📋", services: [] };
        }
        acc[catName].services.push(
          typeof service === "string"
            ? { title: service, category: catName }
            : service
        );
        return acc;
      }, {});
      return Object.values(grouped);
    }
    return [];
  }, [categoriesData, services]);

  const toggleCategory = (catTitle) => {
    setOpenCategories((prev) => ({
      ...prev,
      [catTitle]: prev[catTitle] === undefined ? false : !prev[catTitle],
    }));
  };

  const isCategoryOpen = (catTitle) => {
    return openCategories[catTitle] !== false;
  };

  const displayedCategories = useMemo(() => {
    let list = categoriesList;

    if (selectedCategory && selectedCategory !== "All Services") {
      list = list.filter(
        (cat) =>
          cat.title.toLowerCase().trim() ===
          selectedCategory.toLowerCase().trim()
      );
    }

    return list
      .map((cat) => {
        const filteredSubs = (cat.services || []).filter((s) => {
          const sTitle = typeof s === "string" ? s : s.title;

          const matchesService = selectedService
            ? sTitle.toLowerCase().trim() ===
              selectedService.toLowerCase().trim()
            : true;

          const matchesSearch = searchTerm.trim()
            ? sTitle.toLowerCase().includes(searchTerm.toLowerCase().trim())
            : true;

          return matchesService && matchesSearch;
        });

        return { ...cat, services: filteredSubs };
      })
      .filter((cat) => cat.services.length > 0);
  }, [categoriesList, selectedCategory, selectedService, searchTerm]);

  const totalFilteredServicesCount = displayedCategories.reduce(
    (acc, cat) => acc + (cat.services ? cat.services.length : 0),
    0
  );
  const totalDisplayedCategoriesCount = displayedCategories.length;

  return (
    <div className="space-y-6 font-['Inter',sans-serif]">
      {/* GOOGLE FONTS */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hedvig+Letters+Serif:opsz@12..24&family=Inter:wght@400;500;600;700&display=swap');

        /* Large Desktop (1920px Full HD) */
        @media (min-width: 1920px) {
          .grid-summary-bar { font-size: 1rem !important; padding: 1.1rem 1.5rem !important; }
          .grid-category-title { font-size: 1.35rem !important; }
          .grid-category-badge { font-size: 0.95rem !important; padding: 0.45rem 1rem !important; }
        }

        /* 4K Ultra-Wide (3840px) */
        @media (min-width: 3840px) {
          .grid-summary-bar { font-size: 1.5rem !important; padding: 1.75rem 2.25rem !important; border-radius: 1.5rem !important; }
          .grid-category-title { font-size: 2.25rem !important; }
          .grid-category-badge { font-size: 1.35rem !important; padding: 0.75rem 1.6rem !important; }
        }
      `}</style>

      {/* TOP SUMMARY BAR */}
      <div className="grid-summary-bar bg-white border border-gray-200/80 rounded-2xl px-5 py-3.5 shadow-xs text-xs sm:text-sm text-gray-600 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
        <div>
          <span className="font-bold text-gray-900">{totalFilteredServicesCount}</span> services across{" "}
          <span className="font-bold text-gray-900">{totalDisplayedCategoriesCount}</span>{" "}
          {totalDisplayedCategoriesCount === 1 ? "category" : "categories"}
        </div>

        {(selectedCategory !== "All Services" || selectedService || searchTerm) && (
          <div className="flex items-center gap-2 flex-wrap">
            {selectedCategory !== "All Services" && (
              <span className="bg-blue-50 border border-blue-200/80 text-[#0B4EA2] px-3 py-1 rounded-full text-xs font-bold shadow-xs">
                Category: {selectedCategory}
              </span>
            )}
            {selectedService && (
              <span className="bg-emerald-50 border border-emerald-200/80 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold shadow-xs">
                Service: {selectedService}
              </span>
            )}
            {searchTerm && (
              <span className="bg-amber-50 border border-amber-200/80 text-amber-700 px-3 py-1 rounded-full text-xs font-bold shadow-xs">
                Search: "{searchTerm}"
              </span>
            )}
          </div>
        )}
      </div>

      {/* CATEGORIES ACCORDION */}
      <div className="space-y-6">
        {displayedCategories.map((category) => {
          const isOpen = isCategoryOpen(category.title);
          const servicesList = category.services || [];

          return (
            <div
              key={category.id || category.title}
              className="bg-white rounded-3xl border border-gray-200/80 shadow-sm overflow-hidden transition-all duration-300"
            >
              {/* ACCORDION CATEGORY HEADER */}
              <div
                onClick={() => toggleCategory(category.title)}
                className="p-4 sm:p-5 flex items-center justify-between gap-3 bg-white hover:bg-slate-50 border-b border-gray-100 transition-colors duration-200 cursor-pointer group/header"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-lg shrink-0 group-hover/header:bg-blue-100 transition-colors">
                    {category.emoji || "📋"}
                  </div>
                  <h2
                    style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
                    className="grid-category-title text-base sm:text-lg font-bold text-gray-900 truncate"
                  >
                    {category.title}
                  </h2>
                </div>

                <div className="grid-category-badge flex items-center gap-2 bg-blue-50 group-hover/header:bg-blue-100 text-[#0B4EA2] px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all shrink-0">
                  <span>{servicesList.length} services</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${
                      isOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </div>
              </div>

              {/* SERVICES GRID INSIDE ACCORDION */}
              {isOpen && (
                <div className="p-4 sm:p-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 bg-slate-50/60 border-t border-gray-100">
                  {servicesList.map((service, index) => {
                    const serviceObj =
                      typeof service === "string"
                        ? { title: service, category: category.title }
                        : { ...service, category: category.title };

                    return (
                      <ServiceCard
                        key={serviceObj.slug || serviceObj.title || index}
                        service={serviceObj}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ServicesGrid;