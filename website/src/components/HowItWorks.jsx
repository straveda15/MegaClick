import React, { useEffect, useState } from "react";
import {
  PhoneCall,
  FileText,
  Settings,
  CheckCircle2,
  Check,
} from "lucide-react";

// ─────────────────────────────────────────────
// Fresh, Modern Dual-Tone Vector Badges
// ─────────────────────────────────────────────
const ModernCardIcon = ({ type }) => {
  switch (type) {
    case "consultation":
      return (
        <svg
          viewBox="0 0 48 48"
          className="w-12 h-12 sm:w-13 sm:h-13 lg:w-14 lg:h-14"
          fill="none"
        >
          <rect
            x="6"
            y="8"
            width="36"
            height="32"
            rx="10"
            fill="#e0f2fe"
            stroke="#0B4EA2"
            strokeWidth="2.5"
          />
          <circle
            cx="24"
            cy="20"
            r="6"
            fill="#38bdf8"
            stroke="#0f172a"
            strokeWidth="2"
          />
          <path
            d="M14 34c0-4.5 4.5-7 10-7s10 2.5 10 7"
            stroke="#0f172a"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <circle
            cx="34"
            cy="14"
            r="3.5"
            fill="#22c55e"
            stroke="#ffffff"
            strokeWidth="1.5"
          />
        </svg>
      );

    case "digital":
      return (
        <svg
          viewBox="0 0 48 48"
          className="w-12 h-12 sm:w-13 sm:h-13 lg:w-14 lg:h-14"
          fill="none"
        >
          <rect
            x="8"
            y="6"
            width="32"
            height="36"
            rx="8"
            fill="#e0f2fe"
            stroke="#0B4EA2"
            strokeWidth="2.5"
          />
          <path
            d="M24 30V16M18 22l6-6 6 6"
            stroke="#0284c7"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16 34h16"
            stroke="#0f172a"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      );

    case "verification":
      return (
        <svg
          viewBox="0 0 48 48"
          className="w-12 h-12 sm:w-13 sm:h-13 lg:w-14 lg:h-14"
          fill="none"
        >
          <path
            d="M24 6l15 6v12c0 10-6.5 17-15 20-8.5-3-15-10-15-20V12l15-6z"
            fill="#e0f2fe"
            stroke="#0B4EA2"
            strokeWidth="2.5"
          />
          <circle
            cx="24"
            cy="22"
            r="7"
            fill="#38bdf8"
            stroke="#0f172a"
            strokeWidth="1.8"
          />
          <path
            d="M20 22l3 3 6-6"
            stroke="#ffffff"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );

    case "filing":
      return (
        <svg
          viewBox="0 0 48 48"
          className="w-12 h-12 sm:w-13 sm:h-13 lg:w-14 lg:h-14"
          fill="none"
        >
          <rect
            x="8"
            y="8"
            width="32"
            height="32"
            rx="8"
            fill="#e0f2fe"
            stroke="#0B4EA2"
            strokeWidth="2.5"
          />
          <path
            d="M14 24l10-8 10 8"
            stroke="#0284c7"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M18 26v10M24 26v10M30 26v10"
            stroke="#0f172a"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M14 36h20"
            stroke="#0f172a"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      );

    case "tracking":
      return (
        <svg
          viewBox="0 0 48 48"
          className="w-12 h-12 sm:w-13 sm:h-13 lg:w-14 lg:h-14"
          fill="none"
        >
          <rect
            x="10"
            y="8"
            width="28"
            height="34"
            rx="8"
            fill="#e0f2fe"
            stroke="#0B4EA2"
            strokeWidth="2.5"
          />
          <circle
            cx="24"
            cy="22"
            r="7"
            fill="#38bdf8"
            stroke="#0f172a"
            strokeWidth="1.8"
          />
          <path
            d="M24 18v4l3 2"
            stroke="#ffffff"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M18 34h12"
            stroke="#0f172a"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      );

    case "delivery":
      return (
        <svg
          viewBox="0 0 48 48"
          className="w-12 h-12 sm:w-13 sm:h-13 lg:w-14 lg:h-14"
          fill="none"
        >
          <circle
            cx="24"
            cy="20"
            r="13"
            fill="#e0f2fe"
            stroke="#0B4EA2"
            strokeWidth="2.5"
          />
          <circle
            cx="24"
            cy="20"
            r="7"
            fill="#38bdf8"
            stroke="#0f172a"
            strokeWidth="1.8"
          />
          <path
            d="M21 20l2 2 4-4"
            stroke="#ffffff"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M17 31l-3 11 10-5 10 5-3-11"
            fill="#38bdf8"
            stroke="#0f172a"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      );

    default:
      return null;
  }
};

