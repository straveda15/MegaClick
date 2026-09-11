import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
          className="w-11 h-11 sm:w-12 sm:h-12 lg:w-13 lg:h-13 min-[1920px]:w-16 min-[1920px]:h-16 min-[3840px]:w-28 min-[3840px]:h-28"
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
          className="w-11 h-11 sm:w-12 sm:h-12 lg:w-13 lg:h-13 min-[1920px]:w-16 min-[1920px]:h-16 min-[3840px]:w-28 min-[3840px]:h-28"
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
          className="w-11 h-11 sm:w-12 sm:h-12 lg:w-13 lg:h-13 min-[1920px]:w-16 min-[1920px]:h-16 min-[3840px]:w-28 min-[3840px]:h-28"
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
          className="w-11 h-11 sm:w-12 sm:h-12 lg:w-13 lg:h-13 min-[1920px]:w-16 min-[1920px]:h-16 min-[3840px]:w-28 min-[3840px]:h-28"
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
          className="w-11 h-11 sm:w-12 sm:h-12 lg:w-13 lg:h-13 min-[1920px]:w-16 min-[1920px]:h-16 min-[3840px]:w-28 min-[3840px]:h-28"
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
          className="w-11 h-11 sm:w-12 sm:h-12 lg:w-13 lg:h-13 min-[1920px]:w-16 min-[1920px]:h-16 min-[3840px]:w-28 min-[3840px]:h-28"
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

    case "support":
      return (
        <svg
          viewBox="0 0 48 48"
          className="w-11 h-11 sm:w-12 sm:h-12 lg:w-13 lg:h-13 min-[1920px]:w-16 min-[1920px]:h-16 min-[3840px]:w-28 min-[3840px]:h-28"
          fill="none"
        >
          <circle
            cx="24"
            cy="22"
            r="15"
            fill="#e0f2fe"
            stroke="#0B4EA2"
            strokeWidth="2.5"
          />
          <path
            d="M14 24v-3a10 10 0 0 1 20 0v3"
            stroke="#0284c7"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <rect
            x="10.5"
            y="22.5"
            width="6"
            height="8"
            rx="3"
            fill="#38bdf8"
            stroke="#0f172a"
            strokeWidth="1.8"
          />
          <rect
            x="31.5"
            y="22.5"
            width="6"
            height="8"
            rx="3"
            fill="#38bdf8"
            stroke="#0f172a"
            strokeWidth="1.8"
          />
          <path
            d="M34.5 30.5v1.5a4 4 0 0 1-4 4H27"
            stroke="#0f172a"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      );

    case "compliance":
      return (
        <svg
          viewBox="0 0 48 48"
          className="w-11 h-11 sm:w-12 sm:h-12 lg:w-13 lg:h-13 min-[1920px]:w-16 min-[1920px]:h-16 min-[3840px]:w-28 min-[3840px]:h-28"
          fill="none"
        >
          <path
            d="M24 8a4 4 0 0 1 4 4v1.5c5.2 1.8 8.5 6.6 8.5 12.5v6l2.5 3.5H9l2.5-3.5v-6c0-5.9 3.3-10.7 8.5-12.5V12a4 4 0 0 1 4-4z"
            fill="#e0f2fe"
            stroke="#0B4EA2"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <path
            d="M19 35.5a5 5 0 0 0 10 0"
            stroke="#0f172a"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <circle
            cx="34"
            cy="12"
            r="4"
            fill="#22c55e"
            stroke="#ffffff"
            strokeWidth="1.5"
          />
        </svg>
      );

    default:
      return null;
  }
};

// ─────────────────────────────────────────────
// Solution Cards Data
// ─────────────────────────────────────────────
const solutionCards = [
  {
    id: 1,
    title: "Needs Assessment",
    desc: "Expert legal consultation and tailored business planning.",
    iconType: "consultation",
  },
  {
    id: 2,
    title: "100% Digital Upload",
    desc: "Upload required documents online with zero paperwork.",
    iconType: "digital",
  },
  {
    id: 3,
    title: "Flawless Verification",
    desc: "Thorough audit by legal experts ensuring zero rejections.",
    iconType: "verification",
  },
  {
    id: 4,
    title: "Priority Portal Filing",
    desc: "Fast-track application filing via government portals.",
    iconType: "filing",
  },
  {
    id: 5,
    title: "Live Status Tracking",
    desc: "Real-time milestone alerts and transparent status tracking.",
    iconType: "tracking",
  },
  {
    id: 6,
    title: "Certificate Delivery",
    desc: "Instant digital certificates with full ongoing support.",
    iconType: "delivery",
  },
  {
    id: 7,
    title: "Dedicated Support",
    desc: "Connect with dedicated experts for fast, hands-on help.",
    iconType: "support",
  },
  {
    id: 8,
    title: "Compliance Reminders",
    desc: "Timely alerts for renewals and statutory deadlines.",
    iconType: "compliance",
  },
];

