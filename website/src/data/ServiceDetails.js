import React from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import serviceDetailsData from "../data/serviceDetailsData";

import ServiceHero from "../components/ServiceDetails/ServiceHero";
import HowItWorks from "../components/ServiceDetails/HowItWorks";
import ServiceBenefits from "../components/ServiceDetails/ServiceBenefits";
import ServiceFAQ from "../components/ServiceDetails/ServiceFAQ";
import Testimonials from "../components/ServiceDetails/Testimonials";
import ServiceHighlights from "../components/Services/ServiceHighlights";

const ServiceDetails = () => {
  const { slug } = useParams();

  const service = serviceDetailsData.find(
    (item) => item.slug === slug
  );

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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Service Not Found
          </h1>

          <p className="text-gray-600 mb-8 leading-7">
            Sorry, the service you are looking for does not exist or has been removed.
          </p>

          <Link
            to="/services"
            className="
              inline-flex items-center gap-2
              bg-[#0B4EA2]
              hover:bg-blue-700
              text-white
              px-6 py-3
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

  return (
    <div className="w-full overflow-hidden">
      <ServiceHero service={service} />

      <HowItWorks service={service} />

      <ServiceHighlights service={service} />

      <ServiceBenefits service={service} />

      <ServiceFAQ service={service} />

      <Testimonials />
    </div>
  );
};

export default ServiceDetails;