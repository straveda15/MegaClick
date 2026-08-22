import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  FileCheck,
  CreditCard,
  Award,
  ReceiptText,
} from "lucide-react";

import hero1 from "../assets/hero1.jpg";
import hero2 from "../assets/hero2.jpg";
import hero4 from "../assets/hero4.png";
import hero3 from "../assets/hero3.webp";

const services = [
  {
    id: 1,
    title: "MSME / UDYAM Registration",
    desc: "Apply for MSME and Udyam certificate online with fast document verification, expert support, and complete registration guidance.",
    image: hero4,
    imgClass: "max-h-[75%] max-w-[72%]",
    fallbackIcon: <FileCheck className="w-8 h-8 text-[#0B4EA2]" />,
    gradient: "from-sky-100/70 via-blue-50/40 to-white",
    borderColor: "border-sky-100",
  },
  {
    id: 2,
    title: "Voter ID, PAN & TAN Services",
    desc: "Quick assistance for new PAN, TAN, and Voter ID cards, corrections, biometric updates, and timely government processing.",
    image: hero2,
    imgClass: "max-h-full max-w-[85%]",
    fallbackIcon: <CreditCard className="w-8 h-8 text-amber-500" />,
    gradient: "from-amber-100/60 via-orange-50/30 to-white",
    borderColor: "border-amber-100",
  },
  {
    id: 3,
    title: "Trademark Registration",
    desc: "Secure your brand name, logo, and identity with end-to-end online trademark search, filing, and legal brand protection.",
    image: hero1,
    imgClass: "max-h-full max-w-[95%] scale-110",
    fallbackIcon: <Award className="w-8 h-8 text-emerald-600" />,
    gradient: "from-emerald-100/60 via-green-50/30 to-white",
    borderColor: "border-emerald-100",
  },
  {
    id: 4,
    title: "GST Registration & Filing Services",
    desc: "Online GST registration, monthly return filings, input tax credit reconciliation, and comprehensive business tax compliance.",
    image: hero3,
    imgClass: "max-h-full max-w-[85%]",
    fallbackIcon: <ReceiptText className="w-8 h-8 text-purple-600" />,
    gradient: "from-purple-100/60 via-indigo-50/30 to-white",
    borderColor: "border-purple-100",
  },
];

