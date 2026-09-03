import React, { useState, useEffect, useRef } from "react";
import {
  Users,
  Lightbulb,
  FileCheck2,
  WalletCards,
  ShieldCheck,
  Handshake,
} from "lucide-react";

// =========================================================
// ZERO-DELAY FIXED STEPPER (15, 25, 99 सर्वांसाठी एकदम smooth)
// =========================================================
const FastCountUp = ({ end, suffix = "", totalDuration = 700, stepSize = 1 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          
          const totalSteps = Math.ceil(end / stepSize);
          const stepTime = Math.max(18, Math.floor(totalDuration / totalSteps));
          let current = 0;
          
          const timer = setInterval(() => {
            current += stepSize;
            if (current >= end) {
              setCount(end);
              clearInterval(timer);
            } else {
              setCount(current);
            }
          }, stepTime);
        }
      },
      { threshold: 0.15 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, totalDuration, stepSize]);

  return (
    <span
      ref={ref}
      style={{ fontVariantNumeric: "tabular-nums" }}
      className="inline-block tabular-nums whitespace-nowrap"
    >
      {count}
      {suffix}
    </span>
  );
};

const hexagonItems = [
  {
    title: (
      <>
        EXPERT
        <br />
        PROFESSIONAL
        <br />
        NETWORK
      </>
    ),
    icon: Users,
    color: "green",
  },
  {
    title: (
      <>
        ONE-STOP
        <br />
        SOLUTION
      </>
    ),
    icon: Lightbulb,
    color: "blue",
  },
  {
    title: (
      <>
        END-TO-END
        <br />
        PROFESSIONAL
        <br />
        SERVICE
      </>
    ),
    icon: FileCheck2,
    color: "green",
  },
  {
    title: (
      <>
        TIME &amp; COST
        <br />
        EFFICIENCY
      </>
    ),
    icon: WalletCards,
    color: "blue",
  },
  {
    title: (
      <>
        TRANSPARENCY &amp;
        <br />
        ACCOUNTABILITY
      </>
    ),
    icon: ShieldCheck,
    color: "green",
  },
  {
    title: (
      <>
        BUILT FOR
        <br />
        EVERYONE
      </>
    ),
    icon: Handshake,
    color: "blue",
  },
];

