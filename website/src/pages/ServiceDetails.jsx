import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

// =========================================
// DATA
// =========================================

import serviceDetailsData from "../data/serviceDetailsData";
import otherServices from "../data/Services/otherServices";
import businessServices from "../data/Services/businessServices";

// =========================================
// COMPONENTS
// =========================================

import ServiceHero from "../components/ServiceDetails/ServiceHero";
import ServiceOverview from "../components/ServiceDetails/ServiceOverview";
import HowItWorks from "../components/ServiceDetails/HowItWorks";
import ServiceBenefits from "../components/ServiceDetails/ServiceBenefits";
import ServiceFAQ from "../components/ServiceDetails/ServiceFAQ";
import Testimonials from "../components/ServiceDetails/Testimonials";

const ServiceDetails = () => {
  const { slug } = useParams();

  // =========================================
  // COMBINE ALL SERVICE DETAILS
  // =========================================

  const allServiceDetails = [
    ...serviceDetailsData,
    ...otherServices,
    ...businessServices,
  ];

  // =========================================
  // FIND SERVICE USING URL SLUG
  // =========================================

  const service = allServiceDetails.find(
    (item) => item.slug === slug
  );

  // =========================================
  // SERVICE NOT FOUND
  // =========================================

  if (!service) {
    return (
      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
          bg-gray-50
          px-4
          sm:px-6
          py-10
        "
      >
        <div
          className="
            bg-white
            rounded-3xl
            shadow-lg
            border
            border-gray-200
            p-7
            sm:p-10
            md:p-12
            text-center
            max-w-lg
            w-full
          "
        >
          <h1
            className="
              text-2xl
              sm:text-3xl
              md:text-4xl
              font-bold
              text-gray-900
              mb-4
            "
          >
            Service Not Found
          </h1>

          <p
            className="
              text-sm
              sm:text-base
              text-gray-600
              mb-8
              leading-7
            "
          >
            Sorry, the service you are looking for does not
            exist or has been removed.
          </p>

          <Link
            to="/services"
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              bg-[#0B4EA2]
              hover:bg-blue-700
              text-white
              px-5
              sm:px-6
              py-3
              rounded-xl
              font-semibold
              text-sm
              sm:text-base
              transition
              duration-200
            "
          >
            <ArrowLeft size={18} />
            Back to Services
          </Link>
        </div>
      </div>
    );
  }

  // =========================================
  // SERVICE DETAILS PAGE
  // =========================================

  return (
    <div className="w-full overflow-hidden">
      {/* =========================================
          SERVICE HERO
      ========================================= */}

      <ServiceHero service={service} />

      {/* =========================================
          SERVICE OVERVIEW
      ========================================= */}

      <ServiceOverview service={service} />

      {/* =========================================
          HOW IT WORKS
      ========================================= */}

      <HowItWorks service={service} />

      {/* =========================================
          BENEFITS
      ========================================= */}

      <ServiceBenefits service={service} />

      {/* =========================================
          COMMON FAQ
          - 9 FAQs for every service
          - Exact FAQs for GST
          - Exact FAQs for Voter/PAN/TAN
          - Exact FAQs for MSME/Udyam
      ========================================= */}

      <ServiceFAQ service={service} />

      {/* =========================================
          TESTIMONIALS
      ========================================= */}

      <Testimonials service={service} />
    </div>
  );
};

export default ServiceDetails;