import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Eye, Target, CheckCircle2 } from "lucide-react";

const VisionMission = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });

  return (
    <section
      ref={sectionRef}
      className="vm-section relative overflow-hidden py-12 sm:py-14 lg:py-20 bg-blue-50 font-['Inter',sans-serif]"
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hedvig+Letters+Serif&family=Inter:wght@400;500;600;700;800&display=swap');

        /* ── Standard Desktop 1440px ── */
        @media (min-width: 1440px) {
          .vm-section          { padding-top: 3.5rem !important; padding-bottom: 3.5rem !important; }
          .vm-container        { max-width: 1440px !important; padding-left: 5rem !important; padding-right: 5rem !important; }
          .vm-badge            { font-size: 0.85rem !important; padding: 0.5rem 1.25rem !important; }
          .vm-heading          { font-size: 2.25rem !important; margin-top: 1rem !important; }
          .vm-card-heading     { font-size: 1.65rem !important; }
          .vm-card-para        { font-size: 1.05rem !important; line-height: 1.75 !important; }
          .vm-card-footer      { font-size: 0.85rem !important; }
        }

        /* ── Large Desktop 1920px ── */
        @media (min-width: 1920px) {
          .vm-section          { padding-top: 5rem !important; padding-bottom: 5rem !important; }
          .vm-container        { max-width: 1800px !important; padding-left: 6rem !important; padding-right: 6rem !important; }
          .vm-badge            { font-size: 1rem !important; padding: 0.6rem 1.5rem !important; gap: 0.6rem !important; }
          .vm-badge-icon       { width: 1.1rem !important; height: 1.1rem !important; }
          .vm-heading          { font-size: 2.85rem !important; margin-top: 1.25rem !important; }
          .vm-card             { padding: 2.5rem !important; }
          .vm-card-icon-box    { width: 4.5rem !important; height: 4.5rem !important; }
          .vm-card-icon-box svg{ width: 1.85rem !important; height: 1.85rem !important; }
          .vm-card-eyebrow     { font-size: 0.8rem !important; }
          .vm-card-heading     { font-size: 2rem !important; }
          .vm-card-para        { font-size: 1.2rem !important; line-height: 1.85 !important; }
          .vm-card-footer      { font-size: 0.95rem !important; margin-top: 2rem !important; }
        }

        /* ── 4K Ultra-Wide 3840px ── */
        @media (min-width: 3840px) {
          .vm-section          { padding-top: 9rem !important; padding-bottom: 9rem !important; }
          .vm-container        { max-width: 3400px !important; padding-left: 10rem !important; padding-right: 10rem !important; }
          .vm-header           { margin-bottom: 4.5rem !important; }
          .vm-badge            { font-size: 1.65rem !important; padding: 1rem 2.25rem !important; gap: 0.85rem !important; border-radius: 9999px !important; }
          .vm-badge-icon       { width: 1.85rem !important; height: 1.85rem !important; }
          .vm-heading          { font-size: 4.75rem !important; margin-top: 2rem !important; line-height: 1.15 !important; }
          .vm-cards-grid       { gap: 2.5rem !important; }
          .vm-card             { padding: 4rem !important; border-radius: 2rem !important; border-width: 2px !important; }
          .vm-card-side-bar    { width: 6px !important; }
          .vm-card-left        { width: 14rem !important; }
          .vm-card-icon-box    { width: 6.5rem !important; height: 6.5rem !important; border-radius: 1.25rem !important; }
          .vm-card-icon-box svg{ width: 2.75rem !important; height: 2.75rem !important; }
          .vm-card-eyebrow     { font-size: 1.1rem !important; letter-spacing: 0.18em !important; }
          .vm-card-heading     { font-size: 3.5rem !important; margin-top: 0.5rem !important; }
          .vm-card-para        { font-size: 2rem !important; line-height: 2 !important; }
          .vm-card-footer      { font-size: 1.5rem !important; margin-top: 3rem !important; gap: 1rem !important; }
          .vm-card-footer-line { width: 3.5rem !important; height: 3px !important; }
        }
      `}</style>

      {/* BG BLOBS */}
      <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full bg-blue-200 blur-3xl opacity-50 pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full bg-green-100 blur-3xl opacity-40 pointer-events-none" />

      <div className="vm-container max-w-[1500px] mx-auto px-4 sm:px-8 lg:px-16 xl:px-24 pt-2 sm:pt-3 lg:pt-4 pb-6 sm:pb-8 lg:pb-10">

        {/* HEADER */}
        <div className="vm-header mb-10 lg:mb-14">
         <p className="services-tagline text-xs font-semibold tracking-[0.25em] uppercase text-[#0B4EA2] mb-3.5 sm:mb-4 text-left">
          Our Purpose
          </p>

          <h2
            style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
            className="vm-heading mt-5 text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight"
          >
            <span className="text-[#0B4EA2]">Vision</span>
            <span className="text-gray-900"> &amp; </span>
            <span className="text-green-500">Mission</span>
          </h2>
        </div>

        {/* CARDS */}
        <div className="vm-cards-grid grid lg:grid-cols-2 gap-6 lg:gap-8">

          {/* ── VISION ── */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="vm-card group relative overflow-hidden rounded-2xl border border-blue-100 bg-[#D6E9FF] p-6 sm:p-8 lg:p-10 hover:border-blue-300 hover:shadow-xl transition-all duration-500"
          >
            <div className="vm-card-side-bar absolute top-0 left-0 w-1 h-full bg-[#0B4EA2]" />

            <div className="flex flex-col sm:flex-row gap-6">

              {/* LEFT */}
              <div className="vm-card-left sm:w-[150px] lg:w-[170px] flex-shrink-0">
                <div className="flex sm:flex-col items-center sm:items-start gap-3">
                  <motion.div
                    whileHover={{ scale: 1.08, rotate: 5 }}
                    transition={{ duration: 0.3 }}
                    className="vm-card-icon-box w-14 h-14 rounded-xl bg-white border border-blue-100 flex items-center justify-center shadow-sm"
                  >
                    <Eye size={28} className="text-[#0B4EA2]" />
                  </motion.div>

                  <div>
                    <p className="vm-card-eyebrow text-xs font-semibold uppercase tracking-widest text-gray-400">
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

              {/* RIGHT */}
              <div className="flex-1">
                <p className="vm-card-para text-gray-600 text-base sm:text-lg text-justify leading-7 sm:leading-8">
                  To become India's most trusted digital platform for legal, business
                  and financial services by empowering entrepreneurs with innovative,
                  transparent and hassle-free solutions.
                </p>

                
              </div>

            </div>
          </motion.div>

          {/* ── MISSION ── */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="vm-card group relative overflow-hidden rounded-2xl border border-green-100 bg-[#D9F7E5] p-6 sm:p-8 lg:p-10 hover:border-green-300 hover:shadow-xl transition-all duration-500"
          >
            <div className="vm-card-side-bar absolute top-0 left-0 w-1 h-full bg-green-500" />

            <div className="flex flex-col sm:flex-row gap-6">

              {/* LEFT */}
              <div className="vm-card-left sm:w-[150px] lg:w-[170px] flex-shrink-0">
                <div className="flex sm:flex-col items-center sm:items-start gap-3">
                  <motion.div
                    whileHover={{ scale: 1.08, rotate: -5 }}
                    transition={{ duration: 0.3 }}
                    className="vm-card-icon-box w-14 h-14 rounded-xl bg-white border border-green-100 flex items-center justify-center shadow-sm"
                  >
                    <Target size={28} className="text-green-600" />
                  </motion.div>

                  <div>
                    <p className="vm-card-eyebrow text-xs font-semibold uppercase tracking-widest text-gray-400">
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

              {/* RIGHT */}
              <div className="flex-1">
                <p className="vm-card-para text-gray-600 text-base sm:text-lg leading-7 text-justify  sm:leading-8">
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