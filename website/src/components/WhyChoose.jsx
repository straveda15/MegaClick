import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
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
// CONTENT
// =========================================================
const STATS = [
  { end: 15, suffix: "K+", label: "Happy Clients", duration: 650 },
  { end: 99, suffix: "%", label: "Success Rate", duration: 750, stepSize: 3 },
  { end: 25, suffix: "+", label: "Services", duration: 700 },
];

const FEATURES = [
  {
    title: "Expert Professional Network",
    desc: "Experienced CAs, advocates and consultants ready to guide you at every step.",
    icon: Users,
  },
  {
    title: "One-Stop Solution",
    desc: "Registrations, compliance, taxation and legal services under a single roof.",
    icon: Lightbulb,
  },
  {
    title: "End-to-End Professional Service",
    desc: "From the first consultation to the final filing, we handle the complete process.",
    icon: FileCheck2,
  },
  {
    title: "Time & Cost Efficiency",
    desc: "Streamlined processes that save your time and keep costs predictable.",
    icon: WalletCards,
  },
  {
    title: "Transparency & Accountability",
    desc: "Clear updates, honest pricing and full accountability at every stage.",
    icon: ShieldCheck,
  },
  {
    title: "Built for Everyone",
    desc: "Simple solutions for startups, growing businesses and individuals alike.",
    icon: Handshake,
  },
];

