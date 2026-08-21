import React, { useEffect } from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaWhatsapp,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import logo from "../assets/LOGO.png";

// ======================================================
// FOOTER LINKS
// ======================================================

const FOOTER_LINKS = {
  EXPLORE: [
    { label: "Home", path: "/" },
    { label: "About Us", path: "/about" },
    { label: "Services", path: "/services" },
    { label: "Associate With Us", path: "/associate-with-us" },
    { label: "Contact Us", path: "/contact" },
  ],

  SERVICES: [
    {
      label: "Business Registration",
      path: "/services",
    },
    {
      label: "Tax & Compliance Services",
      path: "/services",
    },
    {
      label: "Financial & Legal Solutions",
      path: "/services",
    },
  ],
};

// ======================================================
// SOCIAL LINKS
// ======================================================

const SOCIAL_LINKS = [
  {
    icon: FaLinkedinIn,
    href: "#",
    label: "LinkedIn",
    hoverClass:
      "hover:bg-[#0077B5] hover:border-[#0077B5] hover:shadow-[#0077B5]/40",
  },
  {
    icon: FaInstagram,
    href: "#",
    label: "Instagram",
    hoverClass:
      "hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:border-transparent hover:shadow-pink-600/40",
  },
  {
    icon: FaFacebookF,
    href: "#",
    label: "Facebook",
    hoverClass:
      "hover:bg-[#1877F2] hover:border-[#1877F2] hover:shadow-[#1877F2]/40",
  },
  {
    icon: FaWhatsapp,
    href: "https://wa.me/919921611911",
    label: "WhatsApp",
    hoverClass:
      "hover:bg-[#25D366] hover:border-[#25D366] hover:shadow-[#25D366]/40",
  },
];

// ======================================================
// FOOTER
// ======================================================

