import React from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

import { SOCIAL_PROFILES } from "../data/socialLinks";
import { openWhatsApp } from "../lib/whatsapp";
import logo from "../assets/LOGO.png";
import stravedalogo from "/straveda-logo-cropped.png";

const FOOTER_LINKS = {
  EXPLORE: [
    { label: "Home", path: "/" },
    { label: "About Us", path: "/about" },
    { label: "Associate With Us", path: "/associate-with-us" },
    { label: "Privacy Policy", path: "/privacy-policy" },
    { label: "Terms & Conditions", path: "/terms-and-conditions" },
  ],

  SERVICES: [
    { label: "Legal Services", path: "/services?category=legal-services" },
    {
      label: "Business & Financial Services",
      path: "/services?category=business-financial-services",
    },
    { label: "IT Services", path: "/services?category=it-services" },
    { label: "Other Services", path: "/services?category=other-services" },
  ],
};

/* =========================================================
   SOCIAL LINKS
========================================================= */

const SOCIAL_LINKS = [
  {
    icon: FaFacebookF,
    href: SOCIAL_PROFILES.facebook.url || "#",
    label: "Facebook",
    iconColor: "text-[#1877F2]",
    bgColor: "bg-[#E8F1FF]",
    hoverColor: "hover:bg-[#DCEAFF]",
  },
  {
    icon: FaWhatsapp,
    href: SOCIAL_PROFILES.whatsapp.url,
    onClick: openWhatsApp,
    label: "WhatsApp",
    iconColor: "text-[#16A34A]",
    bgColor: "bg-[#E2F9EA]",
    hoverColor: "hover:bg-[#D3F5DF]",
  },
  {
    icon: FaInstagram,
    href: SOCIAL_PROFILES.instagram.url || "#",
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
        w-full
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
        .footer-container {
          width: 100%;
          max-width: 100%;
          margin: 0 auto;
          padding-left: 24px;
          padding-right: 24px;
          box-sizing: border-box;
        }

        /* =====================================================
           TABLET / DESKTOP BASE
        ===================================================== */

        @media (min-width: 768px) {
          .footer-container {
            max-width: 1500px;
            margin-left: auto;
            margin-right: auto;
          }
        }

        /* =====================================================
           1440px
        ===================================================== */

        @media (min-width: 1440px) {
          .footer-container {
            width: 100%;
            max-width: 1500px;
            margin-left: auto;
            margin-right: auto;
            padding-left: 40px;
            padding-right: 40px;
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
            max-width: 280px !important;
          }

          .footer-col-heading {
            font-size: 0.75rem !important;
            margin-bottom: 0.9rem !important;
          }

          .footer-link-text {
            font-size: 0.9rem !important;
            line-height: 1.5 !important;
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

        /* =====================================================
           1920px
        ===================================================== */

        @media (min-width: 1920px) {
          .footer-container {
            width: 100%;
            max-width: 1600px;
            margin-left: auto;
            margin-right: auto;
            padding-left: 50px;
            padding-right: 50px;
          }

          .footer-brand-column {
            width: 320px !important;
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
          }

          .footer-link-text {
            font-size: 0.95rem !important;
          }

          .footer-social-btn {
            width: 42px !important;
            height: 42px !important;
          }

          .footer-logo-img {
            width: 44px !important;
            height: 44px !important;
          }

          .footer-contact-icon {
            width: 17px !important;
            height: 17px !important;
          }
        }

        /* =====================================================
           2560px
        ===================================================== */

        @media (min-width: 2560px) {
          .footer-container {
            width: 100%;
            max-width: 1750px;
            margin-left: auto;
            margin-right: auto;
            padding-left: 60px;
            padding-right: 60px;
          }

          .footer-brand-column {
            width: 340px !important;
          }

          .footer-brand-title {
            font-size: 1.85rem !important;
          }

          .footer-brand-desc {
            font-size: 1rem !important;
            max-width: 340px !important;
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
            width: 18px !important;
            height: 18px !important;
          }
        }

        /* =====================================================
           3840px — 4K
           
           IMPORTANT:
           Footer background remains full width.
           Content also uses the complete viewport width instead
           of being restricted to a narrow 1900px container.
        ===================================================== */

        @media (min-width: 3840px) {
          .footer-container {
            width: 100%;
            max-width: none !important;
            margin-left: 0;
            margin-right: 0;
            padding-left: 5vw;
            padding-right: 5vw;
          }

          .footer-brand-column {
            width: auto !important;
            min-width: 0 !important;
          }

          .footer-brand-title {
            font-size: 2rem !important;
          }

          .footer-brand-desc {
            font-size: 1.05rem !important;
            line-height: 1.6 !important;
            max-width: 380px !important;
          }

          .footer-col-heading {
            font-size: 0.9rem !important;
            margin-bottom: 1.1rem !important;
          }

          .footer-link-text {
            font-size: 1.05rem !important;
            line-height: 1.55 !important;
          }

          .footer-social-btn {
            width: 46px !important;
            height: 46px !important;
          }

          .footer-logo-img {
            width: 52px !important;
            height: 52px !important;
          }

          .footer-contact-icon {
            width: 19px !important;
            height: 19px !important;
          }

          .footer-desktop-content {
            width: 100% !important;
          }

          .footer-desktop-content > .footer-main-row {
            width: 100% !important;
            grid-template-columns:
              minmax(360px, 1fr)
              minmax(0, 3fr) !important;
          }

          .footer-link-columns {
            width: 100% !important;
            grid-template-columns:
              repeat(3, minmax(0, 1fr)) !important;
          }
        }

        /* =====================================================
           DESKTOP LAYOUT
        ===================================================== */

        @media (min-width: 1024px) {
          .footer-main-row {
            grid-template-columns:
              minmax(260px, 1.05fr)
              minmax(0, 2.95fr) !important;
            width: 100%;
          }

          .footer-brand-column {
            min-width: 0;
          }

          .footer-link-columns {
            grid-column: 2 / -1;
            display: grid;
            grid-template-columns:
              repeat(3, minmax(0, 1fr));
            gap: 2.5rem;
            min-width: 0;
          }
        }

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

        /* =====================================================
           WATERMARK
        ===================================================== */

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

        @media (max-width: 767px) {
          .footer-watermark {
            font-size: 21vw !important;
          }
        }

        @media (min-width: 768px) {
          .footer-watermark {
            font-size: 18vw !important;
          }
        }

        @media (min-width: 1440px) {
          .footer-watermark {
            font-size: 15vw !important;
          }
        }

        @media (min-width: 1920px) {
          .footer-watermark {
            font-size: 13vw !important;
          }
        }

        @media (min-width: 2560px) {
          .footer-watermark {
            font-size: 12vw !important;
          }
        }

        @media (min-width: 3840px) {
          .footer-watermark {
            font-size: 11vw !important;
          }
        }
      `}</style>

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

              <h2
                className="
                  text-2xl
                  sm:text-[1.7rem]
                  font-bold
                  tracking-tight
                "
                style={{ fontFamily: "'Poppins', sans-serif" }}
              >
                <span className="text-white">Mega</span>
                <span className="text-green-400">Click</span>
              </h2>
            </div>

            <p
              className="
                text-[13px]
                sm:text-sm
                text-blue-100/90
                font-medium
                text-left
                leading-relaxed
              "
            >
              Exceptional value. Cost effective solutions.
            </p>
          </div>

          {/* EXPLORE */}

          <div className="w-full text-left">
            <h3
              className="
                text-[11px]
                sm:text-xs
                font-black
                uppercase
                tracking-widest
                text-green-400
                mb-2.5
              "
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              EXPLORE
            </h3>

            <div className="flex flex-col items-start gap-2.5">
              {FOOTER_LINKS.EXPLORE.map((link) => {
                if (link.label === "Privacy Policy") {
                  return (
                    <Link
                      key={link.label}
                      to={link.path}
                      className="
                        text-[13.5px]
                        sm:text-sm
                        font-semibold
                        text-blue-100/90
                        hover:text-white
                        transition-colors
                        text-left
                      "
                    >
                      {link.label}
                    </Link>
                  );
                }

                if (link.label === "Terms & Conditions") {
                  return (
                    <Link
                      key={link.label}
                      to={link.path}
                      className="
                        text-[13.5px]
                        sm:text-sm
                        font-semibold
                        text-blue-100/90
                        hover:text-white
                        transition-colors
                        text-left
                      "
                    >
                      {link.label}
                    </Link>
                  );
                }

                return (
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
                );
              })}
            </div>
          </div>

          {/* CONTACT US */}

          <div className="w-full text-left">
            <h3
              className="
                text-[11px]
                sm:text-xs
                font-black
                uppercase
                tracking-widest
                text-green-400
                mb-3
              "
            >
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
                  className="
                    shrink-0
                    mt-0.5
                    text-green-400
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
                  className="
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
                  className="
                    mt-1
                    shrink-0
                    text-green-400
                  "
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
                  onClick={social.onClick}
                  className="
                    w-10
                    h-10
                    sm:w-11
                    sm:h-11
                    rounded-full
                    border
                    border-white/25
                    bg-white/5
                    text-white
                    flex
                    items-center
                    justify-center
                    transition-all
                    duration-300
                    hover:scale-110
                    hover:bg-white/15
                    hover:border-white/50
                    cursor-pointer
                  "
                >
                  <Icon size={17} />
                </a>
              );
            })}
          </div>

          {/* MOBILE TECH PARTNER */}

          <a
            href="https://stravedatech.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex
              flex-col
              items-start
              justify-center
              gap-1
              w-full
              pt-1
              pb-1
              group
              transition-opacity
              hover:opacity-80
            "
            aria-label="Straveda Tech - Tech Partner"
          >
            <img
              src={stravedalogo}
              alt="Straveda"
              className="
                h-7
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
            <p
              className="
                text-[11px]
                sm:text-xs
                font-bold
                uppercase
                tracking-wider
                text-blue-100/70
                text-left
                leading-relaxed
              "
            >
              &copy; {new Date().getFullYear()} MegaClick. All rights reserved.
            </p>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              <Link
                to="/privacy-policy"
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
              </Link>

              <Link
                to="/terms-and-conditions"
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
                Terms & Conditions
              </Link>
            </div>
          </div>
        </div>

        {/* ===================================================
            DESKTOP & LAPTOP VIEW
        =================================================== */}

        <div className="hidden md:block footer-desktop-content">

          {/* MAIN DESKTOP ROW */}

          <div
            className="
              flex
              w-full
              flex-col
              lg:grid
              lg:grid-cols-[
                minmax(240px,1.25fr)
                _minmax(150px,0.75fr)
                _minmax(180px,0.85fr)
                _minmax(300px,1.35fr)
              ]
              lg:items-start
              gap-y-7
              gap-x-8
              min-[1440px]:gap-x-10
              min-[1920px]:gap-x-14
              min-[2560px]:gap-x-20
              footer-main-row
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
                <div
                  className="
                    flex
                    items-center
                    gap-3
                    min-[1920px]:gap-4
                    mb-1.5
                  "
                >
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
                      onClick={social.onClick}
                      className="
                        footer-social-btn
                        w-9
                        h-9
                        min-[1440px]:w-10
                        min-[1440px]:h-10
                        rounded-full
                        border
                        border-white/25
                        bg-white/5
                        text-white
                        flex
                        items-center
                        justify-center
                        transition-all
                        duration-300
                        hover:scale-110
                        hover:bg-white/15
                        hover:border-white/50
                        cursor-pointer
                      "
                    >
                      <Icon
                        size={16}
                        className="
                          min-[1920px]:w-[18px]
                          min-[1920px]:h-[18px]
                        "
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
                lg:grid
                lg:grid-cols-3
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
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  EXPLORE
                </h3>

                <ul className="space-y-1.5 min-[1920px]:space-y-2">
                  {FOOTER_LINKS.EXPLORE.map((link) => (
                    <li key={link.label}>
                      {link.label === "Privacy Policy" ||
                      link.label === "Terms & Conditions" ? (
                        <Link
                          to={link.path}
                          className="
                            footer-link-text
                            text-[13px]
                            font-semibold
                            text-blue-100/90
                            hover:text-white
                            transition-colors
                            text-left
                          "
                        >
                          {link.label}
                        </Link>
                      ) : (
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
                      )}
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
                  style={{ fontFamily: "'Poppins', sans-serif" }}
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
                  style={{ fontFamily: "'Poppins', sans-serif" }}
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