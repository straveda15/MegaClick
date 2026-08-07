import React, { useState } from "react";

import HeroSection from "../components/Services/HeroSection";
import SearchServices from "../components/Services/SearchServices";
import CategoriesSidebar from "../components/Services/CategoriesSidebar";
import ServicesGrid from "../components/Services/ServicesGrid";
import PopularServices from "../components/Services/PopularServices";

import serviceCategories from "../data/servicesData";


const Services = () => {


  const [searchTerm, setSearchTerm] = useState("");

  const [selectedCategory, setSelectedCategory] =
  useState("All Services");


  // Selected Sub Service

  const [selectedService, setSelectedService] =
  useState(null);





  // Create Complete Services List

  const allServices = serviceCategories.flatMap(

    category =>

    category.services.map(service => ({

      ...service,

      category: category.title,

      categorySlug: category.slug

    }))

  );







  // Filter Services

  const getFilteredServices = () => {


    let result = [];




    // All Services

    if(selectedCategory === "All Services"){

      result = allServices;

    }






    // Specific Sub Service

    else if(selectedService){


      result = allServices.filter(

        service =>

        service.title === selectedService

      );


    }







    // Category Services

    else {


      result = allServices.filter(

        service =>

        service.category === selectedCategory

      );


    }








    // Search Filter

    if(searchTerm.trim() !== ""){


      result = result.filter(service =>


        service.title

        .toLowerCase()

        .includes(

          searchTerm.toLowerCase()

        )


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





      {/* Popular */}

      <PopularServices />









      {/* Services Section */}

      <section

        className="
          py-12
          bg-gray-50
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


                setSelectedCategory={
                  setSelectedCategory
                }


                selectedService={selectedService}


                setSelectedService={
                  setSelectedService
                }


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



                services={
                  getFilteredServices()
                }



                searchTerm={searchTerm}



                selectedCategory={
                  selectedCategory
                }



              />



            </div>





          </div>





        </div>





      </section>





    </>

  );

};


export default Services;