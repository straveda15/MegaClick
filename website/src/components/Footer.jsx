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

    const isMobile =
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

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
    <footer className="relative mt-auto overflow-hidden bg-[#083A7A] text-white font-['Inter',sans-serif] pt-8 sm:pt-10 pb-5">

      {/* =========================================================
          TOP ACCENT LINE
      ========================================================= */}

      <div className="h-1 bg-green-400 absolute top-0 left-0 right-0 z-10" />

      {/* =========================================================
          MEGACLICK WATERMARK
      ========================================================= */}

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

      {/* =========================================================
          MAIN FOOTER CONTENT
      ========================================================= */}

      <div className="relative z-10 max-w-[1500px] mx-auto px-5 sm:px-8 lg:px-16 xl:px-24">

        {/* =======================================================
            MOBILE VIEW
        ======================================================= */}

        <div className="md:hidden w-full flex flex-col items-start text-left px-2 pb-1">

          {/* =====================================================
              LOGO + NAME
          ===================================================== */}

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

          {/* =====================================================
              TAGLINE
          ===================================================== */}

          <p className="text-[13px] text-blue-100/90 font-medium mb-5 text-left">
            Exceptional value. Cost effective solutions.
          </p>

          {/* =====================================================
              MOBILE LINKS
          ===================================================== */}

          <div className="w-full flex flex-col items-start text-left gap-3 mb-6">

            {FOOTER_LINKS.EXPLORE.map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={() => handleNavigation(link.path)}
                className="
                  text-[13px]
                  font-semibold
                  text-blue-100
                  hover:text-white
                  transition-colors
                  text-left
                  cursor-pointer
                  p-0
                  m-0
                  bg-transparent
                  border-none
                "
              >
                {link.label}
              </button>
            ))}

            {FOOTER_LINKS.SERVICES.map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={() => handleNavigation(link.path)}
                className="
                  text-[13px]
                  font-semibold
                  text-blue-100
                  hover:text-white
                  transition-colors
                  text-left
                  cursor-pointer
                  p-0
                  m-0
                  bg-transparent
                  border-none
                "
              >
                {link.label}
              </button>
            ))}

          </div>

          {/* =====================================================
              SOCIAL ICONS
          ===================================================== */}

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
                  className={`
                    w-10 h-10
                    rounded-full
                    ${social.bgColor}
                    ${social.iconColor}
                    flex items-center justify-center
                    transition-all duration-300
                    hover:scale-110
                    ${social.hoverColor}
                    cursor-pointer
                  `}
                >
                  <Icon size={17} />
                </a>
              );
            })}

          </div>

          {/* =====================================================
              MOBILE BOTTOM BAR
          ===================================================== */}

          <div
            className="
              border-t-2
              border-white/10
              pt-4
              w-full
              flex
              flex-col
              items-start
              text-left
              gap-2
            "
          >

            {/* STRAVEDA TECH
                SAME FONT/SIZE AS MOBILE HOME/ABOUT LINKS
            */}

            <p
              className="
                text-[13px]
                font-semibold
                text-blue-100
                text-left
                tracking-normal
                normal-case
              "
            >
              Straveda Tech.
            </p>

            {/* BACK TO TOP */}

            <button
              type="button"
              onClick={scrollToTop}
              className="
                text-[13px]
                font-semibold
                text-blue-100
                hover:text-green-400
                transition-colors
                cursor-pointer
                text-left
                tracking-normal
                normal-case
                p-0
                bg-transparent
                border-none
              "
            >
              Back to Top ↑
            </button>

          </div>

        </div>

        {/* =======================================================
            DESKTOP VIEW
        ======================================================= */}

        <div className="hidden md:block">

          <div className="grid grid-cols-4 lg:grid-cols-12 gap-y-6 gap-x-8 mb-5 pt-1">

            {/* ===================================================
                BRAND
            =================================================== */}

            <div className="lg:col-span-4 space-y-4">

              <div>

                <div className="flex items-center gap-3 mb-1.5">

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

                <p className="mt-1.5 text-[14px] text-blue-100/90 font-medium leading-snug max-w-[280px]">
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
                      className={`
                        w-10 h-10
                        rounded-full
                        ${social.bgColor}
                        ${social.iconColor}
                        flex items-center justify-center
                        transition-all duration-300
                        hover:scale-110
                        ${social.hoverColor}
                        cursor-pointer
                      `}
                    >
                      <Icon size={17} />
                    </a>
                  );
                })}

              </div>

            </div>

            {/* ===================================================
                EXPLORE
            =================================================== */}

            <div className="lg:col-span-2 space-y-2.5">

              <h3 className="text-[11px] font-black uppercase tracking-widest text-green-400">
                EXPLORE
              </h3>

              <ul className="space-y-1.5">

                {FOOTER_LINKS.EXPLORE.map((link) => (
                  <li key={link.label}>

                    <button
                      type="button"
                      onClick={() => handleNavigation(link.path)}
                      className="text-[13px] font-semibold text-blue-100/90 hover:text-white transition-colors text-left"
                    >
                      {link.label}
                    </button>

                  </li>
                ))}

              </ul>

            </div>

            {/* ===================================================
                SERVICES
            =================================================== */}

            <div className="lg:col-span-3 space-y-2.5">

              <h3 className="text-[11px] font-black uppercase tracking-widest text-green-400">
                SERVICES
              </h3>

              <ul className="space-y-1.5">

                {FOOTER_LINKS.SERVICES.map((link) => (
                  <li key={link.label}>

                    <button
                      type="button"
                      onClick={() => handleNavigation(link.path)}
                      className="text-[13px] font-semibold text-blue-100/90 hover:text-white transition-colors text-left"
                    >
                      {link.label}
                    </button>

                  </li>
                ))}

              </ul>

            </div>

            {/* ===================================================
                CONTACT US
            =================================================== */}

            <div className="lg:col-span-3 space-y-2.5">

              <h3 className="text-[11px] font-black uppercase tracking-widest text-green-400">
                CONTACT US
              </h3>

              <div className="space-y-2.5 text-[13px] font-semibold text-blue-100/90">

                {/* EMAIL */}

                <button
                  type="button"
                  onClick={openGmailCompose}
                  className="
                    flex items-center gap-3
                    group
                    text-left
                    w-full
                    cursor-pointer
                    bg-transparent
                    border-0
                    p-0
                    text-[13px]
                    font-semibold
                    text-blue-100/90
                    hover:text-white
                    transition-colors
                  "
                >
                  <Mail
                    size={17}
                    className="shrink-0 text-green-400"
                  />

                  <span className="break-all">
                    megaclickofficial@gmail.com
                  </span>
                </button>

                {/* PHONE */}

                <a
                  href="tel:+919921611911"
                  className="
                    flex items-center gap-3
                    group
                    hover:text-white
                    transition-colors
                  "
                >
                  <Phone
                    size={17}
                    className="shrink-0 text-green-400"
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
                  className="
                    flex items-start gap-3
                    group
                    hover:text-white
                    transition-colors
                  "
                >
                  <MapPin
                    size={17}
                    className="mt-0.5 shrink-0 text-green-400"
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

          {/* =====================================================
              DESKTOP BOTTOM BAR
          ===================================================== */}

          <div className="pt-3.5 border-t-2 border-white/10 flex flex-col md:flex-row justify-between items-center gap-3">

            {/* STRAVEDA TECH */}

            <p className="text-[13px] font-semibold text-blue-100/90 normal-case tracking-normal">
              Straveda Tech.
            </p>

            {/* BACK TO TOP */}

            <div className="flex gap-6">

              <button
                type="button"
                onClick={scrollToTop}
                className="
                  text-[11px]
                  font-black
                  text-white/40
                  uppercase
                  tracking-[0.2em]
                  hover:text-green-400
                  cursor-pointer
                "
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