const Footer = () => {
  const navigate = useNavigate();

  // ====================================================
  // LOAD HEDVIG + INTER FONT
  // ====================================================

  useEffect(() => {
    const fontId = "google-fonts-hedvig-inter";

    if (!document.getElementById(fontId)) {
      const link = document.createElement("link");

      link.id = fontId;
      link.rel = "stylesheet";

      link.href =
        "https://fonts.googleapis.com/css2?family=Hedvig+Letters+Serif:opsz@12..24&family=Inter:wght@400;500;600;700;800&display=swap";

      document.head.appendChild(link);
    }
  }, []);

  // ====================================================
  // OPEN GMAIL
  // ====================================================

  const openGmailCompose = () => {
    const email = "megaclickofficial@gmail.com";

    const isMobile = /Android|iPhone|iPad|iPod/i.test(
      navigator.userAgent
    );

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

  // ====================================================
  // SCROLL TO TOP
  // ====================================================

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

  // ====================================================
  // NAVIGATION
  // ====================================================

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
        bg-[#083A7A]
        text-white
        font-['Inter',sans-serif]
        pt-8
        sm:pt-10
        pb-5
      "
    >
      {/* =====================================================
          TOP GREEN ACCENT LINE
      ===================================================== */}

      <div className="h-1 bg-green-400 absolute top-0 left-0 right-0 z-10" />

      {/* =====================================================
          BACKGROUND WATERMARK
          MEGACLICK - HEDVIG LETTERS SERIF
      ===================================================== */}

      <div
        className="
          absolute
          inset-0
          z-0
          flex
          items-center
          justify-center
          pointer-events-none
          select-none
          overflow-hidden
        "
        aria-hidden="true"
      >
        {/* Soft Ambient Glow */}

        <div
          className="
            absolute
            top-1/2
            left-1/2
            -translate-x-1/2
            -translate-y-1/2
            w-3/4
            h-1/2
            bg-blue-400/10
            blur-[120px]
            rounded-full
            pointer-events-none
          "
        />

        {/* =================================================
            MEGACLICK WATERMARK
            HEDVIG LETTERS SERIF
        ================================================= */}

        <span
          className="
            text-[18vw]
            sm:text-[17vw]
            lg:text-[16vw]
            font-bold
            whitespace-nowrap
            text-center
            text-white/[0.045]
            leading-none
            select-none
          "
          style={{
            fontFamily: "'Hedvig Letters Serif', serif",
            letterSpacing: "-0.04em",
          }}
        >
          MEGACLICK
        </span>
      </div>

      {/* =====================================================
          MAIN FOOTER CONTENT
      ===================================================== */}

      <div
        className="
          relative
          z-10
          max-w-[1500px]
          mx-auto
          px-5
          sm:px-8
          lg:px-16
          xl:px-24
        "
      >
        {/* =================================================
            MOBILE FOOTER
        ================================================= */}

        <div className="flex flex-col items-center text-center md:hidden pb-1">
          {/* BRAND */}

          <div className="flex items-center gap-3 mb-2">
            <img
              src={logo}
              alt="MegaClick"
              className="
                w-10
                h-10
                rounded-full
                object-contain
                p-1
                border
                border-blue-300
                bg-white
                shadow-md
                shadow-blue-900/30
              "
            />

            <h2
              className="text-2xl font-bold tracking-tight"
              style={{
                fontFamily: "'Hedvig Letters Serif', serif",
              }}
            >
              <span className="text-white">Mega</span>
              <span className="text-green-400">Click</span>
            </h2>
          </div>

          {/* TAGLINE */}

          <p className="text-[13px] text-blue-100/90 font-medium mb-4">
            Exceptional value. Cost effective solutions.
          </p>

          {/* NAV LINKS */}

          <div
            className="
              grid
              grid-cols-2
              gap-x-10
              gap-y-3.5
              mb-5
              w-full
              max-w-xs
            "
          >
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
                  text-center
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
                  text-center
                "
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* SOCIAL ICONS */}

          <div className="flex gap-3.5 mb-5">
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
                    rounded-full
                    border
                    border-white/20
                    bg-white/5
                    text-white/90
                    flex
                    items-center
                    justify-center
                    transition-all
                    duration-300
                    transform
                    hover:scale-110
                    hover:text-white
                    hover:shadow-lg
                    cursor-pointer
                    ${social.hoverClass}
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
              border-t-2
              border-white/10
              pt-3.5
              w-full
              flex
              flex-col
              items-center
              gap-2
              text-[11px]
              font-black
              text-white/40
              uppercase
              tracking-[0.2em]
            "
          >
            <p>© 2026 MegaClick. All rights reserved.</p>

            <div className="flex gap-6">
              <button
                type="button"
                onClick={scrollToTop}
                className="
                  hover:text-green-400
                  uppercase
                  cursor-pointer
                "
              >
                Back to Top ↑
              </button>
            </div>
          </div>
        </div>

        {/* =================================================
            DESKTOP FOOTER
        ================================================= */}

        <div className="hidden md:block">
          <div
            className="
              grid
              grid-cols-4
              lg:grid-cols-12
              gap-y-6
              gap-x-8
              mb-5
              pt-1
            "
          >
            {/* =================================================
                BRAND COLUMN
            ================================================= */}

            <div className="lg:col-span-4 space-y-4">
              <div>
                <div className="flex items-center gap-3 mb-1.5">
                  <img
                    src={logo}
                    alt="MegaClick"
                    className="
                      w-10
                      h-10
                      rounded-full
                      object-contain
                      p-1
                      border
                      border-blue-300
                      bg-white
                      shadow-md
                      shadow-blue-900/30
                    "
                  />

                  <h2
                    className="text-2xl font-bold tracking-tight"
                    style={{
                      fontFamily: "'Hedvig Letters Serif', serif",
                    }}
                  >
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
                        w-10
                        h-10
                        rounded-full
                        border
                        border-white/20
                        bg-white/5
                        text-white/90
                        flex
                        items-center
                        justify-center
                        transition-all
                        duration-300
                        transform
                        hover:scale-110
                        hover:text-white
                        hover:shadow-lg
                        cursor-pointer
                        ${social.hoverClass}
                      `}
                    >
                      <Icon size={17} />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* =================================================
                EXPLORE COLUMN
            ================================================= */}

            <div className="lg:col-span-2 space-y-2.5">
              <h3
                className="
                  text-[11px]
                  font-bold
                  uppercase
                  tracking-widest
                  text-green-400
                "
                style={{
                  fontFamily: "'Hedvig Letters Serif', serif",
                }}
              >
                EXPLORE
              </h3>

              <ul className="space-y-1.5">
                {FOOTER_LINKS.EXPLORE.map((link) => (
                  <li key={link.label}>
                    <button
                      type="button"
                      onClick={() => handleNavigation(link.path)}
                      className="
                        text-[13px]
                        font-semibold
                        text-blue-100/90
                        hover:text-white
                        transition-colors
                        text-left
                      "
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* =================================================
                SERVICES COLUMN
            ================================================= */}

            <div className="lg:col-span-3 space-y-2.5">
              <h3
                className="
                  text-[11px]
                  font-bold
                  uppercase
                  tracking-widest
                  text-green-400
                "
                style={{
                  fontFamily: "'Hedvig Letters Serif', serif",
                }}
              >
                SERVICES
              </h3>

              <ul className="space-y-1.5">
                {FOOTER_LINKS.SERVICES.map((link) => (
                  <li key={link.label}>
                    <button
                      type="button"
                      onClick={() => handleNavigation(link.path)}
                      className="
                        text-[13px]
                        font-semibold
                        text-blue-100/90
                        hover:text-white
                        transition-colors
                        text-left
                      "
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* =================================================
                CONTACT COLUMN
            ================================================= */}

            <div className="lg:col-span-3 space-y-2.5">
              <h3
                className="
                  text-[11px]
                  font-bold
                  uppercase
                  tracking-widest
                  text-green-400
                "
                style={{
                  fontFamily: "'Hedvig Letters Serif', serif",
                }}
              >
                CONTACT US
              </h3>

              <div
                className="
                  space-y-2.5
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
                    flex
                    items-center
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
                    size={17}
                    className="shrink-0 text-green-400"
                  />

                  <span
                    className="
                      border-b-2
                      border-white/10
                      group-hover:border-white
                      transition-all
                      break-all
                    "
                  >
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
                    group
                    hover:text-white
                    transition-colors
                  "
                >
                  <Phone
                    size={17}
                    className="shrink-0 text-green-400"
                  />

                  <span
                    className="
                      border-b-2
                      border-white/10
                      group-hover:border-white
                      transition-all
                    "
                  >
                    +91 9921611911
                  </span>
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
                    group
                    hover:text-white
                    transition-colors
                  "
                >
                  <MapPin
                    size={17}
                    className="
                      mt-0.5
                      shrink-0
                      text-green-400
                    "
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

          {/* =================================================
              DESKTOP BOTTOM BAR
          ================================================= */}

          <div
            className="
              pt-3.5
              border-t-2
              border-white/10
              flex
              flex-col
              md:flex-row
              justify-between
              items-center
              gap-3
              text-[11px]
              font-black
              text-white/40
              uppercase
              tracking-[0.2em]
            "
          >
            <p>Straveda Tech.</p>

            <div className="flex gap-6">
              <button
                type="button"
                onClick={scrollToTop}
                className="
                  hover:text-green-400
                  uppercase
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