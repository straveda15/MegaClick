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

  // 1. Group services by category
  const categoriesList = useMemo(() => {
    if (Array.isArray(categoriesData) && categoriesData.length > 0) {
      return categoriesData;
    }
    if (Array.isArray(services) && services.length > 0) {
      const grouped = services.reduce((acc, service) => {
        const catName =
          typeof service === "string"
            ? "Services"
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
    return openCategories[catTitle] !== false; // Open by default
  };

  // 2. Filter categories dynamically
  const displayedCategories = useMemo(() => {
    let list = categoriesList;

    if (selectedCategory !== "All Services") {
      list = list.filter((cat) => cat.title === selectedCategory);
    }

    return list
      .map((cat) => {
        const filteredSubs = (cat.services || []).filter((s) => {
          const sTitle = typeof s === "string" ? s : s.title;

          const matchesService = selectedService
            ? sTitle === selectedService
            : true;

          const matchesSearch = searchTerm.trim()
            ? sTitle.toLowerCase().includes(searchTerm.toLowerCase())
            : true;

          return matchesService && matchesSearch;
        });

        return { ...cat, services: filteredSubs };
      })
      .filter((cat) => cat.services.length > 0);
  }, [categoriesList, selectedCategory, selectedService, searchTerm]);

  // 3. Dynamic counts
  const totalFilteredServicesCount = displayedCategories.reduce(
    (acc, cat) => acc + (cat.services ? cat.services.length : 0),
    0
  );
  const totalDisplayedCategoriesCount = displayedCategories.length;

  return (
    <div className="space-y-6">

      {/* TOP SUMMARY BAR */}
      <div
        className="
          bg-white
          border
          border-gray-200/80
          rounded-2xl
          px-5
          py-3.5
          shadow-xs
          text-xs
          sm:text-sm
          text-gray-600
          flex
          flex-col
          sm:flex-row
          sm:items-center
          justify-between
          gap-2.5
        "
      >
        {/* LEFT COUNTS */}
        <div>
          <span className="font-bold text-gray-900">{totalFilteredServicesCount}</span>{" "}
          services across{" "}
          <span className="font-bold text-gray-900">{totalDisplayedCategoriesCount}</span>{" "}
          {totalDisplayedCategoriesCount === 1 ? "category" : "categories"}
        </div>

        {/* RIGHT BADGES */}
        {(selectedCategory !== "All Services" || selectedService || searchTerm) && (
          <div className="flex items-center gap-2 flex-wrap">
            {selectedCategory !== "All Services" && (
              <span className="bg-emerald-50 border border-emerald-200/80 text-emerald-700 px-3 py-1 rounded-full text-xs font-bold shadow-xs">
                Category: {selectedCategory}
              </span>
            )}
            {selectedService && (
              <span className="bg-blue-50 border border-blue-200/80 text-blue-700 px-3 py-1 rounded-full text-xs font-bold shadow-xs">
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

      {/* CATEGORY ACCORDION CARDS */}
      <div className="space-y-6">
        {displayedCategories.map((category) => {
          const isOpen = isCategoryOpen(category.title);
          const servicesList = category.services || [];

          return (
            <div
              key={category.id || category.title}
              className="
                bg-white
                rounded-3xl
                border
                border-gray-200/80
                shadow-sm
                overflow-hidden
                transition-all
                duration-300
              "
            >
              {/* CATEGORY HEADER (TURNS GRAY ON HOVER) */}
              <div
                onClick={() => toggleCategory(category.title)}
                className="
                  p-4
                  sm:p-5
                  flex
                  items-center
                  justify-between
                  gap-3
                  bg-white
                  hover:bg-slate-100/70
                  border-b
                  border-gray-100
                  transition-colors
                  duration-200
                  cursor-pointer
                  group/header
                "
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-lg shrink-0 group-hover/header:bg-amber-100 transition-colors">
                    {category.emoji || "📋"}
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-800 truncate group-hover/header:text-gray-900">
                    {category.title}
                  </h2>
                </div>

                {/* DROPDOWN BADGE */}
                <div
                  className="
                    flex
                    items-center
                    gap-2
                    bg-emerald-50
                    group-hover/header:bg-emerald-100
                    text-emerald-700
                    px-3.5
                    py-1.5
                    rounded-full
                    text-xs
                    sm:text-sm
                    font-semibold
                    transition-all
                    shrink-0
                  "
                >
                  <span>{servicesList.length} services</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-300 ${
                      isOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </div>
              </div>

              {/* SERVICE CARDS GRID CONTAINER */}
              {isOpen && (
                <div
                  className="
                    p-4
                    sm:p-6
                    grid
                    grid-cols-2
                    sm:grid-cols-3
                    lg:grid-cols-4
                    gap-4
                    sm:gap-5
                    bg-slate-100/70
                    border-t
                    border-gray-100
                  "
                >
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