// ─────────────────────────────────────────────
// Solution Cards
// ─────────────────────────────────────────────
const solutionCards = [
  {
    id: 1,
    title: "Needs Assessment",
    desc: "Personalized business consultation & comprehensive legal roadmap planning.",
    iconType: "consultation",
  },
  {
    id: 2,
    title: "100% Digital Upload",
    desc: "Secure end-to-end document submission with zero physical office visits.",
    iconType: "digital",
  },
  {
    id: 3,
    title: "Flawless Verification",
    desc: "Expert document audit guaranteeing zero rejection rates on portals.",
    iconType: "verification",
  },
  {
    id: 4,
    title: "Priority Portal Filing",
    desc: "Fast-track application filing directly through government portals.",
    iconType: "filing",
  },
  {
    id: 5,
    title: "Live Status Tracking",
    desc: "Real-time milestone notifications and complete process transparency.",
    iconType: "tracking",
  },
  {
    id: 6,
    title: "Certificate Delivery",
    desc: "Instant digital certificate issuance with continuous compliance support.",
    iconType: "delivery",
  },
];

// ─────────────────────────────────────────────
// Solution Card
// ─────────────────────────────────────────────
const SolutionCardItem = ({ item }) => (
  <div className="group relative rounded-2xl hover:-translate-y-1.5 transition-all duration-300 w-full aspect-square">
    <div
      className="
        w-full h-full
        bg-white
        border border-slate-200/90
        rounded-2xl
        p-4.5 sm:p-5 lg:p-6
        flex flex-col
        items-center
        justify-center
        text-center
        shadow-[0_2px_10px_-2px_rgba(0,0,0,0.04)]
        group-hover:shadow-[0_14px_28px_-6px_rgba(11,78,162,0.14)]
        transition-all duration-300
      "
      style={{
        clipPath:
          "polygon(0 0, calc(100% - 44px) 0, 100% 44px, 100% 100%, 0 100%)",
      }}
    >
      <div className="mb-2 sm:mb-3 group-hover:scale-105 transition-transform duration-300">
        <ModernCardIcon type={item.iconType} />
      </div>

      <h3
        style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
        className="
          text-[15px]
          sm:text-[16px]
          lg:text-[17px]
          font-bold
          text-slate-900
          mb-1.5
          leading-snug
        "
      >
        {item.title}
      </h3>

      <p className="text-[12px] sm:text-[12.5px] lg:text-[13px] text-slate-600 leading-relaxed max-w-[230px]">
        {item.desc}
      </p>
    </div>

    <div className="deep-peel-fold" />
  </div>
);

// ─────────────────────────────────────────────
// Steps
// ─────────────────────────────────────────────
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
    text: "Share required documents securely for fast verification.",
  },
  {
    number: "03",
    icon: Settings,
    title: "Expert Processing",
    text: "Our professionals handle your filing with complete accuracy.",
  },
  {
    number: "04",
    icon: CheckCircle2,
    title: "Get Your Solution",
    text: "Receive completed certificates with continuous support.",
  },
];

