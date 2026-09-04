import React from "react";
import { Users, Building2, ShieldCheck, BadgeCheck } from "lucide-react";

const About = () => {
  return (
    <section className="about-section relative overflow-hidden py-10 sm:py-14 min-[1440px]:py-16 min-[1920px]:py-20 min-[3840px]:py-32 bg-white font-['Inter',sans-serif]">
      {/* GOOGLE FONTS */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hedvig+Letters+Serif:opsz@12..24&family=Inter:wght@400;500;600;700;800&display=swap');

        /* ── Standard Desktop 1440px ── */
        @media (min-width: 1440px) {
          .about-container        { max-width: 1380px !important; padding-left: 2.5rem !important; padding-right: 2.5rem !important; }
          .about-heading          { font-size: 2.5rem !important; }
          .about-para             { font-size: 1.15rem !important; line-height: 1.85 !important; }
          .about-stat-icon        { width: 3.5rem !important; height: 3.5rem !important; }
          .about-stat-icon svg    { width: 1.5rem !important; height: 1.5rem !important; }
          .about-stat-num         { font-size: 2.5rem !important; }
          .about-stat-label       { font-size: 0.95rem !important; }
        }

        /* ── Large Desktop 1920px ── */
        @media (min-width: 1920px) {
          .about-container        { max-width: 1800px !important; padding-left: 4rem !important; padding-right: 4rem !important; }
          .about-tagline          { font-size: 0.95rem !important; letter-spacing: 0.3em !important; }
          .about-heading          { font-size: 3.25rem !important; }
          .about-para             { font-size: 1.35rem !important; line-height: 1.95 !important; }
          .about-stat-icon        { width: 4.25rem !important; height: 4.25rem !important; margin-bottom: 1rem !important; }
          .about-stat-icon svg    { width: 1.85rem !important; height: 1.85rem !important; }
          .about-stat-num         { font-size: 3.25rem !important; }
          .about-stat-label       { font-size: 1.1rem !important; margin-top: 0.65rem !important; }
          .about-stat-cell        { padding-top: 2.75rem !important; padding-bottom: 2.75rem !important; }
        }

        /* ── 4K Ultra-Wide 3840px ── */
        @media (min-width: 3840px) {
          .about-container        { max-width: 3200px !important; padding-left: 6rem !important; padding-right: 6rem !important; }
          .about-tagline          { font-size: 1.75rem !important; letter-spacing: 0.35em !important; margin-bottom: 1.5rem !important; }
          .about-heading          { font-size: 5.5rem !important; line-height: 1.15 !important; }
          .about-para             { font-size: 2.25rem !important; line-height: 2.1 !important; }
          .about-para-gap         { gap: 3.5rem !important; }
          .about-stats-wrap       { margin-top: 4.5rem !important; border-radius: 2.5rem !important; }
          .about-stat-icon        { width: 7rem !important; height: 7rem !important; margin-bottom: 1.75rem !important; }
          .about-stat-icon svg    { width: 3rem !important; height: 3rem !important; }
          .about-stat-num         { font-size: 5.5rem !important; }
          .about-stat-label       { font-size: 1.85rem !important; margin-top: 1rem !important; }
          .about-stat-cell        { padding-top: 4.5rem !important; padding-bottom: 4.5rem !important; padding-left: 2rem !important; padding-right: 2rem !important; }
        }
      `}</style>

      <div className="about-container w-full max-w-[1380px] min-[1920px]:max-w-[1800px] min-[3840px]:max-w-[3200px] mx-auto px-4 sm:px-6 min-[1440px]:px-10 min-[1920px]:px-16 min-[3840px]:px-24">

        {/* =========================================
            HEADING (Consistent Typography)
        ========================================== */}
        <div className="mb-6 sm:mb-8 min-[1920px]:mb-12 min-[3840px]:mb-16 text-left">
          <p className="about-tagline text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-[#0B4EA2] mb-2 sm:mb-2.5">
            About Us
          </p>

          <h2
            style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
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
            Your Success <span className="text-[#0B4EA2]">Our Mission</span>
          </h2>
        </div>

        {/* =========================================
            PARAGRAPHS (Inter font)
        ========================================== */}
        <div className="about-para-gap w-full flex flex-col space-y-4 sm:space-y-6 min-[1920px]:space-y-8">
          <p className="about-para text-sm sm:text-base lg:text-lg text-gray-700 text-left sm:text-justify leading-relaxed font-normal">
            <span className="font-bold">
              <span className="text-[#0B4EA2]">Mega</span>
              <span className="text-green-500">Click</span>
            </span>{" "}
            stands as one of India's most dynamic and forward-thinking integrated
            professional services. It is built to simplify, streamline,
            and elevate the way individuals and businesses access professional
            services. Founded on a foundation of integrity, professionalism, and
            customer satisfaction, MegaClick is not merely a professional service
            provider—it is a complete ecosystem designed to fulfil every personal
            and business requirement with precision, expertise, and an
            unwavering commitment to excellence.
          </p>

          <p className="about-para text-sm sm:text-base lg:text-lg text-gray-700 text-left sm:text-justify leading-relaxed font-normal">
            By bringing together legal, financial, banking, real estate, and
            business support professional services under one seamlessly
            integrated ecosystem,{" "}
            <span className="font-bold">
              <span className="text-[#0B4EA2]">Mega</span>
              <span className="text-green-500">Click</span>
            </span>{" "}
            eliminates the fragmentation that has traditionally complicated
            professional service delivery across India. Individuals and businesses
            no longer need to manage multiple uncoordinated service providers.
            MegaClick brings everything under one roof, supported by meticulous
            planning, continuous effort, and a strategic approach that
            consistently delivers reliable, transparent, and result-oriented
            professional services.
          </p>
        </div>

        {/* =========================================
            STATS STRIP
        ========================================== */}
        <div className="about-stats-wrap relative mt-8 sm:mt-12 min-[1920px]:mt-14 min-[3840px]:mt-20 w-full overflow-hidden rounded-2xl min-[3840px]:rounded-[40px] bg-gradient-to-r from-[#0B4EA2] via-blue-600 to-[#0B4EA2] shadow-xl">
          <div
            className="absolute inset-0 opacity-[0.08] pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,.9) 1.2px, transparent 1.2px)",
              backgroundSize: "26px 26px",
            }}
          />

          {/* GRID */}
          <div className="about-stats-grid relative z-10 grid grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: <Users />,
                color: "text-[#0B4EA2]",
                num: "15K+",
                label: "Happy Clients",
                borderClass:
                  "border-b border-r lg:border-b-0 lg:border-r border-white/10",
              },
              {
                icon: <Building2 />,
                color: "text-green-500",
                num: "25+",
                label: "Business Services",
                borderClass:
                  "border-b lg:border-b-0 lg:border-r border-white/10",
              },
              {
                icon: <ShieldCheck />,
                color: "text-emerald-500",
                num: "100%",
                label: "Trusted Process",
                borderClass: "border-r border-white/10",
              },
              {
                icon: <BadgeCheck />,
                color: "text-[#0B4EA2]",
                num: "10+",
                label: "Years Experience",
                borderClass: "",
              },
            ].map((stat, i) => (
              <div
                key={i}
                className={`about-stat-cell flex flex-col items-center justify-center text-center px-4 py-6 sm:py-8 min-[1920px]:py-10 min-[3840px]:py-16 ${stat.borderClass}`}
              >
                <div className="about-stat-icon w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-white flex items-center justify-center mb-3 sm:mb-4 shadow-md">
                  {React.cloneElement(stat.icon, {
                    className: `w-5 h-5 sm:w-7 sm:h-7 ${stat.color}`,
                  })}
                </div>
                <h3
                  style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
                  className="about-stat-num text-2xl sm:text-3xl lg:text-4xl font-bold text-white"
                >
                  {stat.num}
                </h3>
                <p className="about-stat-label text-xs sm:text-sm text-white/90 mt-1 sm:mt-2 font-medium">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default About;