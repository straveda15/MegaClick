import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BriefcaseBusiness,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

import legalImg from "../assets/legal.jpg";
import otherImg from "../assets/registration.jpg";
import businessImg from "../assets/Business.jpg";

const services = [
  {
    title: "Legal Services",
    slug: "legal-services",
    image: legalImg,
    icon: ShieldCheck,
    short:
      "Professional legal documentation, registrations and compliance support for your business.",
  },
  {
    title: "Other Services",
    slug: "other-services",
    image: otherImg,
    icon: BriefcaseBusiness,
    short:
      "Complete assistance for licenses, registrations and essential business requirements.",
  },
  {
    title: "Business & Financial Services",
    slug: "business-financial-services",
    image: businessImg,
    icon: TrendingUp,
    short:
      "Reliable taxation, accounting and financial solutions for business growth.",
  },
];

const Services = () => {
  const navigate = useNavigate();
  const [activeCard, setActiveCard] = useState(null);

  const handleCardClick = (index) => {
    setActiveCard(index);
    setTimeout(() => {
      setActiveCard(null);
    }, 500);
  };

  return (
    <section className="w-full py-10 sm:py-12 lg:py-16 bg-white">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 xl:px-20">
        
        {/* ================= HEADING AREA ================= */}
        <div className="mb-8 sm:mb-10 lg:mb-12 w-full">
          
          {/* HEADING (Hedvig Letters Serif - Without 'Under One Roof') */}
          <h2
            className="text-2xl sm:text-3xl lg:text-[40px] font-normal text-[#0f172a] leading-tight"
            style={{ fontFamily: '"Hedvig Letters Serif", Georgia, serif', fontWeight: 400 }}
          >
            Complete Business <span className="text-[#0B4EA2]">Solutions</span>
          </h2>

          {/* SPREAD PARAGRAPH (Inter Font) */}
          <p className="mt-3.5 sm:mt-4 text-slate-600 font-normal text-sm sm:text-base md:text-lg leading-relaxed w-full">
            We provide reliable legal, business and financial solutions with
            expert guidance to simplify your business journey. MegaClick
            provides professional assistance for registrations, agreements,
            documentation and compliance requirements with simple and
            transparent processes.
          </p>
        </div>

        {/* ================= SERVICE CARDS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <div
                key={index}
                onClick={() => handleCardClick(index)}
                className={`
                  group
                  w-full
                  bg-white
                  border
                  border-blue-100
                  rounded-2xl
                  overflow-hidden
                  shadow-xs
                  hover:shadow-lg
                  transition-all
                  duration-300
                  cursor-pointer
                  lg:hover:-translate-y-1.5
                  ${activeCard === index ? "-translate-y-1.5 shadow-lg" : ""}
                `}
              >
                {/* IMAGE */}
                <div className="relative w-full h-48 sm:h-52 md:h-56 lg:h-52 xl:h-56 overflow-hidden bg-slate-100">
                  <img
                    src={service.image}
                    alt={service.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/10 transition-colors duration-300" />
                </div>

                {/* CONTENT (Inter Font) */}
                <div className="p-5 sm:p-6">
                  {/* ICON + TITLE */}
                  <div className="flex items-center gap-3.5 mb-3.5">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0 text-[#0B4EA2]">
                      <Icon size={22} className="text-[#0B4EA2]" />
                    </div>

                    <h3 className="text-base sm:text-lg lg:text-xl font-bold text-[#0f172a] leading-snug">
                      {service.title}
                    </h3>
                  </div>

                  {/* DESCRIPTION */}
                  <p className="text-sm text-slate-600 font-normal leading-relaxed">
                    {service.short}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* ================= VIEW ALL BUTTON ================= */}
        <div className="flex justify-center mt-9 sm:mt-11">
          <button
            onClick={() => navigate("/services")}
            className="inline-flex items-center justify-center gap-2.5 bg-[#0B4EA2] hover:bg-blue-700 text-white px-7 sm:px-8 py-3.5 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 hover:scale-[1.02] shadow-md hover:shadow-lg cursor-pointer"
          >
            <span>View All Services</span>
            <ArrowRight size={18} />
          </button>
        </div>

      </div>
    </section>
  );
};

export default Services;