import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import HeroSection from "../components/Services/HeroSection";
import SearchServices from "../components/Services/SearchServices";
import CategoriesSidebar from "../components/Services/CategoriesSidebar";
import ServicesGrid from "../components/Services/ServicesGrid";
import PopularServices from "../components/Services/PopularServices";

import serviceCategories from "../data/servicesData";

const Services = () => {
  const [searchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState("All Services");
  const [selectedService, setSelectedService] = useState(null);

  // =================================================
  // HANDLE CATEGORY FROM HOME PAGE
  // =================================================
  useEffect(() => {
    const categorySlug = searchParams.get("category");

    if (!categorySlug) {
      setSelectedCategory("All Services");
      setSelectedService(null);
      return;
    }

    // Find category using slug
    const foundCategory = serviceCategories.find(
      (category) => category.slug === categorySlug
    );

    if (foundCategory) {
      // Select the category
      setSelectedCategory(foundCategory.title);

      // Make sure no individual service is selected
      setSelectedService(null);

      // Clear search
      setSearchTerm("");

      // Scroll to services section
      setTimeout(() => {
        const section = document.getElementById("services-section");

        if (section) {
          section.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 300);
    }
  }, [searchParams]);

  // =================================================
  // HANDLE POPULAR SERVICE CLICK
  // =================================================
  const handlePopularServiceSelect = (serviceTitle) => {
    // Auto-detect category of clicked service
    const foundCategory = serviceCategories.find((category) =>
      category.services.some((s) => s.title === serviceTitle)
    );

    if (foundCategory) {
      setSelectedCategory(foundCategory.title);
    } else {
      setSelectedCategory("All Services");
    }

    // Set active service
    setSelectedService(serviceTitle);

    // Clear search
    setSearchTerm("");

    // Scroll to services section
    setTimeout(() => {
      const section = document.getElementById("services-section");

      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
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
      {/* ================= HERO ================= */}
      <HeroSection />

      {/* ================= SEARCH ================= */}
      <SearchServices
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* ================= POPULAR SERVICES ================= */}
      <PopularServices
        onSelectService={handlePopularServiceSelect}
      />

      {/* ================= SERVICES SECTION ================= */}
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
            {/* ================= LEFT SIDEBAR ================= */}
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

            {/* ================= RIGHT SERVICES GRID ================= */}
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