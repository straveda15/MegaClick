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
import UdyamRegistrationFAQ from "../components/ServiceDetails/UdyamRegistrationFAQ";

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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
        <div
          className="
            bg-white
            rounded-3xl
            shadow-lg
            border
            border-gray-200
            p-10
            md:p-12
            text-center
            max-w-lg
            w-full
          "
        >
          <h1
            className="
              text-3xl
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
              gap-2
              bg-[#0B4EA2]
              hover:bg-blue-700
              text-white
              px-6
              py-3
              rounded-xl
              font-semibold
              transition
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
  // UDYAM / MSME SERVICE CHECK
  // =========================================

  const isUdyamService =
    service.slug === "udyam-registration" ||
    service.slug === "udyam-registration-online" ||
    service.slug === "msme-udyam-registration" ||
    service.slug === "msme-registration";

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
          NORMAL FAQ
      ========================================= */}

      <ServiceFAQ service={service} />

      {/* =========================================
          UDYAM / MSME FAQ
      ========================================= */}

      {isUdyamService && (
        <UdyamRegistrationFAQ />
      )}

      {/* =========================================
          TESTIMONIALS
      ========================================= */}

      <Testimonials />

    </div>
  );
};

export default ServiceDetails;