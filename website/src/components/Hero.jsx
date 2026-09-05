import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  FileCheck,
  CreditCard,
  Award,
  ReceiptText,
} from "lucide-react";

import hero1 from "../assets/hero1.jpg";
import hero2 from "../assets/hero2.jpg";
import hero4 from "../assets/hero4.png";
import hero3 from "../assets/hero3.webp";

// =========================================================
// ✅ PERFECT LINEAR COUNT-UP
// कोई easing नहीं → 15 तक एकदम सीधा, बिना रुके
// =========================================================
const LinearCountUp = ({ end, suffix = "", duration = 800 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  const rafRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          let startTime = null;

          const tick = (timestamp) => {
            if (!startTime) startTime = timestamp;
            // Linear progress: 0 → 1 uniformly over `duration` ms
            const progress = Math.min((timestamp - startTime) / duration, 1);
            // Direct linear mapping — no easing, no slowdown at end
            const current = Math.ceil(progress * end);
            setCount(current);

            if (progress < 1) {
              rafRef.current = requestAnimationFrame(tick);
            } else {
              setCount(end); // guarantee exact final value
            }
          };

          rafRef.current = requestAnimationFrame(tick);
        }
      },
      { threshold: 0.1 }
    );

    const el = ref.current;
    if (el) observer.observe(el);

    return () => {
      observer.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [end, duration]);

  return (
    <span
      ref={ref}
      style={{ fontVariantNumeric: "tabular-nums", display: "inline-block", minWidth: "2ch" }}
    >
      {count}{suffix}
    </span>
  );
};

// =========================================================
// SERVICE CARDS DATA
// =========================================================
const services = [
  {
    id: 1,
    title: "MSME / UDYAM Registration",
    desc: "Apply for MSME and Udyam certificate online with fast document verification, expert support, and complete registration.",
    image: hero4,
    imgClass: "max-h-[85%] max-w-[80%]",
    fallbackIcon: <FileCheck className="w-8 h-8 text-[#0B4EA2]" />,
    gradient: "from-sky-100/70 via-blue-50/40 to-white",
    borderColor: "border-sky-100",
  },
  {
    id: 2,
    title: "Voter ID, PAN & TAN Services",
    desc: "Quick assistance for new PAN, TAN, and Voter ID cards, corrections, biometric updates, and timely government.",
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
    imgClass: "max-h-full max-w-[95%]",
    fallbackIcon: <Award className="w-8 h-8 text-emerald-600" />,
    gradient: "from-emerald-100/60 via-green-50/30 to-white",
    borderColor: "border-emerald-100",
  },
  {
    id: 4,
    title: "GST Registration & Filing",
    desc: "Online GST registration, monthly return filings, input tax credit reconciliation, and comprehensive business tax compliance.",
    image: hero3,
    imgClass: "max-h-full max-w-[85%]",
    fallbackIcon: <ReceiptText className="w-8 h-8 text-purple-600" />,
    gradient: "from-purple-100/60 via-indigo-50/30 to-white",
    borderColor: "border-purple-100",
  },
];

const CAROUSEL_INTERVAL_MS = 4500;

