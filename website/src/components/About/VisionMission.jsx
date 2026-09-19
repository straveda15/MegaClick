import { useEffect, useRef, useState } from "react";
import { Eye, Target } from "lucide-react";

const clamp01 = (n) => Math.min(1, Math.max(0, n));

const VisionMission = () => {
  const sectionRef = useRef(null);
  const envRef = useRef(null);
  const [inView, setInView] = useState(
    () => typeof IntersectionObserver === "undefined"
  );

  // Fade the headline / envelope in once the section reaches the viewport
  useEffect(() => {
    const node = sectionRef.current;
    if (!node || typeof IntersectionObserver === "undefined") return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.05 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  // Scroll-linked progress (--p: 0 → 1) that lifts the cards out of the envelope
  useEffect(() => {
    const env = envRef.current;
    if (!env) return undefined;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      env.style.setProperty("--p", "1");
      return undefined;
    }

    let target = 0;
    let current = 0;
    let raf = 0;

    const tick = () => {
      current += (target - current) * 0.14;
      if (Math.abs(target - current) < 0.001) current = target;
      env.style.setProperty("--p", current.toFixed(4));
      raf = current === target ? 0 : requestAnimationFrame(tick);
    };

    const update = () => {
      const { top } = env.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 while the envelope's top edge is at the bottom of the screen,
      // 1 once it has travelled up to roughly a third of the way down.
      const start = vh * 0.95;
      const end = vh * 0.3;
      target = clamp01((start - top) / (start - end));
      if (!raf) raf = requestAnimationFrame(tick);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`mcx-vm ${inView ? "is-in" : ""}`}
      aria-labelledby="mcx-vm-heading"
    >
      {/* Decorative background */}
      <div className="mcx-vm-bg" aria-hidden="true">
        <span className="mcx-ring mcx-ring-1" />
        <span className="mcx-ring mcx-ring-2" />
        <span className="mcx-ring mcx-ring-3" />
        <span className="mcx-orb mcx-orb-blue" />
        <span className="mcx-orb mcx-orb-green" />
      </div>

      <div className="mcx-vm-wrap">
        {/* ---------- HEADLINE ---------- */}
        <header className="mcx-vm-head">
          <h2 id="mcx-vm-heading" className="mcx-vm-title">
            <span className="mcx-line mcx-line-1">
              Simplifying Needs
            </span>
            <span className="mcx-line">and Problems For</span>
            <span className="mcx-line">
              <span className="mcx-hl-blue">Businesses</span> &amp;{" "}
              <span className="mcx-hl-green">Individuals</span>
            </span>
          </h2>

          <p className="mcx-vm-sub">
            Business solutions. Individual services.{" "}
            <strong>All under one roof.</strong>
          </p>
        </header>

        {/* ---------- ENVELOPE ---------- */}
        <div className="mcx-stage">
          <div ref={envRef} className="mcx-env">
            {/* back flap */}
            <svg className="mcx-env-back" viewBox="0 0 780 260" aria-hidden="true">
              <defs>
                <linearGradient id="mcx-back-g" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#f6faff" />
                  <stop offset="1" stopColor="#dfeafb" />
                </linearGradient>
              </defs>
              <path
                d="M0 260 L350 26 Q390 0 430 26 L780 260 Z"
                fill="url(#mcx-back-g)"
                stroke="rgba(11,78,162,0.14)"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>

            {/* Vision */}
            <article className="mcx-card mcx-card-vision">
              <div className="mcx-card-inner">
                <div className="mcx-card-top">
                  <span className="mcx-card-icon">
                    <Eye strokeWidth={2} />
                  </span>
                  <span className="mcx-card-tag">Our Vision</span>
                </div>
                <p className="mcx-card-text">
                  Building a trusted ecosystem where businesses and individuals
                  can find the solutions they need.
                </p>
              </div>
            </article>

            {/* Mission */}
            <article className="mcx-card mcx-card-mission">
              <div className="mcx-card-inner">
                <div className="mcx-card-top">
                  <span className="mcx-card-icon">
                    <Target strokeWidth={2} />
                  </span>
                  <span className="mcx-card-tag">Our Mission</span>
                </div>
                <p className="mcx-card-text">
                  Making complex needs simpler through reliable services and
                  customer-focused solutions.
                </p>
              </div>
            </article>

            {/* envelope front */}
            <svg className="mcx-env-front" viewBox="0 0 780 340" aria-hidden="true">
              <defs>
                <linearGradient id="mcx-front-g" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#ffffff" />
                  <stop offset="1" stopColor="#edf4ff" />
                </linearGradient>
              </defs>
              <path
                d="M0 70 Q0 48 22 52 L390 150 L758 52 Q780 48 780 70 L780 340 L0 340 Z"
                fill="url(#mcx-front-g)"
                stroke="rgba(11,78,162,0.16)"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <polygon points="0,56 390,150 0,340" fill="rgba(205,224,252,0.38)" />
              <polygon points="780,56 390,150 780,340" fill="rgba(222,235,254,0.42)" />
              <polygon points="0,340 390,150 780,340" fill="rgba(255,255,255,0.75)" />
              <path
                d="M0 340 L390 150 L780 340"
                fill="none"
                stroke="rgba(11,78,162,0.12)"
                strokeWidth="1.5"
              />
            </svg>

            {/* promise, printed on the envelope */}
            <div className="mcx-env-promise">
              <span className="mcx-env-promise-tag">Our Promise</span>
              <span className="mcx-env-promise-text">
                Simple & Reliable
                <br />
                All in one place
              </span>
            </div>
          </div>
        </div>

      </div>

      <style>{`
/* =========================================================
   MegaClick — Vision / Mission
   (all selectors prefixed with .mcx- to stay scoped)
========================================================= */

.mcx-vm,
.mcx-vm * {
  box-sizing: border-box;
}

.mcx-vm {
  --mcx-blue: #0B4EA2;
  --mcx-navy: #083A7A;
  --mcx-green: #08A957;
  --mcx-green-dark: #079c4d;
  --mcx-ink: #0b1f3f;
  --mcx-muted: #475569;

  position: relative;
  width: 100%;
  overflow: hidden;
  padding: 64px 0 0;
  font-family: "Inter", sans-serif;
  color: var(--mcx-ink);
  background: linear-gradient(
    180deg,
    #ffffff 0%,
    #f6faff 38%,
    #eef5ff 72%,
    #ffffff 100%
  );
}

.mcx-vm-wrap {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 16px;
}

/* ---------- Background decoration ---------- */

.mcx-vm-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.mcx-ring {
  position: absolute;
  left: 50%;
  bottom: -420px;
  border-radius: 50%;
  border: 1px solid rgba(11, 78, 162, 0.09);
  transform: translateX(-50%);
}
.mcx-ring-1 { width: 820px;  height: 820px; }
.mcx-ring-2 { width: 1240px; height: 1240px; bottom: -640px; border-color: rgba(11, 78, 162, 0.07); }
.mcx-ring-3 { width: 1700px; height: 1700px; bottom: -860px; border-color: rgba(11, 78, 162, 0.05); }

.mcx-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(70px);
}
.mcx-orb-blue {
  top: 22%;
  left: -6%;
  width: clamp(200px, 30vw, 380px);
  height: clamp(200px, 30vw, 380px);
  background: rgba(11, 78, 162, 0.10);
}
.mcx-orb-green {
  top: 34%;
  right: -6%;
  width: clamp(180px, 27vw, 340px);
  height: clamp(180px, 27vw, 340px);
  background: rgba(8, 169, 87, 0.10);
}

/* ---------- Headline ---------- */

.mcx-vm-head {
  text-align: center;
}

.mcx-vm-title {
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "Poppins", sans-serif;
  font-weight: 700;
  font-size: clamp(2.1rem, 6.4vw, 4.5rem);
  line-height: 1.08;
  letter-spacing: -0.035em;
  text-wrap: balance;
  color: transparent;
  background: linear-gradient(180deg, #0b1f3f 0%, #29405f 100%);
  -webkit-background-clip: text;
  background-clip: text;
}

.mcx-line {
  display: block;
}

.mcx-line-1 {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.22em;
}

.mcx-hl-blue {
  color: transparent;
  background: linear-gradient(135deg, #0B4EA2 0%, #2f7de1 100%);
  -webkit-background-clip: text;
  background-clip: text;
}

.mcx-hl-green {
  color: transparent;
  background: linear-gradient(135deg, #079c4d 0%, #2fcf85 100%);
  -webkit-background-clip: text;
  background-clip: text;
}

.mcx-logo-tile {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 0.98em;
  height: 0.98em;
  border-radius: 0.26em;
  background: #ffffff;
  border: 1px solid rgba(11, 78, 162, 0.14);
  box-shadow:
    0 0.18em 0.5em rgba(11, 78, 162, 0.22),
    0 0 0 0.1em rgba(255, 255, 255, 0.7),
    inset 0 -0.08em 0.2em rgba(11, 78, 162, 0.06);
  transform: rotate(-6deg);
  animation: mcx-tile-float 6s ease-in-out infinite;
}
.mcx-logo-tile img {
  width: 76%;
  height: 76%;
  object-fit: contain;
}

.mcx-vm-sub {
  margin: 22px auto 0;
  max-width: 560px;
  font-size: clamp(1rem, 2.4vw, 1.25rem);
  line-height: 1.6;
  color: var(--mcx-muted);
}
.mcx-vm-sub strong {
  white-space: nowrap;
  font-weight: 600;
  color: var(--mcx-green-dark);
}

/* ---------- Envelope ---------- */

.mcx-stage {
  width: 100%;
  max-width: 1120px;
  margin: 40px auto 0;
}

.mcx-env {
  --p: 0;
  position: relative;
  width: 100%;
  aspect-ratio: 780 / 620;
  container-type: inline-size;
  /* the mask also clips the cards while they are still inside the envelope */
  -webkit-mask-image: linear-gradient(180deg, #000 0%, #000 90%, transparent 100%);
  mask-image: linear-gradient(180deg, #000 0%, #000 90%, transparent 100%);
}

.mcx-env-back,
.mcx-env-front {
  position: absolute;
  left: 0;
  width: 100%;
  height: auto;
  display: block;
}
.mcx-env-back  { top: 0; z-index: 1; }
.mcx-env-front {
  bottom: 0;
  z-index: 3;
  filter: drop-shadow(0 -10px 26px rgba(24, 56, 104, 0.10));
}

/* cards: driven by --p (scroll progress) */
.mcx-card {
  position: absolute;
  z-index: 2;
  width: 44%;
  min-height: 42%;
  will-change: translate, rotate;
}

.mcx-card-vision {
  left: 5%;
  top: 3%;
  translate: 0 calc((1 - var(--p)) * 150%);
  rotate: calc(var(--p) * -3deg);
}
.mcx-card-mission {
  right: 5%;
  top: 6%;
  translate: 0 calc((1 - var(--p)) * 150%);
  rotate: calc(var(--p) * 3.5deg);
}

.mcx-card-inner {
  height: 100%;
  min-height: inherit;
  padding: clamp(10px, 2.4cqw, 28px);
  border-radius: clamp(12px, 2.2cqw, 24px);
  background: #ffffff;
  border: 1px solid rgba(11, 78, 162, 0.10);
  box-shadow:
    0 0 0 1px rgba(255, 255, 255, 0.8),
    0 3cqw 6cqw -2.4cqw rgba(24, 56, 104, 0.30);
}

.mcx-card-top {
  display: flex;
  align-items: center;
  gap: clamp(6px, 1.4cqw, 16px);
  margin-bottom: clamp(6px, 1.6cqw, 18px);
}

.mcx-card-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: clamp(26px, 4.4cqw, 52px);
  height: clamp(26px, 4.4cqw, 52px);
  flex-shrink: 0;
  border-radius: 30%;
  color: var(--mcx-blue);
  background: linear-gradient(145deg, #ffffff, #e8f1ff);
  box-shadow: 0 6px 14px rgba(11, 78, 162, 0.14);
}
.mcx-card-icon svg {
  width: 52%;
  height: 52%;
}
.mcx-card-mission .mcx-card-icon {
  color: var(--mcx-green);
  background: linear-gradient(145deg, #ffffff, #e2f9ea);
  box-shadow: 0 6px 14px rgba(8, 169, 87, 0.16);
}

.mcx-card-tag {
  font-size: clamp(8px, 1.2cqw, 13px);
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--mcx-blue);
}
.mcx-card-mission .mcx-card-tag { color: var(--mcx-green-dark); }

.mcx-card-text {
  margin: 0;
  font-family: "Poppins", sans-serif;
  font-size: clamp(10.5px, 1.75cqw, 19px);
  font-weight: 500;
  line-height: 1.5;
  color: #1e2f4d;
}

/* promise text printed on the envelope front */
.mcx-env-promise {
  position: absolute;
  z-index: 4;
  left: 50%;
  top: 77%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1cqw;
  text-align: center;
  white-space: nowrap;
}
.mcx-env-promise-tag {
  font-size: clamp(8px, 1.3cqw, 14px);
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--mcx-green-dark);
}
.mcx-env-promise-text {
  font-family: "Poppins", sans-serif;
  font-size: clamp(0.8rem, 2.8cqw, 1.9rem);
  font-weight: 600;
  line-height: 1.25;
  color: var(--mcx-navy);
}

/* ---------- Entrance ---------- */

.mcx-vm .mcx-vm-head,
.mcx-vm .mcx-stage {
  opacity: 0;
  transform: translateY(26px);
  transition:
    opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
}
.mcx-vm .mcx-stage { transition-delay: 0.15s; }
.mcx-vm.is-in .mcx-vm-head,
.mcx-vm.is-in .mcx-stage {
  opacity: 1;
  transform: none;
}

@keyframes mcx-tile-float {
  0%, 100% { transform: rotate(-6deg) translateY(0); }
  50%      { transform: rotate(-3deg) translateY(-4px); }
}

/* ---------- Tablet (>= 640px) ---------- */

@media (min-width: 640px) {
  .mcx-vm { padding-top: 80px; }
  .mcx-vm-wrap { padding: 0 24px; }
  .mcx-vm-sub { margin-top: 26px; }
  .mcx-stage { margin-top: 56px; }
  .mcx-env {
    aspect-ratio: 780 / 520;
    -webkit-mask-image: linear-gradient(180deg, #000 0%, #000 92%, transparent 100%);
    mask-image: linear-gradient(180deg, #000 0%, #000 92%, transparent 100%);
  }
  .mcx-card { width: 44%; }
  .mcx-card-vision  { left: 5%;  top: 2%; }
  .mcx-card-mission { right: 5%; top: 5%; }
  .mcx-env-promise { top: 72%; }
}

/* ---------- Desktop (>= 1024px) ---------- */

@media (min-width: 1024px) {
  .mcx-vm { padding-top: 96px; }
  .mcx-vm-wrap { padding: 0 40px; }
  .mcx-stage { margin-top: 64px; }
  .mcx-env {
    aspect-ratio: 780 / 440;
    -webkit-mask-image: linear-gradient(180deg, #000 0%, #000 86%, transparent 100%);
    mask-image: linear-gradient(180deg, #000 0%, #000 86%, transparent 100%);
  }
  .mcx-card { width: 41%; }
  .mcx-card-vision  { left: 6%; }
  .mcx-card-mission { right: 6%; }
  .mcx-env-promise { top: 68%; }
}

/* ---------- Reduced motion ---------- */

@media (prefers-reduced-motion: reduce) {
  .mcx-vm .mcx-vm-head,
  .mcx-vm .mcx-stage {
    opacity: 1;
    transform: none;
    transition: none;
  }
  .mcx-logo-tile {
    animation: none;
  }
}
      `}</style>
    </section>
  );
};

export default VisionMission;
