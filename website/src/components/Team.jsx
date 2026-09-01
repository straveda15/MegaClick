import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

import team1 from "../assets/team1.webp";
import team2 from "../assets/team2.jpg";
import team3 from "../assets/team3.jpg";
import team4 from "../assets/team4.jpg";
import team5 from "../assets/team5.png";
import team6 from "../assets/team6.png";

/* ------------------- Team data ------------------- */
const teamMembers = [
  { image: team1, name: "Rahul Sharma",   role: "Founder & CEO" },
  { image: team2, name: "Priya Deshmukh", role: "Legal Consultant" },
  { image: team3, name: "Amit Patil",     role: "Financial Advisor" },
  { image: team4, name: "Neha Kulkarni",  role: "Business Consultant" },
  { image: team5, name: "Vaibhav Verma",  role: "Operations Lead" },
  { image: team6, name: "Siddharth Rao", role: "Senior Consultant" },
];

const Team = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  /* ---- lock body scroll when modal is open ---- */
  useEffect(() => {
    document.body.style.overflow = selectedImage ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedImage]);

  /* ---- close modal with ESC key ---- */
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setSelectedImage(null);
    };
    if (selectedImage) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedImage]);

  return (
    <>
      {/* ==================== MAIN SECTION ==================== */}
      <section className="w-full py-8 sm:py-12 min-[1440px]:py-16 min-[1920px]:py-20 min-[3840px]:py-32 bg-white team-section font-['Inter',sans-serif]">
        
        {/* DIRECT CSS RULES FOR 1440px, 1920px & 3840px (4K) */}
        <style>{`
          .app-container {
            width: 100%;
            max-width: 1380px;
            margin-left: auto;
            margin-right: auto;
            padding-left: 1rem;
            padding-right: 1rem;
          }

          @media (min-width: 640px) {
            .app-container {
              padding-left: 1.5rem;
              padding-right: 1.5rem;
            }
          }

          /* ── 1. Standard Desktop (1440px x 900px) ── */
          @media (min-width: 1440px) {
            .app-container {
              max-width: 1380px !important;
              padding-left: 2.5rem !important;  /* px-10 (40px) */
              padding-right: 2.5rem !important; /* px-10 (40px) */
            }
            .team-tagline {
              font-size: 0.85rem !important;
              margin-bottom: 0.75rem !important;
            }
            .team-title {
              font-size: 2.75rem !important;
              line-height: 1.2 !important;
              margin-bottom: 0.75rem !important;
            }
            .team-sub {
              font-size: 1rem !important;
              line-height: 1.6 !important;
              margin-bottom: 2.5rem !important;
            }
            .team-grid {
              gap: 1.25rem !important;
            }
            .team-photo-box {
              height: 200px !important;
              border-radius: 0.875rem !important;
            }
            .team-name {
              font-size: 1rem !important;
              margin-top: 0.6rem !important;
            }
            .team-role {
              font-size: 0.825rem !important;
            }
          }

          /* ── 2. Large Desktop (1920px x 1080px Full HD) ── */
          @media (min-width: 1920px) {
            .app-container {
              max-width: 1800px !important;
              padding-left: 4rem !important;   /* px-16 (64px) */
              padding-right: 4rem !important;  /* px-16 (64px) */
            }
            .team-tagline {
              font-size: 1rem !important;
              letter-spacing: 0.3em !important;
              margin-bottom: 1rem !important;
            }
            .team-title {
              font-size: 3.5rem !important;
              line-height: 1.18 !important;
              margin-bottom: 1rem !important;
            }
            .team-sub {
              font-size: 1.25rem !important;
              line-height: 1.7 !important;
              margin-bottom: 3.5rem !important;
            }
            .team-grid {
              gap: 1.75rem !important;
            }
            .team-photo-box {
              height: 260px !important;
              border-radius: 1rem !important;
            }
            .team-name {
              font-size: 1.25rem !important;
              margin-top: 0.75rem !important;
            }
            .team-role {
              font-size: 1rem !important;
            }
          }

          /* ── 3. 4K Ultra-Wide Desktop (3840px x 2160px) ── */
          @media (min-width: 3840px) {
            .app-container {
              max-width: 3200px !important;
              padding-left: 6rem !important;   /* px-24 (96px) */
              padding-right: 6rem !important;  /* px-24 (96px) */
            }
            .team-tagline {
              font-size: 1.75rem !important;
              letter-spacing: 0.35em !important;
              margin-bottom: 1.75rem !important;
            }
            .team-title {
              font-size: 6rem !important;
              line-height: 1.15 !important;
              margin-bottom: 1.75rem !important;
            }
            .team-sub {
              font-size: 2.25rem !important;
              line-height: 1.8 !important;
              margin-bottom: 6rem !important;
            }
            .team-grid {
              gap: 3rem !important;
            }
            .team-photo-box {
              height: 480px !important;
              border-radius: 2rem !important;
              padding: 0.75rem !important;
            }
            .team-name {
              font-size: 2.25rem !important;
              margin-top: 1.5rem !important;
            }
            .team-role {
              font-size: 1.75rem !important;
              margin-top: 0.5rem !important;
            }
          }
        `}</style>

        {/* ---------- WRAPPER CONTAINER ---------- */}
        <div className="app-container">
          {/* ----- TAGLINE ----- */}
          <p className="team-tagline text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-[#0B4EA2] mb-2 sm:mb-4 text-left">
            The People Behind It
          </p>

          {/* ----- HEADING ----- */}
          <h2
            style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
            className="
              team-title
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
            Meet The{" "}
            <span className="text-[#0B4EA2]">
              Experts
            </span>
          </h2>

          {/* ----- SUB-HEADING ----- */}
          <p className="team-sub text-slate-600 font-normal text-xs sm:text-base leading-relaxed w-full mb-6 sm:mb-10 lg:mb-14 text-left">
            Our experienced professionals are dedicated to providing reliable
            business solutions and expert guidance.
          </p>

          {/* ----- TEAM GRID (2 COLUMNS ON MOBILE, 3 ON TABLET, 6 ON DESKTOP) ----- */}
          <div className="team-grid grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4 lg:gap-5 w-full">
            {teamMembers.map((member, idx) => (
              <div
                key={idx}
                className="group flex flex-col cursor-pointer"
                onClick={() => setSelectedImage(member)}
              >
                {/* Photo container */}
                <div className="team-photo-box relative w-full h-[150px] sm:h-[180px] lg:h-[175px] xl:h-[185px] rounded-xl bg-blue-50/60 overflow-hidden p-1 sm:p-1.5 flex items-end justify-center transition-all duration-300 group-hover:bg-blue-100/60 border border-blue-100/60 shadow-xs">
                  <img
                    src={member.image}
                    alt={member.name}
                    loading="lazy"
                    className="w-full h-full object-cover rounded-lg transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Name & role */}
                <div className="px-0.5 text-left">
                  <h3 className="team-name text-xs sm:text-sm font-bold text-[#0B4EA2] leading-snug">
                    {member.name}
                  </h3>
                  <p className="team-role text-[10px] sm:text-[11px] font-medium text-[#0f172a] mt-0.5">
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FULLSCREEN IMAGE MODAL ==================== */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 min-[3840px]:p-12"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-sm sm:max-w-md min-[1920px]:max-w-lg min-[3840px]:max-w-3xl w-full bg-white rounded-2xl min-[3840px]:rounded-[32px] overflow-hidden shadow-2xl p-4 min-[3840px]:p-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute top-3 right-3 min-[3840px]:top-6 min-[3840px]:right-6 z-10 w-8 h-8 min-[3840px]:w-14 min-[3840px]:h-14 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center transition-all cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-4 h-4 min-[3840px]:w-8 min-[3840px]:h-8" />
            </button>

            <img
              src={selectedImage.image}
              alt={selectedImage.name}
              className="w-full h-[260px] sm:h-[320px] min-[1920px]:h-[380px] min-[3840px]:h-[650px] object-cover rounded-xl min-[3840px]:rounded-2xl mb-3 min-[3840px]:mb-6"
            />
            <h3 className="text-base sm:text-lg min-[1920px]:text-xl min-[3840px]:text-4xl font-bold text-[#0B4EA2]">
              {selectedImage.name}
            </h3>
            <p className="text-xs sm:text-sm min-[3840px]:text-2xl font-medium text-[#0f172a] mt-0.5 min-[3840px]:mt-2">
              {selectedImage.role}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Team;