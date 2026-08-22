import React from "react";
import { Users, Building2, ShieldCheck, BadgeCheck } from "lucide-react";

const About = () => {
  return (
    <section className="about-section relative overflow-hidden py-4 sm:py-10 lg:py-14 bg-white font-['Inter',sans-serif]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hedvig+Letters+Serif&family=Inter:wght@400;500;600;700;800&display=swap');

        /* ── Standard Desktop 1440px ── */
        @media (min-width: 1440px) {
          .about-section          { padding-top: 3rem !important; padding-bottom: 3rem !important; }
          .about-container        { max-width: 1440px !important; padding-left: 5rem !important; padding-right: 5rem !important; }
          .about-badge            { font-size: 0.85rem !important; padding: 0.5rem 1.25rem !important; }
          .about-heading          { font-size: 2.25rem !important; margin-top: 1rem !important; }
          .about-para             { font-size: 1.1rem !important; line-height: 1.85 !important; }
          .about-stats-grid       { padding-top: 0 !important; padding-bottom: 0 !important; }
          .about-stat-icon        { width: 3.5rem !important; height: 3.5rem !important; }
          .about-stat-icon svg    { width: 1.5rem !important; height: 1.5rem !important; }
          .about-stat-num         { font-size: 2.5rem !important; }
          .about-stat-label       { font-size: 0.875rem !important; }
        }

        /* ── Large Desktop 1920px ── */
        @media (min-width: 1920px) {
          .about-section          { padding-top: 4rem !important; padding-bottom: 4rem !important; }
          .about-container        { max-width: 1800px !important; padding-left: 6rem !important; padding-right: 6rem !important; }
          .about-badge            { font-size: 1rem !important; padding: 0.6rem 1.5rem !important; gap: 0.6rem !important; }
          .about-badge-icon       { width: 1.15rem !important; height: 1.15rem !important; }
          .about-heading          { font-size: 2.75rem !important; margin-top: 1.25rem !important; }
          .about-para             { font-size: 1.3rem !important; line-height: 2 !important; }
          .about-stat-icon        { width: 4rem !important; height: 4rem !important; margin-bottom: 1rem !important; }
          .about-stat-icon svg    { width: 1.75rem !important; height: 1.75rem !important; }
          .about-stat-num         { font-size: 3rem !important; }
          .about-stat-label       { font-size: 1rem !important; margin-top: 0.65rem !important; }
          .about-stat-cell        { padding-top: 2.5rem !important; padding-bottom: 2.5rem !important; }
        }

        /* ── 4K Ultra-Wide 3840px ── */
        @media (min-width: 3840px) {
          .about-section          { padding-top: 7rem !important; padding-bottom: 7rem !important; }
          .about-container        { max-width: 3400px !important; padding-left: 10rem !important; padding-right: 10rem !important; }
          .about-badge            { font-size: 1.65rem !important; padding: 1rem 2.25rem !important; gap: 0.85rem !important; border-radius: 9999px !important; }
          .about-badge-icon       { width: 1.85rem !important; height: 1.85rem !important; }
          .about-heading          { font-size: 4.5rem !important; margin-top: 2rem !important; line-height: 1.15 !important; }
          .about-para             { font-size: 2rem !important; line-height: 2.1 !important; }
          .about-para-gap         { gap: 3rem !important; }
          .about-stats-wrap       { margin-top: 4rem !important; border-radius: 1.5rem !important; }
          .about-stat-icon        { width: 6rem !important; height: 6rem !important; margin-bottom: 1.5rem !important; }
          .about-stat-icon svg    { width: 2.65rem !important; height: 2.65rem !important; }
          .about-stat-num         { font-size: 5rem !important; }
          .about-stat-label       { font-size: 1.65rem !important; margin-top: 1rem !important; }
          .about-stat-cell        { padding-top: 4rem !important; padding-bottom: 4rem !important; padding-left: 2rem !important; padding-right: 2rem !important; }
        }
      `}</style>

      <div className="about-container max-w-[1500px] mx-auto px-4 sm:px-8 lg:px-16 xl:px-24 pt-0 sm:pt-3 lg:pt-4 pb-2 sm:pb-8 lg:pb-10">

        {/* HEADING */}
        <div className="mb-4 sm:mb-10 lg:mb-12">
         {/* TOP TAGLINE */}
          <p className="services-tagline text-xs font-semibold tracking-[0.25em] uppercase text-[#0B4EA2] mb-3.5 sm:mb-4 text-left">
           About Us 
          </p>

          <h2
            style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
            className="about-heading mt-2.5 sm:mt-5 text-2xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight"
          >
            Your Success {" "}
            <span className="text-[#0B4EA2]">Our Mission</span>
          </h2>
        </div>

        {/* PARAGRAPHS */}
        <div className="about-para-gap w-full flex flex-col space-y-3.5 sm:space-y-7 lg:space-y-8">
          <p className="about-para text-sm sm:text-lg lg:text-[22px] leading-6 sm:leading-8 lg:leading-10 text-gray-700 text-left sm:text-justify">
            <span className="font-bold">
              <span className="text-[#0B4EA2]">Mega</span>
              <span className="text-green-500">Click</span>
            </span>{" "}
            stands as one of India's most dynamic and forward-thinking integrated
            professional service platforms. It is built to simplify, streamline, and
            elevate the way individuals and businesses access professional services.
            Founded on a foundation of integrity, professionalism, and customer
            satisfaction, MegaClick is not merely a professional service provider—it
            is a complete ecosystem designed to fulfil every personal and business
            requirement with precision, expertise, and an unwavering commitment to
            excellence.
          </p>

          <p className="about-para text-sm sm:text-lg lg:text-[22px] leading-6 sm:leading-8 lg:leading-10 text-gray-700 text-left sm:text-justify">
            By bringing together legal, financial, banking, real estate, and business
            support professional services under one seamlessly integrated ecosystem,{" "}
            <span className="font-bold">
              <span className="text-[#0B4EA2]">Mega</span>
              <span className="text-green-500">Click</span>
            </span>{" "}
            eliminates the fragmentation that has traditionally complicated
            professional service delivery across India. Individuals and businesses no
            longer need to manage multiple uncoordinated service providers. MegaClick
            brings everything under one roof, supported by meticulous planning,
            continuous effort, and a strategic approach that consistently delivers
            reliable, transparent, and result-oriented professional services.
          </p>
        </div>

        {/* STATS STRIP */}
        <div className="about-stats-wrap relative mt-5 sm:mt-10 lg:mt-14 w-full overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-r from-[#0B4EA2] via-blue-600 to-[#0B4EA2] shadow-2xl">
          {/* DOT PATTERN */}
          <div
            className="absolute inset-0 opacity-[0.08] pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,.9) 1.2px, transparent 1.2px)",
              backgroundSize: "26px 26px",
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.08] pointer-events-none"
            style={{
              backgroundImage: "repeating-linear-gradient(-45deg, rgba(255,255,255,.8) 0px, rgba(255,255,255,.8) 2px, transparent 2px, transparent 42px)",
            }}
          />

          {/* GRID */}
          <div className="about-stats-grid relative z-10 grid grid-cols-2 lg:grid-cols-4">
            {[
              { icon: <Users />, color: "text-[#0B4EA2]", num: "15K+", label: "Happy Clients", borderClass: "border-b border-r lg:border-b-0 lg:border-r border-white/10" },
              { icon: <Building2 />, color: "text-green-500", num: "25+", label: "Business Services", borderClass: "border-b lg:border-b-0 lg:border-r border-white/10" },
              { icon: <ShieldCheck />, color: "text-emerald-500", num: "100%", label: "Trusted Process", borderClass: "border-r border-white/10" },
              { icon: <BadgeCheck />, color: "text-[#0B4EA2]", num: "10+", label: "Years Experience", borderClass: "" },
            ].map((stat, i) => (
              <div
                key={i}
                className={`about-stat-cell flex flex-col items-center justify-center text-center px-3 sm:px-4 py-3.5 sm:py-7 lg:py-8 ${stat.borderClass}`}
              >
                <div className="about-stat-icon w-9 h-9 sm:w-12 sm:h-12 lg:w-14 lg:h-14 rounded-full bg-white flex items-center justify-center mb-2 sm:mb-4 shadow-lg">
                  {React.cloneElement(stat.icon, { className: `w-4 h-4 sm:w-6 sm:h-6 ${stat.color}` })}
                </div>
                <h3
                  style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
                  className="about-stat-num text-xl sm:text-3xl lg:text-4xl font-bold text-white"
                >
                  {stat.num}
                </h3>
                <p className="about-stat-label text-[11px] sm:text-sm text-white/80 mt-0.5 sm:mt-2 font-medium">
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