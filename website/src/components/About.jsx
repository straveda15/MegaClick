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
    <section className="relative overflow-hidden bg-white py-6 sm:py-10 lg:py-12">
      {/* MAIN CONTAINER */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16 xl:px-20">

        {/* MAIN GRID — Content LEFT, Images RIGHT */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-14 items-start">

          {/* ======= LEFT — TEXT CONTENT ======= */}
          <div className="w-full pt-1 lg:pt-2 order-2 lg:order-1">

            {/* TOP TAGLINE */}
            <p className="text-xs font-semibold tracking-[0.25em] uppercase text-[#0B4EA2] mb-3.5 text-left">
              ABOUT US
            </p>

            {/* HEADING */}
            <h2
              className="text-2xl sm:text-3xl lg:text-[38px] font-normal text-slate-900 leading-tight"
              style={{ fontFamily: '"Hedvig Letters Serif", Georgia, serif', fontWeight: 400 }}
            >
              Helping Businesses
              <br />
              <span className="text-[#0B4EA2]">With Smart Solutions</span>
            </h2>

            {/* PARAGRAPH — justified */}
            <p className="mt-4 sm:mt-5 text-slate-600 text-sm sm:text-base leading-relaxed font-normal text-justify">
              MegaClick provides professional business services that simplify
              registrations, compliance, taxation and financial management. We
              help startups, entrepreneurs and established businesses with
              complete end-to-end support, transparent processes and expert
              guidance so you can focus on growing your business.
            </p>

            {/* HIGHLIGHTS LIST */}
            <ul className="mt-5 sm:mt-6 flex flex-col gap-2.5">
              {highlights.map((point, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2
                    size={18}
                    className="text-[#0B4EA2] flex-shrink-0 mt-0.5"
                  />
                  <span className="text-sm sm:text-base text-slate-600 leading-snug">
                    {point}
                  </span>
                </li>
              ))}
            </ul>

            {/* LEARN MORE BUTTON */}
            <div className="mt-6 sm:mt-8 flex justify-start">
              <button
                onClick={() => navigate("/about")}
                className="inline-flex items-center justify-center gap-2.5 bg-[#0B4EA2] hover:bg-blue-700 text-white px-7 sm:px-8 py-3 rounded-full font-medium text-sm sm:text-base transition-all duration-300 hover:scale-[1.02] shadow-md hover:shadow-lg cursor-pointer"
              >
                <span>Learn More</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {/* ======= RIGHT — PHOTO GRID ======= */}
          <div className="relative grid grid-cols-2 gap-3 sm:gap-4 md:gap-5 w-full order-1 lg:order-2">

            {/* IMAGE 1 */}
            <div
              onClick={() => setSelectedImage(img1)}
              className="h-[170px] sm:h-[210px] md:h-[240px] lg:h-[220px] xl:h-[250px] rounded-2xl sm:rounded-[24px] overflow-hidden shadow-md group cursor-pointer"
            >
              <img
                src={img1}
                alt="MegaClick business"
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
              />
            </div>

            {/* IMAGE 2 */}
            <div
              onClick={() => setSelectedImage(img2)}
              className="h-[170px] sm:h-[210px] md:h-[240px] lg:h-[220px] xl:h-[250px] rounded-2xl sm:rounded-[24px] overflow-hidden shadow-md group cursor-pointer"
            >
              <img
                src={img2}
                alt="MegaClick services"
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
              />
            </div>

            {/* IMAGE 3 */}
            <div
              onClick={() => setSelectedImage(img3)}
              className="h-[170px] sm:h-[210px] md:h-[240px] lg:h-[220px] xl:h-[250px] rounded-2xl sm:rounded-[24px] overflow-hidden shadow-md group cursor-pointer"
            >
              <img
                src={img3}
                alt="MegaClick team"
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
              />
            </div>

            {/* IMAGE 4 + EXPERIENCE OVERLAY */}
            <div
              onClick={() => setSelectedImage(img4)}
              className="relative h-[170px] sm:h-[210px] md:h-[240px] lg:h-[220px] xl:h-[250px] rounded-2xl sm:rounded-[24px] overflow-hidden shadow-md group cursor-pointer"
            >
              <img
                src={img4}
                alt="MegaClick experience"
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
              />
              {/* OVERLAY */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-700/80 to-green-500/80" />
              {/* EXPERIENCE TEXT */}
              <div className="absolute inset-0 flex flex-col justify-center items-center text-white text-center px-2 pointer-events-none">
                <h3 className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-bold">
                  10+
                </h3>
                <p className="text-xs sm:text-base lg:text-lg xl:text-xl font-semibold mt-1 sm:mt-2">
                  Years Experience
                </p>
              </div>
            </div>

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
            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/90 hover:bg-white text-gray-900 flex items-center justify-center text-2xl sm:text-3xl font-bold shadow-lg transition-all duration-200 hover:scale-105"
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