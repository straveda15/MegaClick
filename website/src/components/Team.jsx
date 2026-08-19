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
      <section className="w-full py-10 sm:py-12 lg:py-16 bg-white">
        {/* ---------- WRAPPER CONTAINER ---------- */}
        <div
          className="
            max-w-[1500px]
            mx-auto
            px-5
            sm:px-8
            lg:px-16
            xl:px-24
          "
        >
          {/* ----- TAGLINE (left-aligned) ----- */}
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-[#0B4EA2] mb-1.5 text-left">
            The People Behind It
          </p>

          {/* ----- HEADING (Hedvig Letters Serif, left) ----- */}
          <h2
            className="text-2xl sm:text-3xl lg:text-[40px] font-normal text-[#0f172a] leading-tight mb-3 text-left"
            style={{
              fontFamily: '"Hedvig Letters Serif", Georgia, serif',
              fontWeight: 400,
            }}
          >
            Meet the <span className="text-[#0B4EA2]">Experts</span>
          </h2>

          {/* ----- SUB-HEADING (Inter, left & spread full width) ----- */}
          <p className="text-slate-600 font-normal text-sm sm:text-base leading-relaxed w-full mb-8 sm:mb-10 text-left">
            Our experienced professionals are dedicated to providing reliable
            business solutions and expert guidance.
          </p>

          {/* ----- TEAM GRID (full width left-aligned cards) ----- */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4 lg:gap-5 w-full">
            {teamMembers.map((member, idx) => (
              <div
                key={idx}
                className="group flex flex-col cursor-pointer"
                onClick={() => setSelectedImage(member)}
              >
                {/* Photo container */}
                <div className="relative w-full h-[160px] sm:h-[180px] lg:h-[175px] xl:h-[185px] rounded-xl bg-blue-50/60 overflow-hidden p-1.5 flex items-end justify-center transition-all duration-300 group-hover:bg-blue-100/60 border border-blue-100/60 shadow-xs">
                  <img
                    src={member.image}
                    alt={member.name}
                    loading="lazy"
                    className="w-full h-full object-cover rounded-lg transition-transform duration-500 group-hover:scale-102"
                  />
                </div>

                {/* Name & role */}
                <div className="mt-2.5 px-0.5 text-left">
                  <h3 className="text-sm font-bold text-[#0B4EA2] leading-snug">
                    {member.name}
                  </h3>
                  <p className="text-[11px] font-medium text-[#0f172a] mt-0.5">
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