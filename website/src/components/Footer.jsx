import React from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import logo from "../assets/LOGO.png";

const FOOTER_LINKS = {
  EXPLORE: [
    { label: "Home", path: "/" },
    { label: "About Us", path: "/about" },
    { label: "Services", path: "/services" },
    { label: "Associate With Us", path: "/associate-with-us" },
    { label: "Contact Us", path: "/contact" },
  ],

  SERVICES: [
    { label: "Business Registration", path: "/services" },
    { label: "Tax & Compliance Services", path: "/services" },
    { label: "Financial & Legal Solutions", path: "/services" },
  ],
};

/* =========================================================
   SOCIAL LINKS
========================================================= */

const SOCIAL_LINKS = [
  {
    icon: FaFacebookF,
    href: "#",
    label: "Facebook",
    iconColor: "text-[#1877F2]",
    bgColor: "bg-[#E8F1FF]",
    hoverColor: "hover:bg-[#DCEAFF]",
  },
  {
    icon: FaLinkedinIn,
    href: "#",
    label: "LinkedIn",
    iconColor: "text-[#0077B5]",
    bgColor: "bg-[#E8F1FF]",
    hoverColor: "hover:bg-[#DCEAFF]",
  },
  {
    icon: FaWhatsapp,
    href: "https://wa.me/919921611911",
    label: "WhatsApp",
    iconColor: "text-[#16A34A]",
    bgColor: "bg-[#E2F9EA]",
    hoverColor: "hover:bg-[#D3F5DF]",
  },
  {
    icon: FaInstagram,
    href: "#",
    label: "Instagram",
    iconColor: "text-[#E1306C]",
    bgColor: "bg-[#FCE7F3]",
    hoverColor: "hover:bg-[#FBD5E7]",
  },
];

/* =========================================================
   FOOTER
========================================================= */

