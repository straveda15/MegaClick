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

  // =========================================================
  // HANDLE CATEGORY FROM HOME PAGE
  // =========================================================

  useEffect(() => {
    const categorySlug = searchParams.get("category");

    if (!categorySlug) {
      setSelectedCategory("All Services");
      setSelectedService(null);
      return;
    }

    const foundCategory = serviceCategories.find(
      (category) => category.slug === categorySlug
    );

    if (foundCategory) {
      setSelectedCategory(foundCategory.title);
      setSelectedService(null);
      setSearchTerm("");

      setTimeout(() => {
        const section =
          document.getElementById("services-section");

        if (section) {
          section.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 300);
    }
  }, [searchParams]);

  // =========================================================
  // HANDLE POPULAR SERVICE CLICK
  // =========================================================

  const handlePopularServiceSelect = (serviceTitle) => {
    const foundCategory = serviceCategories.find((category) =>
      category.services.some(
        (service) => service.title === serviceTitle
      )
    );

    if (foundCategory) {
      setSelectedCategory(foundCategory.title);
    } else {
      setSelectedCategory("All Services");
    }

    setSelectedService(serviceTitle);
    setSearchTerm("");

    setTimeout(() => {
      const section =
        document.getElementById("services-section");

      if (section) {
        section.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  // =========================================================
  // CREATE COMPLETE SERVICES LIST
  // =========================================================

  const allServices = serviceCategories.flatMap((category) =>
    category.services.map((service) => ({
      ...service,
      category: category.title,
      categorySlug: category.slug,
    }))
  );

  // =========================================================
  // FILTER SERVICES
  // =========================================================

  const getFilteredServices = () => {
    let result = [];

    // Specific service
    if (selectedService) {
      result = allServices.filter(
        (service) => service.title === selectedService
      );
    }

    // Specific category
    else if (selectedCategory !== "All Services") {
      result = allServices.filter(
        (service) => service.category === selectedCategory
      );
    }

    // All services
    else {
      result = allServices;
    }

    // Search filter
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
      {/* =====================================================
          RESPONSIVE DESKTOP CONTAINER STYLES
          ===================================================== */}

      <style>{`

        /* =====================================================
           STANDARD DESKTOP
           1440px × 900px
           ===================================================== */

        @media (min-width: 1440px) {
          .services-page-container {
            max-width: 1440px !important;
            padding-left: 4rem !important;
            padding-right: 4rem !important;
          }

          .services-main-grid {
            gap: 2rem !important;
          }
        }


        /* =====================================================
           LARGE DESKTOP
           1920px × 1080px
           ===================================================== */

        @media (min-width: 1920px) {
          .services-page-container {
            max-width: 1800px !important;
            padding-left: 5rem !important;
            padding-right: 5rem !important;
          }

          .services-main-grid {
            gap: 2.5rem !important;
          }
        }


        /* =====================================================
           4K / ULTRA-WIDE
           3840px × 2160px
           ===================================================== */

        @media (min-width: 3840px) {
          .services-page-container {
            max-width: 3400px !important;
            padding-left: 8rem !important;
            padding-right: 8rem !important;
          }

          .services-main-grid {
            gap: 4rem !important;
          }
        }


        /* =====================================================
           LARGE LAPTOP / SMALL DESKTOP
           1024px – 1439px
           ===================================================== */

        @media (min-width: 1024px) and (max-width: 1439px) {
          .services-page-container {
            padding-left: 3rem !important;
            padding-right: 3rem !important;
          }

          .services-main-grid {
            gap: 1.5rem !important;
          }
        }


        /* =====================================================
           TABLET
           768px – 1023px
           ===================================================== */

        @media (min-width: 768px) and (max-width: 1023px) {
          .services-page-container {
            padding-left: 2rem !important;
            padding-right: 2rem !important;
          }

          .services-main-grid {
            gap: 1.5rem !important;
          }
        }


        /* =====================================================
           MOBILE
           Below 768px
           ===================================================== */

        @media (max-width: 767px) {
          .services-page-container {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }

          .services-main-grid {
            gap: 1.25rem !important;
          }

          .services-sidebar-wrapper {
            position: relative !important;
            top: auto !important;
          }
        }


        /* =====================================================
           SMALL MOBILE
           Below 480px
           ===================================================== */

        @media (max-width: 479px) {
          .services-page-container {
            padding-left: 0.875rem !important;
            padding-right: 0.875rem !important;
          }

          .services-main-grid {
            gap: 1rem !important;
          }
        }

      `}</style>


      {/* =====================================================
          HERO
          ===================================================== */}

      <HeroSection />


      {/* =====================================================
          SEARCH
          ===================================================== */}

      <SearchServices
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />


      {/* =====================================================
          POPULAR SERVICES
          ===================================================== */}

      <PopularServices
        onSelectService={handlePopularServiceSelect}
      />


      {/* =====================================================
          SERVICES SECTION
          ===================================================== */}

      <section
        id="services-section"
        className="
          py-10
          sm:py-12
          lg:py-14
          xl:py-16
          bg-gray-50
          scroll-mt-24
        "
      >

        {/* =====================================================
            MAIN RESPONSIVE CONTAINER
            ===================================================== */}

        <div
          className="
            services-page-container

            w-full
            max-w-[1500px]
            mx-auto

            px-4
            sm:px-6
            md:px-8
            lg:px-16
            xl:px-24
          "
        >

          {/* =====================================================
              SIDEBAR + SERVICES GRID
              ===================================================== */}

          <div
            className="
              services-main-grid

              grid
              grid-cols-1

              lg:grid-cols-4

              gap-6
              lg:gap-8

              items-start
            "
          >

            {/* =================================================
                LEFT SIDEBAR
                ================================================= */}

            <div
              className="
                services-sidebar-wrapper

                lg:col-span-1

                lg:sticky
                lg:top-24

                h-fit
                min-w-0
                w-full
              "
            >

              <CategoriesSidebar
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedService={selectedService}
                setSelectedService={setSelectedService}
              />

            </div>


            {/* =================================================
                RIGHT SERVICES GRID
                ================================================= */}

            <div
              className="
                lg:col-span-3

                w-full
                min-w-0
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