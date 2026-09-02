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
// SECTION-TRIGGERED COUNT UP COMPONENT
// =========================================================
const SectionCountUp = ({ end, duration = 1800, suffix = "", isTriggered }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let animationFrameId;
    let startTime = null;

    if (isTriggered) {
      setCount(0);
      startTime = null;

      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const easeOutQuad = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(easeOutQuad * end));

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(animate);
        } else {
          setCount(end);
        }
      };

      animationFrameId = requestAnimationFrame(animate);
    } else {
      setCount(0);
    }

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [isTriggered, end, duration]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
};

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

const Hero = () => {
  const heroSectionRef = useRef(null);
  const [isHeroInView, setIsHeroInView] = useState(true);

  let navigate;
  try {
    navigate = useNavigate();
  } catch (e) {
    navigate = null;
  }

  // RE-TRIGGER COUNTERS WHEN SCROLLING ONTO HERO SECTION
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsHeroInView(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    if (heroSectionRef.current) {
      observer.observe(heroSectionRef.current);
    }

    return () => observer.disconnect();
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
      ref={heroSectionRef}
      className="relative overflow-hidden bg-white font-['Inter',sans-serif] py-6 sm:py-10 lg:py-14 min-[1920px]:py-20 min-[3840px]:py-32"
    >
      {/* DIRECT CSS FOR RESPONSIVE SCALING (LAPTOP, 1440px, 1920px, 3840px) */}
      <style>{`
        /* 1920px Full HD Desktop */
        @media (min-width: 1920px) {
          .hero-container {
            max-width: 1800px !important;
            padding-left: 4rem !important;
            padding-right: 4rem !important;
          }
          .hero-title {
            font-size: 3.75rem !important;
            line-height: 1.15 !important;
          }
          .hero-desc {
            font-size: 1.25rem !important;
            line-height: 2rem !important;
            max-width: 44rem !important;
          }
          .hero-stat-num {
            font-size: 2.75rem !important;
          }
          .hero-stat-label {
            font-size: 1rem !important;
          }
          .hero-btn {
            font-size: 1.125rem !important;
            padding: 1rem 2.25rem !important;
          }
          .hero-card {
            min-height: 250px !important;
            padding: 1.75rem !important;
            border-radius: 1.5rem !important;
          }
          .hero-card-img-box {
            height: 5rem !important;
          }
          .hero-card-title {
            font-size: 1.25rem !important;
          }
          .hero-card-desc {
            font-size: 0.95rem !important;
            line-height: 1.55 !important;
          }
        }

        /* 3840px 4K Ultra-Wide Desktop */
        @media (min-width: 3840px) {
          .hero-container {
            max-width: 3200px !important;
            padding-left: 6rem !important;
            padding-right: 6rem !important;
          }
          .hero-grid {
            gap: 5rem !important;
          }
          .hero-title {
            font-size: 6.5rem !important;
            line-height: 1.15 !important;
          }
          .hero-desc {
            font-size: 2.25rem !important;
            line-height: 3.5rem !important;
            max-width: 75rem !important;
          }
          .hero-stat-num {
            font-size: 5rem !important;
          }
          .hero-stat-label {
            font-size: 1.75rem !important;
            margin-top: 0.75rem !important;
          }
          .hero-btn {
            font-size: 2rem !important;
            padding: 1.5rem 3.5rem !important;
            border-radius: 9999px !important;
          }
          .hero-btn-icon {
            width: 2rem !important;
            height: 2rem !important;
          }
          .hero-cards-grid {
            max-width: 1400px !important;
            gap: 2rem !important;
          }
          .hero-card {
            min-height: 440px !important;
            padding: 2.5rem !important;
            border-radius: 2.5rem !important;
          }
          .hero-card-img-box {
            height: 9rem !important;
            margin-bottom: 1.5rem !important;
          }
          .hero-card-title {
            font-size: 2.25rem !important;
            line-height: 1.3 !important;
            margin-bottom: 0.75rem !important;
          }
          .hero-card-desc {
            font-size: 1.6rem !important;
            line-height: 2.4rem !important;
          }
        }
      `}</style>

      {/* MAIN CONTAINER */}
      <div className="hero-container w-full max-w-[1380px] mx-auto px-4 sm:px-6 min-[1440px]:px-10">
        <div className="hero-grid grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-start">
          
          {/* =====================================================
              LEFT CONTENT (HEADING AT TOP, DESCRIPTION, STATS & BUTTONS)
          ====================================================== */}
          <div className="space-y-4 sm:space-y-6 md:space-y-7 w-full flex flex-col items-start text-left pt-0 sm:pt-1">
            
            {/* HEADING (Hedvig Letters Serif - Aligned to the top) */}
            <h1
              style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
              className="hero-title text-3xl sm:text-4xl lg:text-4xl xl:text-5xl font-bold leading-[1.18] text-slate-900 text-left mt-0"
            >
              Grow Your Business
              <br />
              <span className="text-[#0B4EA2]">With Smart Solutions</span>
            </h1>

            {/* DESCRIPTION */}
            <p
              style={{ fontFamily: "'Inter', sans-serif" }}
              className="hero-desc text-sm sm:text-base md:text-lg text-slate-600 leading-relaxed sm:leading-7 max-w-xl text-left"
            >
              Complete business solutions to simplify your registrations, tax
              compliance, and financial growth with trusted expert guidance.
            </p>

            {/* =====================================================
                STATS (TRIGGERED VIA INTERSECTION OBSERVER)
            ====================================================== */}
            <div className="flex gap-6 sm:gap-8 md:gap-10 flex-wrap justify-start w-full pt-1">
              
              {/* STAT 1: 15k+ */}
              <div className="flex flex-col items-start text-left">
                <h3
                  style={{ fontFamily: "'Inter', sans-serif" }}
                  className="hero-stat-num text-2xl sm:text-3xl font-bold text-[#0B4EA2] tracking-tight leading-none"
                >
                  <SectionCountUp
                    end={15}
                    suffix="k+"
                    duration={1800}
                    isTriggered={isHeroInView}
                  />
                </h3>
                <div
                  style={{ fontFamily: "'Inter', sans-serif" }}
                  className="hero-stat-label text-xs sm:text-sm font-medium text-slate-600 mt-1 sm:mt-1.5 whitespace-nowrap"
                >
                  Happy customers
                </div>
              </div>

              {/* STAT 2: 25+ */}
              <div className="flex flex-col items-start text-left">
                <h3
                  style={{ fontFamily: "'Inter', sans-serif" }}
                  className="hero-stat-num text-2xl sm:text-3xl font-bold text-[#0B4EA2] tracking-tight leading-none"
                >
                  <SectionCountUp
                    end={25}
                    suffix="+"
                    duration={1500}
                    isTriggered={isHeroInView}
                  />
                </h3>
                <div
                  style={{ fontFamily: "'Inter', sans-serif" }}
                  className="hero-stat-label text-xs sm:text-sm font-medium text-slate-600 mt-1 sm:mt-1.5 whitespace-nowrap"
                >
                  Services
                </div>
              </div>

              {/* STAT 3: 10+ */}
              <div className="flex flex-col items-start text-left">
                <h3
                  style={{ fontFamily: "'Inter', sans-serif" }}
                  className="hero-stat-num text-2xl sm:text-3xl font-bold text-[#0B4EA2] tracking-tight leading-none"
                >
                  <SectionCountUp
                    end={10}
                    suffix="+"
                    duration={1400}
                    isTriggered={isHeroInView}
                  />
                </h3>
                <div
                  style={{ fontFamily: "'Inter', sans-serif" }}
                  className="hero-stat-label text-xs sm:text-sm font-medium text-slate-600 mt-1 sm:mt-1.5 whitespace-nowrap"
                >
                  Years Experience
                </div>
              </div>
            </div>

            {/* BUTTONS */}
            <div className="flex flex-row gap-3 sm:gap-4 pt-2 w-full sm:w-auto justify-start items-center">
              <button
                onClick={scrollToHowItWorks}
                className="hero-btn group flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 active:bg-emerald-800 text-white px-6 sm:px-8 py-3.5 rounded-full font-semibold text-sm sm:text-base shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer text-center whitespace-nowrap"
              >
                <span>Get Started</span>
                <ArrowRight
                  size={17}
                  className="hero-btn-icon transition-transform duration-200 group-hover:translate-x-1"
                />
              </button>

              <button
                onClick={handleContactRedirect}
                className="hero-btn flex-1 sm:flex-initial inline-flex items-center justify-center bg-[#0B4EA2] hover:bg-blue-700 active:bg-blue-800 text-white px-6 sm:px-8 py-3.5 rounded-full font-semibold text-sm sm:text-base shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer text-center whitespace-nowrap"
              >
                Contact Us
              </button>
            </div>
          </div>

          {/* =====================================================
              RIGHT CONTENT (4 2×2 SERVICE CARDS)
          ====================================================== */}
          <div className="w-full flex justify-center lg:justify-end items-start">
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
                    flex
                    flex-col
                    justify-between
                    shadow-[0_2px_12px_-2px_rgba(0,0,0,0.04)]
                    hover:shadow-[0_12px_30px_-4px_rgba(11,78,162,0.15)]
                    hover:-translate-y-1.5
                    transition-all
                    duration-300
                    overflow-hidden
                    min-h-[210px]
                    sm:min-h-[225px]
                  `}
                >
                  {/* IMAGE BOX */}
                  <div className="hero-card-img-box h-14 sm:h-16 w-full flex items-center justify-center mb-3">
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

                  {/* TITLE & DESCRIPTION */}
                  <div className="flex flex-col flex-grow text-left">
                    <h3
                      style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
                      className="hero-card-title text-[15px] sm:text-[16.5px] font-bold text-slate-900 mb-1.5 leading-snug text-left"
                    >
                      {service.title}
                    </h3>
                    <p
                      style={{ fontFamily: "'Inter', sans-serif" }}
                      className="hero-card-desc text-xs sm:text-[12.5px] text-slate-600 leading-[1.55] line-clamp-3 text-left"
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
    </section>
  );
};

export default Hero;