// =========================================================
// WHY CHOOSE US
// =========================================================
const WhyChoose = () => {
  const navigate = useNavigate();

  const handleContact = () => {
    navigate("/contact");
    window.scrollTo(0, 0);
  };

  return (
    <section className="why-section w-full overflow-hidden font-['Inter',sans-serif]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800&display=swap');

        .why-section {
          background: #f3f7fd;
          padding: 2rem 0;
        }

        .why-container {
          width: 100%;
          max-width: 1380px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .why-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          gap: 1.5rem;
        }

        /* ---------- Left panel ---------- */

        .why-panel {
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 2rem;
          padding: 1.75rem 1.5rem;
          border-radius: 1.5rem;
          color: #ffffff;
          background: linear-gradient(160deg, #0B4EA2 0%, #083A7A 100%);
          box-shadow: 0 24px 48px -24px rgba(8, 58, 122, 0.55);
        }

        /* soft rings, echoing the About section */
        .why-panel::before,
        .why-panel::after {
          content: "";
          position: absolute;
          border-radius: 50%;
          border: 1px solid rgba(255, 255, 255, 0.08);
          pointer-events: none;
        }
        .why-panel::before {
          width: 22rem;
          height: 22rem;
          right: -9rem;
          bottom: -9rem;
        }
        .why-panel::after {
          width: 34rem;
          height: 34rem;
          right: -15rem;
          bottom: -15rem;
        }

        .why-panel > * {
          position: relative;
          z-index: 1;
        }

        .why-tagline {
          margin: 0 0 0.75rem;
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #a9cdf7;
        }

        .why-title {
          margin: 0;
          font-family: 'Poppins', sans-serif;
          font-size: clamp(1.9rem, 5vw, 2.5rem);
          font-weight: 700;
          line-height: 1.15;
          letter-spacing: -0.02em;
        }

        .why-title span {
          color: #9fd0ff;
        }

        .why-stats {
          display: flex;
          margin-top: 1.5rem;
        }

        .why-stat {
          padding-right: 0.9rem;
          margin-right: 0.9rem;
          border-right: 1px solid rgba(255, 255, 255, 0.16);
        }
        .why-stat:last-child {
          padding-right: 0;
          margin-right: 0;
          border-right: 0;
        }

        .why-stat-num {
          margin: 0;
          font-family: 'Poppins', sans-serif;
          font-size: 1.75rem;
          font-weight: 700;
          line-height: 1;
          color: #ffffff;
        }

        .why-stat-label {
          margin: 0.4rem 0 0;
          font-size: 0.75rem;
          font-weight: 500;
          white-space: nowrap;
          color: #b7d3f6;
        }

        .why-desc {
          margin: 0;
          max-width: 28rem;
          font-size: 0.9rem;
          line-height: 1.7;
          color: #d3e4fa;
        }

        .why-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          margin-top: 1.25rem;
          padding: 0.95rem 1.5rem;
          border: 0;
          border-radius: 0.9rem;
          font-family: 'Inter', sans-serif;
          font-size: 0.95rem;
          font-weight: 600;
          color: #0B4EA2;
          background: #ffffff;
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .why-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 24px -10px rgba(0, 0, 0, 0.4);
        }
        .why-btn:focus-visible {
          outline: 2px solid #ffffff;
          outline-offset: 3px;
        }
        .why-btn svg {
          transition: transform 0.2s ease;
        }
        .why-btn:hover svg {
          transform: translateX(3px);
        }

        /* ---------- Right list ---------- */

        .why-list {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          grid-auto-rows: 1fr;
          column-gap: 2.5rem;
        }

        .why-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1.15rem 0;
          border-bottom: 1px solid rgba(11, 78, 162, 0.12);
        }

        .why-item:last-child {
          border-bottom: 0;
        }

        .why-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: 3.25rem;
          height: 3.25rem;
          border-radius: 0.9rem;
          color: #0B4EA2;
          background: #dfeafb;
          transition: background 0.25s ease, color 0.25s ease, transform 0.25s ease;
        }
        .why-icon svg {
          width: 1.4rem;
          height: 1.4rem;
        }

        .why-item-title {
          margin: 0;
          font-family: 'Poppins', sans-serif;
          font-size: 1rem;
          font-weight: 600;
          line-height: 1.3;
          color: #0f1f3d;
          transition: color 0.25s ease;
        }

        .why-item-desc {
          margin: 0.4rem 0 0;
          font-size: 0.85rem;
          line-height: 1.6;
          color: #566379;
        }

        .why-item:hover .why-icon {
          color: #ffffff;
          background: #0B4EA2;
          transform: translateY(-2px);
        }
        .why-item:hover .why-item-title {
          color: #0B4EA2;
        }

        /* ---------- Breakpoints ---------- */

        @media (min-width: 640px) {
          .why-section { padding: 3rem 0; }
          .why-container { padding: 0 1.5rem; }
          .why-panel { padding: 2.25rem 2rem; }
          .why-stat { padding-right: 1.5rem; margin-right: 1.5rem; }
          .why-stat-num { font-size: 2rem; }
          .why-stat-label { font-size: 0.8rem; }
          .why-list { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          /* two columns: the last row (two items) loses its divider */
          .why-item:nth-last-child(-n + 2) { border-bottom: 0; }
        }

        @media (min-width: 1024px) {
          .why-section { padding: 4rem 0; }
          .why-grid {
            grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.6fr);
            gap: 2.5rem;
            align-items: stretch;
          }
          .why-panel { padding: 2.5rem 2.25rem; }
          .why-stat-num { font-size: 2.15rem; }
          .why-list { padding: 0.25rem 0; }
          .why-item { padding: 1.9rem 0 1.2rem; }
        }

        @media (min-width: 1440px) {
          .why-container { padding: 0 2.5rem; }
          .why-grid { gap: 3rem; }
          .why-item { padding: 2.1rem 0 1.4rem; }
          .why-item-title { font-size: 1.05rem; }
          .why-item-desc { font-size: 0.9rem; }
        }

        @media (min-width: 1920px) {
          .why-section { padding: 5rem 0; }
          .why-container { max-width: 1800px; padding: 0 4rem; }
          .why-grid { gap: 4rem; }
          .why-panel { padding: 3.25rem 3rem; border-radius: 2rem; }
          .why-tagline { font-size: 1rem; }
          .why-title { font-size: 3.25rem; }
          .why-stat-num { font-size: 2.75rem; }
          .why-stat-label { font-size: 1rem; }
          .why-desc { font-size: 1.1rem; max-width: 34rem; }
          .why-btn { font-size: 1.1rem; padding: 1.15rem 1.75rem; }
          .why-icon { width: 4rem; height: 4rem; border-radius: 1.1rem; }
          .why-icon svg { width: 1.75rem; height: 1.75rem; }
          .why-item { gap: 1.4rem; padding: 1.75rem 0; }
          .why-item-title { font-size: 1.3rem; }
          .why-item-desc { font-size: 1.05rem; }
        }

        @media (min-width: 3840px) {
          .why-section { padding: 8rem 0; }
          .why-container { max-width: 3200px; padding: 0 6rem; }
          .why-grid { gap: 6rem; }
          .why-panel { padding: 5rem 4.5rem; border-radius: 3rem; }
          .why-tagline { font-size: 1.75rem; }
          .why-title { font-size: 5.5rem; }
          .why-stat-num { font-size: 4.75rem; }
          .why-stat-label { font-size: 1.75rem; }
          .why-desc { font-size: 1.9rem; max-width: 60rem; }
          .why-btn { font-size: 1.9rem; padding: 1.75rem 3rem; border-radius: 1.5rem; }
          .why-icon { width: 6.5rem; height: 6.5rem; border-radius: 1.6rem; }
          .why-icon svg { width: 2.9rem; height: 2.9rem; }
          .why-item { gap: 2.25rem; padding: 3rem 0; }
          .why-item-title { font-size: 2.1rem; }
          .why-item-desc { font-size: 1.7rem; }
        }

        @media (prefers-reduced-motion: reduce) {
          .why-btn,
          .why-btn svg,
          .why-icon,
          .why-item-title { transition: none; }
        }
      `}</style>

      <div className="why-container">
        <div className="why-grid">

          {/* ===================================================
              LEFT — PANEL
          =================================================== */}
          <div className="why-panel">
            <div>
              <p className="why-tagline">Why Choose Us</p>

              <h2 className="why-title">
                Your Trusted <span>Partner</span>
              </h2>

              {/* NUMBERS — directly under the title */}
              <div className="why-stats">
                {STATS.map((stat) => (
                  <div key={stat.label} className="why-stat">
                    <h3 className="why-stat-num">
                      <FastCountUp
                        end={stat.end}
                        suffix={stat.suffix}
                        totalDuration={stat.duration}
                        stepSize={stat.stepSize}
                      />
                    </h3>
                    <p className="why-stat-label">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="why-desc">
                MegaClick brings together trusted professionals, complete
                business solutions and reliable support to simplify every step
                of your business journey.
              </p>

              <button type="button" className="why-btn" onClick={handleContact}>
                Get Started
                <ArrowRight size={18} strokeWidth={2.2} />
              </button>
            </div>
          </div>

          {/* ===================================================
              RIGHT — FEATURE LIST
          =================================================== */}
          <div className="why-list">
            {FEATURES.map(({ title, desc, icon: Icon }) => (
              <div key={title} className="why-item">
                <span className="why-icon" aria-hidden="true">
                  <Icon strokeWidth={2} />
                </span>

                <div>
                  <h3 className="why-item-title">{title}</h3>
                  <p className="why-item-desc">{desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default WhyChoose;
