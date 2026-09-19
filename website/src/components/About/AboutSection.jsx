import { useEffect, useRef, useState } from "react";

const STEPS = [
  {
    number: "01",
    title: "Integrated Services",
    description:
      "Legal, financial, banking, real estate, and business support services brought together in one ecosystem.",
  },
  {
    number: "02",
    title: "Simplified Access",
    description:
      "We simplify and streamline the way individuals and businesses access professional services.",
  },
  {
    number: "03",
    title: "Trusted Foundation",
    description:
      "Built on integrity, professionalism, customer satisfaction, and a strong commitment to excellence.",
  },
  {
    number: "04",
    title: "One Roof",
    description:
      "Multiple professional requirements are brought together through one seamless and coordinated platform.",
  },
  {
    number: "05",
    title: "Reliable Results",
    description:
      "Meticulous planning, continuous effort, and a strategic approach deliver transparent and result-oriented services.",
  },
];

// Number peeks out of a "window" and slides up on hover / focus. Touch devices
// have no hover, so the step that crosses the middle of the screen is activated.
const Step = ({ step }) => {
  const ref = useRef(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: "-40% 0px -40% 0px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      tabIndex={0}
      className={`abs-step ${active ? "is-active" : ""}`}
    >
      <div className="abs-num-win" aria-hidden="true">
        <span className="abs-num">{step.number}</span>
      </div>

      <h3 className="abs-title">{step.title}</h3>
      <p className="abs-desc">{step.description}</p>
    </div>
  );
};

