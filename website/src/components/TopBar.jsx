import React from "react";

import {
  Phone,
  Mail,
  ShieldCheck,
} from "lucide-react";

const TopBar = () => {
  return (
    <div className="bg-[#083A7A] text-white">
      <div
        className="
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

            {/* =================================================
                PHONE
            ================================================= */}

            <a
              href="tel:+919921611911"
              className="
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
                  text-green-400
                  sm:w-4
                  sm:h-4
                  flex-shrink-0
                "
              />

              <span
                className="
                  text-blue-100
                  font-semibold
                "
              >
                +91 9921611911
              </span>

            </a>


            {/* =================================================
                EMAIL
            ================================================= */}

            <a
              href="https://mail.google.com/mail/?view=cm&fs=1&to=megaclickofficial@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Email MegaClick"
              className="
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
                  text-green-400
                  sm:w-4
                  sm:h-4
                  flex-shrink-0
                "
              />

              <span
                className="
                  text-blue-100
                  font-semibold
                "
              >
                megaclickofficial@gmail.com
              </span>

            </a>

          </div>


          {/* =====================================================
              TRUST TEXT
          ====================================================== */}

          <div
            className="
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
                text-green-400
                sm:w-4
                sm:h-4
                flex-shrink-0
              "
            />

            <span>
              Trusted Business Solutions
            </span>

          </div>

        </div>
      </div>
    </div>
  );
};

export default TopBar;