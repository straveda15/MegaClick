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
      <section className="w-full py-10 sm:py-12 lg:py-16 bg-white team-section">
        {/* UNIFIED APP-CONTAINER (EXACT MATCH WITH NAVBAR) */}
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
          }

          /* Large Desktop (1920px x 1080px Full HD) */
          @media (min-width: 1920px) {
            .app-container {
              max-width: 1800px !important;
              padding-left: 6rem !important;
              padding-right: 6rem !important;
            }
            .team-section {
              padding-top: 5rem !important;
              padding-bottom: 5rem !important;
            }
            .team-tagline {
              font-size: 0.95rem !important;
              margin-bottom: 1.25rem !important;
            }
            .team-title {
              font-size: 3.25rem !important;
              margin-bottom: 1.25rem !important;
            }
            .team-sub {
              font-size: 1.25rem !important;
              margin-bottom: 4rem !important;
            }
            .team-grid {
              gap: 1.75rem !important;
            }
            .team-photo-box {
              height: 240px !important;
            }
            .team-name {
              font-size: 1.2rem !important;
            }
            .team-role {
              font-size: 0.95rem !important;
            }
          }

          /* QHD / 2K Ultra-Wide (2560px Desktop) */
          @media (min-width: 2560px) {
            .app-container {
              max-width: 2400px !important;
              padding-left: 8rem !important;
              padding-right: 8rem !important;
            }
            .team-section {
              padding-top: 6rem !important;
              padding-bottom: 6rem !important;
            }
            .team-tagline {
              font-size: 1.2rem !important;
            }
            .team-title {
              font-size: 4.25rem !important;
            }
            .team-sub {
              font-size: 1.55rem !important;
              margin-bottom: 5rem !important;
            }
            .team-grid {
              gap: 2.25rem !important;
            }
            .team-photo-box {
              height: 320px !important;
            }
            .team-name {
              font-size: 1.5rem !important;
            }
            .team-role {
              font-size: 1.15rem !important;
            }
          }

          /* 4K Ultra-Wide Desktop (3840px x 2160px) */
          @media (min-width: 3840px) {
            .app-container {
              max-width: 3400px !important;
              padding-left: 10rem !important;
              padding-right: 10rem !important;
            }
            .team-section {
              padding-top: 8rem !important;
              padding-bottom: 8rem !important;
            }
            .team-tagline {
              font-size: 1.75rem !important;
              margin-bottom: 2rem !important;
            }
            .team-title {
              font-size: 6rem !important;
              margin-bottom: 2rem !important;
            }
            .team-sub {
              font-size: 2.25rem !important;
              margin-bottom: 7rem !important;
            }
            .team-grid {
              gap: 3.5rem !important;
            }
            .team-photo-box {
              height: 460px !important;
              border-radius: 1.75rem !important;
            }
            .team-name {
              font-size: 2.25rem !important;
            }
            .team-role {
              font-size: 1.6rem !important;
            }
          }
        `}</style>

        {/* ---------- WRAPPER CONTAINER ---------- */}
        <div className="app-container">
          {/* ----- TAGLINE ----- */}
          <p className="team-tagline text-xs font-semibold tracking-[0.25em] uppercase text-[#0B4EA2] mb-3 sm:mb-4 text-left">
            The People Behind It
          </p>

          {/* ----- HEADING ----- */}
          <h2
            style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
            className="
              team-title
              text-3xl
              sm:text-3xl
              md:text-3xl
              lg:text-3xl
              xl:text-4xl
              font-bold
              leading-[1.18]
              text-black
              text-left
              mb-3
              sm:mb-4
            "
          >
            Meet The{" "}
            <span className="text-[#0B4EA2]">
              Experts
            </span>
          </h2>

          {/* ----- SUB-HEADING ----- */}
          <p className="team-sub text-slate-600 font-normal text-sm sm:text-base leading-relaxed w-full mb-10 sm:mb-14 lg:mb-16 text-left">
            Our experienced professionals are dedicated to providing reliable
            business solutions and expert guidance.
          </p>

          {/* ----- TEAM GRID ----- */}
          <div className="team-grid grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4 lg:gap-5 w-full">
            {teamMembers.map((member, idx) => (
              <div
                key={idx}
                className="group flex flex-col cursor-pointer"
                onClick={() => setSelectedImage(member)}
              >
                {/* Photo container */}
                <div className="team-photo-box relative w-full h-[160px] sm:h-[180px] lg:h-[175px] xl:h-[185px] rounded-xl bg-blue-50/60 overflow-hidden p-1.5 flex items-end justify-center transition-all duration-300 group-hover:bg-blue-100/60 border border-blue-100/60 shadow-xs">
                  <img
                    src={member.image}
                    alt={member.name}
                    loading="lazy"
                    className="w-full h-full object-cover rounded-lg transition-transform duration-500 group-hover:scale-102"
                  />
                </div>

                {/* Name & role */}
                <div className="mt-2.5 px-0.5 text-left">
                  <h3 className="team-name text-sm font-bold text-[#0B4EA2] leading-snug">
                    {member.name}
                  </h3>
                  <p className="team-role text-[11px] font-medium text-[#0f172a] mt-0.5">
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== IMAGE MODAL ==================== */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-lg w-full bg-white rounded-2xl overflow-hidden shadow-2xl p-4 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 flex items-center justify-center transition-all"
              aria-label="Close modal"
            >
              <X size={16} />
            </button>

            <img
              src={selectedImage.image}
              alt={selectedImage.name}
              className="w-full h-[280px] sm:h-[340px] object-cover rounded-xl mb-3"
            />
            <h3 className="text-lg font-bold text-[#0B4EA2]">
              {selectedImage.name}
            </h3>
            <p className="text-xs font-medium text-[#0f172a] mt-0.5">
              {selectedImage.role}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Team;