const About = () => {
  return (
    <section className="about-section relative overflow-hidden py-10 sm:py-14 min-[1440px]:py-16 min-[1920px]:py-20 min-[3840px]:py-32 bg-white font-['Inter',sans-serif]">

      {/* GOOGLE FONTS */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800&display=swap');

        /* ── Standard Desktop 1440px ── */
        @media (min-width: 1440px) {
          .about-container {
            max-width: 1380px !important;
            padding-left: 2.5rem !important;
            padding-right: 2.5rem !important;
          }

          .about-heading {
            font-size: 2.5rem !important;
          }

          .about-para {
            font-size: 1.rem !important;
            line-height: 1.75 !important;
          }
        }

        /* ── Large Desktop 1920px ── */
        @media (min-width: 1920px) {
          .about-container {
            max-width: 1800px !important;
            padding-left: 4rem !important;
            padding-right: 4rem !important;
          }

          .about-tagline {
            font-size: 0.95rem !important;
            letter-spacing: 0.3em !important;
          }

          .about-heading {
            font-size: 3.25rem !important;
          }

          .about-para {
            font-size: 1.25rem !important;
            line-height: 2rem !important;
          }

          .about-para-gap {
            gap: 3.5rem !important;
          }
        }

        /* ── 4K Ultra-Wide 3840px ── */
        @media (min-width: 3840px) {
          .about-container {
            max-width: 3200px !important;
            padding-left: 6rem !important;
            padding-right: 6rem !important;
          }

          .about-tagline {
            font-size: 1.75rem !important;
            letter-spacing: 0.35em !important;
            margin-bottom: 1.5rem !important;
          }

          .about-heading {
            font-size: 5.5rem !important;
            line-height: 1.15 !important;
          }

          .about-para {
            font-size: 2.25rem !important;
            line-height: 3.5rem !important;
          }

          .about-para-gap {
            gap: 3.5rem !important;
          }
        }

        /* ── Stepper ── */
        .abs-grid {
          --abs-num: 72px;
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          gap: 28px 16px;
        }

        .abs-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          padding: 0 12px;
          cursor: pointer;
          outline: none;
        }

        /* the window the number slides up into */
        .abs-num-win {
          position: relative;
          width: 100%;
          height: 0.82em; /* digit is 0.76em tall: 0.04em headroom above, 0.02em below */
          font-size: var(--abs-num);
          font-family: 'Poppins', sans-serif;
          font-weight: 700;
          overflow: hidden;
        }

        .abs-num {
          display: block;
          margin-top: -0.06em;
          line-height: 1;
          letter-spacing: -0.02em;
          color: #bcc3cd;
          transform: translateY(28%);
          transition:
            transform 0.65s cubic-bezier(0.22, 1, 0.36, 1),
            color 0.4s ease;
        }

        /* soft fade over the part of the number that is cut off */
        .abs-num-win::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 50%;
          background: linear-gradient(
            to bottom,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.88) 100%
          );
          transition: opacity 0.4s ease;
          pointer-events: none;
        }

        .abs-title {
          margin: 14px 0 0;
          font-family: 'Poppins', sans-serif;
          font-size: 1.05rem;
          font-weight: 700;
          line-height: 1.25;
          color: #111827;
          transition: color 0.3s ease;
        }

        .abs-desc {
          margin: 10px 0 0;
          max-width: 260px;
          font-size: 0.875rem;
          line-height: 1.65;
          color: #4b5563;
        }

        .abs-step:focus-visible {
          border-radius: 12px;
          box-shadow: 0 0 0 2px rgba(11, 78, 162, 0.35);
        }

        /* hover / focus (mouse + keyboard) */
        @media (hover: hover) {
          .abs-step:hover .abs-num { transform: translateY(0); color: #0B4EA2; }
          .abs-step:hover .abs-num-win::after { opacity: 0; }
          .abs-step:hover .abs-title { color: #0B4EA2; }
        }
        .abs-step:focus-visible .abs-num { transform: translateY(0); color: #0B4EA2; }
        .abs-step:focus-visible .abs-num-win::after { opacity: 0; }
        .abs-step:focus-visible .abs-title { color: #0B4EA2; }

        /* touch: the step in the middle of the screen is "hovered" */
        @media (hover: none) {
          .abs-step.is-active .abs-num { transform: translateY(0); color: #0B4EA2; }
          .abs-step.is-active .abs-num-win::after { opacity: 0; }
          .abs-step.is-active .abs-title { color: #0B4EA2; }
        }

        @media (min-width: 640px) {
          .abs-grid {
            --abs-num: 80px;
            grid-template-columns: repeat(6, minmax(0, 1fr));
            gap: 36px 16px;
          }
          .abs-step { grid-column: span 2; }
          .abs-step:nth-child(4) { grid-column: 2 / span 2; }
          .abs-step:nth-child(5) { grid-column: 4 / span 2; }
          .abs-title { font-size: 1.125rem; }
        }

        @media (min-width: 1024px) {
          .abs-grid {
            --abs-num: clamp(72px, 7vw, 100px);
            grid-template-columns: repeat(5, minmax(0, 1fr));
            gap: 16px;
          }
          .abs-step,
          .abs-step:nth-child(4),
          .abs-step:nth-child(5) { grid-column: auto; padding: 0 8px; }
          .abs-title { font-size: 1.15rem; }
        }

        @media (min-width: 1920px) {
          .abs-grid { --abs-num: 120px; }
          .abs-title { font-size: 1.5rem; }
          .abs-desc { font-size: 1.05rem; max-width: 320px; }
        }

        @media (min-width: 3840px) {
          .abs-grid { --abs-num: 210px; }
          .abs-title { font-size: 2.6rem; }
          .abs-desc { font-size: 1.6rem; max-width: 560px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .abs-num,
          .abs-num-win::after,
          .abs-title { transition: none; }
        }
      `}</style>

      <div className="about-container w-full max-w-[1380px] min-[1920px]:max-w-[1800px] min-[3840px]:max-w-[3200px] mx-auto px-4 sm:px-6 min-[1440px]:px-10 min-[1920px]:px-16 min-[3840px]:px-24">

        {/* =========================================
            HEADING
        ========================================== */}

        <div className="mb-6 sm:mb-8 min-[1920px]:mb-12 min-[3840px]:mb-16 text-left">

          <p
            style={{ fontFamily: "'Inter', sans-serif" }}
            className="about-tagline text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-[#0B4EA2] mb-2 sm:mb-2.5"
          >
            About Us
          </p>

          <h2
            style={{ fontFamily: "'Poppins', serif" }}
            className="
              about-heading
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
            Your Success{" "}
            <span className="text-[#0B4EA2]">
              Our Mission
            </span>
          </h2>

        </div>

        {/* =========================================
            ABOUT STEPPER
        ========================================== */}

        <div className="abs-grid mt-8 sm:mt-10 lg:mt-12">
          {STEPS.map((step) => (
            <Step key={step.number} step={step} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default About;