const Hero = () => {
  let navigate;
  try {
    navigate = useNavigate();
  } catch (e) {
    navigate = null;
  }

  // =========================================================
  // ✅ SERVICE CARD CAROUSEL (auto-rotate + manual select)
  // =========================================================
  const [activeService, setActiveService] = useState(0);
  const rotateTimerRef = useRef(null);

  const resetRotateTimer = () => {
    if (rotateTimerRef.current) clearInterval(rotateTimerRef.current);
    rotateTimerRef.current = setInterval(() => {
      setActiveService((prev) => (prev + 1) % services.length);
    }, CAROUSEL_INTERVAL_MS);
  };

  useEffect(() => {
    resetRotateTimer();
    return () => clearInterval(rotateTimerRef.current);
  }, []);

  const handleServiceSelect = (index) => {
    setActiveService(index);
    resetRotateTimer();
  };

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
      className="relative overflow-hidden bg-white font-['Inter',sans-serif] py-6 sm:py-10 lg:py-14 min-[1920px]:py-20 min-[3840px]:py-32"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hedvig+Letters+Serif:opsz@12..24&family=Inter:wght@400;500;600;700;800&display=swap');

        /* ── 1440px Desktop ── */
        @media (min-width: 1440px) {
          .hero-container        { max-width: 1380px !important; padding-left: 2.5rem !important; padding-right: 2.5rem !important; }
          .hero-title            { font-size: 2.75rem !important; }
          .hero-desc             { font-size: 1rem !important; }
          .hero-stat-num         { font-size: 2.25rem !important; }
          .hero-stat-label       { font-size: 0.875rem !important; }
          .hero-card             { min-height: 230px !important; padding: 2rem !important; border-radius: 1.25rem !important; }
          .hero-card-img-box     { height: 8rem !important; }
          .hero-card-title       { font-size: 1.5rem !important; }
          .hero-card-desc        { font-size: 1rem !important; line-height: 1.65 !important; }
        }

        /* ── 1920px Full HD ── */
        @media (min-width: 1920px) {
          .hero-container        { max-width: 1800px !important; padding-left: 4rem !important; padding-right: 4rem !important; }
          .hero-title            { font-size: 3.75rem !important; line-height: 1.15 !important; }
          .hero-desc             { font-size: 1.25rem !important; line-height: 2rem !important; max-width: 44rem !important; }
          .hero-stat-num         { font-size: 2.75rem !important; }
          .hero-stat-label       { font-size: 1rem !important; }
          .hero-btn              { font-size: 1.125rem !important; padding: 1rem 2.25rem !important; }

          /* ✅ Card scaling for 1920px */
          .hero-cards-grid       { max-width: 700px !important; gap: 1.5rem !important; }
          .hero-card             { min-height: 280px !important; padding: 2.5rem !important; border-radius: 1.5rem !important; }
          .hero-card-img-box     { height: 9rem !important; }
          .hero-card-title       { font-size: 1.75rem !important; margin-bottom: 0.75rem !important; }
          .hero-card-desc        { font-size: 1.125rem !important; line-height: 1.7 !important; }
        }

        /* ── 2560px QHD ── */
        @media (min-width: 2560px) {
          .hero-container        { max-width: 2400px !important; padding-left: 5rem !important; padding-right: 5rem !important; }
          .hero-title            { font-size: 5rem !important; line-height: 1.15 !important; }
          .hero-desc             { font-size: 1.75rem !important; line-height: 2.75rem !important; max-width: 60rem !important; }
          .hero-stat-num         { font-size: 4rem !important; }
          .hero-stat-label       { font-size: 1.4rem !important; }
          .hero-btn              { font-size: 1.5rem !important; padding: 1.25rem 3rem !important; }

          /* ✅ Card scaling for 2560px */
          .hero-cards-grid       { max-width: 1000px !important; gap: 2rem !important; }
          .hero-card             { min-height: 380px !important; padding: 3rem !important; border-radius: 1.75rem !important; }
          .hero-card-img-box     { height: 11rem !important; }
          .hero-card-title       { font-size: 2.25rem !important; margin-bottom: 1rem !important; }
          .hero-card-desc        { font-size: 1.4rem !important; line-height: 1.8 !important; }
        }

        /* ── 3840px 4K Ultra-Wide ── */
        @media (min-width: 3840px) {
          .hero-container        { max-width: 3200px !important; padding-left: 6rem !important; padding-right: 6rem !important; }
          .hero-grid             { gap: 5rem !important; }
          .hero-title            { font-size: 6.5rem !important; line-height: 1.15 !important; }
          .hero-desc             { font-size: 2.25rem !important; line-height: 3.5rem !important; max-width: 75rem !important; }
          .hero-stat-num         { font-size: 5rem !important; }
          .hero-stat-label       { font-size: 1.75rem !important; margin-top: 0.75rem !important; }
          .hero-btn              { font-size: 2rem !important; padding: 1.5rem 3.5rem !important; border-radius: 9999px !important; }

          /* ✅ Card scaling for 4K */
          .hero-cards-grid       { max-width: 1400px !important; gap: 2.5rem !important; }
          .hero-card             { min-height: 520px !important; padding: 4rem !important; border-radius: 2.5rem !important; }
          .hero-card-img-box     { height: 15rem !important; }
          .hero-card-title       { font-size: 3rem !important; margin-bottom: 1.25rem !important; line-height: 1.3 !important; }
          .hero-card-desc        { font-size: 2rem !important; line-height: 2.75rem !important; }
        }

        /* ── Respect reduced-motion preference: swap instead of fade ── */
        @media (prefers-reduced-motion: reduce) {
          .hero-carousel-card {
            transition: none !important;
          }
        }
      `}</style>

      {/* MAIN CONTAINER */}
      <div className="hero-container w-full max-w-[1380px] mx-auto px-4 sm:px-6 min-[1440px]:px-10">
        <div className="hero-grid grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-start lg:items-stretch">

          {/* =====================================================
              LEFT — Heading, Desc, Stats, Buttons
          ====================================================== */}
          <div className="space-y-4 sm:space-y-6 md:space-y-7 w-full flex flex-col items-start text-left">

            {/* HEADING */}
            <h1
              style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
              className="hero-title text-3xl sm:text-4xl xl:text-5xl font-bold leading-[1.18] text-slate-900 text-left"
            >
              Grow Your Business
              <br />
              <span className="text-[#0B4EA2]">With Smart Solutions</span>
            </h1>

            {/* DESCRIPTION */}
            <p
              style={{ fontFamily: "'Inter', sans-serif" }}
              className="hero-desc text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed sm:leading-7 max-w-xl text-left font-normal"
            >
              Complete business solutions to simplify your registrations, tax
              compliance, and financial growth with trusted expert guidance.
            </p>

            {/* STATS */}
            <div className="flex gap-6 sm:gap-8 md:gap-10 flex-wrap justify-start w-full pt-1">

              <div className="flex flex-col items-start text-left" style={{ minWidth: "90px" }}>
                <h3
                  style={{ fontFamily: "'Inter', sans-serif" }}
                  className="hero-stat-num text-2xl sm:text-3xl font-bold text-[#0B4EA2] tracking-tight leading-none"
                >
                  <LinearCountUp end={15} suffix="k+" duration={800} />
                </h3>
                <div className="hero-stat-label text-xs sm:text-sm font-medium text-slate-600 mt-1 sm:mt-1.5 whitespace-nowrap">
                  Happy customers
                </div>
              </div>

              <div className="flex flex-col items-start text-left" style={{ minWidth: "70px" }}>
                <h3
                  style={{ fontFamily: "'Inter', sans-serif" }}
                  className="hero-stat-num text-2xl sm:text-3xl font-bold text-[#0B4EA2] tracking-tight leading-none"
                >
                  <LinearCountUp end={25} suffix="+" duration={800} />
                </h3>
                <div className="hero-stat-label text-xs sm:text-sm font-medium text-slate-600 mt-1 sm:mt-1.5 whitespace-nowrap">
                  Services
                </div>
              </div>

              <div className="flex flex-col items-start text-left" style={{ minWidth: "100px" }}>
                <h3
                  style={{ fontFamily: "'Inter', sans-serif" }}
                  className="hero-stat-num text-2xl sm:text-3xl font-bold text-[#0B4EA2] tracking-tight leading-none"
                >
                  <LinearCountUp end={10} suffix="+" duration={800} />
                </h3>
                <div className="hero-stat-label text-xs sm:text-sm font-medium text-slate-600 mt-1 sm:mt-1.5 whitespace-nowrap">
                  Years Experience
                </div>
              </div>

            </div>

            {/* BUTTONS */}
            <div className="flex flex-row gap-3 sm:gap-4 pt-2 w-full sm:w-auto justify-start items-center">
              <button
                onClick={scrollToHowItWorks}
                className="hero-btn group flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 sm:px-8 py-3.5 rounded-full font-semibold text-sm sm:text-base shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer whitespace-nowrap"
              >
                <span>Get Started</span>
                <ArrowRight size={17} className="transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              <button
                onClick={handleContactRedirect}
                className="hero-btn flex-1 sm:flex-initial inline-flex items-center justify-center bg-[#0B4EA2] hover:bg-blue-700 text-white px-6 sm:px-8 py-3.5 rounded-full font-semibold text-sm sm:text-base shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 cursor-pointer whitespace-nowrap"
              >
                Contact Us
              </button>
            </div>
          </div>

          {/* =====================================================
              RIGHT — Single Large Auto-Rotating Service Card
          ====================================================== */}
          <div className="w-full flex justify-center lg:justify-end items-start lg:items-stretch">
            <div className="hero-cards-grid w-full max-w-[620px] flex flex-col">

              {/* CARD STAGE — crossfading cards stacked on top of each other */}
              <div className="hero-card-stage relative w-full min-h-[280px] sm:min-h-[380px] lg:flex-1">
                {services.map((service, index) => {
                  const isActive = index === activeService;
                  return (
                    <div
                      key={service.id}
                      aria-hidden={!isActive}
                      className={`
                        hero-card hero-carousel-card
                        group absolute inset-0
                        bg-gradient-to-b ${service.gradient}
                        border ${service.borderColor}
                        rounded-2xl sm:rounded-3xl
                        p-6 sm:p-10
                        flex flex-col items-center justify-center text-center
                        gap-5 sm:gap-7
                        shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)]
                        hover:shadow-[0_12px_30px_-4px_rgba(11,78,162,0.15)]
                        overflow-hidden
                        transition-opacity duration-700 ease-in-out
                        ${isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"}
                      `}
                    >
                      {/* IMAGE */}
                      <div className="hero-card-img-box h-24 sm:h-32 md:h-36 w-full flex items-center justify-center shrink-0">
                        {service.image ? (
                          <img
                            src={service.image}
                            alt={service.title}
                            loading="lazy"
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

                      {/* TEXT */}
                      <div className="flex flex-col items-center max-w-md">
                        <h3
                          style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
                          className="hero-card-title text-xl sm:text-2xl font-bold text-slate-900 mb-2.5 sm:mb-3 leading-snug"
                        >
                          {service.title}
                        </h3>
                        <p
                          style={{ fontFamily: "'Inter', sans-serif" }}
                          className="hero-card-desc text-sm sm:text-base text-slate-600 leading-[1.65] line-clamp-5 font-normal"
                        >
                          {service.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* INDICATORS */}
              <div
                role="tablist"
                aria-label="Featured services"
                className="flex items-center justify-center gap-2 mt-4 sm:mt-5"
              >
                {services.map((service, index) => (
                  <button
                    key={service.id}
                    type="button"
                    role="tab"
                    aria-selected={index === activeService}
                    aria-label={`Show ${service.title}`}
                    onClick={() => handleServiceSelect(index)}
                    className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      index === activeService
                        ? "w-6 bg-green-600"
                        : "w-2 bg-slate-300 hover:bg-slate-400"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;