
import React from "react";

import {
  ArrowRight,
  Phone,
  CheckCircle,
  Mail,
} from "lucide-react";

import { FaWhatsapp } from "react-icons/fa";

const CTA = () => {
  return (
    <section className="py-10 sm:py-12 lg:py-16 bg-blue-100">
      <div
        className="
          max-w-[1500px]
          mx-auto
          px-5
          sm:px-8
          lg:px-16
          xl:px-24
        "
      >
        {/* ================= SINGLE CTA CARD ================= */}

        <div
          className="
            bg-white
            border
            border-gray-200
            rounded-2xl
            shadow-sm
            p-6
            sm:p-8
            lg:p-10
            flex
            flex-col
            lg:flex-row
            items-center
            gap-8
            lg:gap-10
          "
        >

          {/* =================================================
              LEFT CONTENT
          ================================================= */}

          <div
            className="
              w-full
              lg:flex-1
              text-center
              lg:text-left
              min-w-0
            "
          >

            {/* Label */}

            <div
              className="
                inline-flex
                items-center
                gap-2
                text-sm
                font-semibold
                text-[#0B4EA2]
              "
            >
              <CheckCircle
                size={17}
                className="text-green-500 flex-shrink-0"
              />

              Ready to Start?
            </div>


            {/* Heading */}

            <h2
              className="
                mt-3
                text-2xl
                sm:text-3xl
                md:text-4xl
                lg:text-5xl
                font-bold
                leading-tight
                text-black
              "
            >
              Get Professional Support For{" "}
              <br className="hidden sm:block" />

              <span
                className="
                  bg-gradient-to-r
                  from-blue-600
                  to-green-500
                  bg-clip-text
                  text-transparent
                "
              >
                Your Business Needs
              </span>
            </h2>


            {/* Description */}

            <p
              className="
                mt-4
                text-sm
                sm:text-base
                text-gray-600
                leading-6
                sm:leading-7
                max-w-xl
                mx-auto
                lg:mx-0
              "
            >
              From registrations to compliance,
              our experts help you complete your
              business requirements smoothly.
            </p>


            {/* Features */}

            <div
              className="
                mt-5
                flex
                flex-wrap
                justify-center
                lg:justify-start
                gap-x-5
                gap-y-3
                text-sm
                text-gray-600
              "
            >

              <div className="flex items-center gap-2">
                <CheckCircle
                  size={16}
                  className="text-green-500 flex-shrink-0"
                />
                Expert Assistance
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle
                  size={16}
                  className="text-green-500 flex-shrink-0"
                />
                Quick Process
              </div>

              <div className="flex items-center gap-2">
                <CheckCircle
                  size={16}
                  className="text-green-500 flex-shrink-0"
                />
                Trusted Service
              </div>

            </div>
          </div>


          {/* =================================================
              VERTICAL SEPARATOR
          ================================================= */}

          <div
            className="
              hidden
              lg:block
              w-px
              self-stretch
              bg-gray-300
              min-h-[210px]
            "
          />


          {/* =================================================
              RIGHT ACTIONS
          ================================================= */}

          <div
            className="
              w-full
              lg:w-[310px]
              xl:w-[330px]
              flex
              flex-col
              items-stretch
              justify-center
              flex-shrink-0
            "
          >

            {/* ================= CONSULTATION BUTTON ================= */}

            <a
              href="/contact"
              className="
                w-full
                inline-flex
                items-center
                justify-center
                gap-2
                bg-green-600
                hover:bg-green-700
                text-white
                px-6
                sm:px-8
                py-3
                sm:py-3.5
                rounded-lg
                font-semibold
                text-sm
                sm:text-base
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:shadow-md
              "
            >
              Get Consultation

              <ArrowRight
                size={18}
                className="flex-shrink-0"
              />
            </a>


            {/* =================================================
                CONTACT LINKS
            ================================================= */}

            <div
              className="
                mt-5
                flex
                flex-col
                items-start
                gap-4
                w-full
              "
            >

              {/* ================= PHONE ================= */}

              <a
                href="tel:+919921611911"
                className="
                  inline-flex
                  items-center
                  justify-start
                  gap-3
                  w-full
                  text-[#0B4EA2]
                  font-semibold
                  text-sm
                  sm:text-base
                  hover:text-green-600
                  transition-colors
                  duration-300
                "
              >

                <Phone
                  size={18}
                  className="
                    flex-shrink-0
                    w-[20px]
                  "
                />

                <span>
                  +91 9921611911
                </span>

              </a>


              {/* ================= WHATSAPP ================= */}

              <a
                href="https://wa.me/919921611911"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-flex
                  items-center
                  justify-start
                  gap-3
                  w-full
                  text-[#25D366]
                  font-semibold
                  text-sm
                  sm:text-base
                  hover:text-[#1ebe5d]
                  transition-colors
                  duration-300
                "
              >

                <FaWhatsapp
                  size={21}
                  className="
                    flex-shrink-0
                    w-[20px]
                  "
                />

                <span>
                  Chat on WhatsApp
                </span>

              </a>


         <a
  href="https://mail.google.com/mail/?view=cm&fs=1&to=megaclickofficial@gmail.com"
  target="_blank"
  rel="noopener noreferrer"
  className="
    inline-flex
    items-center
    justify-start
    gap-3
    w-full
    min-w-0
    text-[#0B4EA2]
    font-semibold
    text-sm
    sm:text-base
    hover:text-green-600
    transition-colors
    duration-300
  "
>
  <Mail
    size={19}
    className="
     
      flex-shrink-0
      w-[20px]
    "
  />

  <span className="break-all">
    megaclickofficial@gmail.com
  </span>
</a>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default CTA;