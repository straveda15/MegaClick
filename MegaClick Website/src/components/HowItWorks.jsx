import React, { useEffect, useState } from "react";

import {
  PhoneCall,
  FileText,
  Settings,
  CheckCircle2,
  ShieldCheck,
  Check,
  Award,
} from "lucide-react";

import processImg from "../assets/process.png";

const steps = [
  {
    number: "01",
    icon: PhoneCall,
    title: "Free Consultation",
    text: "Discuss your business requirements with our experts.",
  },
  {
    number: "02",
    icon: FileText,
    title: "Submit Documents",
    text: "Share the required documents securely for quick verification.",
  },
  {
    number: "03",
    icon: Settings,
    title: "Expert Processing",
    text: "Our professionals handle your application with accuracy.",
  },
  {
    number: "04",
    icon: CheckCircle2,
    title: "Get Your Solution",
    text: "Receive your completed service with smooth and reliable support.",
  },
];

const points = [
  "Understand your business requirements",
  "Get expert guidance for the best solution",
  "Complete documentation assistance",
  "Transparent and hassle-free process",
];

const HowItWorks = () => {
  // =====================================================
  // MOBILE / TABLET ACTIVE STEP
  // Desktop hover animation remains unchanged
  // =====================================================

  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 2200);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className="
        relative
        overflow-hidden
        bg-blue-100
        py-3
        sm:py-6
        lg:py-8
      "
    >
      <div
        className="
          max-w-[1500px]
          mx-auto
          px-4
          sm:px-8
          lg:px-16
          xl:px-24
          pt-2
          sm:pt-3
          lg:pt-4
          pb-6
          sm:pb-8
          lg:pb-10
        "
      >
        {/* =================================================
            TOP SECTION
        ================================================= */}

        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-2
            gap-8
            sm:gap-10
            lg:gap-14
            xl:gap-20
            items-center
          "
        >
          {/* =================================================
              LEFT CONTENT
          ================================================= */}

          <div className="w-full">
            {/* Badge */}

            <span
              className="
                inline-flex
                items-center
                gap-2
                bg-[#0B4EA2]
                text-white
                px-3
                sm:px-4
                py-1.5
                sm:py-2
                rounded-full
                text-xs
                sm:text-sm
                font-semibold
              "
            >
              <CheckCircle2
                size={15}
                className="text-green-400 sm:w-4 sm:h-4"
              />

              Our Process
            </span>

            {/* Heading */}

            <h2
              className="
                mt-4
                sm:mt-5
                text-3xl
                sm:text-4xl
                lg:text-5xl
                font-bold
                leading-tight
                text-gray-900
              "
            >
              Get Your Solution

              <br />

              <span
                className="
                  bg-gradient-to-r
                  from-blue-600
                  to-green-500
                  bg-clip-text
                  text-transparent
                "
              >
                In Simple Steps
              </span>
            </h2>

            {/* Description */}

            <p
              className="
                mt-4
                sm:mt-5
                text-sm
                sm:text-[15px]
                leading-6
                sm:leading-7
                text-gray-600
                max-w-[560px]
                text-left
                sm:text-justify
              "
            >
              We follow a simple and transparent process to help businesses
              complete registrations, legal documentation, compliance services
              and business solutions efficiently. Our experts guide you through
              every stage ensuring accuracy and reliability.
            </p>

            {/* Points */}

            <div
              className="
                mt-6
                sm:mt-8
                space-y-3
                sm:space-y-4
              "
            >
              {points.map((item, index) => (
                <div
                  key={index}
                  className="
                    flex
                    items-start
                    gap-3
                  "
                >
                  <div
                    className="
                      flex-shrink-0
                      w-8
                      h-8
                      sm:w-9
                      sm:h-9
                      rounded-full
                      bg-[#0B4EA2]
                      text-white
                      flex
                      items-center
                      justify-center
                      shadow
                    "
                  >
                    <Check size={16} />
                  </div>

                  <p
                    className="
                      pt-1
                      text-sm
                      sm:text-[15px]
                      font-semibold
                      leading-5
                      sm:leading-6
                      text-gray-800
                    "
                  >
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* =================================================
              RIGHT CARD
          ================================================= */}

          <div
            className="
              w-full
              flex
              justify-center
              lg:justify-end
            "
          >
            <div
              className="
                w-full
                max-w-[420px]
                bg-white
                border
                border-blue-100
                rounded-2xl
                shadow-lg
                overflow-hidden
              "
            >
              {/* IMAGE */}

              <div
                className="
                  bg-gradient-to-br
                  from-blue-50
                  to-green-50
                  px-4
                  sm:px-6
                  py-3
                  sm:py-4
                "
              >
                <img
                  src={processImg}
                  alt="Process"
                  className="
                    w-full
                    h-[140px]
                    sm:h-[160px]
                    md:h-[170px]
                    object-contain
                  "
                />
              </div>

              {/* CARD CONTENT */}

              <div
                className="
                  p-4
                  sm:p-5
                "
              >
                {/* Card Header */}

                <div
                  className="
                    flex
                    items-center
                    gap-3
                  "
                >
                  <div
                    className="
                      flex-shrink-0
                      w-9
                      h-9
                      rounded-lg
                      bg-blue-50
                      border
                      border-blue-100
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <ShieldCheck
                      size={22}
                      className="text-[#0B4EA2]"
                    />
                  </div>

                  <div className="min-w-0">
                    <h3
                      className="
                        text-base
                        sm:text-lg
                        font-bold
                        text-gray-900
                      "
                    >
                      Trusted Expertise
                    </h3>

                    <p
                      className="
                        text-[11px]
                        sm:text-xs
                        text-gray-500
                      "
                    >
                      Professional Business Assistance
                    </p>
                  </div>
                </div>

                {/* Description */}

                <p
                  className="
                    mt-4
                    text-sm
                    leading-6
                    text-gray-600
                  "
                >
                  Experienced professionals manage every stage with accuracy
                  and complete transparency.
                </p>

                {/* Features */}

                <div
                  className="
                    mt-5
                    grid
                    grid-cols-1
                    xs:grid-cols-2
                    sm:grid-cols-2
                    gap-3
                  "
                >
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Check
                      size={15}
                      className="flex-shrink-0 text-green-600"
                    />
                    Secure Docs
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Check
                      size={15}
                      className="flex-shrink-0 text-green-600"
                    />
                    Expert Support
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Check
                      size={15}
                      className="flex-shrink-0 text-green-600"
                    />
                    Fast Process
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Check
                      size={15}
                      className="flex-shrink-0 text-green-600"
                    />
                    Reliable
                  </div>
                </div>

                {/* TRUST BANNER */}

                <div
                  className="
                    mt-5
                    sm:mt-6
                    rounded-xl
                    bg-gradient-to-r
                    from-blue-600
                    to-green-500
                    px-4
                    sm:px-5
                    py-3
                    sm:py-4
                    flex
                    items-center
                    justify-between
                    gap-3
                    text-white
                  "
                >
                  <div className="min-w-0">
                    <p
                      className="
                        text-[10px]
                        sm:text-[12px]
                        uppercase
                        font-semibold
                        tracking-wider
                        opacity-80
                      "
                    >
                      Trusted Business Partner
                    </p>

                    <h4
                      className="
                        text-xs
                        sm:text-sm
                        font-semibold
                        mt-1
                      "
                    >
                      Verified & Reliable Service
                    </h4>
                  </div>

                  <Award
                    size={27}
                    className="flex-shrink-0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =================================================
            STEPPER SECTION
        ================================================= */}

        <div
          className="
            mt-10
            sm:mt-12
            lg:mt-16
          "
        >
          <div className="relative">

            {/* =================================================
                MOBILE / TABLET VERTICAL LINE
            ================================================= */}

            <div
              className="
                lg:hidden
                absolute
                top-[32px]
                bottom-[32px]
                left-1/2
                -translate-x-1/2
                w-[2px]
                bg-gradient-to-b
                from-blue-400
                via-blue-300
                to-green-400
                z-0
              "
            />

            {/* =================================================
                DESKTOP HORIZONTAL LINE
            ================================================= */}

            <div
              className="
                hidden
                lg:block
                absolute
                top-[36px]
                left-[14%]
                right-[14%]
                h-[2px]
                bg-gradient-to-r
                from-blue-400
                via-blue-300
                to-green-400
                z-0
              "
            />

            {/* =================================================
                STEPS
            ================================================= */}

            <div
              className="
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-4
                gap-8
                sm:gap-10
                lg:gap-6
                relative
                z-10
              "
            >
              {steps.map((item, index) => {
                const Icon = item.icon;

                // Automatic animation only below lg
                const isMobileActive = activeStep === index;

                return (
                  <div
                    key={index}
                    className="
                      flex
                      flex-col
                      items-center
                      text-center
                      group
                      relative
                    "
                  >
                    {/* =================================================
                        ICON
                    ================================================= */}

                    <div
                      className={`
                        relative
                        w-[64px]
                        h-[64px]
                        sm:w-[72px]
                        sm:h-[72px]
                        rounded-full
                        bg-white
                        border-4
                        border-blue-50
                        shadow-md
                        flex
                        items-center
                        justify-center
                        transition-all
                        duration-500
                        group-hover:-translate-y-2
                        group-hover:border-blue-500
                        z-20

                        ${
                          isMobileActive
                            ? "max-lg:-translate-y-2 max-lg:scale-110 max-lg:border-blue-500"
                            : ""
                        }
                      `}
                    >
                      {/* Animated Background */}

                      <div
                        className={`
                          absolute
                          inset-0
                          rounded-full
                          bg-gradient-to-br
                          from-blue-600
                          to-green-500
                          opacity-0
                          group-hover:opacity-100
                          transition-opacity
                          duration-300

                          ${
                            isMobileActive
                              ? "max-lg:opacity-100"
                              : ""
                          }
                        `}
                      />

                      {/* Icon */}

                      <Icon
                        size={26}
                        className={`
                          relative
                          z-10
                          text-[#0B4EA2]
                          group-hover:text-white
                          transition-colors
                          duration-300

                          ${
                            isMobileActive
                              ? "max-lg:text-white"
                              : ""
                          }
                        `}
                      />
                    </div>

                    {/* =================================================
                        NUMBER
                    ================================================= */}

                    <div
                      className={`
                        mt-3
                        text-[11px]
                        sm:text-xs
                        font-bold
                        transition-colors
                        duration-300
                        ${
                          isMobileActive
                            ? "max-lg:text-green-600"
                            : "text-[#0B4EA2]"
                        }
                      `}
                    >
                      STEP {item.number}
                    </div>

                    {/* =================================================
                        TITLE
                    ================================================= */}

                    <h4
                      className="
                        mt-1.5
                        sm:mt-2
                        text-lg
                        sm:text-xl
                        font-bold
                        text-gray-900
                      "
                    >
                      {item.title}
                    </h4>

                    {/* =================================================
                        DESCRIPTION
                    ================================================= */}

                    <p
                      className="
                        mt-2
                        text-sm
                        leading-6
                        text-gray-600
                        max-w-[280px]
                        sm:max-w-[260px]
                        lg:max-w-[220px]
                      "
                    >
                      {item.text}
                    </p>

                    {/* =================================================
                        BADGE
                    ================================================= */}

                    <div
                      className="
                        mt-3
                        sm:mt-4
                        px-3
                        py-1
                        rounded-full
                        bg-blue-50
                        border
                        border-blue-100
                        flex
                        items-center
                        gap-1
                      "
                    >
                      <Check
                        size={13}
                        className="text-green-600"
                      />

                      <span
                        className="
                          text-[10px]
                          sm:text-[11px]
                          font-semibold
                          text-[#0B4EA2]
                        "
                      >
                        Fast & Secure
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;