import React from "react";
import { Phone, Mail, ShieldCheck } from "lucide-react";

const TopBar = () => {
  return (
    <div className="bg-[#083A7A] text-white font-['Inter',sans-serif]">
      {/* DIRECT DESKTOP MEDIA QUERIES - MATCHED TO NAVBAR */}
      <style>{`
        /* 1. Laptop Screens (1024px to 1439px) */
        @media (min-width: 1024px) and (max-width: 1439px) {
          .topbar-container {
            max-width: 1400px !important;
            padding-left: 2rem !important;
            padding-right: 2rem !important;
          }
          .topbar-contact-group {
            gap: 1.75rem !important;
          }
        }

        /* 2. Standard Desktop (1440px x 900px) */
        @media (min-width: 1440px) {
          .topbar-container {
            max-width: 1420px !important;
            padding-left: 2.25rem !important;
            padding-right: 2.25rem !important;
          }
          .topbar-contact-group {
            gap: 2.25rem !important;
          }
        }

        /* 3. Large Desktop (1920px x 1080px Full HD) */
        @media (min-width: 1920px) {
          .topbar-container {
            max-width: 1800px !important;
            padding-left: 3.5rem !important;
            padding-right: 3.5rem !important;
            padding-top: 0.65rem !important;
            padding-bottom: 0.65rem !important;
          }
          .topbar-contact-group {
            gap: 2.5rem !important;
          }
          .topbar-item {
            font-size: 1.05rem !important;
            gap: 0.6rem !important;
          }
          .topbar-icon {
            width: 1.25rem !important;
            height: 1.25rem !important;
          }
          .topbar-trust {
            font-size: 1.05rem !important;
            gap: 0.6rem !important;
          }
        }

        /* 4. 4K Ultra-Wide Desktop (3840px x 2160px) */
        @media (min-width: 3840px) {
          .topbar-container {
            max-width: 3200px !important;
            padding-left: 5.5rem !important;
            padding-right: 5.5rem !important;
            padding-top: 1.25rem !important;
            padding-bottom: 1.25rem !important;
          }
          .topbar-contact-group {
            gap: 4rem !important;
          }
          .topbar-item {
            font-size: 1.85rem !important;
            gap: 1rem !important;
          }
          .topbar-icon {
            width: 2.25rem !important;
            height: 2.25rem !important;
          }
          .topbar-trust {
            font-size: 1.85rem !important;
            gap: 1rem !important;
          }
        }
      `}</style>

      {/* MAIN CONTAINER (px-5 on mobile exactly matches Navbar) */}
      <div className="topbar-container w-full max-w-[1420px] mx-auto px-5 sm:px-6 lg:px-8 py-2">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-1.5 sm:gap-4">
          
          {/* CONTACT DETAILS (PHONE & EMAIL) */}
          <div className="topbar-contact-group flex items-center justify-center gap-3.5 sm:gap-5 w-full sm:w-auto min-w-0">
            {/* PHONE */}
            <a
              href="tel:+919921611911"
              className="topbar-item flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs lg:text-sm whitespace-nowrap min-w-0 hover:text-white transition-colors duration-200"
            >
              <Phone
                size={13}
                className="topbar-icon text-emerald-400 sm:w-4 sm:h-4 shrink-0"
              />
              <span className="text-blue-100 font-semibold">
                +91 9921611911
              </span>
            </a>

            {/* EMAIL */}
            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=megaclickofficial@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Email MegaClick"
              className="topbar-item flex items-center gap-1.5 sm:gap-2 text-[9.5px] sm:text-xs lg:text-sm whitespace-nowrap min-w-0 hover:text-white transition-colors duration-200"
            >
              <Mail
                size={13}
                className="topbar-icon text-emerald-400 sm:w-4 sm:h-4 shrink-0"
              />
              <span className="text-blue-100 font-semibold">
                megaclickofficial@gmail.com
              </span>
            </a>
          </div>

          {/* TRUST BADGE / TEXT */}
          <div className="topbar-trust flex items-center justify-center gap-1.5 text-[9.5px] sm:text-xs lg:text-sm text-blue-100 font-medium whitespace-nowrap">
            <ShieldCheck
              size={14}
              className="topbar-icon text-emerald-400 sm:w-4 sm:h-4 shrink-0"
            />
            <span>Trusted Business Solutions</span>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TopBar;