const Footer = () => {
  const navigate = useNavigate();

  /* =========================================================
     GMAIL
  ========================================================= */
  const openGmailCompose = () => {
    const email = "megaclickofficial@gmail.com";
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (isMobile) {
      window.location.href = `mailto:${email}`;
    } else {
      window.open(
        `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
          email
        )}`,
        "_blank"
      );
    }
  };

  /* =========================================================
     BACK TO TOP
  ========================================================= */
  const scrollToTop = () => {
    if (window.location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }, 300);
    } else {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  /* =========================================================
     NAVIGATION
  ========================================================= */
  const handleNavigation = (path) => {
    navigate(path);
    if (path === "/") {
      setTimeout(() => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      }, 100);
    }
  };

  return (
    <footer className="relative mt-auto overflow-hidden bg-[#083A7A] text-white font-['Inter',sans-serif] pt-8 sm:pt-10 pb-5 footer-section">
      {/* UNIFIED APP-CONTAINER + RESPONSIVE DESKTOP & 4K SCALING */}
      <style>{`
        .app-container {
          width: 100%;
          max-width: 1500px;
          margin-left: auto;
          margin-right: auto;
          padding-left: 1.25rem;
          padding-right: 1.25rem;
        }

        @media (min-width: 640px) {
          .app-container {
            padding-left: 2rem;
            padding-right: 2rem;
          }
        }

        @media (min-width: 1024px) {
          .app-container {
            padding-left: 4rem;
            padding-right: 4rem;
          }
        }

        @media (min-width: 1280px) {
          .app-container {
            padding-left: 6rem;
            padding-right: 6rem;
          }
        }

        /* Standard Desktop (1440px x 900px) */
        @media (min-width: 1440px) {
          .app-container {
            max-width: 1440px !important;
            padding-left: 5rem !important;
            padding-right: 5rem !important;
          }
        }

        /* Large Desktop (1920px x 1080px Full HD) */
        @media (min-width: 1920px) {
          .app-container {
            max-width: 1800px !important;
            padding-left: 6rem !important;
            padding-right: 6rem !important;
          }
          .footer-section {
            padding-top: 3.5rem !important;
            padding-bottom: 2rem !important;
          }
          .footer-logo-img {
            width: 3rem !important;
            height: 3rem !important;
          }
          .footer-brand-title {
            font-size: 1.75rem !important;
          }
          .footer-brand-desc {
            font-size: 0.95rem !important;
            max-width: 320px !important;
          }
          .footer-col-heading {
            font-size: 0.8rem !important;
            margin-bottom: 1rem !important;
          }
          .footer-link-text {
            font-size: 0.95rem !important;
          }
          .footer-social-btn {
            width: 2.75rem !important;
            height: 2.75rem !important;
          }
        }

        /* QHD / 2K Ultra-Wide (2560px Desktop) */
        @media (min-width: 2560px) {
          .app-container {
            max-width: 2400px !important;
            padding-left: 8rem !important;
            padding-right: 8rem !important;
          }
          .footer-section {
            padding-top: 4.5rem !important;
            padding-bottom: 2.5rem !important;
          }
          .footer-logo-img {
            width: 3.75rem !important;
            height: 3.75rem !important;
          }
          .footer-brand-title {
            font-size: 2.25rem !important;
          }
          .footer-brand-desc {
            font-size: 1.15rem !important;
            max-width: 400px !important;
          }
          .footer-col-heading {
            font-size: 0.95rem !important;
            margin-bottom: 1.25rem !important;
          }
          .footer-link-text {
            font-size: 1.15rem !important;
          }
          .footer-social-btn {
            width: 3.25rem !important;
            height: 3.25rem !important;
          }
        }

        /* 4K Ultra-Wide Desktop (3840px x 2160px) */
        @media (min-width: 3840px) {
          .app-container {
            max-width: 3400px !important;
            padding-left: 10rem !important;
            padding-right: 10rem !important;
          }
          .footer-section {
            padding-top: 6rem !important;
            padding-bottom: 3.5rem !important;
          }
          .footer-logo-img {
            width: 5rem !important;
            height: 5rem !important;
            border-width: 2px !important;
          }
          .footer-brand-title {
            font-size: 3.25rem !important;
          }
          .footer-brand-desc {
            font-size: 1.5rem !important;
            max-width: 550px !important;
            line-height: 1.6 !important;
          }
          .footer-col-heading {
            font-size: 1.25rem !important;
            margin-bottom: 1.75rem !important;
          }
          .footer-link-text {
            font-size: 1.5rem !important;
          }
          .footer-social-btn {
            width: 4.5rem !important;
            height: 4.5rem !important;
          }
          .footer-contact-icon {
            width: 1.75rem !important;
            height: 1.75rem !important;
          }
        }
      `}</style>

      {/* TOP ACCENT LINE */}
      <div className="h-1 bg-green-400 absolute top-0 left-0 right-0 z-10" />

      {/* MEGACLICK WATERMARK */}
      <div
        className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-1/2 bg-blue-400/10 blur-[120px] rounded-full pointer-events-none" />

        <span
          className="text-[18vw] font-black uppercase tracking-tight whitespace-nowrap text-center text-white/[0.045] leading-none select-none"
          style={{
            fontFamily:
              "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            letterSpacing: "-0.03em",
          }}
        >
          MEGACLICK
        </span>
      </div>

      {/* MAIN FOOTER CONTENT */}
      <div className="relative z-10 app-container">

        {/* =======================================================
            MOBILE VIEW (< md)
        ======================================================= */}
        <div className="md:hidden w-full flex flex-col items-start text-left px-1 pb-1">
          {/* LOGO + NAME */}
          <div className="flex items-center justify-start gap-3 mb-2">
            <img
              src={logo}
              alt="MegaClick"
              className="w-10 h-10 rounded-full object-contain p-1 border border-blue-300 bg-white shadow-md shadow-blue-900/30"
            />
            <h2 className="text-2xl font-bold tracking-tight">
              <span className="text-white">Mega</span>
              <span className="text-green-400">Click</span>
            </h2>
          </div>

          {/* TAGLINE */}
          <p className="text-[13px] text-blue-100/90 font-medium mb-5 text-left">
            Exceptional value. Cost effective solutions.
          </p>

          {/* MOBILE LINKS */}
          <div className="w-full flex flex-col items-start text-left gap-3 mb-6">
            {FOOTER_LINKS.EXPLORE.map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={() => handleNavigation(link.path)}
                className="text-[13px] font-semibold text-blue-100 hover:text-white transition-colors text-left cursor-pointer p-0 m-0 bg-transparent border-none"
              >
                {link.label}
              </button>
            ))}

            {FOOTER_LINKS.SERVICES.map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={() => handleNavigation(link.path)}
                className="text-[13px] font-semibold text-blue-100 hover:text-white transition-colors text-left cursor-pointer p-0 m-0 bg-transparent border-none"
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* SOCIAL ICONS */}
          <div className="flex justify-start items-center gap-3.5 mb-6">
            {SOCIAL_LINKS.map((social, index) => {
              const Icon = social.icon;
              return (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className={`w-10 h-10 rounded-full ${social.bgColor} ${social.iconColor} flex items-center justify-center transition-all duration-300 hover:scale-110 ${social.hoverColor} cursor-pointer`}
                >
                  <Icon size={17} />
                </a>
              );
            })}
          </div>

          {/* MOBILE BOTTOM BAR */}
          <div className="border-t-2 border-white/10 pt-4 w-full flex flex-col items-start text-left gap-2">
            <p className="text-[13px] font-semibold text-blue-100 text-left tracking-normal normal-case">
              Straveda Tech.
            </p>

            <button
              type="button"
              onClick={scrollToTop}
              className="text-[13px] font-semibold text-blue-100 hover:text-green-400 transition-colors cursor-pointer text-left tracking-normal normal-case p-0 bg-transparent border-none"
            >
              Back to Top ↑
            </button>
          </div>
        </div>

        {/* =======================================================
            DESKTOP VIEW (>= md)
        ======================================================= */}
        <div className="hidden md:block">
          <div className="grid grid-cols-4 lg:grid-cols-12 gap-y-6 gap-x-8 mb-5 pt-1">
            {/* BRAND */}
            <div className="lg:col-span-4 space-y-4">
              <div>
                <div className="flex items-center gap-3 mb-1.5">
                  <img
                    src={logo}
                    alt="MegaClick"
                    className="footer-logo-img w-10 h-10 rounded-full object-contain p-1 border border-blue-300 bg-white shadow-md shadow-blue-900/30"
                  />
                  <h2 className="footer-brand-title text-2xl font-bold tracking-tight">
                    <span className="text-white">Mega</span>
                    <span className="text-green-400">Click</span>
                  </h2>
                </div>

                <p className="footer-brand-desc mt-1.5 text-[14px] text-blue-100/90 font-medium leading-snug max-w-[280px]">
                  Exceptional value.
                  <br />
                  Cost effective solutions.
                </p>
              </div>

              {/* SOCIAL ICONS */}
              <div className="flex gap-3 pt-1">
                {SOCIAL_LINKS.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      className={`footer-social-btn w-10 h-10 rounded-full ${social.bgColor} ${social.iconColor} flex items-center justify-center transition-all duration-300 hover:scale-110 ${social.hoverColor} cursor-pointer`}
                    >
                      <Icon size={17} />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* EXPLORE */}
            <div className="lg:col-span-2 space-y-2.5">
              <h3 className="footer-col-heading text-[11px] font-black uppercase tracking-widest text-green-400">
                EXPLORE
              </h3>

              <ul className="space-y-1.5">
                {FOOTER_LINKS.EXPLORE.map((link) => (
                  <li key={link.label}>
                    <button
                      type="button"
                      onClick={() => handleNavigation(link.path)}
                      className="footer-link-text text-[13px] font-semibold text-blue-100/90 hover:text-white transition-colors text-left"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* SERVICES */}
            <div className="lg:col-span-3 space-y-2.5">
              <h3 className="footer-col-heading text-[11px] font-black uppercase tracking-widest text-green-400">
                SERVICES
              </h3>

              <ul className="space-y-1.5">
                {FOOTER_LINKS.SERVICES.map((link) => (
                  <li key={link.label}>
                    <button
                      type="button"
                      onClick={() => handleNavigation(link.path)}
                      className="footer-link-text text-[13px] font-semibold text-blue-100/90 hover:text-white transition-colors text-left"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* CONTACT US */}
            <div className="lg:col-span-3 space-y-2.5">
              <h3 className="footer-col-heading text-[11px] font-black uppercase tracking-widest text-green-400">
                CONTACT US
              </h3>

              <div className="space-y-2.5 text-[13px] font-semibold text-blue-100/90">
                {/* EMAIL */}
                <button
                  type="button"
                  onClick={openGmailCompose}
                  className="footer-link-text flex items-center gap-3 group text-left w-full cursor-pointer bg-transparent border-0 p-0 text-[13px] font-semibold text-blue-100/90 hover:text-white transition-colors"
                >
                  <Mail
                    size={17}
                    className="footer-contact-icon shrink-0 text-green-400"
                  />
                  <span className="break-all">
                    megaclickofficial@gmail.com
                  </span>
                </button>

                {/* PHONE */}
                <a
                  href="tel:+919921611911"
                  className="footer-link-text flex items-center gap-3 group hover:text-white transition-colors"
                >
                  <Phone
                    size={17}
                    className="footer-contact-icon shrink-0 text-green-400"
                  />
                  <span>
                    +91 9921611911
                  </span>
                </a>

                {/* ADDRESS */}
                <a
                  href="https://www.google.com/maps/search/?api=1&query=4th+Floor+Tristar+Complex+Jehan+Circle+Gangapur+Road+Nashik+Maharashtra+422005"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link-text flex items-start gap-3 group hover:text-white transition-colors"
                >
                  <MapPin
                    size={17}
                    className="footer-contact-icon mt-0.5 shrink-0 text-green-400"
                  />
                  <span className="leading-tight">
                    4th Floor, Tristar Complex, Jehan Circle,
                    <br />
                    Gangapur Rd, Nashik, Maharashtra 422005
                  </span>
                </a>
              </div>
            </div>
          </div>

          {/* DESKTOP BOTTOM BAR */}
          <div className="pt-3.5 border-t-2 border-white/10 flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="footer-link-text text-[13px] font-semibold text-blue-100/90 normal-case tracking-normal">
              Straveda Tech.
            </p>

            <div className="flex gap-6">
              <button
                type="button"
                onClick={scrollToTop}
                className="text-[11px] font-black text-white/40 uppercase tracking-[0.2em] hover:text-green-400 cursor-pointer"
              >
                Back to Top ↑
              </button>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;