const Hero = () => {
  let navigate;
  try {
    navigate = useNavigate();
  } catch (e) {
    navigate = null;
  }

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

  const scrollToHowItWorks = () => {
    const target =
      document.getElementById("how-it-works") ||
      document.getElementById("services") ||
      document.getElementById("contact");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    } else if (navigate) {
      navigate("/services");
      window.scrollTo(0, 0);
    }
  };

  const handleContactRedirect = () => {
    if (navigate) {
      navigate("/contact");
      window.scrollTo(0, 0);
    } else {
      window.location.href = "/contact";
    }
  };

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-white font-['Inter',sans-serif]"
    >
      {/* DIRECT DESKTOP MEDIA QUERIES TO GUARANTEE 100% RESPONSIVENESS AT 1440px, 1920px, 2560px & 3840px (4K) */}
      <style>{`
        /* Standard Desktop (1440px x 900px) */
        @media (min-width: 1440px) {
          .hero-container {
            max-width: 1440px !important;
            padding-left: 4rem !important;
            padding-right: 4rem !important;
            padding-top: 3.5rem !important;
            padding-bottom: 3.5rem !important;
          }
          .hero-grid {
            gap: 4rem !important;
          }
          .hero-title {
            font-size: 3.25rem !important;
            line-height: 1.15 !important;
          }
          .hero-desc {
            font-size: 1.125rem !important;
            max-width: 36rem !important;
            line-height: 1.75rem !important;
          }
          .hero-stat-num {
            font-size: 2.25rem !important;
          }
          .hero-stat-label {
            font-size: 0.95rem !important;
          }
          .hero-cards-grid {
            max-width: 680px !important;
            gap: 1.25rem !important;
          }
          .hero-card {
            min-height: 240px !important;
            padding: 1.5rem !important;
          }
          .hero-card-title {
            font-size: 1.15rem !important;
          }
          .hero-card-desc {
            font-size: 0.85rem !important;
          }
        }

        /* Large Desktop (1920px x 1080px Full HD) */
        @media (min-width: 1920px) {
          .hero-container {
            max-width: 1800px !important;
            padding-left: 5rem !important;
            padding-right: 5rem !important;
            padding-top: 4.5rem !important;
            padding-bottom: 4.5rem !important;
          }
          .hero-grid {
            gap: 5rem !important;
          }
          .hero-badge-text {
            font-size: 1.1rem !important;
          }
          .hero-title {
            font-size: 4.25rem !important;
            line-height: 1.12 !important;
          }
          .hero-desc {
            font-size: 1.35rem !important;
            max-width: 44rem !important;
            line-height: 2.1rem !important;
          }
          .hero-stat-num {
            font-size: 3rem !important;
          }
          .hero-stat-label {
            font-size: 1.05rem !important;
          }
          .hero-btn {
            padding: 1rem 2.5rem !important;
            font-size: 1.15rem !important;
          }
          .hero-cards-grid {
            max-width: 800px !important;
            gap: 1.5rem !important;
          }
          .hero-card {
            min-height: 280px !important;
            padding: 2rem !important;
            border-radius: 1.75rem !important;
          }
          .hero-card-img-box {
            height: 5.5rem !important;
            margin-bottom: 1.25rem !important;
          }
          .hero-card-title {
            font-size: 1.35rem !important;
            margin-bottom: 0.6rem !important;
          }
          .hero-card-desc {
            font-size: 0.98rem !important;
            line-height: 1.6 !important;
          }
        }

        /* QHD / 2K Ultra-Wide (2560px Desktop) */
        @media (min-width: 2560px) {
          .hero-container {
            max-width: 2300px !important;
            padding-left: 6rem !important;
            padding-right: 6rem !important;
            padding-top: 6rem !important;
            padding-bottom: 6rem !important;
          }
          .hero-grid {
            gap: 6rem !important;
          }
          .hero-badge-text {
            font-size: 1.35rem !important;
          }
          .hero-title {
            font-size: 5.5rem !important;
            line-height: 1.1 !important;
          }
          .hero-desc {
            font-size: 1.75rem !important;
            max-width: 56rem !important;
            line-height: 2.6rem !important;
          }
          .hero-stat-num {
            font-size: 4rem !important;
          }
          .hero-stat-label {
            font-size: 1.3rem !important;
          }
          .hero-btn {
            padding: 1.25rem 3.25rem !important;
            font-size: 1.4rem !important;
          }
          .hero-cards-grid {
            max-width: 1000px !important;
            gap: 2rem !important;
          }
          .hero-card {
            min-height: 350px !important;
            padding: 2.5rem !important;
            border-radius: 2.25rem !important;
          }
          .hero-card-img-box {
            height: 7rem !important;
            margin-bottom: 1.5rem !important;
          }
          .hero-card-title {
            font-size: 1.75rem !important;
            margin-bottom: 0.75rem !important;
          }
          .hero-card-desc {
            font-size: 1.2rem !important;
            line-height: 1.65 !important;
          }
        }

        /* 4K Ultra-Wide Desktop (3840px x 2160px) */
        @media (min-width: 3840px) {
          .hero-container {
            max-width: 3400px !important;
            padding-left: 8rem !important;
            padding-right: 8rem !important;
            padding-top: 8rem !important;
            padding-bottom: 8rem !important;
          }
          .hero-grid {
            gap: 8rem !important;
          }
          .hero-badge-text {
            font-size: 2rem !important;
          }
          .hero-badge-icon {
            width: 2.5rem !important;
            height: 2.5rem !important;
          }
          .hero-title {
            font-size: 7.5rem !important;
            line-height: 1.08 !important;
          }
          .hero-desc {
            font-size: 2.5rem !important;
            max-width: 78rem !important;
            line-height: 3.75rem !important;
          }
          .hero-stat-num {
            font-size: 5.5rem !important;
          }
          .hero-stat-label {
            font-size: 1.75rem !important;
          }
          .hero-btn {
            padding: 1.75rem 4.5rem !important;
            font-size: 2rem !important;
            border-radius: 9999px !important;
          }
          .hero-btn-icon {
            width: 2rem !important;
            height: 2rem !important;
          }
          .hero-cards-grid {
            max-width: 1500px !important;
            gap: 3rem !important;
          }
          .hero-card {
            min-height: 480px !important;
            padding: 3.5rem !important;
            border-radius: 3rem !important;
          }
          .hero-card-img-box {
            height: 10rem !important;
            margin-bottom: 2rem !important;
          }
          .hero-card-title {
            font-size: 2.5rem !important;
            margin-bottom: 1.25rem !important;
          }
          .hero-card-desc {
            font-size: 1.6rem !important;
            line-height: 1.8 !important;
          }
        }
      `}</style>

      <div
        className="
          hero-container
          max-w-[1500px]
          mx-auto
          px-5
          sm:px-8
          lg:px-16
          xl:px-24
          py-6
          sm:py-10
          lg:py-12
        "
      >
        <div
          className="
            hero-grid
            grid
            grid-cols-1
            lg:grid-cols-2
            gap-8
            sm:gap-10
            lg:gap-12
            xl:gap-16
            items-start
          "
        >
          {/* =====================================================
              LEFT CONTENT (PERFECT HORIZONTAL ALIGNMENT AT TOP)
          ====================================================== */}
          <div
            className="
              space-y-4
              sm:space-y-6
              md:space-y-7
              w-full
              flex
              flex-col
              items-start
              text-left
            "
          >
            {/* TRUSTED BUSINESS SOLUTIONS TEXT (TOP HORIZONTAL LINE WITH CARDS) */}
            <div
              className="
                hero-badge-text
                inline-flex
                items-center
                gap-2
                text-[#0B4EA2]
                text-xs
                sm:text-sm
                font-semibold
                tracking-wide
                text-left
              "
            >
              <CheckCircle2 size={18} className="hero-badge-icon text-[#0B4EA2] flex-shrink-0" />
              <span>Trusted Business Solutions</span>
            </div>

            {/* HEADING (Hedvig Letters Serif) */}
            <h1
              style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
              className="
                hero-title
                text-3xl
                sm:text-3xl
                md:text-4xl
                lg:text-4xl
                xl:text-5xl
                font-bold
                leading-[1.18]
                text-black
                text-left
              "
            >
              Grow Your Business
              <br />
              <span className="text-[#0B4EA2]">
                With Smart Solutions
              </span>
            </h1>

            {/* DESCRIPTION */}
            <p
              className="
                hero-desc
                text-sm
                sm:text-base
                md:text-lg
                text-slate-700
                leading-relaxed
                sm:leading-7
                max-w-xl
                text-justify
                sm:text-left
                [text-align-last:left]
                [text-wrap:pretty]
              "
            >
              Complete business solutions to simplify your registrations, tax
              compliance, and financial growth with trusted expert guidance.
            </p>

            {/* STATS */}
            <div
              className="
                flex
                gap-5
                sm:gap-8
                md:gap-10
                flex-wrap
                justify-start
                w-full
              "
            >
              <div className="text-left">
                <h3
                  className="
                    hero-stat-num
                    text-2xl
                    sm:text-3xl
                    font-bold
                    text-[#0B4EA2]
                  "
                >
                  15000+
                </h3>
                <p className="hero-stat-label text-black text-xs sm:text-sm whitespace-nowrap">
                  Happy Clients
                </p>
              </div>

              <div className="text-left">
                <h3
                  className="
                    hero-stat-num
                    text-2xl
                    sm:text-3xl
                    font-bold
                    text-[#0B4EA2]
                  "
                >
                  25+
                </h3>
                <p className="hero-stat-label text-black text-xs sm:text-sm whitespace-nowrap">
                  Services
                </p>
              </div>

              <div className="text-left">
                <h3
                  className="
                    hero-stat-num
                    text-2xl
                    sm:text-3xl
                    font-bold
                    text-[#0B4EA2]
                  "
                >
                  10+
                </h3>
                <p className="hero-stat-label text-black text-xs sm:text-sm whitespace-nowrap">
                  Years Experience
                </p>
              </div>
            </div>

            {/* BUTTONS */}
            <div
              className="
                flex
                flex-row
                gap-3
                sm:gap-4
                pt-2
                w-full
                sm:w-auto
                justify-start
                items-center
              "
            >
              <button
                onClick={scrollToHowItWorks}
                className="
                  hero-btn
                  group
                  flex-1
                  sm:flex-initial
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  bg-green-600
                  hover:bg-green-700
                  active:bg-green-800
                  text-white
                  px-5
                  sm:px-8
                  py-3
                  sm:py-3.5
                  rounded-full
                  font-medium
                  text-sm
                  sm:text-base
                  shadow-sm
                  hover:shadow-md
                  transition-all
                  duration-200
                  transform
                  hover:-translate-y-0.5
                  active:translate-y-0
                  cursor-pointer
                  text-center
                  whitespace-nowrap
                "
              >
                <span>Get Started</span>
                <ArrowRight
                  size={17}
                  className="hero-btn-icon transition-transform duration-200 group-hover:translate-x-1"
                />
              </button>

              <button
                onClick={handleContactRedirect}
                className="
                  hero-btn
                  flex-1
                  sm:flex-initial
                  inline-flex
                  items-center
                  justify-center
                  bg-[#0B4EA2]
                  hover:bg-blue-700
                  active:bg-blue-800
                  text-white
                  px-5
                  sm:px-8
                  py-3
                  sm:py-3.5
                  rounded-full
                  font-medium
                  text-sm
                  sm:text-base
                  shadow-sm
                  hover:shadow-md
                  transition-all
                  duration-200
                  transform
                  hover:-translate-y-0.5
                  active:translate-y-0
                  cursor-pointer
                  text-center
                  whitespace-nowrap
                "
              >
                Contact Us
              </button>
            </div>
          </div>

          {/* =====================================================
              RIGHT 4 CARDS GRID
          ====================================================== */}
          <div className="w-full flex justify-center lg:justify-end items-center">
            <div className="hero-cards-grid grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-5 w-full max-w-[620px]">
              {services.map((service) => (
                <div
                  key={service.id}
                  className={`
                    hero-card
                    group
                    relative
                    bg-gradient-to-b ${service.gradient}
                    border ${service.borderColor}
                    rounded-2xl
                    sm:rounded-3xl
                    p-4.5
                    sm:p-5
                    md:p-5.5
                    flex
                    flex-col
                    justify-between
                    shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)]
                    hover:shadow-[0_10px_28px_-4px_rgba(11,78,162,0.14)]
                    hover:-translate-y-1.5
                    transition-all
                    duration-300
                    overflow-hidden
                    min-h-[210px]
                    sm:min-h-[225px]
                  `}
                >
                  {/* Card Image Container */}
                  <div className="hero-card-img-box h-14 sm:h-16 w-full flex items-center justify-center mb-3">
                    {service.image ? (
                      <img
                        src={service.image}
                        alt={service.title}
                        className={`${service.imgClass || "max-h-full max-w-[85%]"} object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300`}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          const fallback = e.currentTarget.parentElement?.querySelector(".fallback-box");
                          if (fallback) fallback.classList.remove("hidden");
                        }}
                      />
                    ) : null}
                    <div className="fallback-box hidden items-center justify-center p-2.5 rounded-2xl bg-white/90 shadow-sm border border-slate-100">
                      {service.fallbackIcon}
                    </div>
                  </div>

                  {/* Card Text Content */}
                  <div className="flex flex-col flex-grow text-left">
                    <h3
                      style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
                      className="
                        hero-card-title
                        text-[15px]
                        sm:text-[16.5px]
                        font-bold
                        text-slate-900
                        mb-1.5
                        leading-snug
                        text-left
                      "
                    >
                      {service.title}
                    </h3>
                    <p
                      style={{ fontFamily: "'Inter', sans-serif" }}
                      className="
                        hero-card-desc
                        text-[11.5px]
                        sm:text-[12px]
                        text-slate-600
                        leading-[1.55]
                        line-clamp-3
                        text-left
                        [text-wrap:pretty]
                      "
                    >
                      {service.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          BACKGROUND BLUR ACCENTS
      ====================================================== */}
      <div
        className="
          absolute
          -top-32
          -left-32
          w-72
          h-72
          rounded-full
          bg-blue-100/50
          blur-3xl
          -z-10
        "
      />
      <div
        className="
          absolute
          -bottom-40
          -right-40
          w-96
          h-96
          rounded-full
          bg-green-100/40
          blur-3xl
          -z-10
        "
      />
    </section>
  );
};

export default Hero;