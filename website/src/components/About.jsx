import React, { useEffect, useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import img1 from "../assets/img1.jpg";
import img2 from "../assets/img2.jpg";
import img3 from "../assets/img3.jpg";
import img4 from "../assets/img4.jpg";

const highlights = [
  "500+ Businesses Successfully Registered",
  "Expert Guidance at Every Step",
  "100% Transparent & Hassle-Free Process",
  "Dedicated Support Across Maharashtra",
];

const About = () => {
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);

  // SCROLL TO TOP
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // LOCK BACKGROUND SCROLL WHEN MODAL IS OPEN
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedImage]);

  // ESCAPE KEY TO CLOSE IMAGE
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setSelectedImage(null);
    };
    if (selectedImage) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedImage]);

  return (
    <section className="relative overflow-hidden bg-white py-10 sm:py-14 lg:py-16 min-[1920px]:py-24 min-[3840px]:py-36 font-['Inter',sans-serif]">
      {/* DIRECT RESPONSIVE CSS BREAKPOINTS */}
      <style>{`
        /* 1920px Full HD */
        @media (min-width: 1920px) {
          .about-container {
            max-width: 1800px !important;
            padding-left: 4rem !important;
            padding-right: 4rem !important;
          }
          .about-tagline {
            font-size: 1rem !important;
            letter-spacing: 0.25em !important;
          }
          .about-heading {
            font-size: 3.25rem !important;
            line-height: 1.2 !important;
          }
          .about-desc {
            font-size: 1.15rem !important;
            line-height: 2rem !important;
          }
          .about-highlight-text {
            font-size: 1.15rem !important;
          }
          .about-img-box {
            height: 300px !important;
          }
          .about-btn {
            font-size: 1.15rem !important;
            padding: 1rem 2.25rem !important;
          }
          .about-exp-num {
            font-size: 4rem !important;
          }
          .about-exp-text {
            font-size: 1.25rem !important;
          }
        }

        /* 3840px 4K Ultra-Wide */
        @media (min-width: 3840px) {
          .about-container {
            max-width: 3200px !important;
            padding-left: 6rem !important;
            padding-right: 6rem !important;
          }
          .about-tagline {
            font-size: 1.75rem !important;
            letter-spacing: 0.3em !important;
            margin-bottom: 1.5rem !important;
          }
          .about-heading {
            font-size: 5.5rem !important;
            line-height: 1.2 !important;
          }
          .about-desc {
            font-size: 2rem !important;
            line-height: 3.25rem !important;
            margin-top: 2rem !important;
          }
          .about-highlight-list {
            margin-top: 2.5rem !important;
            gap: 1.75rem !important;
          }
          .about-highlight-text {
            font-size: 2rem !important;
            line-height: 2.5rem !important;
          }
          .about-highlight-icon {
            width: 2.25rem !important;
            height: 2.25rem !important;
            margin-top: 0.25rem !important;
          }
          .about-img-box {
            height: 520px !important;
            border-radius: 2rem !important;
          }
          .about-img-grid {
            gap: 2rem !important;
          }
          .about-btn {
            font-size: 2rem !important;
            padding: 1.5rem 3.5rem !important;
            border-radius: 9999px !important;
            margin-top: 3.5rem !important;
          }
          .about-btn svg {
            width: 2rem !important;
            height: 2rem !important;
          }
          .about-exp-num {
            font-size: 7rem !important;
          }
          .about-exp-text {
            font-size: 2.25rem !important;
          }
        }
      `}</style>

      {/* MAIN CONTAINER */}
      <div className="about-container w-full max-w-[1380px] mx-auto px-4 sm:px-6 min-[1440px]:px-10">
        
        {/* RESPONSIVE FLOW: INFO LEFT / TOP, IMAGES RIGHT / BOTTOM */}
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 min-[1920px]:gap-16 min-[3840px]:gap-24 items-center">

          {/* ======= 1. TEXT INFO (LEFT ON DESKTOP) ======= */}
          <div className="w-full order-1">
            {/* TOP TAGLINE */}
            <p
              style={{ fontFamily: "'Inter', sans-serif" }}
              className="about-tagline text-xs sm:text-sm font-semibold tracking-[0.2em] uppercase text-[#0B4EA2] mb-2 sm:mb-3 text-left"
            >
              ABOUT US
            </p>

            {/* HEADING (Hedvig Letters Serif) */}
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
           Helping Businesses
           <br/>
            <span className="text-[#0B4EA2]">
            With Smart Solutions
            </span>
          </h2>

            {/* PARAGRAPH */}
            <p
              style={{ fontFamily: "'Inter', sans-serif" }}
              className="about-desc mt-3.5 sm:mt-5 text-slate-600 text-sm sm:text-base lg:text-base leading-relaxed text-left sm:text-justify max-w-2xl min-[1920px]:max-w-3xl min-[3840px]:max-w-5xl"
            >
              MegaClick provides professional business services that simplify
              registrations, compliance, taxation and financial management. We
              help startups, entrepreneurs and established businesses with
              complete end-to-end support, transparent processes and expert
              guidance so you can focus on growing your business.
            </p>

            {/* HIGHLIGHTS LIST */}
            <ul className="about-highlight-list mt-5 sm:mt-6 flex flex-col gap-3 min-[1920px]:gap-4">
              {highlights.map((point, i) => (
                <li key={i} className="flex items-start gap-2.5 sm:gap-3">
                  <CheckCircle2
                    size={20}
                    className="about-highlight-icon text-[#0B4EA2] shrink-0 mt-0.5"
                  />
                  <span
                    style={{ fontFamily: "'Inter', sans-serif" }}
                    className="about-highlight-text text-sm sm:text-base text-slate-700 font-medium leading-snug"
                  >
                    {point}
                  </span>
                </li>
              ))}
            </ul>

            {/* DESKTOP LEARN MORE BUTTON (HIDDEN ON MOBILE) */}
            <div className="hidden lg:flex mt-7 sm:mt-9 justify-start">
              <button
                onClick={() => navigate("/about")}
                className="about-btn inline-flex items-center justify-center gap-2.5 bg-[#0B4EA2] hover:bg-blue-700 text-white px-7 sm:px-8 py-3.5 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 hover:scale-[1.02] shadow-md hover:shadow-lg cursor-pointer"
              >
                <span>Learn More</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {/* ======= 2. PHOTO GRID (RIGHT ON DESKTOP) ======= */}
          <div className="w-full order-2">
            <div className="about-img-grid grid grid-cols-2 gap-3 sm:gap-4 md:gap-5 w-full">

              {/* IMAGE 1 */}
              <div
                onClick={() => setSelectedImage(img1)}
                className="about-img-box h-[160px] sm:h-[220px] md:h-[250px] lg:h-[240px] rounded-2xl overflow-hidden shadow-md group cursor-pointer"
              >
                <img
                  src={img1}
                  alt="MegaClick business"
                  loading="lazy"
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                />
              </div>

              {/* IMAGE 2 */}
              <div
                onClick={() => setSelectedImage(img2)}
                className="about-img-box h-[160px] sm:h-[220px] md:h-[250px] lg:h-[240px] rounded-2xl overflow-hidden shadow-md group cursor-pointer"
              >
                <img
                  src={img2}
                  alt="MegaClick services"
                  loading="lazy"
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                />
              </div>

              {/* IMAGE 3 */}
              <div
                onClick={() => setSelectedImage(img3)}
                className="about-img-box h-[160px] sm:h-[220px] md:h-[250px] lg:h-[240px] rounded-2xl overflow-hidden shadow-md group cursor-pointer"
              >
                <img
                  src={img3}
                  alt="MegaClick team"
                  loading="lazy"
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                />
              </div>

              {/* IMAGE 4 + EXPERIENCE OVERLAY */}
              <div
                onClick={() => setSelectedImage(img4)}
                className="about-img-box relative h-[160px] sm:h-[220px] md:h-[250px] lg:h-[240px] rounded-2xl overflow-hidden shadow-md group cursor-pointer"
              >
                <img
                  src={img4}
                  alt="MegaClick experience"
                  loading="lazy"
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#0B4EA2]/85 to-emerald-600/85 transition-opacity duration-300 group-hover:opacity-95" />
                <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-2 pointer-events-none select-none">
                  <h3
                    style={{ fontFamily: "'Inter', sans-serif" }}
                    className="about-exp-num text-3xl sm:text-5xl font-extrabold tracking-tight drop-shadow-sm"
                  >
                    10+
                  </h3>
                  <p
                    style={{ fontFamily: "'Inter', sans-serif" }}
                    className="about-exp-text text-xs sm:text-base font-semibold mt-1 drop-shadow-xs"
                  >
                    Years Experience
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* ======= 3. MOBILE LEARN MORE BUTTON (UNDER IMAGES) ======= */}
          <div className="w-full flex lg:hidden order-3 justify-start mt-2">
            <button
              onClick={() => navigate("/about")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#0B4EA2] hover:bg-blue-700 text-white px-7 py-3.5 rounded-full font-semibold text-sm sm:text-base transition-all duration-300 shadow-md cursor-pointer active:scale-95"
            >
              <span>Learn More</span>
              <ArrowRight size={18} />
            </button>
          </div>

        </div>
      </div>

      {/* FULLSCREEN IMAGE MODAL */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          onClick={() => setSelectedImage(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white text-gray-900 flex items-center justify-center text-2xl sm:text-3xl font-bold shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer"
            aria-label="Close image"
          >
            ×
          </button>
          <div
            className="relative max-w-5xl max-h-[90vh] w-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage}
              alt="MegaClick preview"
              className="max-w-full max-h-[85vh] object-contain rounded-xl sm:rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default About;