import React from "react";
import { Phone, Mail, MapPin } from "lucide-react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaWhatsapp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import logo from "../assets/LOGO.png";

const Footer = () => {
  const navigate = useNavigate();

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

  const scrollToTop = () => {
    if (window.location.pathname !== "/") {
      navigate("/");
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 300);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const services = [
    "Business Registration",
    "Tax & Compliance Services",
    "Financial & Legal Solutions",
  ];

  const quickLinks = [
    { name: "Home",              path: "/" },
    { name: "About Us",          path: "/about" },
    { name: "Services",          path: "/services" },
    { name: "Associate With Us", path: "/associate-with-us" },
    { name: "Contact Us",        path: "/contact" },
  ];

  const socialLinks = [
    { icon: FaFacebookF,  link: "#",                          label: "Facebook"  },
    { icon: FaInstagram,  link: "#",                          label: "Instagram" },
    { icon: FaLinkedinIn, link: "#",                          label: "LinkedIn"  },
    { icon: FaWhatsapp,   link: "https://wa.me/919921611911", label: "WhatsApp"  },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    if (path === "/") {
      setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
    }
  };

  return (
    <footer className="relative mt-auto overflow-hidden bg-[#083A7A] text-white font-['Inter',sans-serif] pt-10 pb-6">

      {/* TOP ACCENT LINE */}
      <div className="h-1 bg-green-400 absolute top-0 left-0 right-0 z-10" />

      {/* ========================================================================= */}
      {/* 1. EXACT STRAVEDA WATERMARK (Line-height 0.6, Gradient Clip, Dual-Layer) */}
      {/* ========================================================================= */}
      <div
        className="absolute inset-0 z-0 flex items-end justify-center px-4 pb-4 pointer-events-none select-none overflow-hidden"
        aria-hidden="true"
      >
        <div className="relative w-full flex justify-center items-end h-full">
          {/* Subtle glow oval behind bottom text */}
          <div
            className="absolute bottom-[5%] w-[60%] h-[20%] bg-blue-400/10 blur-[100px] rounded-full"
            style={{ transform: "scale(0.969459)" }}
          />

          {/* Typography clipped with line-height: 0.6 for exact Straveda anchoring */}
          <span
            className="text-[17vw] sm:text-[18vw] lg:text-[19vw] font-bold uppercase tracking-tighter"
            style={{
              fontFamily: "system-ui, -apple-system, sans-serif",
              lineHeight: 0.6,
              marginBottom: "20px",
              transform: "translateY(-0.144917px)",
            }}
          >
            <span className="relative inline-block text-white/[0.08] drop-shadow-[0_0_15px_rgba(59,130,246,0.15)]">
              MegaClick
              {/* Bottom-to-top gradient clip */}
              <span className="absolute inset-0 bg-gradient-to-t from-white/15 to-transparent bg-clip-text text-transparent" />
            </span>
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN FOOTER CONTENT (Exact Straveda 12-Column Grid & Typography)       */}
      {/* ========================================================================= */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10">

        {/* 12-COLUMN DESKTOP & RESPONSIVE GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-y-8 gap-x-8 mb-8 pt-4">

          {/* ============ COMPANY INFO (lg:col-span-4) ============ */}
          <div className="lg:col-span-4 space-y-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
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
              <p className="mt-2 text-[14px] text-blue-100/90 font-medium leading-snug max-w-[280px]">
                Exceptional value.<br />Cost effective business solutions.
              </p>
            </div>

            {/* Social Icons (Straveda Circle Style) */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <a
                    key={index}
                    href={social.link}
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-11 h-11 rounded-full border-2 border-white/20 flex items-center justify-center text-white hover:bg-green-500 hover:text-white hover:border-green-500 transition-all cursor-pointer"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* ============ EXPLORE LINKS (lg:col-span-2) ============ */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-green-400">
              EXPLORE
            </h3>
            <ul className="space-y-2">
              {quickLinks.map((item, index) => (
                <li key={index}>
                  <button
                    type="button"
                    onClick={() => handleNavigation(item.path)}
                    className="text-[13px] font-bold text-blue-100/90 hover:text-white transition-colors text-left"
                  >
                    {item.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* ============ SERVICES (lg:col-span-3) ============ */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-green-400">
              SERVICES
            </h3>
            <ul className="space-y-2">
              {services.map((service, index) => (
                <li key={index}>
                  <span className="text-[13px] font-bold text-blue-100/90 hover:text-white transition-colors block">
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* ============ CONTACT US (lg:col-span-3) ============ */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-[11px] font-black uppercase tracking-widest text-green-400">
              CONTACT US
            </h3>
            <div className="space-y-3 text-[13px] font-bold text-blue-100/90">
              
              <button
                type="button"
                onClick={openGmailCompose}
                className="flex items-center gap-3 group text-left w-full cursor-pointer bg-transparent border-0 p-0 text-[13px] font-bold text-blue-100/90 hover:text-white transition-colors"
              >
                <Mail size={18} className="shrink-0 text-green-400" />
                <span className="border-b border-white/10 group-hover:border-white transition-all break-all">
                  megaclickofficial@gmail.com
                </span>
              </button>

              <a
                href="tel:+919921611911"
                className="flex items-center gap-3 group hover:text-white transition-colors"
              >
                <Phone size={18} className="shrink-0 text-green-400" />
                <span className="border-b border-white/10 group-hover:border-white transition-all">
                  +91 9921611911
                </span>
              </a>

              <a
                href="https://www.google.com/maps/search/?api=1&query=4th+Floor+Tristar+Complex+Jehan+Circle+Gangapur+Road+Nashik+Maharashtra+422005"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-3 group hover:text-white transition-colors"
              >
                <MapPin size={18} className="mt-0.5 shrink-0 text-green-400" />
                <span className="leading-tight">
                  4th Floor, Tristar Complex, Jehan Circle,<br />
                  Gangapur Rd, Nashik, Maharashtra 422005
                </span>
              </a>

            </div>
          </div>

        </div>

        {/* ========================================================================= */}
        {/* 3. EXACT STRAVEDA BOTTOM BAR                                              */}
        {/* ========================================================================= */}
        <div className="pt-5 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] font-black text-white/40 uppercase tracking-[0.2em]">
          <p>Straveda Tech.</p>
          <div className="flex gap-6">
            <button
              type="button"
              onClick={scrollToTop}
              className="hover:text-green-400 transition-colors uppercase cursor-pointer"
            >
              Back to Top ↑
            </button>
          </div>
        </div>

      </div>

    </footer>
  );
};

export default Footer;