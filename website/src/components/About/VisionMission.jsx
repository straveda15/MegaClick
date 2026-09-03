import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Eye, Target } from "lucide-react";

const VisionMission = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });

  return (
    <section
      ref={sectionRef}
      className="vm-section relative overflow-hidden py-10 sm:py-14 min-[1440px]:py-16 min-[1920px]:py-20 min-[3840px]:py-32 bg-blue-50/50 font-['Inter',sans-serif]"
    >
      {/* GOOGLE FONTS */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hedvig+Letters+Serif:opsz@12..24&family=Inter:wght@400;500;600;700;800&display=swap');

        /* ── Standard Desktop 1440px ── */
        @media (min-width: 1440px) {
          .vm-container        { max-width: 1380px !important; padding-left: 2.5rem !important; padding-right: 2.5rem !important; }
          .vm-heading          { font-size: 2.5rem !important; }
          .vm-card-heading     { font-size: 1.85rem !important; }
          .vm-card-para        { font-size: 1.05rem !important; line-height: 1.8 !important; }
        }

        /* ── Large Desktop 1920px ── */
        @media (min-width: 1920px) {
          .vm-container        { max-width: 1800px !important; padding-left: 4rem !important; padding-right: 4rem !important; }
          .vm-tagline          { font-size: 0.95rem !important; letter-spacing: 0.3em !important; }
          .vm-heading          { font-size: 3.25rem !important; }
          .vm-card             { padding: 2.75rem !important; }
          .vm-card-icon-box    { width: 4.5rem !important; height: 4.5rem !important; border-radius: 1rem !important; }
          .vm-card-icon-box svg{ width: 2rem !important; height: 2rem !important; }
          .vm-card-eyebrow     { font-size: 0.9rem !important; }
          .vm-card-heading     { font-size: 2.25rem !important; }
          .vm-card-para        { font-size: 1.25rem !important; line-height: 1.9 !important; }
        }

        /* ── 4K Ultra-Wide 3840px ── */
        @media (min-width: 3840px) {
          .vm-container        { max-width: 3200px !important; padding-left: 6rem !important; padding-right: 6rem !important; }
          .vm-header           { margin-bottom: 4.5rem !important; }
          .vm-tagline          { font-size: 1.75rem !important; letter-spacing: 0.35em !important; margin-bottom: 1.5rem !important; }
          .vm-heading          { font-size: 5.5rem !important; line-height: 1.15 !important; }
          .vm-cards-grid       { gap: 3.5rem !important; }
          .vm-card             { padding: 4.5rem !important; border-radius: 2.5rem !important; border-width: 2px !important; }
          .vm-card-side-bar    { width: 8px !important; }
          .vm-card-left        { width: 14rem !important; }
          .vm-card-icon-box    { width: 7rem !important; height: 7rem !important; border-radius: 1.5rem !important; }
          .vm-card-icon-box svg{ width: 3.25rem !important; height: 3.25rem !important; }
          .vm-card-eyebrow     { font-size: 1.25rem !important; letter-spacing: 0.2em !important; }
          .vm-card-heading     { font-size: 3.75rem !important; margin-top: 0.5rem !important; }
          .vm-card-para        { font-size: 2.25rem !important; line-height: 2 !important; }
        }
      `}</style>

      {/* BG BLOBS */}
      <div className="absolute -top-32 -right-32 w-80 h-80 min-[3840px]:w-[30rem] min-[3840px]:h-[30rem] rounded-full bg-blue-200 blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 min-[3840px]:w-[30rem] min-[3840px]:h-[30rem] rounded-full bg-green-100 blur-3xl opacity-40 pointer-events-none" />

      {/* UNIFIED CONTAINER */}
      <div className="vm-container w-full max-w-[1380px] min-[1920px]:max-w-[1800px] min-[3840px]:max-w-[3200px] mx-auto px-4 sm:px-6 min-[1440px]:px-10 min-[1920px]:px-16 min-[3840px]:px-24">

        {/* =========================================
            HEADER (Consistent Typography)
        ========================================== */}
        <div className="vm-header mb-8 sm:mb-10 min-[1920px]:mb-12 min-[3840px]:mb-16 text-left">
          <p className="vm-tagline text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-[#0B4EA2] mb-2 sm:mb-2.5">
            Our Purpose
          </p>

          <h2
            style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
            className="
              vm-heading
              text-2xl
              sm:text-3xl
              md:text-3xl
              lg:text-4xl
              font-bold
              leading-[1.18]
              text-left
              mb-2.5
              sm:mb-4
            "
          >
            <span className="text-[#0B4EA2]">Vision</span>
            <span className="text-black"> &amp; </span>
            <span className="text-green-600">Mission</span>
          </h2>
        </div>

        {/* CARDS */}
        <div className="vm-cards-grid grid lg:grid-cols-2 gap-6 lg:gap-8 min-[1920px]:gap-10 items-stretch">

          {/* ── VISION ── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -40 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="vm-card group relative overflow-hidden rounded-2xl min-[3840px]:rounded-[40px] border border-blue-100 min-[3840px]:border-2 bg-[#D6E9FF] p-6 sm:p-8 min-[1440px]:p-10 min-[1920px]:p-12 hover:border-blue-300 hover:shadow-xl transition-all duration-500 flex flex-col justify-between"
          >
            <div className="vm-card-side-bar absolute top-0 left-0 w-1.5 h-full bg-[#0B4EA2]" />

            <div className="flex flex-col sm:flex-row gap-6 min-[3840px]:gap-10">
              {/* LEFT ICON + TITLE */}
              <div className="vm-card-left sm:w-[150px] lg:w-[170px] min-[1920px]:w-[190px] flex-shrink-0">
                <div className="flex sm:flex-col items-center sm:items-start gap-3 min-[3840px]:gap-5">
                  <motion.div
                    whileHover={{ scale: 1.08, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                    className="vm-card-icon-box w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white border border-blue-100 flex items-center justify-center shadow-sm"
                  >
                    <Eye className="w-6 h-6 sm:w-7 sm:h-7 text-[#0B4EA2]" />
                  </motion.div>

                  <div>
                    <p className="vm-card-eyebrow text-xs font-semibold uppercase tracking-widest text-gray-500">
                      Our
                    </p>
                    <h3
                      style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
                      className="vm-card-heading text-2xl sm:text-3xl font-bold text-[#0B4EA2]"
                    >
                      Vision
                    </h3>
                  </div>
                </div>
              </div>

              {/* RIGHT TEXT */}
              <div className="flex-1">
                <p className="vm-card-para text-gray-700 text-sm sm:text-base lg:text-lg text-left sm:text-justify leading-relaxed font-normal">
                  To become India's most trusted digital platform for legal, business
                  and financial services by empowering entrepreneurs with innovative,
                  transparent and hassle-free solutions.
                </p>
              </div>
            </div>
          </motion.div>

          {/* ── MISSION ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 40 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="vm-card group relative overflow-hidden rounded-2xl min-[3840px]:rounded-[40px] border border-green-100 min-[3840px]:border-2 bg-[#D9F7E5] p-6 sm:p-8 min-[1440px]:p-10 min-[1920px]:p-12 hover:border-green-300 hover:shadow-xl transition-all duration-500 flex flex-col justify-between"
          >
            <div className="vm-card-side-bar absolute top-0 left-0 w-1.5 h-full bg-green-500" />

            <div className="flex flex-col sm:flex-row gap-6 min-[3840px]:gap-10">
              {/* LEFT ICON + TITLE */}
              <div className="vm-card-left sm:w-[150px] lg:w-[170px] min-[1920px]:w-[190px] flex-shrink-0">
                <div className="flex sm:flex-col items-center sm:items-start gap-3 min-[3840px]:gap-5">
                  <motion.div
                    whileHover={{ scale: 1.08, rotate: -5 }}
                    transition={{ duration: 0.3 }}
                    className="vm-card-icon-box w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white border border-green-100 flex items-center justify-center shadow-sm"
                  >
                    <Target className="w-6 h-6 sm:w-7 sm:h-7 text-green-600" />
                  </motion.div>

                  <div>
                    <p className="vm-card-eyebrow text-xs font-semibold uppercase tracking-widest text-gray-500">
                      Our
                    </p>
                    <h3
                      style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
                      className="vm-card-heading text-2xl sm:text-3xl font-bold text-green-600"
                    >
                      Mission
                    </h3>
                  </div>
                </div>
              </div>

              {/* RIGHT TEXT */}
              <div className="flex-1">
                <p className="vm-card-para text-gray-700 text-sm sm:text-base lg:text-lg text-left sm:text-justify leading-relaxed font-normal">
                  Deliver affordable, reliable and technology-driven legal, taxation
                  and compliance services while ensuring transparency, efficiency and
                  customer satisfaction.
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default VisionMission;