const WhyChoose = () => {
  return (
    <section className="w-full bg-blue-50 py-8 sm:py-12 lg:py-16 min-[1920px]:py-20 min-[3840px]:py-32 overflow-hidden font-['Inter',sans-serif]">
      {/* DIRECT CSS RULES */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hedvig+Letters+Serif:opsz@12..24&family=Inter:wght@400;500;600;700;800&display=swap');

        /* Standard Desktop (1440px) */
        @media (min-width: 1440px) {
          .why-container { max-width: 1380px !important; padding-left: 2.5rem !important; padding-right: 2.5rem !important; }
          .why-tagline { font-size: 0.85rem !important; margin-bottom: 0.75rem !important; }
          .why-title { font-size: 2.5rem !important; line-height: 1.2 !important; }
          .why-desc { font-size: 0.95rem !important; line-height: 1.65 !important; max-width: 32rem !important; }
          .why-card { padding: 1.25rem 0.75rem !important; }
          .why-card-title { font-size: 0.85rem !important; }
        }

        /* Large Desktop (1920px Full HD) */
        @media (min-width: 1920px) {
          .why-container { max-width: 1800px !important; padding-left: 4rem !important; padding-right: 4rem !important; }
          .why-tagline { font-size: 1rem !important; letter-spacing: 0.3em !important; margin-bottom: 1rem !important; }
          .why-title { font-size: 3.25rem !important; line-height: 1.18 !important; }
          .why-desc { font-size: 1.15rem !important; line-height: 1.85 !important; max-width: 40rem !important; }
          .why-stat-num { font-size: 3.25rem !important; }
          .why-stat-label { font-size: 1rem !important; }
          .why-cards-box { max-width: 780px !important; }
          .why-card { padding: 1.75rem 1rem !important; border-radius: 1.25rem !important; }
        }

        /* 4K Ultra-Wide Desktop (3840px) */
        @media (min-width: 3840px) {
          .why-container { max-width: 3200px !important; padding-left: 6rem !important; padding-right: 6rem !important; }
          .why-tagline { font-size: 1.75rem !important; letter-spacing: 0.35em !important; margin-bottom: 1.5rem !important; }
          .why-title { font-size: 5.5rem !important; line-height: 1.15 !important; }
          .why-desc { font-size: 2rem !important; line-height: 3.25rem !important; max-width: 65rem !important; }
          .why-stat-num { font-size: 5.5rem !important; }
          .why-stat-label { font-size: 1.75rem !important; }
          .why-cards-box { max-width: 1400px !important; gap: 2rem !important; }
          .why-card { padding: 3rem 1.5rem !important; border-radius: 2rem !important; }
        }
      `}</style>

      <div className="why-container w-full max-w-[1380px] mx-auto px-4 sm:px-6 min-[1440px]:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1.2fr] items-center gap-8 sm:gap-10 lg:gap-12 min-[1920px]:gap-16 min-[3840px]:gap-24">
          
          {/* LEFT CONTENT */}
          <div className="text-left w-full">
            {/* TAGLINE */}
            <p
              style={{ fontFamily: "'Inter', sans-serif" }}
              className="why-tagline text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-[#0B4EA2] mb-2 sm:mb-2.5 text-left w-full"
            >
              WHY CHOOSE US
            </p>

            {/* HEADING (Hedvig Letters Serif) */}
            <h2
              style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
              className="
                text-2xl
                sm:text-3xl
                md:text-3xl
                lg:text-4xl
                font-bold
                leading-[1.18]
                text-black
                text-left
                mb-2.5
                sm:mb-4
              "
            >
              Your Trusted{" "}
              <span className="text-[#0B4EA2]">Partner</span>
            </h2>

            {/* DESCRIPTION */}
            <p
              style={{ fontFamily: "'Inter', sans-serif" }}
              className="why-desc text-slate-600 font-normal text-xs sm:text-sm lg:text-base leading-relaxed text-left max-w-xl"
            >
              MegaClick brings together trusted professionals, complete
              business solutions and reliable support to simplify every step of
              your business journey.
            </p>

            {/* =========================================================
                STABLE INSTANT STATS (No hanging on last digit)
            ========================================================= */}
            <div className="why-stats-wrapper mt-6 sm:mt-8 lg:mt-10 flex justify-start gap-7 sm:gap-10 lg:gap-10 min-[1920px]:gap-14">
              
              {/* 15K+ HAPPY CLIENTS */}
              <div className="min-w-[95px]">
                <h3
                  style={{ fontFamily: "'Inter', sans-serif" }}
                  className="why-stat-num text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B4EA2] tracking-tight leading-none"
                >
                  <FastCountUp end={15} suffix="K+" totalDuration={650} />
                </h3>
                <p
                  style={{ fontFamily: "'Inter', sans-serif" }}
                  className="why-stat-label mt-1.5 text-xs sm:text-sm font-medium text-slate-600"
                >
                  Happy Clients
                </p>
              </div>

              {/* 99% SUCCESS RATE */}
              <div className="min-w-[85px]">
                <h3
                  style={{ fontFamily: "'Inter', sans-serif" }}
                  className="why-stat-num text-2xl sm:text-3xl lg:text-4xl font-extrabold text-emerald-600 tracking-tight leading-none"
                >
                  <FastCountUp end={99} suffix="%" totalDuration={750} stepSize={3} />
                </h3>
                <p
                  style={{ fontFamily: "'Inter', sans-serif" }}
                  className="why-stat-label mt-1.5 text-xs sm:text-sm font-medium text-slate-600"
                >
                  Success Rate
                </p>
              </div>

              {/* 25+ SERVICES */}
              <div className="min-w-[75px]">
                <h3
                  style={{ fontFamily: "'Inter', sans-serif" }}
                  className="why-stat-num text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#0B4EA2] tracking-tight leading-none"
                >
                  <FastCountUp end={25} suffix="+" totalDuration={700} />
                </h3>
                <p
                  style={{ fontFamily: "'Inter', sans-serif" }}
                  className="why-stat-label mt-1.5 text-xs sm:text-sm font-medium text-slate-600"
                >
                  Services
                </p>
              </div>

            </div>
          </div>

          {/* RIGHT CONTENT (6 HEXAGON CARDS) */}
          <div className="w-full flex justify-center lg:justify-end items-center">
            <div className="why-cards-box w-full max-w-[620px] grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-4 lg:gap-4.5">
              {hexagonItems.map((item, index) => {
                const Icon = item.icon;
                const isBlue = item.color === "blue";

                return (
                  <div key={index} className="group relative h-full">
                    <div className="why-card relative h-full flex flex-col items-center justify-between text-center bg-white rounded-2xl border border-gray-100/80 shadow-[0_8px_24px_rgba(11,78,162,0.06)] px-3 py-5 sm:px-4 sm:py-6 transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-[0_12px_28px_rgba(11,78,162,0.12)]">
                      
                      <div
                        className={`why-card-icon w-12 h-12 sm:w-13 sm:h-13 rounded-full flex items-center justify-center mb-2.5 sm:mb-3 shrink-0 transition-transform duration-300 group-hover:scale-105 ${
                          isBlue ? "bg-blue-100" : "bg-emerald-100"
                        }`}
                      >
                        <Icon
                          size={22}
                          strokeWidth={2}
                          className={isBlue ? "text-[#0B4EA2]" : "text-emerald-600"}
                        />
                      </div>

                      <h3
                        style={{ fontFamily: "'Inter', sans-serif" }}
                        className="why-card-title min-h-[3rem] sm:min-h-[3.25rem] flex items-center justify-center text-[10.5px] sm:text-xs font-extrabold text-slate-900 uppercase leading-snug tracking-wide"
                      >
                        {item.title}
                      </h3>

                      <div
                        className={`why-card-bar mt-2.5 sm:mt-3 h-1 w-7 rounded-full shrink-0 transition-all duration-300 group-hover:w-10 ${
                          isBlue ? "bg-[#0B4EA2]" : "bg-emerald-600"
                        }`}
                      />
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

export default WhyChoose;