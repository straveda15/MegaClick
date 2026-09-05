import React, { useState, useEffect } from "react";
import {
  Quote,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const testimonials = [
  {
    name: "Keval Barot",
    service: "GST & Tax Compliance",
    location: "Nashik, Maharashtra",
    review:
      "Its a great platform to solve all business registration and tax query problems. The MegaClick staff is extremely supportive and prompt.",
  },
  {
    name: "Prakshal Jain",
    service: "Company Incorporation",
    location: "Pune, Maharashtra",
    review:
      "Genuine and reliable service provider. MegaClick made our company incorporation fast, transparent, and hassle-free.",
  },
  {
    name: "Prem Nair",
    service: "Business Advisory",
    location: "Nashik, Maharashtra",
    review:
      "MegaClick does a fantastic job of managing complex policies and filings into smooth, accessible solutions for businesses.",
  },
  {
    name: "Satyam Jha",
    service: "PAN & ROC Filings",
    location: "Nashik, Maharashtra",
    review:
      "Quick, professional, and reliable. The team guided us step-by-step through our PAN and annual ROC filings without any hassle.",
  },
  {
    name: "Sanatan Jena",
    service: "Trademark & Audit",
    location: "Pune, Maharashtra",
    review:
      "Excellent service provider! No need to run around different consultants. Everything was handled under one roof.",
  },
  {
    name: "Riya Mehta",
    service: "MSME Registration",
    location: "Mumbai, Maharashtra",
    review:
      "Very fast and professional team. Got my MSME registration done within a day. Highly recommend MegaClick for all legal services.",
  },
  {
    name: "Aditya Sharma",
    service: "Trademark Registration",
    location: "Nashik, Maharashtra",
    review:
      "MegaClick handled my trademark registration smoothly. The team was knowledgeable and always available to answer my questions.",
  },
  {
    name: "Pooja Desai",
    service: "Income Tax Filing",
    location: "Aurangabad, Maharashtra",
    review:
      "Filing income tax was always stressful, but MegaClick made the whole process simple and transparent. Excellent support.",
  },
  {
    name: "Rahul Patil",
    service: "Marriage Registration",
    location: "Nashik, Maharashtra",
    review:
      "Got our marriage certificate registered without any hassle. The team guided us with all the required documents. Great service!",
  },
];

/* =========================================
    EXACT SCREENSHOT CARD DESIGN
========================================== */
const TestimonialCard = ({ testimonial }) => (
  <article
    className="
      relative flex flex-col justify-between
      rounded-3xl border border-slate-200/90
      bg-white
      p-6
      shadow-sm hover:shadow-md hover:border-blue-200
      h-full
      transition-all duration-300
    "
  >
    {/* TOP: STARS & QUOTE */}
    <div>
      <div className="flex items-center justify-between mb-3.5">
        {/* 5 Green Stars */}
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={15}
              className="fill-emerald-500 text-emerald-500"
            />
          ))}
        </div>
        {/* Light Quote Icon */}
        <Quote size={18} className="text-slate-300" />
      </div>

      {/* REVIEW TEXT */}
      <p
        style={{ fontFamily: "'Inter', sans-serif" }}
        className="
          text-xs sm:text-[13.5px]
          text-slate-600
          leading-relaxed
          text-left
          min-h-[75px]
        "
      >
        "{testimonial.review}"
      </p>
    </div>

    {/* BOTTOM: DIVIDER & CLIENT DETAILS */}
    <div>
      <div className="my-4 h-px bg-slate-100" />

      <div className="flex flex-col text-left">
        <h3
          style={{ fontFamily: "'Inter', sans-serif" }}
          className="text-xs sm:text-sm font-bold text-[#0B4EA2] leading-snug truncate"
        >
          {testimonial.name}
        </h3>
        <p
          style={{ fontFamily: "'Inter', sans-serif" }}
          className="text-[11px] sm:text-xs font-semibold text-[#0B4EA2]/80 mt-0.5 truncate"
        >
          {testimonial.service}
        </p>
        <p
          style={{ fontFamily: "'Inter', sans-serif" }}
          className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 truncate"
        >
          {testimonial.location}
        </p>
      </div>
    </div>
  </article>
);

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCards, setVisibleCards] = useState(3);

  /* =========================================
      RESPONSIVE CARDS
      Desktop: 3
      Tablet: 2
      Mobile: 1
  ========================================== */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setVisibleCards(3);
      } else if (window.innerWidth >= 640) {
        setVisibleCards(2);
      } else {
        setVisibleCards(1);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const maxIndex = Math.max(0, testimonials.length - visibleCards);

  const goPrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const goNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  const trackWidthPercent = (testimonials.length / visibleCards) * 100;
  const singleCardShiftPercent = 100 / testimonials.length;

  return (
    <section className="w-full bg-white overflow-hidden py-10 sm:py-14 lg:py-16">
      {/* GOOGLE FONTS */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hedvig+Letters+Serif:opsz@12..24&family=Inter:wght@400;500;600;700&display=swap');
      `}</style>

      <div className="max-w-[1380px] mx-auto px-4 sm:px-6 min-[1440px]:px-10">
        {/* =========================================
            HEADING (Left-aligned)
        ========================================== */}
        <div className="mb-8 sm:mb-10 text-left">
          <p
            style={{ fontFamily: "'Inter', sans-serif" }}
            className="text-xs sm:text-sm font-semibold tracking-[0.25em] uppercase text-[#0B4EA2] mb-2 text-left"
          >
            CLIENT OUTCOMES
          </p>

          <h2
            style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
            className="
              text-2xl sm:text-3xl md:text-3xl lg:text-4xl
              font-bold
              leading-[1.18]
              text-black
              text-left
              mb-2.5 sm:mb-3
            "
          >
            What Our Clients{" "}
            <span className="text-[#0B4EA2]">Say About MegaClick</span>
          </h2>

          <p
            style={{ fontFamily: "'Inter', sans-serif" }}
            className="
              text-sm sm:text-base
              text-gray-500
              font-normal
              leading-relaxed
              max-w-xl
              text-left
            "
          >
            Real feedback from businesses trusting MegaClick for their growth.
          </p>
        </div>

        {/* =========================================
            TESTIMONIAL CAROUSEL (Exact 1-Card Shift)
        ========================================== */}
        <div className="relative overflow-hidden w-full py-2">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{
              width: `${trackWidthPercent}%`,
              transform: `translateX(-${currentIndex * singleCardShiftPercent}%)`,
            }}
          >
            {testimonials.map((testimonial, index) => (
              <div
                key={`${testimonial.name}-${index}`}
                style={{
                  width: `${100 / testimonials.length}%`,
                }}
                className="px-2.5 shrink-0"
              >
                {/* UNIFORM CARD HEIGHT */}
                <div className="w-full h-[255px] sm:h-[265px]">
                  <TestimonialCard testimonial={testimonial} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* =========================================
            NAVIGATION BUTTONS
        ========================================== */}
        <div className="mt-8 flex justify-center items-center gap-4">
          <button
            type="button"
            onClick={goPrev}
            disabled={currentIndex === 0}
            aria-label="Previous testimonial"
            className="
              flex items-center justify-center
              w-11 h-11
              rounded-full
              border-2 border-[#0B4EA2]
              text-[#0B4EA2] bg-white
              hover:bg-[#0B4EA2] hover:text-white
              transition-all duration-200
              cursor-pointer
              shadow-sm
              disabled:opacity-30 disabled:cursor-not-allowed
              disabled:hover:bg-white disabled:hover:text-[#0B4EA2]
            "
          >
            <ChevronLeft size={21} />
          </button>

          <button
            type="button"
            onClick={goNext}
            disabled={currentIndex >= maxIndex}
            aria-label="Next testimonial"
            className="
              flex items-center justify-center
              w-11 h-11
              rounded-full
              border-2 border-[#0B4EA2]
              text-[#0B4EA2] bg-white
              hover:bg-[#0B4EA2] hover:text-white
              transition-all duration-200
              cursor-pointer
              shadow-sm
              disabled:opacity-30 disabled:cursor-not-allowed
              disabled:hover:bg-white disabled:hover:text-[#0B4EA2]
            "
          >
            <ChevronRight size={21} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;