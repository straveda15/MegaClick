
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
// ZERO-DELAY FIXED STEPPER
// =========================================================
const FastCountUp = ({
  end,
  suffix = "",
  totalDuration = 700,
  stepSize = 1,
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;

          const totalSteps = Math.ceil(end / stepSize);
          const stepTime = Math.max(
            18,
            Math.floor(totalDuration / totalSteps)
          );

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

// =========================================================
// HEXAGON / FEATURE ITEMS
// =========================================================
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

// =========================================================
// WHY CHOOSE US
// =========================================================
const WhyChoose = () => {
  return (
    <section className="w-full bg-blue-50 py-8 sm:py-12 lg:py-16 min-[1920px]:py-20 min-[3840px]:py-32 overflow-hidden font-['Inter',sans-serif]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hedvig+Letters+Serif:opsz@12..24&family=Inter:wght@400;500;600;700;800&display=swap');

        /* =====================================================
           STANDARD DESKTOP - 1440px
        ===================================================== */
        @media (min-width: 1440px) {
          .why-container {
            max-width: 1380px !important;
            padding-left: 2.5rem !important;
            padding-right: 2.5rem !important;
          }

          /*
            Both left and right sections begin from
            the exact same horizontal/top alignment.
          */
          .why-main-grid {
            align-items: start !important;
          }

          .why-left-content {
            padding-top: 0 !important;
          }

          .why-right-content {
            padding-top: 0 !important;
          }

          .why-tagline {
            font-size: 0.85rem !important;
            margin-bottom: 0.75rem !important;
          }

          .why-title {
            font-size: 2.5rem !important;
            line-height: 1.2 !important;
          }

          .why-desc {
            font-size: 0.95rem !important;
            line-height: 1.65 !important;
            max-width: 32rem !important;
          }

          .why-stats-wrapper {
            margin-top: 2.25rem !important;
            gap: 2.75rem !important;
          }

          .why-stat-num {
            font-size: 2.5rem !important;
          }

          .why-stat-label {
            font-size: 0.85rem !important;
          }

          /*
            RIGHT CARDS
          */
          .why-cards-box {
            max-width: 700px !important;
            gap: 1.25rem !important;
          }

          .why-card {
            min-height: 145px !important;
            padding: 1.5rem 1rem !important;
            border-radius: 1.25rem !important;
          }

          .why-card-icon {
            width: 3.5rem !important;
            height: 3.5rem !important;
            margin-bottom: 0.85rem !important;
          }

          .why-card-icon svg {
            width: 1.7rem !important;
            height: 1.7rem !important;
          }

          .why-card-title {
            min-height: 3.5rem !important;
            font-size: 0.8rem !important;
            line-height: 1.45 !important;
            letter-spacing: 0.07em !important;
          }

          .why-card-bar {
            margin-top: 0.8rem !important;
            width: 2rem !important;
            height: 0.25rem !important;
          }
        }

        /* =====================================================
           LARGE DESKTOP - 1920px
        ===================================================== */
        @media (min-width: 1920px) {
          .why-container {
            max-width: 1800px !important;
            padding-left: 4rem !important;
            padding-right: 4rem !important;
          }

          .why-main-grid {
            align-items: start !important;
            gap: 4rem !important;
          }

          .why-tagline {
            font-size: 1rem !important;
            letter-spacing: 0.3em !important;
            margin-bottom: 1rem !important;
          }

          .why-title {
            font-size: 3.25rem !important;
            line-height: 1.18 !important;
          }

          .why-desc {
            font-size: 1.15rem !important;
            line-height: 1.85 !important;
            max-width: 40rem !important;
          }

          .why-stats-wrapper {
            margin-top: 2.75rem !important;
            gap: 3.5rem !important;
          }

          .why-stat-num {
            font-size: 3.25rem !important;
          }

          .why-stat-label {
            font-size: 1rem !important;
          }

          /*
            RIGHT CARD AREA
          */
          .why-right-content {
            justify-content: flex-end !important;
          }

          .why-cards-box {
            max-width: 800px !important;
            gap: 1.5rem !important;
          }

          .why-card {
            min-height: 175px !important;
            padding: 1.75rem 1.25rem !important;
            border-radius: 1.35rem !important;
          }

          .why-card-icon {
            width: 4.25rem !important;
            height: 4.25rem !important;
            margin-bottom: 1rem !important;
          }

          .why-card-icon svg {
            width: 2rem !important;
            height: 2rem !important;
          }

          .why-card-title {
            min-height: 4rem !important;
            font-size: 0.95rem !important;
            line-height: 1.5 !important;
            letter-spacing: 0.08em !important;
          }

          .why-card-bar {
            margin-top: 1rem !important;
            width: 2.5rem !important;
            height: 0.28rem !important;
          }
        }

        /* =====================================================
           4K ULTRA-WIDE - 3840px
        ===================================================== */
        @media (min-width: 3840px) {
          .why-container {
            max-width: 3200px !important;
            padding-left: 6rem !important;
            padding-right: 6rem !important;
          }

          .why-main-grid {
            align-items: start !important;
            gap: 6rem !important;
          }

          .why-tagline {
            font-size: 1.75rem !important;
            letter-spacing: 0.35em !important;
            margin-bottom: 1.5rem !important;
          }

          .why-title {
            font-size: 5.5rem !important;
            line-height: 1.15 !important;
          }

          .why-desc {
            font-size: 2rem !important;
            line-height: 3.25rem !important;
            max-width: 65rem !important;
          }

          .why-stats-wrapper {
            margin-top: 4rem !important;
            gap: 5rem !important;
          }

          .why-stat-num {
            font-size: 5.5rem !important;
          }

          .why-stat-label {
            font-size: 1.75rem !important;
          }

          /*
            RIGHT CARDS - scaled proportionally
          */
          .why-cards-box {
            max-width: 1450px !important;
            gap: 2rem !important;
          }

          .why-card {
            min-height: 285px !important;
            padding: 3rem 1.75rem !important;
            border-radius: 2rem !important;
          }

          .why-card-icon {
            width: 6rem !important;
            height: 6rem !important;
            margin-bottom: 1.5rem !important;
          }

          .why-card-icon svg {
            width: 2.75rem !important;
            height: 2.75rem !important;
          }

          .why-card-title {
            min-height: 6rem !important;
            font-size: 1.45rem !important;
            line-height: 1.55 !important;
            letter-spacing: 0.09em !important;
          }

          .why-card-bar {
            margin-top: 1.5rem !important;
            width: 3.5rem !important;
            height: 0.4rem !important;
          }
        }

        /* =====================================================
           TABLET
        ===================================================== */
        @media (min-width: 768px) and (max-width: 1023px) {
          .why-main-grid {
            align-items: start !important;
          }

          .why-card {
            min-height: 150px !important;
          }

          .why-card-icon {
            width: 3.25rem !important;
            height: 3.25rem !important;
          }

          .why-card-icon svg {
            width: 1.5rem !important;
            height: 1.5rem !important;
          }

          .why-card-title {
            font-size: 0.72rem !important;
          }
        }

        /* =====================================================
           MOBILE
        ===================================================== */
        @media (max-width: 767px) {
          .why-main-grid {
            align-items: start !important;
          }

          .why-left-content,
          .why-right-content {
            padding-top: 0 !important;
          }

          .why-card {
            min-height: 145px !important;
          }

          .why-card-icon {
            width: 3.25rem !important;
            height: 3.25rem !important;
          }

          .why-card-icon svg {
            width: 1.55rem !important;
            height: 1.55rem !important;
          }

          .why-card-title {
            min-height: 3.25rem !important;
            font-size: 0.68rem !important;
            line-height: 1.4 !important;
            letter-spacing: 0.055em !important;
          }
        }
      `}</style>

      <div className="why-container w-full max-w-[1380px] mx-auto px-4 sm:px-6 min-[1440px]:px-10">

        {/* =====================================================
            MAIN GRID
        ===================================================== */}
        <div className="why-main-grid grid grid-cols-1 lg:grid-cols-[1.1fr_1.2fr] items-start gap-8 sm:gap-10 lg:gap-12 min-[1920px]:gap-16 min-[3840px]:gap-24">

          {/* ===================================================
              LEFT CONTENT
          =================================================== */}
          <div className="why-left-content text-left w-full pt-0">

            {/* TAGLINE */}
            <p
              style={{ fontFamily: "'Inter', sans-serif" }}
              className="why-tagline text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-[#0B4EA2] mb-2 sm:mb-2.5 text-left w-full"
            >
              WHY CHOOSE US
            </p>

            {/* HEADING */}
            <h2
              style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
              className="
                why-title
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
              <span className="text-[#0B4EA2]">
                Partner
              </span>
            </h2>

            {/* DESCRIPTION */}
            <p
              style={{ fontFamily: "'Inter', sans-serif" }}
              className="
                why-desc
                text-slate-600
                font-normal
                text-xs
                sm:text-sm
                lg:text-base
                leading-relaxed
                text-left
                max-w-xl
              "
            >
              MegaClick brings together trusted professionals, complete
              business solutions and reliable support to simplify every step
              of your business journey.
            </p>

            {/* =================================================
                STATS
            ================================================= */}
            <div
              className="
                why-stats-wrapper
                mt-6
                sm:mt-8
                lg:mt-10
                flex
                justify-start
                gap-7
                sm:gap-10
                lg:gap-10
                min-[1920px]:gap-14
              "
            >

              {/* 15K+ HAPPY CLIENTS */}
              <div className="min-w-[95px]">
                <h3
                  style={{ fontFamily: "'Inter', sans-serif" }}
                  className="
                    why-stat-num
                    text-2xl
                    sm:text-3xl
                    lg:text-4xl
                    font-extrabold
                    text-[#0B4EA2]
                    tracking-tight
                    leading-none
                  "
                >
                  <FastCountUp
                    end={15}
                    suffix="K+"
                    totalDuration={650}
                  />
                </h3>

                <p
                  style={{ fontFamily: "'Inter', sans-serif" }}
                  className="
                    why-stat-label
                    mt-1.5
                    text-xs
                    sm:text-sm
                    font-medium
                    text-slate-600
                  "
                >
                  Happy Clients
                </p>
              </div>

              {/* 99% SUCCESS RATE */}
              <div className="min-w-[85px]">
                <h3
                  style={{ fontFamily: "'Inter', sans-serif" }}
                  className="
                    why-stat-num
                    text-2xl
                    sm:text-3xl
                    lg:text-4xl
                    font-extrabold
                    text-emerald-600
                    tracking-tight
                    leading-none
                  "
                >
                  <FastCountUp
                    end={99}
                    suffix="%"
                    totalDuration={750}
                    stepSize={3}
                  />
                </h3>

                <p
                  style={{ fontFamily: "'Inter', sans-serif" }}
                  className="
                    why-stat-label
                    mt-1.5
                    text-xs
                    sm:text-sm
                    font-medium
                    text-slate-600
                  "
                >
                  Success Rate
                </p>
              </div>

              {/* 25+ SERVICES */}
              <div className="min-w-[75px]">
                <h3
                  style={{ fontFamily: "'Inter', sans-serif" }}
                  className="
                    why-stat-num
                    text-2xl
                    sm:text-3xl
                    lg:text-4xl
                    font-extrabold
                    text-[#0B4EA2]
                    tracking-tight
                    leading-none
                  "
                >
                  <FastCountUp
                    end={25}
                    suffix="+"
                    totalDuration={700}
                  />
                </h3>

                <p
                  style={{ fontFamily: "'Inter', sans-serif" }}
                  className="
                    why-stat-label
                    mt-1.5
                    text-xs
                    sm:text-sm
                    font-medium
                    text-slate-600
                  "
                >
                  Services
                </p>
              </div>
            </div>
          </div>

          {/* ===================================================
              RIGHT CONTENT
          =================================================== */}
          <div className="why-right-content w-full flex justify-center lg:justify-end items-start pt-0">

            <div
              className="
                why-cards-box
                w-full
                max-w-[620px]
                grid
                grid-cols-2
                sm:grid-cols-3
                gap-3.5
                sm:gap-4
                lg:gap-4.5
              "
            >
              {hexagonItems.map((item, index) => {
                const Icon = item.icon;
                const isBlue = item.color === "blue";

                return (
                  <div
                    key={index}
                    className="group relative h-full"
                  >
                    <div
                      className="
                        why-card
                        relative
                        h-full
                        min-h-[135px]
                        flex
                        flex-col
                        items-center
                        justify-between
                        text-center
                        bg-white
                        rounded-2xl
                        border
                        border-gray-100/80
                        shadow-[0_8px_24px_rgba(11,78,162,0.06)]
                        px-3
                        py-5
                        sm:px-4
                        sm:py-6
                        transition-all
                        duration-300
                        group-hover:-translate-y-1.5
                        group-hover:shadow-[0_12px_28px_rgba(11,78,162,0.12)]
                      "
                    >

                      {/* ICON */}
                      <div
                        className={`
                          why-card-icon
                          w-12
                          h-12
                          sm:w-13
                          sm:h-13
                          rounded-full
                          flex
                          items-center
                          justify-center
                          mb-2.5
                          sm:mb-3
                          shrink-0
                          transition-transform
                          duration-300
                          group-hover:scale-105
                          ${
                            isBlue
                              ? "bg-blue-100"
                              : "bg-emerald-100"
                          }
                        `}
                      >
                        <Icon
                          size={22}
                          strokeWidth={2}
                          className={
                            isBlue
                              ? "text-[#0B4EA2]"
                              : "text-emerald-600"
                          }
                        />
                      </div>

                      {/* CARD TITLE */}
                      <h3
                        style={{
                          fontFamily: "'Inter', sans-serif",
                        }}
                        className="
                          why-card-title
                          min-h-[3rem]
                          sm:min-h-[3.25rem]
                          flex
                          items-center
                          justify-center
                          text-[10.5px]
                          sm:text-xs
                          font-extrabold
                          text-slate-900
                          uppercase
                          leading-snug
                          tracking-wide
                        "
                      >
                        {item.title}
                      </h3>

                      {/* BOTTOM BAR */}
                      <div
                        className={`
                          why-card-bar
                          mt-2.5
                          sm:mt-3
                          h-1
                          w-7
                          rounded-full
                          shrink-0
                          transition-all
                          duration-300
                          group-hover:w-10
                          ${
                            isBlue
                              ? "bg-[#0B4EA2]"
                              : "bg-emerald-600"
                          }
                        `}
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