// ─────────────────────────────────────────────
// HOW IT WORKS
// ─────────────────────────────────────────────
const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);

  // Load fonts
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

    // Auto change active step
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 2200);

    return () => clearInterval(interval);
  }, []);

  // Scroll to services
  const handleScrollToServices = (e) => {
    e.preventDefault();

    const servicesSection = document.getElementById("services");

    if (servicesSection) {
      servicesSection.scrollIntoView({
        behavior: "smooth",
      });
    } else {
      window.location.hash = "services";
    }
  };

  return (
    <section
      id="how-it-works"
      className="
        relative
        overflow-hidden
        bg-blue-50
        py-8
        sm:py-10
        lg:py-12
        font-['Inter',sans-serif]
      "
    >
      {/* SAME CONTAINER / SAME ALIGNMENT */}
      <div
        className="
          w-full
          max-w-[1480px]
          mx-auto
          px-5
          sm:px-8
          lg:px-16
          xl:px-24
        "
      >
        {/* ─────────────────────────────────────
            TOP TAGLINE
        ───────────────────────────────────── */}
       <p
  className="
    text-xs
    font-semibold
    tracking-[0.18em]
    uppercase
    text-[#0B4EA2]
    mb-3.5
    sm:mb-6
    text-left
    w-full
  "
>
  HOW IT WORKS
</p>

        {/* ─────────────────────────────────────
            SOLUTION GRID
        ───────────────────────────────────── */}
        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
            gap-4
            sm:gap-4.5
            lg:gap-5
            w-full
            items-stretch
          "
        >
          {/* FEATURED BLUE CARD */}
          <div
            className="
              sm:col-span-2
              w-full
              h-full
              aspect-auto
              sm:aspect-[2/1]
              bg-gradient-to-br
              from-[#0B4EA2]
              via-[#093F83]
              to-[#062752]
              text-white
              rounded-2xl
              p-5
              sm:p-6
              lg:p-7
              flex
              flex-col
              justify-between
              shadow-lg
              shadow-blue-900/20
              relative
              overflow-hidden
            "
          >
            {/* Background glows */}
            <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-blue-400/20 blur-2xl pointer-events-none" />

            <div className="absolute top-0 right-1/4 w-32 h-32 rounded-full bg-cyan-400/10 blur-xl pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 text-left">
              <h2
                style={{
                  fontFamily: "'Hedvig Letters Serif', serif",
                }}
                className="
                  text-3xl
                  sm:text-4xl
                  lg:text-[42px]
                  font-normal
                  tracking-tight
                  text-white
                  leading-snug
                "
              >
                Get your{" "}
                <span className="text-[#a3e635]">
                  Solution
                </span>
              </h2>

              <p
                className="
                  mt-2
                  text-xs
                  sm:text-[13.5px]
                  text-blue-100/90
                  leading-relaxed
                  max-w-lg
                "
              >
                We follow a simple and transparent process to help
                businesses complete registrations with zero hassle.
              </p>
            </div>

            {/* VIEW ALL */}
            <div className="relative z-10 mt-5 sm:mt-6">
              <a
                href="#services"
                onClick={handleScrollToServices}
                className="inline-block group/link cursor-pointer"
              >
                <span
                  className="
                    text-xs
                    sm:text-sm
                    font-semibold
                    tracking-[0.2em]
                    uppercase
                    text-white/90
                    hover:text-white
                    transition-colors
                    duration-200
                  "
                >
                  VIEW ALL
                </span>

                <div
                  className="
                    mt-1
                    h-[1.5px]
                    w-full
                    bg-white/40
                    group-hover/link:bg-white
                    transition-colors
                    duration-200
                  "
                />
              </a>
            </div>
          </div>

          {/* TOP ROW CARDS */}
          {solutionCards.slice(0, 2).map((item) => (
            <SolutionCardItem
              key={item.id}
              item={item}
            />
          ))}

          {/* BOTTOM ROW CARDS */}
          {solutionCards.slice(2).map((item) => (
            <SolutionCardItem
              key={item.id}
              item={item}
            />
          ))}
        </div>

        {/* ─────────────────────────────────────
            HOW IT WORKS STEPPER
            FIXED ALIGNMENT
        ───────────────────────────────────── */}
        <div
          className="
            mt-10
            sm:mt-12
            lg:mt-14
            w-full
            relative
          "
        >
          {/* DESKTOP CONNECTING LINE */}
          <div
            className="
              hidden
              lg:block
              absolute
              top-[35px]
              left-[12.5%]
              right-[12.5%]
              h-[2px]
              bg-gradient-to-r
              from-blue-400
              via-blue-300
              to-green-400
              z-0
            "
          />

          {/* STEPS GRID */}
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-4
              gap-8
              sm:gap-8
              lg:gap-4
              w-full
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
                    min-w-0
                    w-full
                    flex
                    flex-col
                    items-center
                    text-center
                    group
                    relative
                  "
                >
                  {/* ICON CIRCLE */}
                  <div
                    className={`
                      relative
                      w-[62px]
                      h-[62px]
                      sm:w-[70px]
                      sm:h-[70px]
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
                      group-hover:-translate-y-1.5
                      group-hover:border-[#0B4EA2]
                      z-20

                      ${
                        isMobileActive
                          ? "max-lg:-translate-y-1.5 max-lg:scale-105 max-lg:border-[#0B4EA2]"
                          : ""
                      }
                    `}
                  >
                    {/* Active green background */}
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

                    {/* Icon */}
                    <Icon
                      size={25}
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

                  {/* STEP NUMBER */}
                  <div
                    className={`
                      mt-2.5
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
                    style={{
                      fontFamily:
                        "'Hedvig Letters Serif', serif",
                    }}
                    className="
                      mt-1
                      sm:mt-1.5
                      text-base
                      sm:text-lg
                      font-bold
                      text-gray-900
                      leading-snug
                      px-2
                    "
                  >
                    {item.title}
                  </h4>

                  {/* DESCRIPTION */}
                  <p
                    className="
                      mt-1.5
                      text-xs
                      sm:text-[13px]
                      leading-5
                      text-gray-600
                      w-full
                      max-w-[230px]
                      lg:max-w-[220px]
                      px-2
                      text-center
                      break-words
                    "
                  >
                    {item.text}
                  </p>

                  {/* BADGE */}
                  <div
                    className="
                      mt-2.5
                      sm:mt-3
                      px-2.5
                      py-0.5
                      rounded-full
                      bg-blue-50
                      border
                      border-blue-100
                      flex
                      items-center
                      gap-1
                      max-w-full
                    "
                  >
                    <Check
                      size={12}
                      className="
                        text-green-600
                        shrink-0
                      "
                    />

                    <span
                      className="
                        text-[10px]
                        sm:text-[10.5px]
                        font-semibold
                        text-[#0B4EA2]
                        whitespace-nowrap
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

      {/* ─────────────────────────────────────
          DEEP PAPER FOLD STYLES
      ───────────────────────────────────── */}
      <style>{`
        .deep-peel-fold {
          position: absolute;
          top: 0;
          right: 0;
          width: 44px;
          height: 44px;
          pointer-events: none;
          z-index: 20;
          filter: drop-shadow(
            -2px 2px 4px rgba(0, 0, 0, 0.14)
          );
        }

        .deep-peel-fold::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 44px;
          height: 44px;
          background: linear-gradient(
            225deg,
            #cbd5e1 0%,
            #f1f5f9 22%,
            #ffffff 50%,
            #e2e8f0 100%
          );
          clip-path: polygon(
            0 0,
            0 100%,
            100% 100%
          );
          border-bottom-left-radius: 18px;
          transition: all 0.3s
            cubic-bezier(0.4, 0, 0.2, 1);
        }

        .group:hover .deep-peel-fold::after {
          width: 48px;
          height: 48px;
          border-bottom-left-radius: 22px;
          background: linear-gradient(
            225deg,
            #94a3b8 0%,
            #e2e8f0 22%,
            #ffffff 50%,
            #cbd5e1 100%
          );
        }
      `}</style>
    </section>
  );
};

export default HowItWorks;