// ─────────────────────────────────────────────
// Solution Card Item
// ─────────────────────────────────────────────
const SolutionCardItem = ({ item }) => (
  <div className="hiw-card group relative rounded-2xl hover:-translate-y-1.5 transition-all duration-300 w-full aspect-square flex min-w-0">
    <div
      className="
        w-full
        h-full
        min-w-0
        bg-white
        border border-slate-200/90
        rounded-2xl
        p-3
        min-[375px]:p-3.5
        sm:p-4
        lg:p-3
        xl:p-4.5
        flex
        flex-col
        items-center
        justify-center
        shadow-[0_2px_10px_-2px_rgba(0,0,0,0.04)]
        group-hover:shadow-[0_14px_28px_-6px_rgba(11,78,162,0.14)]
        transition-all duration-300
        overflow-hidden
      "
      style={{
        clipPath:
          "polygon(0 0, calc(100% - 38px) 0, 100% 38px, 100% 100%, 0 100%)",
      }}
    >
      {/* ICON */}
      <div className="hiw-card-icon mb-2 min-[375px]:mb-2.5 sm:mb-2.5 lg:mb-2 xl:mb-3 flex justify-center w-full shrink-0 group-hover:scale-105 transition-transform duration-300">
        <ModernCardIcon type={item.iconType} />
      </div>

      {/* TEXT BLOCK */}
      <div className="w-full min-w-0 flex flex-col items-center px-0.5 sm:px-1">
        <h3
          style={{
            fontFamily: "'Hedvig Letters Serif', serif",
          }}
          className="
            hiw-card-title
            text-[12px]
            min-[375px]:text-[13px]
            sm:text-[14.5px]
            lg:text-[14px]
            xl:text-[16px]
            font-bold
            text-slate-900
            mb-1
            leading-[1.25]
            w-full
            min-w-0
            text-center
            break-words
          "
        >
          {item.title}
        </h3>

        <p
          style={{ fontFamily: "'Inter', sans-serif" }}
          className="
            hiw-card-desc
            w-full
            max-w-full
            min-w-0
            text-[9.5px]
            min-[375px]:text-[10.5px]
            sm:text-[11.5px]
            lg:text-[11px]
            xl:text-[12px]
            text-slate-600
            leading-[1.35]
            sm:leading-snug
            text-center
            break-words
            overflow-wrap-anywhere
          "
        >
          {item.desc}
        </p>
      </div>
    </div>

    <div className="deep-peel-fold" />
  </div>
);

// ─────────────────────────────────────────────
// Stepper Steps Data
// ─────────────────────────────────────────────
const steps = [
  {
    number: "01",
    icon: PhoneCall,
    title: "Free Consultation",
    text: "Connect with our legal experts to discuss your business needs.",
  },
  {
    number: "02",
    icon: FileText,
    title: "Submit Documents",
    text: "Upload your required documents securely for a quick review.",
  },
  {
    number: "03",
    icon: Settings,
    title: "Expert Processing",
    text: "Our legal team prepares, submits your application accurately.",
  },
  {
    number: "04",
    icon: CheckCircle2,
    title: "Get Your Solution",
    text: "Receive your certificate with ongoing compliance support.",
  },
];

