import React, { useEffect, useState } from "react";
import {
  PhoneCall,
  FileText,
  Settings,
  CheckCircle2,
  ShieldCheck,
  Check,
  Award,
  Target,
  UserCheck,
  ClipboardList,
} from "lucide-react";

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
  {
    text: "Understand your business requirements",
    icon: Target,
  },
  {
    text: "Get expert guidance for the best solution",
    icon: UserCheck,
  },
  {
    text: "Complete documentation assistance",
    icon: ClipboardList,
  },
  {
    text: "Transparent and hassle-free process",
    icon: ShieldCheck,
  },
];

const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 2200);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="how-it-works"
      className="
        relative
        overflow-hidden
        bg-blue-100
        py-6
        sm:py-8
        lg:py-12
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
            lg:grid-cols-[1.25fr_1fr]
            gap-8
            sm:gap-10
            lg:gap-14
            xl:gap-16
            items-center
          "
        >
          {/* =================================================
              LEFT CONTENT
          ================================================= */}

          <div className="w-full">
           
            {/* HEADING (Explicitly using Hedvig Letters Serif) */}

            <h2
              className="section-heading mt-4 sm:mt-5 text-gray-900 text-2xl sm:text-3xl lg:text-[40px] font-semibold leading-tight"
              style={{ fontFamily: '"Hedvig Letters Serif", Georgia, serif' }}
            >
              Get Your Solution

              <br />

              <span className="text-[#0B4EA2]">
                In Simple Steps
              </span>
            </h2>

            {/* DESCRIPTION (Inter Font) */}

            <p
              className="section-text mt-4 sm:mt-5 max-w-[640px] text-gray-600 text-justify text-sm sm:text-base leading-relaxed"
            >
              We follow a simple and transparent process to help businesses
              complete registrations, legal documentation, compliance services
              and business solutions efficiently. Our experts guide you through
              every stage ensuring accuracy and reliability.
            </p>

            {/* POINTS — CIRCULAR BLUE ICON LIST DESIGN FROM SCREENSHOT */}

            <div
              className="
                mt-6
                sm:mt-8
                space-y-4
                sm:space-y-4.5
              "
            >
              {points.map((item, index) => {
                const PointIcon = item.icon;
                return (
                  <div
                    key={index}
                    className="
                      flex
                      items-center
                      gap-3.5
                      sm:gap-4
                    "
                  >
                    <div
                      className="
                        flex-shrink-0
                        w-10
                        h-10
                        sm:w-11
                        sm:h-11
                        rounded-full
                        bg-blue-50
                        border
                        border-blue-100/80
                        text-[#0B4EA2]
                        flex
                        items-center
                        justify-center
                        shadow-sm
                      "
                    >
                      <PointIcon size={20} className="text-[#0B4EA2]" />
                    </div>

                    <p
                      className="
                        text-sm
                        sm:text-[15px]
                        font-medium
                        text-slate-700
                        leading-snug
                      "
                    >
                      {item.text}
                    </p>
                  </div>
                );
              })}
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
            "
          >
            <div
              className="
                w-full
                max-w-[460px]
                bg-white
                border
                border-blue-100
                rounded-2xl
                shadow-lg
                overflow-hidden
              "
            >
              {/* BRAND GRAPHIC AREA */}

              <div
                className="
                  bg-gradient-to-br
                  from-blue-50
                  to-green-50
                  px-4
                  sm:px-6
                  py-6
                  flex
                  flex-col
                  items-center
                  justify-center
                "
              >
                <div className="w-16 h-16 rounded-2xl bg-white shadow-md border border-blue-100 flex items-center justify-center text-[#0B4EA2] mb-1">
                  <ShieldCheck size={36} className="text-[#0B4EA2]" />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#0B4EA2]">MegaClick Process</span>
              </div>

              {/* CARD CONTENT */}

              <div
                className="
                  p-4
                  sm:p-5
                "
              >
                {/* CARD HEADER */}

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

                {/* DESCRIPTION */}

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

                {/* FEATURES */}

                <div
                  className="
                    mt-5
                    grid
                    grid-cols-1
                    sm:grid-cols-2
                    gap-3
                  "
                >
                  <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                    <Check
                      size={15}
                      className="flex-shrink-0 text-green-600"
                    />
                    Secure Docs
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                    <Check
                      size={15}
                      className="flex-shrink-0 text-green-600"
                    />
                    Expert Support
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                    <Check
                      size={15}
                      className="flex-shrink-0 text-green-600"
                    />
                    Fast Process
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
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
                      Verified &amp; Reliable Service
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

            {/* DESKTOP HORIZONTAL LINE */}

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

            {/* STEPS */}

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
                    {/* ICON */}

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
                      <div
                        className={`
                          absolute
                          inset-0
                          rounded-full
                          bg-green-500
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

                    {/* NUMBER */}

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

                    {/* TITLE */}

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

                    {/* DESCRIPTION */}

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

                    {/* BADGE */}

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
                        Fast &amp; Secure
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