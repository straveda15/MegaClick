import React, { useState, useMemo } from "react";
import ServiceCard from "./ServiceCard";
import { ChevronDown } from "lucide-react";

const ServicesGrid = ({
  categoriesData = [],
  services = [],
  searchTerm = "",
  setSearchTerm,
  selectedCategory = "All Services",
  selectedService = null,
}) => {
  const [openCategories, setOpenCategories] = useState({});

  const categoriesList = useMemo(() => {
  if (Array.isArray(services) && services.length > 0) {
    const grouped = services.reduce((acc, service) => {
      const catName = service.category || "Other Services";

      if (!acc[catName]) {
        const originalCategory = categoriesData.find(
          (cat) => cat.title === catName
        );

        acc[catName] = {
          ...(originalCategory || {}),
          title: catName,
          services: [],
        };
      }

      acc[catName].services.push(service);
      return acc;
    }, {});

    return Object.values(grouped);
  }

  return [];
}, [services, categoriesData]);

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
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

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
          .search-box-animated {
  position: relative;
  padding: 2px;
  border-radius: 16px;
  background: linear-gradient(
    90deg,
    #0B4EA2,
    #22C55E,
    #0B4EA2
  );
  background-size: 200% 100%;
  animation: searchBorderMove 3s linear infinite;
}

.search-input {
  width: 100%;
  height: 52px;
  padding: 0 20px;
  border: none;
  outline: none;
  border-radius: 14px;
  background: white;
  color: #111827;
  font-size: 15px;
}

@keyframes searchBorderMove {
  0% {
    background-position: 0% 50%;
  }

  50% {
    background-position: 100% 50%;
  }

  100% {
    background-position: 0% 50%;
  }
}
      `}</style>

      {/* TOP SUMMARY BAR */}
      {/* SEARCH BAR */}
<div className="search-box-animated">
  <input
    type="text"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    placeholder="Search services..."
    className="search-input"
  />
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
                    style={{ fontFamily: "'Poppins', serif" }}
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