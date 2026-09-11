
import React from "react";
import { Phone, Mail, MapPin, ArrowUp } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import logo from "../assets/LOGO.png";
import stravedalogo from "/straveda-logo-cropped.png";

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
    { label: "Privacy Policy", path: "/privacy-policy" },
    { label: "Terms of Service", path: "/terms-of-service" },
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

    const gmailComposeUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      email
    )}`;

    window.open(gmailComposeUrl, "_blank");
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
    <footer
      className="
        relative
        mt-auto
        overflow-hidden
        bg-gradient-to-br
        from-[#0e57ac]
        via-[#083A7A]
        to-[#041d3d]
        text-white
        font-['Inter',sans-serif]
        pt-5
        sm:pt-6
        md:pt-7
        min-[1440px]:pt-8
        min-[1920px]:pt-10
        min-[2560px]:pt-12
        min-[3840px]:pt-14
        pb-4
        sm:pb-5
        md:pb-5
        min-[1920px]:pb-6
        min-[3840px]:pb-8
        footer-section
      "
    >
      {/* =====================================================
          RESPONSIVE FOOTER CSS
      ===================================================== */}
      <style>{`
        /* ===================================================
           BASE CONTAINER
        =================================================== */

        .footer-container {
          width: 100%;
          max-width: 100%;
          margin-left: auto;
          margin-right: auto;
          padding-left: 1rem;
          padding-right: 1rem;
        }

        /* ===================================================
           SMALL MOBILE
        =================================================== */

        @media (min-width: 375px) {
          .footer-container {
            padding-left: 1.25rem;
            padding-right: 1.25rem;
          }
        }

        /* ===================================================
           TABLET
        =================================================== */

        @media (min-width: 640px) {
          .footer-container {
            max-width: 640px;
            padding-left: 1.5rem;
            padding-right: 1.5rem;
          }
        }

        @media (min-width: 768px) {
          .footer-container {
            max-width: 768px;
            padding-left: 2rem;
            padding-right: 2rem;
          }
        }

        /* ===================================================
           SMALL LAPTOP
        =================================================== */

        @media (min-width: 1024px) {
          .footer-container {
            max-width: 1180px;
            padding-left: 2rem;
            padding-right: 2rem;
          }

          .footer-brand-column {
            width: 235px !important;
          }

          .footer-brand-title {
            font-size: 1.45rem !important;
          }

          .footer-brand-desc {
            font-size: 0.82rem !important;
            line-height: 1.5 !important;
          }

          .footer-col-heading {
            font-size: 0.7rem !important;
            margin-bottom: 0.75rem !important;
          }

          .footer-link-text {
            font-size: 0.78rem !important;
            line-height: 1.45 !important;
          }

          .footer-contact-icon {
            width: 15px !important;
            height: 15px !important;
          }

          .footer-social-btn {
            width: 36px !important;
            height: 36px !important;
          }
        }

        /* ===================================================
           1280px
        =================================================== */

        @media (min-width: 1280px) {
          .footer-container {
            max-width: 1280px;
            padding-left: 2.5rem;
            padding-right: 2.5rem;
          }

          .footer-brand-column {
            width: 270px !important;
          }

          .footer-brand-title {
            font-size: 1.55rem !important;
          }

          .footer-brand-desc {
            font-size: 0.86rem !important;
          }

          .footer-link-text {
            font-size: 0.84rem !important;
          }
        }

        /* ===================================================
           1366px / STANDARD LAPTOP
        =================================================== */

        @media (min-width: 1366px) {
          .footer-container {
            max-width: 1340px;
            padding-left: 2.5rem;
            padding-right: 2.5rem;
          }

          .footer-brand-column {
            width: 285px !important;
          }

          .footer-brand-title {
            font-size: 1.6rem !important;
          }

          .footer-brand-desc {
            font-size: 0.88rem !important;
          }

          .footer-col-heading {
            font-size: 0.73rem !important;
          }

          .footer-link-text {
            font-size: 0.87rem !important;
          }
        }

        /* ===================================================
           1440px DESKTOP
        =================================================== */

        @media (min-width: 1440px) {
          .footer-container {
            max-width: 1440px;
            padding-left: 3rem;
            padding-right: 3rem;
          }

          .footer-brand-column {
            width: 300px !important;
          }

          .footer-brand-title {
            font-size: 1.65rem !important;
          }

          .footer-brand-desc {
            font-size: 0.9rem !important;
            line-height: 1.5 !important;
          }

          .footer-col-heading {
            font-size: 0.75rem !important;
            margin-bottom: 0.9rem !important;
          }

          .footer-link-text {
            font-size: 0.9rem !important;
          }

          .footer-social-btn {
            width: 40px !important;
            height: 40px !important;
          }

          .footer-logo-img {
            width: 40px !important;
            height: 40px !important;
          }
        }

        /* ===================================================
           1600px
        =================================================== */

        @media (min-width: 1600px) {
          .footer-container {
            max-width: 1600px;
            padding-left: 3.5rem;
            padding-right: 3.5rem;
          }

          .footer-brand-column {
            width: 320px !important;
          }

          .footer-brand-title {
            font-size: 1.75rem !important;
          }

          .footer-brand-desc {
            font-size: 0.95rem !important;
          }

          .footer-link-text {
            font-size: 0.95rem !important;
          }
        }

        /* ===================================================
           1920px FULL HD
        =================================================== */

        @media (min-width: 1920px) {
          .footer-container {
            max-width: 1800px;
            padding-left: 4rem;
            padding-right: 4rem;
          }

          .footer-brand-column {
            width: 350px !important;
          }

          .footer-brand-title {
            font-size: 1.9rem !important;
          }

          .footer-brand-desc {
            font-size: 1rem !important;
            max-width: 340px !important;
            line-height: 1.55 !important;
          }

          .footer-col-heading {
            font-size: 0.85rem !important;
            margin-bottom: 1rem !important;
          }

          .footer-link-text {
            font-size: 1rem !important;
            line-height: 1.5 !important;
          }

          .footer-social-btn {
            width: 44px !important;
            height: 44px !important;
          }

          .footer-logo-img {
            width: 48px !important;
            height: 48px !important;
          }

          .footer-contact-icon {
            width: 17px !important;
            height: 17px !important;
          }
        }

        /* ===================================================
           2200px
        =================================================== */

        @media (min-width: 2200px) {
          .footer-container {
            max-width: 2100px;
            padding-left: 4.5rem;
            padding-right: 4.5rem;
          }

          .footer-brand-column {
            width: 400px !important;
          }

          .footer-brand-title {
            font-size: 2.15rem !important;
          }

          .footer-brand-desc {
            font-size: 1.1rem !important;
            max-width: 390px !important;
          }

          .footer-col-heading {
            font-size: 0.95rem !important;
          }

          .footer-link-text {
            font-size: 1.1rem !important;
          }

          .footer-social-btn {
            width: 48px !important;
            height: 48px !important;
          }
        }

        /* ===================================================
           2560px QHD / 2K
        =================================================== */

        @media (min-width: 2560px) {
          .footer-container {
            max-width: 2300px;
            padding-left: 5rem;
            padding-right: 5rem;
          }

          .footer-brand-column {
            width: 450px !important;
          }

          .footer-brand-title {
            font-size: 2.5rem !important;
          }

          .footer-brand-desc {
            font-size: 1.25rem !important;
            max-width: 450px !important;
            line-height: 1.6 !important;
          }

          .footer-col-heading {
            font-size: 1.05rem !important;
            margin-bottom: 1.25rem !important;
          }

          .footer-link-text {
            font-size: 1.25rem !important;
            line-height: 1.55 !important;
          }

          .footer-social-btn {
            width: 54px !important;
            height: 54px !important;
          }

          .footer-logo-img {
            width: 60px !important;
            height: 60px !important;
          }

          .footer-contact-icon {
            width: 19px !important;
            height: 19px !important;
          }
        }

        /* ===================================================
           3200px
        =================================================== */

        @media (min-width: 3200px) {
          .footer-container {
            max-width: 2900px;
            padding-left: 5.5rem;
            padding-right: 5.5rem;
          }

          .footer-brand-column {
            width: 520px !important;
          }

          .footer-brand-title {
            font-size: 3rem !important;
          }

          .footer-brand-desc {
            font-size: 1.45rem !important;
            max-width: 520px !important;
          }

          .footer-col-heading {
            font-size: 1.2rem !important;
          }

          .footer-link-text {
            font-size: 1.45rem !important;
          }

          .footer-social-btn {
            width: 62px !important;
            height: 62px !important;
          }
        }

        /* ===================================================
           3840px 4K
        =================================================== */

        @media (min-width: 3840px) {
          .footer-container {
            max-width: 3400px;
            padding-left: 6rem;
            padding-right: 6rem;
          }

          .footer-brand-column {
            width: 600px !important;
          }

          .footer-logo-img {
            width: 88px !important;
            height: 88px !important;
            border-width: 2px !important;
          }

          .footer-brand-title {
            font-size: 3.5rem !important;
          }

          .footer-brand-desc {
            font-size: 1.6rem !important;
            max-width: 600px !important;
            line-height: 1.6 !important;
          }

          .footer-col-heading {
            font-size: 1.35rem !important;
            margin-bottom: 1.75rem !important;
          }

          .footer-link-text {
            font-size: 1.6rem !important;
            line-height: 1.6 !important;
          }

          .footer-social-btn {
            width: 72px !important;
            height: 72px !important;
          }

          .footer-contact-icon {
            width: 30px !important;
            height: 30px !important;
          }
        }

        /* ===================================================
           DESKTOP CONTENT ALIGNMENT
        =================================================== */

        @media (min-width: 768px) {
          .footer-desktop-content {
            width: 100%;
          }

          .footer-link-columns {
            min-width: 0;
          }

          .footer-link-column {
            min-width: 0;
          }

          .footer-link-text {
            max-width: 100%;
            overflow-wrap: anywhere;
            word-break: normal;
          }

          .footer-contact-item {
            min-width: 0;
          }

          .footer-contact-item span {
            min-width: 0;
            overflow-wrap: anywhere;
          }
        }

        /* ===================================================
           MOBILE SAFETY / OVERFLOW
        =================================================== */

        @media (max-width: 767px) {
          .footer-mobile-content {
            width: 100%;
            min-width: 0;
          }

          .footer-mobile-content > div {
            min-width: 0;
          }

          .footer-mobile-contact {
            width: 100%;
            min-width: 0;
          }

          .footer-mobile-contact span {
            min-width: 0;
            overflow-wrap: anywhere;
          }

          .footer-watermark {
            font-size: 21vw !important;
          }
        }

        /* ===================================================
           WATERMARK RESPONSIVE SCALING
        =================================================== */

        .footer-watermark {
          font-family:
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            Roboto,
            sans-serif;
          letter-spacing: -0.03em;
        }

        @media (min-width: 768px) {
          .footer-watermark {
            font-size: 18vw !important;
          }
        }

        @media (min-width: 1440px) {
          .footer-watermark {
            font-size: 17vw !important;
          }
        }

        @media (min-width: 1920px) {
          .footer-watermark {
            font-size: 15vw !important;
          }
        }

        @media (min-width: 2560px) {
          .footer-watermark {
            font-size: 14vw !important;
          }
        }

        @media (min-width: 3840px) {
          .footer-watermark {
            font-size: 13vw !important;
          }
        }
      `}</style>

      {/* =====================================================
          TOP ACCENT LINE
      ===================================================== */}
      <div className="h-1 bg-green-400 absolute top-0 left-0 right-0 z-10" />

      {/* =====================================================
          MEGACLICK WATERMARK
      ===================================================== */}
      <div
        className="
          absolute
          inset-0
          z-0
          flex
          items-end
          justify-center
          pointer-events-none
          select-none
          overflow-hidden
          pb-2
          md:pb-0
        "
        aria-hidden="true"
      >
        <div
          className="
            absolute
            -top-1/4
            left-1/2
            -translate-x-1/2
            md:top-0
            md:left-auto
            md:right-0
            md:translate-x-1/4
            w-3/4
            h-2/3
            bg-[#3b82f6]/25
            blur-[130px]
            rounded-full
            pointer-events-none
          "
        />

        <span
          className="
            footer-watermark
            text-[20vw]
            md:text-[18vw]
            font-black
            uppercase
            tracking-tight
            whitespace-nowrap
            text-center
            text-white/[0.06]
            md:text-white/[0.07]
            leading-[0.8]
            select-none
          "
          style={{
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 18%, black 82%, transparent 100%), linear-gradient(to bottom, black 55%, transparent 100%)",
            WebkitMaskComposite: "source-in",
            maskImage:
              "linear-gradient(to right, transparent 0%, black 18%, black 82%, transparent 100%), linear-gradient(to bottom, black 55%, transparent 100%)",
            maskComposite: "intersect",
          }}
        >
          MEGACLICK
        </span>
      </div>

      {/* =====================================================
          MAIN FOOTER CONTENT
      ===================================================== */}
      <div className="relative z-10 footer-container">
        {/* ===================================================
            MOBILE VIEW
        =================================================== */}
        <div
          className="
            md:hidden
            footer-mobile-content
            w-full
            flex
            flex-col
            items-start
            text-left
            px-0
            pb-1
            space-y-6
          "
        >
          {/* BACK TO TOP */}
          <button
            type="button"
            onClick={scrollToTop}
            className="
              ml-auto
              flex
              items-center
              gap-1.5
              text-[11px]
              sm:text-xs
              font-black
              text-white/70
              uppercase
              tracking-[0.15em]
              hover:text-green-400
              transition-colors
              cursor-pointer
              p-0
              bg-transparent
              border-none
            "
          >
            <ArrowUp size={13} className="shrink-0" />
            Back to Top
          </button>

          {/* LOGO & BRAND INFO */}
          <div className="w-full min-w-0">
            <div className="flex items-center justify-start gap-3 mb-2">
              <img
                src={logo}
                alt="MegaClick"
                className="
                  w-10
                  h-10
                  sm:w-11
                  sm:h-11
                  rounded-full
                  object-contain
                  p-1
                  border
                  border-blue-300
                  bg-white
                  shadow-md
                  shadow-blue-900/30
                  shrink-0
                "
              />

              <h2 className="text-2xl sm:text-[1.7rem] font-bold tracking-tight">
                <span className="text-white">Mega</span>
                <span className="text-green-400">Click</span>
              </h2>
            </div>

            <p className="text-[13px] sm:text-sm text-blue-100/90 font-medium text-left leading-relaxed">
              Exceptional value. Cost effective solutions.
            </p>
          </div>

          {/* EXPLORE */}
          <div className="w-full text-left">
            <h3 className="text-[11px] sm:text-xs font-black uppercase tracking-widest text-green-400 mb-2.5">
              EXPLORE
            </h3>

            <div className="flex flex-col items-start gap-2.5">
              {FOOTER_LINKS.EXPLORE.map((link) => (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => handleNavigation(link.path)}
                  className="
                    text-[13.5px]
                    sm:text-sm
                    font-semibold
                    text-blue-100/90
                    hover:text-white
                    transition-colors
                    text-left
                    cursor-pointer
                    p-0
                    bg-transparent
                    border-none
                  "
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* SERVICES */}
          <div className="w-full text-left">
            <h3 className="text-[11px] sm:text-xs font-black uppercase tracking-widest text-green-400 mb-2.5">
              SERVICES
            </h3>

            <div className="flex flex-col items-start gap-2.5">
              {FOOTER_LINKS.SERVICES.map((link) => (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => handleNavigation(link.path)}
                  className="
                    text-[13.5px]
                    sm:text-sm
                    font-semibold
                    text-blue-100/90
                    hover:text-white
                    transition-colors
                    text-left
                    cursor-pointer
                    p-0
                    bg-transparent
                    border-none
                  "
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* CONTACT US */}
          <div className="w-full text-left">
            <h3 className="text-[11px] sm:text-xs font-black uppercase tracking-widest text-green-400 mb-3">
              CONTACT US
            </h3>

            <div
              className="
                footer-mobile-contact
                flex
                flex-col
                items-start
                gap-3.5
                text-[13px]
                sm:text-sm
                font-semibold
                text-blue-100/90
              "
            >
              {/* EMAIL */}
              <button
                type="button"
                onClick={openGmailCompose}
                className="
                  flex
                  items-start
                  gap-3
                  text-left
                  w-full
                  cursor-pointer
                  bg-transparent
                  border-0
                  p-0
                  text-[13px]
                  sm:text-sm
                  font-semibold
                  text-blue-100/90
                  hover:text-white
                  transition-colors
                "
              >
                <Mail
                  size={16}
                  className="shrink-0 mt-0.5 text-green-400"
                />

                <span className="break-all">
                  megaclickofficial@gmail.com
                </span>
              </button>

              {/* PHONE */}
              <a
                href="tel:+919921611911"
                className="
                  flex
                  items-center
                  gap-3
                  hover:text-white
                  transition-colors
                  text-left
                "
              >
                <Phone
                  size={16}
                  className="shrink-0 text-green-400"
                />

                <span>+91 9921611911</span>
              </a>

              {/* ADDRESS */}
              <a
                href="https://www.google.com/maps/search/?api=1&query=4th+Floor+Tristar+Complex+Jehan+Circle+Gangapur+Road+Nashik+Maharashtra+422005"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  flex
                  items-start
                  gap-3
                  hover:text-white
                  transition-colors
                  text-left
                  w-full
                "
              >
                <MapPin
                  size={16}
                  className="mt-1 shrink-0 text-green-400"
                />

                <span className="leading-snug text-left">
                  4th Floor, Tristar Complex,
                  <br />
                  Jehan Circle, Gangapur Road,
                  <br />
                  Nashik, Maharashtra - 422005
                </span>
              </a>
            </div>
          </div>

          {/* SOCIAL ICONS */}
          <div className="flex justify-start items-center gap-3 pt-1">
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
                    w-10
                    h-10
                    sm:w-11
                    sm:h-11
                    rounded-full
                    ${social.bgColor}
                    ${social.iconColor}
                    flex
                    items-center
                    justify-center
                    transition-all
                    duration-300
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

          {/* MOBILE BOTTOM BAR */}
          <div
            className="
              border-t
              border-white/10
              pt-4
              w-full
              flex
              flex-col
              gap-2
              text-left
            "
          >
            <p className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-blue-100/70 text-left leading-relaxed">
              &copy; {new Date().getFullYear()} MegaClick. All rights reserved.
            </p>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <a
                href="/privacy-policy"
                className="
                  text-[11px]
                  sm:text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  text-blue-100/70
                  hover:text-green-400
                  transition-colors
                "
              >
                Privacy Policy
              </a>

              <a
                href="/terms-of-service"
                className="
                  text-[11px]
                  sm:text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  text-blue-100/70
                  hover:text-green-400
                  transition-colors
                "
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>

        {/* ===================================================
            DESKTOP & LAPTOP VIEW
        =================================================== */}
        <div className="hidden md:block footer-desktop-content">
          {/* BACK TO TOP */}
          <div
            className="
              flex
              justify-end
              mb-3
              min-[1440px]:mb-4
              min-[1920px]:mb-5
            "
          >
            <button
              type="button"
              onClick={scrollToTop}
              className="
                flex
                items-center
                gap-1.5
                text-[11px]
                min-[1440px]:text-xs
                min-[1920px]:text-sm
                font-black
                text-white/70
                uppercase
                tracking-[0.2em]
                hover:text-green-400
                transition-colors
                cursor-pointer
                p-0
                bg-transparent
                border-none
              "
            >
              <ArrowUp
                size={13}
                className="shrink-0 min-[1920px]:w-4 min-[1920px]:h-4"
              />

              Back to Top
            </button>
          </div>

          {/* MAIN DESKTOP ROW */}
          <div
            className="
              flex
              flex-col
              lg:flex-row
              lg:items-start
              gap-y-7
              gap-x-8
              min-[1440px]:gap-x-10
              min-[1920px]:gap-x-14
              min-[2560px]:gap-x-20
              mb-4
              min-[1920px]:mb-6
            "
          >
            {/* BRAND */}
            <div
              className="
                footer-brand-column
                lg:shrink-0
                space-y-3.5
                min-[1440px]:space-y-4
                min-[1920px]:space-y-5
              "
            >
              <div>
                <div className="flex items-center gap-3 min-[1920px]:gap-4 mb-1.5">
                  <img
                    src={logo}
                    alt="MegaClick"
                    className="
                      footer-logo-img
                      w-9
                      h-9
                      min-[1440px]:w-10
                      min-[1440px]:h-10
                      rounded-full
                      object-contain
                      p-1
                      border
                      border-blue-300
                      bg-white
                      shadow-md
                      shadow-blue-900/30
                      shrink-0
                    "
                  />

                  <h2
                    className="
                      footer-brand-title
                      text-xl
                      min-[1440px]:text-2xl
                      font-bold
                      tracking-tight
                      whitespace-nowrap
                    "
                  >
                    <span className="text-white">Mega</span>
                    <span className="text-green-400">Click</span>
                  </h2>
                </div>

                <p
                  className="
                    footer-brand-desc
                    mt-1.5
                    text-[13px]
                    min-[1440px]:text-[14px]
                    text-blue-100/90
                    font-medium
                    leading-snug
                    max-w-[280px]
                  "
                >
                  Exceptional value.
                  <br />
                  Cost effective solutions.
                </p>
              </div>

              {/* SOCIAL ICONS */}
              <div
                className="
                  flex
                  gap-2.5
                  min-[1440px]:gap-3
                  min-[1920px]:gap-3.5
                  pt-1
                "
              >
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
                        footer-social-btn
                        w-9
                        h-9
                        min-[1440px]:w-10
                        min-[1440px]:h-10
                        rounded-full
                        ${social.bgColor}
                        ${social.iconColor}
                        flex
                        items-center
                        justify-center
                        transition-all
                        duration-300
                        hover:scale-110
                        ${social.hoverColor}
                        cursor-pointer
                      `}
                    >
                      <Icon
                        size={16}
                        className="min-[1920px]:w-[18px] min-[1920px]:h-[18px]"
                      />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* LINK COLUMNS */}
            <div
              className="
                footer-link-columns
                grid
                grid-cols-2
                sm:grid-cols-3
                lg:flex
                lg:flex-1
                lg:justify-between
                gap-y-8
                gap-x-6
                lg:gap-x-10
                min-[1920px]:gap-x-16
                min-[2560px]:gap-x-24
              "
            >
              {/* EXPLORE */}
              <div className="footer-link-column space-y-2.5 min-w-0">
                <h3
                  className="
                    footer-col-heading
                    text-[11px]
                    font-black
                    uppercase
                    tracking-widest
                    text-green-400
                  "
                >
                  EXPLORE
                </h3>

                <ul className="space-y-1.5 min-[1920px]:space-y-2">
                  {FOOTER_LINKS.EXPLORE.map((link) => (
                    <li key={link.label}>
                      <button
                        type="button"
                        onClick={() => handleNavigation(link.path)}
                        className="
                          footer-link-text
                          text-[13px]
                          font-semibold
                          text-blue-100/90
                          hover:text-white
                          transition-colors
                          text-left
                          cursor-pointer
                          p-0
                          bg-transparent
                          border-none
                        "
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* SERVICES */}
              <div className="footer-link-column space-y-2.5 min-w-0">
                <h3
                  className="
                    footer-col-heading
                    text-[11px]
                    font-black
                    uppercase
                    tracking-widest
                    text-green-400
                  "
                >
                  SERVICES
                </h3>

                <ul className="space-y-1.5 min-[1920px]:space-y-2">
                  {FOOTER_LINKS.SERVICES.map((link) => (
                    <li key={link.label}>
                      <button
                        type="button"
                        onClick={() => handleNavigation(link.path)}
                        className="
                          footer-link-text
                          text-[13px]
                          font-semibold
                          text-blue-100/90
                          hover:text-white
                          transition-colors
                          text-left
                          cursor-pointer
                          p-0
                          bg-transparent
                          border-none
                        "
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* CONTACT US */}
              <div className="footer-link-column space-y-2.5 min-w-0">
                <h3
                  className="
                    footer-col-heading
                    text-[11px]
                    font-black
                    uppercase
                    tracking-widest
                    text-green-400
                  "
                >
                  CONTACT US
                </h3>

                <div
                  className="
                    space-y-2.5
                    min-[1920px]:space-y-3
                    text-[13px]
                    font-semibold
                    text-blue-100/90
                  "
                >
                  {/* EMAIL */}
                  <button
                    type="button"
                    onClick={openGmailCompose}
                    className="
                      footer-link-text
                      footer-contact-item
                      flex
                      items-start
                      gap-3
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
                      size={16}
                      className="
                        footer-contact-icon
                        shrink-0
                        text-green-400
                        mt-0.5
                      "
                    />

                    <span className="break-all">
                      megaclickofficial@gmail.com
                    </span>
                  </button>

                  {/* PHONE */}
                  <a
                    href="tel:+919921611911"
                    className="
                      footer-link-text
                      footer-contact-item
                      flex
                      items-center
                      gap-3
                      group
                      hover:text-white
                      transition-colors
                    "
                  >
                    <Phone
                      size={16}
                      className="
                        footer-contact-icon
                        shrink-0
                        text-green-400
                      "
                    />

                    <span>+91 9921611911</span>
                  </a>

                  {/* ADDRESS */}
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=4th+Floor+Tristar+Complex+Jehan+Circle+Gangapur+Road+Nashik+Maharashtra+422005"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="
                      footer-link-text
                      footer-contact-item
                      flex
                      items-start
                      gap-3
                      group
                      hover:text-white
                      transition-colors
                    "
                  >
                    <MapPin
                      size={16}
                      className="
                        footer-contact-icon
                        mt-0.5
                        shrink-0
                        text-green-400
                      "
                    />

                    <span className="leading-tight">
                      4th Floor, Tristar Complex,
                      <br />
                      Jehan Circle, Gangapur Road,
                      <br />
                      Nashik, Maharashtra - 422005
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* =================================================
              DESKTOP BOTTOM BAR
          ================================================= */}
          <div
            className="
              pt-3.5
              min-[1920px]:pt-5
              border-t
              border-white/10
              flex
              flex-col
              md:flex-row
              justify-between
              items-center
              gap-3
              min-[1920px]:gap-5
            "
          >
            <p
              className="
                text-[11px]
                min-[1920px]:text-xs
                min-[2560px]:text-sm
                min-[3840px]:text-lg
                font-bold
                text-white/50
                uppercase
                tracking-[0.15em]
                text-center
                md:text-left
              "
            >
              &copy; {new Date().getFullYear()} MegaClick. All rights reserved.
            </p>

            {/* Straveda Tech Partner Badge */}
            <a
              href="https://stravedatech.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="
                flex
                flex-col
                items-center
                gap-1
                group
                transition-opacity
                hover:opacity-80
              "
              aria-label="Straveda Tech - Tech Partner"
            >
              {/* Straveda logo image (contains the STRAVEDA wordmark in full color) */}
              <img
                src={stravedalogo}
                alt="Straveda"
                className="
                  h-6
                  min-[1920px]:h-8
                  min-[2560px]:h-10
                  min-[3840px]:h-14
                  w-auto
                  object-contain
                  opacity-95
                  group-hover:opacity-100
                  transition-opacity
                "
              />
              <span
                className="
                  text-[9px]
                  min-[1920px]:text-[11px]
                  min-[2560px]:text-xs
                  min-[3840px]:text-sm
                  font-semibold
                  text-white/50
                  uppercase
                  tracking-[0.25em]
                  group-hover:text-white/70
                  transition-colors
                "
              >
                TECH PARTNER
              </span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;