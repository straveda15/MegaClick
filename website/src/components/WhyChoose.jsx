import React from "react";
import {
  Users,
  Lightbulb,
  FileCheck2,
  WalletCards,
  ShieldCheck,
  Handshake,
} from "lucide-react";

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
    delay: "0s",
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
    delay: "0.5s",
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
    delay: "1s",
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
    delay: "1.5s",
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
    delay: "2s",
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
    delay: "2.5s",
  },
];

const WhyChoose = () => {
  return (
    <section className="w-full bg-blue-50 py-8 sm:py-12 lg:py-16 overflow-hidden why-choose-section">
      {/* UNIFIED APP-CONTAINER + 4K & DESKTOP SCALING */}
      <style>{`
        .app-container {
          width: 100%;
          max-width: 1500px;
          margin-left: auto;
          margin-right: auto;
          padding-left: 1.25rem;
          padding-right: 1.25rem;
        }

        @media (min-width: 640px) {
          .app-container {
            padding-left: 2rem;
            padding-right: 2rem;
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

        /* Standard Desktop (1440px x 900px) */
        @media (min-width: 1440px) {
          .app-container {
            max-width: 1440px !important;
            padding-left: 5rem !important;
            padding-right: 5rem !important;
          }
          .why-title {
            font-size: 3rem !important;
            white-space: nowrap !important;
          }
        }

        /* Large Desktop (1920px x 1080px Full HD) */
        @media (min-width: 1920px) {
          .app-container {
            max-width: 1800px !important;
            padding-left: 6rem !important;
            padding-right: 6rem !important;
          }
          .why-choose-section {
            padding-top: 5rem !important;
            padding-bottom: 5rem !important;
          }
          .why-tagline {
            font-size: 0.95rem !important;
            margin-bottom: 1.25rem !important;
          }
          .why-title {
            font-size: 3.75rem !important;
            white-space: nowrap !important;
            margin-bottom: 1.25rem !important;
          }
          .why-desc {
            font-size: 1.25rem !important;
            line-height: 2.1rem !important;
            max-width: 40rem !important;
          }
          .why-stat-num {
            font-size: 3.5rem !important;
          }
          .why-stat-label {
            font-size: 1.05rem !important;
          }
          .why-cards-grid {
            max-width: 780px !important;
            gap: 1.5rem !important;
          }
          .why-card {
            padding: 2.25rem 1.5rem !important;
          }
          .why-card-icon {
            width: 4.25rem !important;
            height: 4.25rem !important;
          }
          .why-card-icon-svg {
            width: 2.25rem !important;
            height: 2.25rem !important;
          }
          .why-card-title {
            font-size: 1.05rem !important;
          }
        }

        /* QHD / 2K Ultra-Wide (2560px Desktop) */
        @media (min-width: 2560px) {
          .app-container {
            max-width: 2400px !important;
            padding-left: 8rem !important;
            padding-right: 8rem !important;
          }
          .why-choose-section {
            padding-top: 6.5rem !important;
            padding-bottom: 6.5rem !important;
          }
          .why-tagline {
            font-size: 1.25rem !important;
          }
          .why-title {
            font-size: 5rem !important;
            white-space: nowrap !important;
          }
          .why-desc {
            font-size: 1.55rem !important;
            line-height: 2.5rem !important;
            max-width: 52rem !important;
          }
          .why-stat-num {
            font-size: 4.5rem !important;
          }
          .why-stat-label {
            font-size: 1.3rem !important;
          }
          .why-cards-grid {
            max-width: 1000px !important;
            gap: 2rem !important;
          }
          .why-card {
            padding: 2.75rem 2rem !important;
          }
          .why-card-icon {
            width: 5.25rem !important;
            height: 5.25rem !important;
          }
          .why-card-icon-svg {
            width: 2.75rem !important;
            height: 2.75rem !important;
          }
          .why-card-title {
            font-size: 1.35rem !important;
          }
        }

        /* 4K Ultra-Wide Desktop (3840px x 2160px) */
        @media (min-width: 3840px) {
          .app-container {
            max-width: 3400px !important;
            padding-left: 10rem !important;
            padding-right: 10rem !important;
          }
          .why-choose-section {
            padding-top: 9rem !important;
            padding-bottom: 9rem !important;
          }
          .why-tagline {
            font-size: 1.85rem !important;
            margin-bottom: 2rem !important;
          }
          .why-title {
            font-size: 7rem !important;
            white-space: nowrap !important;
            margin-bottom: 2.5rem !important;
          }
          .why-desc {
            font-size: 2.25rem !important;
            line-height: 3.6rem !important;
            max-width: 72rem !important;
          }
          .why-stat-num {
            font-size: 6.5rem !important;
          }
          .why-stat-label {
            font-size: 1.85rem !important;
          }
          .why-cards-grid {
            max-width: 1450px !important;
            gap: 3rem !important;
          }
          .why-card {
            padding: 4rem 3rem !important;
            border-radius: 2.5rem !important;
          }
          .why-card-icon {
            width: 8rem !important;
            height: 8rem !important;
          }
          .why-card-icon-svg {
            width: 4rem !important;
            height: 4rem !important;
          }
          .why-card-title {
            font-size: 1.85rem !important;
          }
        }
      `}</style>

      <div className="app-container">
        {/* ================= MAIN LAYOUT (ITEMS-START TOP ALIGNMENT) ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] items-start gap-8 sm:gap-10 lg:gap-12 xl:gap-16">
          
          {/* ================= LEFT SIDE ================= */}
          <div className="text-left w-full">
            {/* TOP TAGLINE */}
            <p className="why-tagline text-xs font-semibold tracking-[0.18em] uppercase text-[#0B4EA2] mb-3.5 sm:mb-6 text-left w-full">
              why choose us
            </p>
       {/* HEADING (CONSISTENT SINGLE LINE ON DESKTOPS) */}
            <h2
              style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
              className="
                why-title
                text-2xl
                sm:text-3xl
                md:text-3xl
                lg:text-3xl
                xl:text-4xl
                font-bold
                leading-[1.2]
                text-black
                text-left
                mb-2.5
                sm:mb-3.5
                whitespace-normal
                lg:whitespace-nowrap
              "
            >
              Your Trusted{" "}
              <span className="text-[#0B4EA2]">
                Partner
              </span>
            </h2>
            {/* DESCRIPTION */}
            <p className="why-desc mt-3.5 sm:mt-4 text-slate-600 font-normal text-sm sm:text-base leading-relaxed text-left max-w-xl">
              MegaClick brings together trusted professionals, complete
              business solutions and reliable support to simplify every
              step of your business journey.
            </p>

            {/* STATS */}
            <div className="mt-8 sm:mt-10 flex justify-start gap-8 sm:gap-12 lg:gap-10">
              {/* CLIENTS */}
              <div>
                <h3 className="why-stat-num text-3xl sm:text-4xl font-extrabold text-[#0B4EA2]">
                  15K+
                </h3>
                <p className="why-stat-label mt-1 text-xs sm:text-sm font-medium text-slate-600">
                  Happy Clients
                </p>
              </div>

              {/* SUCCESS RATE */}
              <div>
                <h3 className="why-stat-num text-3xl sm:text-4xl font-extrabold text-green-600">
                  99%
                </h3>
                <p className="why-stat-label mt-1 text-xs sm:text-sm font-medium text-slate-600">
                  Success Rate
                </p>
              </div>

              {/* SERVICES */}
              <div>
                <h3 className="why-stat-num text-3xl sm:text-4xl font-extrabold text-[#0B4EA2]">
                  25+
                </h3>
                <p className="why-stat-label mt-1 text-xs sm:text-sm font-medium text-slate-600">
                  Services
                </p>
              </div>
            </div>
          </div>

          {/* ================= RIGHT SIDE ================= */}
          <div className="w-full flex justify-center lg:justify-end items-start">
            <div className="why-cards-grid w-full max-w-[660px] grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
              {hexagonItems.map((item, index) => (
                <FeatureCard key={index} item={item} />
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

/* ================= FEATURE CARD COMPONENT ================= */
const FeatureCard = ({ item }) => {
  const Icon = item.icon;
  const isBlue = item.color === "blue";

  return (
    <div className="group relative h-full">
      <div className="why-card relative h-full flex flex-col items-center text-center bg-white rounded-2xl border border-gray-100 shadow-[0_10px_30px_rgba(11,78,162,0.08)] px-3 py-6 sm:px-5 sm:py-7 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_16px_36px_rgba(11,78,162,0.14)]">
        
        {/* ICON */}
        <div
          className={`
            why-card-icon
            w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center mb-3 sm:mb-4 flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6
            ${isBlue ? "bg-blue-100" : "bg-green-100"}
          `}
        >
          <Icon
            size={24}
            strokeWidth={2}
            className={`${isBlue ? "text-[#0B4EA2]" : "text-[#0A8F55]"} why-card-icon-svg`}
          />
        </div>

        {/* TITLE */}
        <h3 className="why-card-title min-h-[3.5rem] sm:min-h-[4rem] flex items-center justify-center text-[11px] sm:text-xs lg:text-sm font-extrabold text-gray-900 uppercase leading-snug tracking-wide">
          {item.title}
        </h3>

        {/* ACCENT UNDERLINE */}
        <div
          className={`
            mt-3 sm:mt-4 h-1 w-8 rounded-full flex-shrink-0
            ${isBlue ? "bg-[#0B4EA2]" : "bg-[#0A8F55]"}
          `}
        />
      </div>
    </div>
  );
};

export default WhyChoose;