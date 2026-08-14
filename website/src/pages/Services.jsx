import React, { useState } from "react";

import HeroSection from "../components/Services/HeroSection";
import SearchServices from "../components/Services/SearchServices";
import CategoriesSidebar from "../components/Services/CategoriesSidebar";
import ServicesGrid from "../components/Services/ServicesGrid";
import PopularServices from "../components/Services/PopularServices";

import serviceCategories from "../data/servicesData";

const Services = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Services");
  const [selectedService, setSelectedService] = useState(null);

  // =================================================
  // HANDLE POPULAR SERVICE CLICK
  // =================================================
  const handlePopularServiceSelect = (serviceTitle) => {
    // 1. Auto-detect category of the clicked service
    const foundCategory = serviceCategories.find((category) =>
      category.services.some((s) => s.title === serviceTitle)
    );

    if (foundCategory) {
      setSelectedCategory(foundCategory.title);
    } else {
      setSelectedCategory("All Services");
    }

    // 2. Set active service & clear search term
    setSelectedService(serviceTitle);
    setSearchTerm("");
  };

  // =================================================
  // CREATE COMPLETE SERVICES LIST
  // =================================================
  const allServices = serviceCategories.flatMap((category) =>
    category.services.map((service) => ({
      ...service,
      category: category.title,
      categorySlug: category.slug,
    }))
  );

  // =================================================
  // FILTER SERVICES LOGIC
  // =================================================
  const getFilteredServices = () => {
    let result = [];

    // Specific Sub Service
    if (selectedService) {
      result = allServices.filter(
        (service) => service.title === selectedService
      );
    }
    // Specific Category Services
    else if (selectedCategory !== "All Services") {
      result = allServices.filter(
        (service) => service.category === selectedCategory
      );
    }
    // All Services
    else {
      result = allServices;
    }

    // Search Filter
    if (searchTerm.trim() !== "") {
      result = result.filter((service) =>
        service.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    return result;
  };

  return (
    <>
      {/* Hero */}
      <HeroSection />

      {/* Search */}
      <SearchServices
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Popular Services */}
      <PopularServices onSelectService={handlePopularServiceSelect} />

      {/* Services Section */}
      <section
        id="services-section"
        className="
          py-12
          bg-gray-50
          scroll-mt-24
        "
      >
        <div
          className="
            max-w-[1500px]
            mx-auto
            px-6
            lg:px-24
          "
        >
          <div
            className="
              grid
              grid-cols-1
              lg:grid-cols-4
              gap-8
            "
          >
            {/* LEFT SIDEBAR */}
            <div
              className="
                lg:col-span-1
                lg:sticky
                lg:top-24
                h-fit
              "
            >
              <CategoriesSidebar
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedService={selectedService}
                setSelectedService={setSelectedService}
              />
            </div>

            {/* RIGHT SERVICES GRID */}
            <div
              className="
                lg:col-span-3
                w-full
              "
            >
              <ServicesGrid
                services={getFilteredServices()}
                categoriesData={serviceCategories}
                searchTerm={searchTerm}
                selectedCategory={selectedCategory}
                selectedService={selectedService}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Services;