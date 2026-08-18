import React from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import logo from "../assets/LOGO.png";

const Footer = () => {
  const navigate = useNavigate();

  /* ================================================= */
  /* EMAIL COMPOSE                                      */
  /* ================================================= */
  const openGmailCompose = () => {
    const email = "megaclickofficial@gmail.com";
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isMobile) {
      window.location.href = `mailto:${email}`;
    } else {
      window.open(
        `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}`,
        "_blank"
      );
    }
  };

  /* ================================================= */
  /* SCROLL TO TOP                                      */
  /* ================================================= */
  const scrollToTop = () => {
    if (window.location.pathname !== "/") {
      navigate("/");
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 300);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  /* ================================================= */
  /* DATA                                               */
  /* ================================================= */
  const services = [
    "Business Registration",
    "Tax & Compliance Services",
    "Financial & Legal Solutions",
  ];

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Associate With Us", path: "/associate-with-us" },
    { name: "Contact Us", path: "/contact" },
  ];

  const socialLinks = [
    { icon: FaFacebookF, link: "#", label: "Facebook" },
    { icon: FaInstagram, link: "#", label: "Instagram" },
    { icon: FaLinkedinIn, link: "#", label: "LinkedIn" },
    {
      icon: FaWhatsapp,
      link: "https://wa.me/919921611911",
      label: "WhatsApp",
    },
  ];

  /* ================================================= */
  /* HANDLE NAVIGATION                                  */
  /* ================================================= */
  const handleNavigation = (path) => {
    navigate(path);
    if (path === "/") {
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
    }
  };

  return (
    <footer className="bg-[#083A7A] text-white relative overflow-hidden font-['Inter',sans-serif]">
      {/* TOP ACCENT LINE */}
      <div className="h-1 bg-green-400" />

      {/* MAIN FOOTER */}
      <div className="max-w-[1500px] mx-auto px-5 sm:px-8 lg:px-16 xl:px-24 pt-12 sm:pt-14 lg:pt-16 pb-10 sm:pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12 xl:gap-16">

          {/* ============ COMPANY INFO ============ */}
          <div className="sm:col-span-2 lg:col-span-1 flex flex-col items-start">
            {/* Logo + Brand Heading */}
            <div className="flex items-center gap-3 mb-4">
              <img
                src={logo}
                alt="MegaClick"
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-contain p-1 border border-blue-300 bg-white shadow-md shadow-blue-900/30"
              />
              <h2 className="text-2xl sm:text-3xl font-['Hedvig_Letters_Serif',serif] font-normal tracking-wide">
                <span className="text-white">Mega</span>
                <span className="text-green-400">Click</span>
              </h2>
            </div>

            {/* Description (Inter) */}
            <p className="text-blue-100/90 text-sm font-normal leading-relaxed max-w-sm mb-6">
              MegaClick provides reliable business solutions to help businesses grow faster.
            </p>

            {/* Social Icons with proper gap */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.link}
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 flex items-center justify-center text-white cursor-pointer transition-all duration-300 hover:bg-green-500 hover:scale-105 active:scale-95"
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* ============ EXPLORE LINKS ============ */}
          <div className="flex flex-col items-start">
            <h3 className="font-['Hedvig_Letters_Serif',serif] text-lg sm:text-xl font-normal tracking-wide text-white mb-4 sm:mb-5 pb-2 border-b border-white/15 w-full sm:w-auto sm:border-none sm:pb-0">
              Explore
            </h3>
            <ul className="space-y-2.5 sm:space-y-3 w-full">
              {quickLinks.map((item, index) => (
                <li key={index}>
                  <button
                    type="button"
                    onClick={() => handleNavigation(item.path)}
                    className="text-sm font-normal text-blue-100/90 hover:text-white transition-colors duration-200 text-left w-full py-0.5"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* ============ OUR SERVICES ============ */}
          <div className="flex flex-col items-start">
            <h3 className="font-['Hedvig_Letters_Serif',serif] text-lg sm:text-xl font-normal tracking-wide text-white mb-4 sm:mb-5 pb-2 border-b border-white/15 w-full sm:w-auto sm:border-none sm:pb-0">
              Our Services
            </h3>
            <ul className="space-y-2.5 sm:space-y-3 w-full">
              {services.map((service, index) => (
                <li key={index}>
                  <span className="text-sm font-normal text-blue-100/90 hover:text-white transition-colors duration-200 py-0.5 block">
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* ============ CONTACT US ============ */}
          <div className="flex flex-col items-start">
            <h3 className="font-['Hedvig_Letters_Serif',serif] text-lg sm:text-xl font-normal tracking-wide text-white mb-4 sm:mb-5 pb-2 border-b border-white/15 w-full sm:w-auto sm:border-none sm:pb-0">
              Contact Us
            </h3>

            <div className="space-y-3.5 sm:space-y-4 w-full">
              {/* Phone */}
              <a
                href="tel:+919921611911"
                className="group flex items-center gap-3 w-full py-0.5"
              >
                <Phone size={17} className="text-green-400 shrink-0" />
                <span className="text-sm font-normal text-blue-100/90 transition-colors duration-200 group-hover:text-white">
                  +91 9921611911
                </span>
              </a>

              {/* Email */}
              <button
                type="button"
                onClick={openGmailCompose}
                aria-label="Send email to MegaClick"
                className="group flex items-center gap-3 w-full text-left bg-transparent border-0 p-0 cursor-pointer py-0.5"
              >
                <Mail size={17} className="text-green-400 shrink-0" />
                <span className="text-sm font-normal text-blue-100/90 transition-colors duration-200 break-all group-hover:text-white">
                  megaclickofficial@gmail.com
                </span>
              </button>

              {/* Address */}
              <a
                href="https://www.google.com/maps/search/?api=1&query=4th+Floor+Tristar+Complex+Jehan+Circle+Gangapur+Road+Nashik+Maharashtra+422005"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-start gap-3 w-full py-0.5"
              >
                <MapPin size={18} className="text-green-400 shrink-0 mt-0.5" />
                <span className="text-sm font-normal leading-6 text-blue-100/90 transition-colors duration-200 group-hover:text-white">
                  4th Floor, Tristar Complex,<br />
                  Jehan Circle, Gangapur Rd,<br />
                  Above Canara Bank,<br />
                  D&apos;souza Colony,<br />
                  Nashik, Maharashtra 422005
                </span>
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-white/10">
        <div className="max-w-[1500px] mx-auto px-5 sm:px-8 lg:px-16 xl:px-24 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-xs sm:text-sm font-normal text-white/90">
            © 2026 MegaClick. All Rights Reserved.
          </p>

          <button
            type="button"
            onClick={scrollToTop}
            aria-label="Back to top"
            className="flex items-center gap-2 bg-white/10 hover:bg-green-500 border border-white/10 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium text-white transition-all duration-300"
          >
            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">↑</span>
            Back to Top
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;