// ─────────────────────────────────────────────
// HOW IT WORKS COMPONENT
// ─────────────────────────────────────────────
const HowItWorks = () => {
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();

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

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 2200);

    return () => clearInterval(interval);
  }, []);

  const handleViewAll = () => {
    navigate("/services");
  };

  return (
    <section
      id="how-it-works"
      className="
        hiw-section
        relative
        overflow-hidden
        bg-blue-50
        py-8
        min-[375px]:py-9
        sm:py-10
        md:py-12
        lg:py-14
        xl:py-16
        font-['Inter',sans-serif]
      "
    >
      <style>{`
        /* ─────────────────────────────────────────
           UNIVERSAL APP CONTAINER
        ───────────────────────────────────────── */
        .app-container {
          width: 100%;
          max-width: 1500px;
          margin-left: auto;
          margin-right: auto;
          padding-left: 1rem;
          padding-right: 1rem;
        }

        @media (min-width: 375px) {
          .app-container {
            padding-left: 1.15rem;
            padding-right: 1.15rem;
          }
        }

        @media (min-width: 640px) {
          .app-container {
            padding-left: 2rem;
            padding-right: 2rem;
          }
        }

        @media (min-width: 768px) {
          .app-container {
            padding-left: 2.5rem;
            padding-right: 2.5rem;
          }
        }

        @media (min-width: 1024px) {
          .app-container {
            padding-left: 4rem;
            padding-right: 4rem;
          }
        }

        @media (min-width: 1280px) {
          .app-container {
            padding-left: 6rem;
            padding-right: 6rem;
          }
        }

        /* ─────────────────────────────────────────
           VERY SMALL MOBILE
        ───────────────────────────────────────── */
        @media (max-width: 374px) {
          .hiw-grid {
            gap: 0.6rem !important;
          }

          .hiw-card {
            min-width: 0 !important;
          }

          .hiw-featured-desc {
            font-size: 0.72rem !important;
            line-height: 1.5 !important;
            max-width: 100% !important;
          }

          .hiw-card-title {
            font-size: 0.72rem !important;
          }

          .hiw-card-desc {
            font-size: 0.55rem !important;
            line-height: 1.3 !important;
          }

          .hiw-step-text-wrapper {
            max-width: 90% !important;
          }

          .hiw-step-text {
            font-size: 0.72rem !important;
            line-height: 1.45 !important;
          }
        }

        /* ─────────────────────────────────────────
           MOBILE
        ───────────────────────────────────────── */
        @media (min-width: 375px) and (max-width: 639px) {
          .hiw-featured-desc {
            font-size: 0.78rem !important;
            line-height: 1.55 !important;
            max-width: 100% !important;
          }

          .hiw-card-desc {
            font-size: 0.62rem !important;
            line-height: 1.35 !important;
          }

          .hiw-step-text-wrapper {
            max-width: 86% !important;
          }

          .hiw-step-text {
            font-size: 0.75rem !important;
            line-height: 1.5 !important;
          }
        }

        /* ─────────────────────────────────────────
           TABLET
        ───────────────────────────────────────── */
        @media (min-width: 640px) and (max-width: 1023px) {
          .hiw-featured-desc {
            font-size: 0.95rem !important;
            line-height: 1.65 !important;
            max-width: 40rem !important;
          }

          .hiw-card-title {
            font-size: 0.95rem !important;
          }

          .hiw-card-desc {
            font-size: 0.72rem !important;
            line-height: 1.45 !important;
            max-width: 100% !important;
          }

          .hiw-step-text-wrapper {
            max-width: 75% !important;
          }

          .hiw-step-text {
            font-size: 0.82rem !important;
            line-height: 1.55 !important;
          }
        }

        /* ─────────────────────────────────────────
           1024px
        ───────────────────────────────────────── */
        @media (min-width: 1024px) {
          .hiw-featured-desc {
            font-size: 0.9rem !important;
            line-height: 1.6 !important;
            max-width: 27rem !important;
          }

          .hiw-card-title {
            font-size: 0.9rem !important;
          }

          .hiw-card-desc {
            font-size: 0.7rem !important;
            line-height: 1.45 !important;
          }
        }

        /* ─────────────────────────────────────────
           1280px
        ───────────────────────────────────────── */
        @media (min-width: 1280px) {
          .hiw-featured-desc {
            font-size: 0.93rem !important;
            line-height: 1.62 !important;
            max-width: 28rem !important;
          }

          .hiw-card-title {
            font-size: 0.95rem !important;
          }

          .hiw-card-desc {
            font-size: 0.76rem !important;
            line-height: 1.5 !important;
          }
        }

        /* ─────────────────────────────────────────
           1440px
        ───────────────────────────────────────── */
        @media (min-width: 1440px) {
          .app-container {
            max-width: 1440px !important;
            padding-left: 5rem !important;
            padding-right: 5rem !important;
          }

          .hiw-tagline {
            font-size: 0.85rem !important;
            margin-bottom: 1rem !important;
          }

          .hiw-featured-title {
            font-size: 2.25rem !important;
            line-height: 1.2 !important;
          }

          .hiw-featured-desc {
            font-size: 0.95rem !important;
            line-height: 1.65 !important;
            max-width: 28rem !important;
          }

          .hiw-featured-btn {
            font-size: 0.85rem !important;
          }

          .hiw-card-title {
            font-size: 1rem !important;
            line-height: 1.25 !important;
          }

          .hiw-card-desc {
            font-size: 0.8rem !important;
            line-height: 1.5 !important;
            max-width: 100% !important;
          }

          .hiw-stepper-box {
            margin-top: 3.5rem !important;
          }

          .hiw-step-text-wrapper {
            max-width: 260px !important;
          }

          .hiw-stepper-line {
            top: 36px !important;
          }

          .hiw-step-circle {
            width: 72px !important;
            height: 72px !important;
          }

          .hiw-step-title {
            font-size: 1.15rem !important;
          }

          .hiw-step-text {
            font-size: 0.875rem !important;
            line-height: 1.5 !important;
          }
        }

        /* ─────────────────────────────────────────
           1600px
        ───────────────────────────────────────── */
        @media (min-width: 1600px) {
          .hiw-featured-desc {
            font-size: 1rem !important;
            line-height: 1.7 !important;
            max-width: 31rem !important;
          }

          .hiw-card-title {
            font-size: 1.08rem !important;
          }

          .hiw-card-desc {
            font-size: 0.86rem !important;
            line-height: 1.55 !important;
          }

          .hiw-step-text-wrapper {
            max-width: 290px !important;
          }
        }

        /* ─────────────────────────────────────────
           1920px
        ───────────────────────────────────────── */
        @media (min-width: 1920px) {
          .app-container {
            max-width: 1800px !important;
            padding-left: 6rem !important;
            padding-right: 6rem !important;
          }

          .hiw-section {
            padding-top: 4.5rem !important;
            padding-bottom: 4.5rem !important;
          }

          .hiw-tagline {
            font-size: 0.95rem !important;
            margin-bottom: 1.25rem !important;
          }

          .hiw-grid {
            gap: 1.5rem !important;
          }

          .hiw-featured-title {
            font-size: 2.75rem !important;
            line-height: 1.2 !important;
          }

          .hiw-featured-desc {
            font-size: 1.1rem !important;
            line-height: 1.7 !important;
            max-width: 34rem !important;
          }

          .hiw-featured-btn {
            font-size: 0.95rem !important;
          }

          .hiw-card-icon svg {
            width: 3.5rem !important;
            height: 3.5rem !important;
          }

          .hiw-card-title {
            font-size: 1.25rem !important;
            margin-bottom: 0.5rem !important;
          }

          .hiw-card-desc {
            font-size: 0.95rem !important;
            line-height: 1.6 !important;
            max-width: 100% !important;
          }

          .hiw-stepper-box {
            margin-top: 4.5rem !important;
          }

          .hiw-step-text-wrapper {
            max-width: 340px !important;
          }

          .hiw-stepper-line {
            top: 42px !important;
          }

          .hiw-step-circle {
            width: 84px !important;
            height: 84px !important;
          }

          .hiw-step-icon {
            width: 1.6rem !important;
            height: 1.6rem !important;
          }

          .hiw-step-num {
            font-size: 0.95rem !important;
            margin-top: 0.75rem !important;
          }

          .hiw-step-title {
            font-size: 1.3rem !important;
          }

          .hiw-step-text {
            font-size: 1.05rem !important;
            line-height: 1.65 !important;
          }

          .hiw-step-badge {
            padding: 0.35rem 0.9rem !important;
            font-size: 0.85rem !important;
          }
        }

        /* ─────────────────────────────────────────
           2200px
        ───────────────────────────────────────── */
        @media (min-width: 2200px) {
          .hiw-featured-desc {
            font-size: 1.2rem !important;
            line-height: 1.75 !important;
            max-width: 39rem !important;
          }

          .hiw-card-title {
            font-size: 1.38rem !important;
          }

          .hiw-card-desc {
            font-size: 1.03rem !important;
            line-height: 1.6 !important;
          }

          .hiw-step-text-wrapper {
            max-width: 390px !important;
          }

          .hiw-step-title {
            font-size: 1.45rem !important;
          }

          .hiw-step-text {
            font-size: 1.12rem !important;
          }
        }

        /* ─────────────────────────────────────────
           2560px
        ───────────────────────────────────────── */
        @media (min-width: 2560px) {
          .app-container {
            max-width: 2400px !important;
            padding-left: 8rem !important;
            padding-right: 8rem !important;
          }

          .hiw-section {
            padding-top: 5.5rem !important;
            padding-bottom: 5.5rem !important;
          }

          .hiw-tagline {
            font-size: 1.15rem !important;
            margin-bottom: 1.5rem !important;
          }

          .hiw-grid {
            gap: 2rem !important;
          }

          .hiw-featured-title {
            font-size: 3.5rem !important;
          }

          .hiw-featured-desc {
            font-size: 1.35rem !important;
            line-height: 1.8 !important;
            max-width: 44rem !important;
          }

          .hiw-featured-btn {
            font-size: 1.15rem !important;
          }

          .hiw-card-icon svg {
            width: 4.5rem !important;
            height: 4.5rem !important;
          }

          .hiw-card-title {
            font-size: 1.55rem !important;
          }

          .hiw-card-desc {
            font-size: 1.15rem !important;
            line-height: 1.65 !important;
          }

          .hiw-stepper-box {
            margin-top: 6rem !important;
          }

          .hiw-step-text-wrapper {
            max-width: 440px !important;
          }

          .hiw-stepper-line {
            top: 52px !important;
          }

          .hiw-step-circle {
            width: 104px !important;
            height: 104px !important;
          }

          .hiw-step-icon {
            width: 2.1rem !important;
            height: 2.1rem !important;
          }

          .hiw-step-num {
            font-size: 1.15rem !important;
          }

          .hiw-step-title {
            font-size: 1.6rem !important;
          }

          .hiw-step-text {
            font-size: 1.25rem !important;
            line-height: 1.7 !important;
          }

          .hiw-step-badge {
            padding: 0.45rem 1.15rem !important;
            font-size: 1rem !important;
          }
        }

        /* ─────────────────────────────────────────
           3200px
        ───────────────────────────────────────── */
        @media (min-width: 3200px) {
          .app-container {
            max-width: 2900px !important;
            padding-left: 9rem !important;
            padding-right: 9rem !important;
          }

          .hiw-featured-desc {
            font-size: 1.6rem !important;
            line-height: 1.9 !important;
            max-width: 52rem !important;
          }

          .hiw-card-title {
            font-size: 1.85rem !important;
          }

          .hiw-card-desc {
            font-size: 1.35rem !important;
            line-height: 1.7 !important;
          }

          .hiw-step-text-wrapper {
            max-width: 520px !important;
          }

          .hiw-step-title {
            font-size: 1.9rem !important;
          }

          .hiw-step-text {
            font-size: 1.45rem !important;
            line-height: 1.75 !important;
          }
        }

        /* ─────────────────────────────────────────
           4K / 3840px
        ───────────────────────────────────────── */
        @media (min-width: 3840px) {
          .app-container {
            max-width: 3400px !important;
            padding-left: 10rem !important;
            padding-right: 10rem !important;
          }

          .hiw-section {
            padding-top: 7.5rem !important;
            padding-bottom: 7.5rem !important;
          }

          .hiw-tagline {
            font-size: 1.5rem !important;
            margin-bottom: 2rem !important;
          }

          .hiw-grid {
            gap: 3rem !important;
          }

          .hiw-featured-title {
            font-size: 4.75rem !important;
          }

          .hiw-featured-desc {
            font-size: 1.85rem !important;
            line-height: 2.2rem !important;
            max-width: 60rem !important;
          }

          .hiw-featured-btn {
            font-size: 1.5rem !important;
          }

          .hiw-card-icon svg {
            width: 6.5rem !important;
            height: 6.5rem !important;
          }

          .hiw-card-title {
            font-size: 2.25rem !important;
            margin-bottom: 0.75rem !important;
          }

          .hiw-card-desc {
            font-size: 1.6rem !important;
            line-height: 1.75 !important;
          }

          .hiw-stepper-box {
            margin-top: 8.5rem !important;
          }

          .hiw-step-text-wrapper {
            max-width: 620px !important;
          }

          .hiw-stepper-line {
            top: 72px !important;
            height: 3px !important;
          }

          .hiw-step-circle {
            width: 144px !important;
            height: 144px !important;
            border-width: 6px !important;
          }

          .hiw-step-icon {
            width: 3rem !important;
            height: 3rem !important;
          }

          .hiw-step-num {
            font-size: 1.5rem !important;
            margin-top: 1.25rem !important;
          }

          .hiw-step-title {
            font-size: 2.25rem !important;
          }

          .hiw-step-text {
            font-size: 1.75rem !important;
            line-height: 1.8 !important;
          }

          .hiw-step-badge {
            padding: 0.6rem 1.6rem !important;
            font-size: 1.35rem !important;
          }
        }

        /* ─────────────────────────────────────────
           MOBILE VERTICAL STEPPER LINE
           Only mobile/tablet
        ───────────────────────────────────────── */
        @media (max-width: 1023px) {
          .hiw-mobile-stepper-line {
            display: block !important;
            position: absolute;

            /*
             * Center of the stepper.
             * The line stays behind the circles,
             * numbers, titles and descriptions.
             */
            top: 0;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);

            width: 2px;
            height: auto;

            background: linear-gradient(
              180deg,
              rgba(147, 197, 253, 0.35),
              rgba(191, 219, 254, 0.70),
              rgba(134, 239, 172, 0.45)
            );

            z-index: 0;
            pointer-events: none;
          }
        }

        @media (max-width: 639px) {
          .hiw-mobile-stepper-line {
            left: 50%;
            width: 1.5px;
          }
        }

        @media (max-width: 374px) {
          .hiw-mobile-stepper-line {
            left: 50%;
            width: 1.5px;
          }
        }

        /* ─────────────────────────────────────────
           DEEP PAPER FOLD
        ───────────────────────────────────────── */
        .deep-peel-fold {
          position: absolute;
          top: 0;
          right: 0;
          width: 38px;
          height: 38px;
          pointer-events: none;
          z-index: 20;
          filter: drop-shadow(-2px 2px 4px rgba(0, 0, 0, 0.14));
        }

        .deep-peel-fold::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 38px;
          height: 38px;
          background: linear-gradient(
            225deg,
            #cbd5e1 0%,
            #f1f5f9 22%,
            #ffffff 50%,
            #e2e8f0 100%
          );
          clip-path: polygon(0 0, 0 100%, 100% 100%);
          border-bottom-left-radius: 14px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .group:hover .deep-peel-fold::after {
          width: 42px;
          height: 42px;
          border-bottom-left-radius: 16px;
          background: linear-gradient(
            225deg,
            #94a3b8 0%,
            #e2e8f0 22%,
            #ffffff 50%,
            #cbd5e1 100%
          );
        }

        /* Prevent long text from ever breaking the layout */
        .hiw-card-desc,
        .hiw-step-text,
        .hiw-featured-desc {
          overflow-wrap: anywhere;
          word-break: normal;
        }

        /* Keep mobile vertical line behind the stepper content */
        @media (max-width: 1023px) {
          .hiw-mobile-stepper-line {
            pointer-events: none;
            z-index: 0;
          }

          .hiw-step-circle,
          .hiw-step-num,
          .hiw-step-text-wrapper,
          .hiw-step-badge {
            isolation: isolate;
            position: relative;
            z-index: 10;
          }
        }
      `}</style>

      <div className="app-container">
        {/* TOP TAGLINE */}
        <p
          className="
            hiw-tagline
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

        {/* SOLUTION GRID */}
        <div
          className="
            hiw-grid
            grid
            grid-cols-2
            lg:grid-cols-5
            gap-3
            sm:gap-4.5
            lg:gap-5
            w-full
            items-stretch
          "
        >
          {/* FEATURED BLUE CARD */}
          <div
            className="
              col-span-2
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
              text-left
              min-w-0
            "
          >
            <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-blue-400/20 blur-2xl pointer-events-none" />

            <div className="absolute top-0 right-1/4 w-32 h-32 rounded-full bg-cyan-400/10 blur-xl pointer-events-none" />

            <div className="relative z-10 text-left min-w-0">
              <h2
                style={{
                  fontFamily: "'Hedvig Letters Serif', serif",
                }}
                className="
                  hiw-featured-title
                  text-3xl
                  sm:text-3xl
                  md:text-4xl
                  lg:text-4xl
                  xl:text-5xl
                  font-bold
                  leading-[1.18]
                  text-white
                  text-left
                  break-words
                "
              >
                Get Your{" "}
                <span className="text-green-600">Solutions</span>
              </h2>

              <p
                className="
                  hiw-featured-desc
                  mt-2
                  text-xs
                  sm:text-[13.5px]
                  text-blue-100/90
                  leading-relaxed
                  max-w-lg
                  text-justify
                  [text-align-last:left]
                  [text-wrap:pretty]
                  break-words
                "
              >
                We provide a fast, transparent process to help businesses
                complete registrations, tax compliance, and legal filings
                with zero hassle.
              </p>
            </div>

            {/* VIEW ALL */}
            <div className="relative z-10 mt-5 sm:mt-6 text-left">
              <button
                type="button"
                onClick={handleViewAll}
                className="
                  inline-block
                  group/link
                  cursor-pointer
                  bg-transparent
                  border-none
                  p-0
                "
              >
                <span
                  style={{ fontFamily: "'Inter', sans-serif" }}
                  className="
                    hiw-featured-btn
                    text-xs
                    sm:text-sm
                    font-semibold
                    tracking-[0.2em]
                    uppercase
                    text-white/90
                    group-hover/link:text-white
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
              </button>
            </div>
          </div>

          {/* SOLUTION CARDS */}
          {solutionCards.map((item) => (
            <SolutionCardItem key={item.id} item={item} />
          ))}
        </div>

        {/* HOW IT WORKS STEPPER */}
        <div className="hiw-stepper-box mt-10 sm:mt-12 lg:mt-14 w-full relative">
          {/* DESKTOP CONNECTING LINE */}
          <div
            className="
              hiw-stepper-line
              hidden
              lg:block
              absolute
              top-[36px]
              left-[12.5%]
              right-[12.5%]
              h-[2px]
              bg-gradient-to-r
              from-blue-300/40
              via-blue-200/50
              to-green-300/40
              z-0
            "
          />

          {/* MOBILE VERTICAL CONNECTING LINE */}
          <div className="hiw-mobile-stepper-line hidden" />

          {/* STEPS GRID */}
          <div
            className="
              grid
              grid-cols-1
              lg:grid-cols-4
              gap-8
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
                    group
                    relative
                    z-10
                  "
                >
                  {/* ICON CIRCLE */}
                  <div
                    className={`
                      hiw-step-circle
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
                      size={20}
                      className={`
                        hiw-step-icon
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
                      hiw-step-num
                      mt-2.5
                      text-[11px]
                      sm:text-xs
                      font-bold
                      transition-colors
                      duration-300
                      relative
                      z-20
                      ${
                        isMobileActive
                          ? "max-lg:text-green-600"
                          : "text-[#0B4EA2]"
                      }
                    `}
                  >
                    STEP {item.number}
                  </div>

                  {/* TITLE & DESCRIPTION */}
                  <div
                    className="
                      hiw-step-text-wrapper
                      w-full
                      max-w-[240px]
                      min-w-0
                      flex
                      flex-col
                      items-center
                      mt-1
                      sm:mt-1.5
                      relative
                      z-20
                      px-2
                    "
                  >
                    <h4
                      style={{
                        fontFamily: "'Hedvig Letters Serif', serif",
                      }}
                      className="
                        hiw-step-title
                        text-base
                        sm:text-lg
                        font-bold
                        text-gray-900
                        leading-snug
                        w-full
                        text-center
                        break-words
                      "
                    >
                      {item.title}
                    </h4>

                    <p
                      className="
                        hiw-step-text
                        mt-1.5
                        w-full
                        text-xs
                        sm:text-[13px]
                        leading-[1.45]
                        text-gray-600
                        text-center
                        px-1
                        break-words
                      "
                    >
                      {item.text}
                    </p>
                  </div>

                  {/* BADGE */}
                  <div
                    className="
                      hiw-step-badge
                      mt-2.5
                      sm:mt-3
                      px-2.5
                      py-0.5
                      rounded-full
                      bg-white/80
                      border
                      border-blue-100
                      flex
                      items-center
                      justify-center
                      gap-1
                      shadow-xs
                      relative
                      z-20
                    "
                  >
                    <Check
                      size={12}
                      className="text-green-600 shrink-0"
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
    </section>
  );
};

export default HowItWorks;