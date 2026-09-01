import React, { useState, useEffect, useRef } from "react";
import { Users, Lightbulb, FileCheck2, WalletCards, ShieldCheck, Handshake } from "lucide-react";

// =========================================================
// VIEWPORT RE-TRIGGERING COUNT UP COMPONENT
// =========================================================
const ViewportCountUp = ({ end, duration = 1800, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const elementRef = useRef(null);

  useEffect(() => {
    let animationFrameId;
    let startTime = null;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Restart count animation from 0 every time scrolled into view
          startTime = null;
          setCount(0);

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
          // Reset when scrolled out of view
          setCount(0);
          if (animationFrameId) cancelAnimationFrame(animationFrameId);
        }
      },
      { threshold: 0.2 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [end, duration]);

  return (
    <span ref={elementRef}>
      {count}
      {suffix}
    </span>
  );
};

const hexagonItems = [
  { title: <>EXPERT<br />PROFESSIONAL<br />NETWORK</>, icon: Users, color: "green" },
  { title: <>ONE-STOP<br />SOLUTION</>, icon: Lightbulb, color: "blue" },
  { title: <>END-TO-END<br />PROFESSIONAL<br />SERVICE</>, icon: FileCheck2, color: "green" },
  { title: <>TIME &amp; COST<br />EFFICIENCY</>, icon: WalletCards, color: "blue" },
  { title: <>TRANSPARENCY &amp;<br />ACCOUNTABILITY</>, icon: ShieldCheck, color: "green" },
  { title: <>BUILT FOR<br />EVERYONE</>, icon: Handshake, color: "blue" },
];

const WhyChoose = () => {
  return (
    <section className="w-full bg-blue-50 py-8 sm:py-12 min-[1440px]:py-16 min-[1920px]:py-20 min-[3840px]:py-32 overflow-hidden font-['Inter',sans-serif]">
      <div className="w-full max-w-[1380px] min-[1920px]:max-w-[1800px] min-[3840px]:max-w-[3200px] mx-auto px-4 sm:px-6 min-[1440px]:px-10 min-[1920px]:px-16 min-[3840px]:px-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] items-start gap-8 sm:gap-10 lg:gap-12 min-[1920px]:gap-16 min-[3840px]:gap-24">
          
          {/* LEFT SIDE */}
          <div className="text-left w-full">
            <p className="text-xs sm:text-sm min-[3840px]:text-2xl font-semibold tracking-[0.18em] uppercase text-[#0B4EA2] mb-3.5 sm:mb-6 text-left w-full">
              WHY CHOOSE US
            </p>

            <h2
              style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
              className="text-3xl sm:text-4xl min-[1920px]:text-5xl min-[3840px]:text-7xl font-bold leading-[1.2] text-black text-left mb-2.5 sm:mb-3.5"
            >
              Your Trusted <span className="text-[#0B4EA2]">Partner</span>
            </h2>

            <p className="mt-3.5 sm:mt-4 text-slate-600 font-normal text-sm sm:text-base min-[1920px]:text-lg min-[3840px]:text-2xl leading-relaxed text-left max-w-xl min-[3840px]:max-w-4xl">
              MegaClick brings together trusted professionals, complete business solutions and reliable support to simplify every step of your business journey.
            </p>

            {/* =========================================================
                ANIMATED RE-TRIGGERING STATS
            ========================================================= */}
            <div className="mt-8 sm:mt-10 min-[3840px]:mt-16 flex justify-start gap-8 sm:gap-12 lg:gap-10 min-[3840px]:gap-20">
              
              {/* 15K+ HAPPY CLIENTS */}
              <div>
                <h3 className="text-3xl sm:text-4xl min-[1920px]:text-5xl min-[3840px]:text-7xl font-extrabold text-[#0B4EA2] tracking-tight">
                  <ViewportCountUp end={15} suffix="K+" duration={1800} />
                </h3>
                <p className="mt-1 text-xs sm:text-sm min-[1920px]:text-base min-[3840px]:text-2xl font-medium text-slate-600">
                  Happy Clients
                </p>
              </div>

              {/* 99% SUCCESS RATE */}
              <div>
                <h3 className="text-3xl sm:text-4xl min-[1920px]:text-5xl min-[3840px]:text-7xl font-extrabold text-green-600 tracking-tight">
                  <ViewportCountUp end={99} suffix="%" duration={1600} />
                </h3>
                <p className="mt-1 text-xs sm:text-sm min-[1920px]:text-base min-[3840px]:text-2xl font-medium text-slate-600">
                  Success Rate
                </p>
              </div>

              {/* 25+ SERVICES */}
              <div>
                <h3 className="text-3xl sm:text-4xl min-[1920px]:text-5xl min-[3840px]:text-7xl font-extrabold text-[#0B4EA2] tracking-tight">
                  <ViewportCountUp end={25} suffix="+" duration={1500} />
                </h3>
                <p className="mt-1 text-xs sm:text-sm min-[1920px]:text-base min-[3840px]:text-2xl font-medium text-slate-600">
                  Services
                </p>
              </div>

            </div>
          </div>

          {/* RIGHT SIDE (6 HEXAGON / FEATURE CARDS) */}
          <div className="w-full flex justify-center lg:justify-end items-start">
            <div className="w-full max-w-[660px] min-[1920px]:max-w-[760px] min-[3840px]:max-w-[1300px] grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 min-[3840px]:gap-10">
              {hexagonItems.map((item, index) => {
                const Icon = item.icon;
                const isBlue = item.color === "blue";
                return (
                  <div key={index} className="group relative h-full">
                    <div className="relative h-full flex flex-col items-center text-center bg-white rounded-2xl min-[3840px]:rounded-3xl border border-gray-100 shadow-[0_10px_30px_rgba(11,78,162,0.08)] px-3 py-6 sm:px-5 sm:py-7 min-[3840px]:p-12 transition-all duration-300 group-hover:-translate-y-1">
                      <div className={`w-12 h-12 sm:w-14 sm:h-14 min-[1920px]:w-16 min-[1920px]:h-16 min-[3840px]:w-24 min-[3840px]:h-24 rounded-full flex items-center justify-center mb-3 sm:mb-4 flex-shrink-0 ${isBlue ? "bg-blue-100" : "bg-green-100"}`}>
                        <Icon size={24} strokeWidth={2} className={`${isBlue ? "text-[#0B4EA2]" : "text-[#0A8F55]"} min-[1920px]:w-7 min-[1920px]:h-7 min-[3840px]:w-12 min-[3840px]:h-12`} />
                      </div>
                      <h3 className="min-h-[3.5rem] sm:min-h-[4rem] min-[3840px]:min-h-[6rem] flex items-center justify-center text-[11px] sm:text-xs lg:text-sm min-[1920px]:text-base min-[3840px]:text-2xl font-extrabold text-gray-900 uppercase leading-snug tracking-wide">
                        {item.title}
                      </h3>
                      <div className={`mt-3 sm:mt-4 h-1 w-8 min-[3840px]:w-14 rounded-full flex-shrink-0 ${isBlue ? "bg-[#0B4EA2]" : "bg-[#0A8F55]"}`} />
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