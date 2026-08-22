import React from "react";
import {
  Phone,
  Mail,
  ShieldCheck,
} from "lucide-react";

const TopBar = () => {
  return (
    <div className="bg-[#083A7A] text-white">
      {/* DIRECT DESKTOP MEDIA QUERIES FOR 1440px, 1920px, 2560px & 3840px (4K) */}
      <style>{`
        /* Standard Desktop (1440px x 900px) */
        @media (min-width: 1440px) {
          .topbar-container {
            max-width: 1440px !important;
            padding-left: 4rem !important;
            padding-right: 4rem !important;
          }
        }

        /* Large Desktop (1920px x 1080px Full HD) */
        @media (min-width: 1920px) {
          .topbar-container {
            max-width: 1800px !important;
            padding-left: 5rem !important;
            padding-right: 5rem !important;
            padding-top: 0.65rem !important;
            padding-bottom: 0.65rem !important;
          }
          .topbar-contact-group {
            gap: 2rem !important;
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

        /* QHD / 2K Ultra-Wide (2560px Desktop) */
        @media (min-width: 2560px) {
          .topbar-container {
            max-width: 2300px !important;
            padding-left: 6rem !important;
            padding-right: 6rem !important;
            padding-top: 0.85rem !important;
            padding-bottom: 0.85rem !important;
          }
          .topbar-contact-group {
            gap: 2.75rem !important;
          }
          .topbar-item {
            font-size: 1.3rem !important;
            gap: 0.75rem !important;
          }
          .topbar-icon {
            width: 1.5rem !important;
            height: 1.5rem !important;
          }
          .topbar-trust {
            font-size: 1.3rem !important;
            gap: 0.75rem !important;
          }
        }

        /* 4K Ultra-Wide Desktop (3840px x 2160px) */
        @media (min-width: 3840px) {
          .topbar-container {
            max-width: 3400px !important;
            padding-left: 8rem !important;
            padding-right: 8rem !important;
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

      <div
        className="
          topbar-container
          max-w-[1500px]
          mx-auto
          px-4
          sm:px-6
          lg:px-16
          xl:px-24
          py-2
        "
      >
        {/* =====================================================
            MOBILE + DESKTOP CONTENT
        ====================================================== */}
        <div
          className="
            flex
            flex-col
            sm:flex-row
            items-center
            justify-between
            gap-1.5
            sm:gap-4
          "
        >
          {/* =====================================================
              CONTACT DETAILS
          ====================================================== */}
          <div
            className="
              topbar-contact-group
              flex
              items-center
              justify-center
              gap-3
              sm:gap-5
              w-full
              sm:w-auto
              min-w-0
            "
          >
            {/* PHONE */}
            <a
              href="tel:+919921611911"
              className="
                topbar-item
                flex
                items-center
                gap-1
                sm:gap-2
                text-[10px]
                sm:text-sm
                whitespace-nowrap
                min-w-0
                hover:text-white
                transition-colors
                duration-300
              "
            >
              <Phone
                size={13}
                className="
                  topbar-icon
                  text-green-400
                  sm:w-4
                  sm:h-4
                  flex-shrink-0
                "
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
              className="
                topbar-item
                flex
                items-center
                gap-1
                sm:gap-2
                text-[9px]
                sm:text-sm
                whitespace-nowrap
                min-w-0
                hover:text-white
                transition-colors
                duration-300
              "
            >
              <Mail
                size={13}
                className="
                  topbar-icon
                  text-green-400
                  sm:w-4
                  sm:h-4
                  flex-shrink-0
                "
              />
              <span className="text-blue-100 font-semibold">
                megaclickofficial@gmail.com
              </span>
            </a>
          </div>

          {/* =====================================================
              TRUST TEXT
          ====================================================== */}
          <div
            className="
              topbar-trust
              flex
              items-center
              justify-center
              gap-1.5
              text-[9px]
              sm:text-xs
              lg:text-sm
              text-blue-100
              font-medium
              whitespace-nowrap
            "
          >
            <ShieldCheck
              size={14}
              className="
                topbar-icon
                text-green-400
                sm:w-4
                sm:h-4
                flex-shrink-0
              "
            />
            <span>Trusted Business Solutions</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;