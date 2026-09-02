import React, { useState, useRef } from "react";
import {
  MapPin,
  Quote,
  Star,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const testimonials = [
  // PAGE 1
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
  // PAGE 2
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
  // PAGE 3
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

const TOTAL_PAGES = 3; // 9 testimonials / 3 per page

const TestimonialCard = ({ testimonial }) => (
  <article
    className="
      relative flex flex-col
      rounded-2xl border border-gray-200
      bg-blue-50 p-5 sm:p-6
      shadow-sm h-full
    "
  >
    {/* QUOTE ICON */}
    <div className="absolute right-5 top-5 text-blue-400">
      <Quote size={20} />
    </div>

    {/* TOP */}
    <div className="flex-1">
      <div className="flex items-center gap-3">
        {/* AVATAR */}
        <div
          className="
            flex h-10 w-10 shrink-0 items-center justify-center
            rounded-full bg-blue-100 border border-blue-200
            text-base font-bold text-[#0B4EA2]
          "
          style={{ fontFamily: "'Inter', sans-serif" }}
        >
          {testimonial.name.charAt(0)}
        </div>

        {/* NAME / SERVICE / LOCATION */}
        <div className="min-w-0 pr-6">
          <h3
            style={{ fontFamily: "'Inter', sans-serif" }}
            className="truncate text-sm font-bold text-gray-900"
          >
            {testimonial.name}
          </h3>
          <p
            style={{ fontFamily: "'Inter', sans-serif" }}
            className="truncate text-xs font-semibold text-[#0B4EA2] mt-0.5"
          >
            {testimonial.service}
          </p>
          <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-0.5">
            <MapPin size={11} className="shrink-0 text-gray-400" />
            <span
              style={{ fontFamily: "'Inter', sans-serif" }}
              className="truncate"
            >
              {testimonial.location}
            </span>
          </div>
        </div>
      </div>

      {/* REVIEW */}
      <p
        style={{ fontFamily: "'Inter', sans-serif" }}
        className="mt-4 text-xs sm:text-sm text-gray-600 leading-relaxed"
      >
        "{testimonial.review}"
      </p>
    </div>

    {/* STARS */}
    <div className="mt-5 pt-3 border-t border-gray-100 flex items-center">
      <div className="flex shrink-0 gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={13}
            className="fill-green-500 stroke-green-500"
          />
        ))}
      </div>
    </div>
  </article>
);

const Testimonials = () => {
  const [page, setPage]           = useState(0); // 0, 1, 2
  const [direction, setDirection] = useState("next");
  const [animKey, setAnimKey]     = useState(0);
  const isAnimating               = useRef(false);

  const goTo = (newPage, dir) => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    setDirection(dir);
    setAnimKey((k) => k + 1);
    setPage(newPage);
    setTimeout(() => { isAnimating.current = false; }, 420);
  };

  const goPrev = () => {
    if (page === 0) return;
    goTo(page - 1, "prev");
  };

  const goNext = () => {
    if (page === TOTAL_PAGES - 1) return;
    goTo(page + 1, "next");
  };

  // 3 cards for current page
  const pageCards = testimonials.slice(page * 3, page * 3 + 3);

  return (
    <section className="w-full bg-white font-['Inter',sans-serif] overflow-hidden">
      <style>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(70px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-70px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .anim-next { animation: slideInRight 0.40s cubic-bezier(0.25,0.8,0.25,1) both; }
        .anim-prev { animation: slideInLeft  0.40s cubic-bezier(0.25,0.8,0.25,1) both; }

        @media (min-width: 1920px) {
          .test-container { max-width: 1800px !important; padding-left: 4rem !important; padding-right: 4rem !important; }
          .test-heading   { font-size: 3rem !important; }
          .test-sub       { font-size: 1.1rem !important; }
        }
        @media (min-width: 3840px) {
          .test-container { max-width: 3200px !important; padding-left: 6rem !important; padding-right: 6rem !important; }
          .test-heading   { font-size: 5rem !important; }
          .test-sub       { font-size: 2rem !important; }
        }
      `}</style>

      <div
        className="
          test-container
          max-w-[1380px] mx-auto
          px-4 sm:px-6 min-[1440px]:px-10
          py-10 sm:py-12 lg:py-16
          min-[1920px]:py-20 min-[3840px]:py-32
        "
      >
        {/* =========================================
            HEADING
        ========================================== */}
        <div className="mb-8 sm:mb-10 text-left">
          

          <br />

          <h2
            style={{ fontFamily: "'Hedvig Letters Serif', serif" }}
            className="
              test-heading
              text-2xl sm:text-3xl lg:text-4xl
              font-bold text-[#0B4EA2] leading-tight mt-2
            "
          >
            What Our Clients Say
          </h2>

          <p
            style={{ fontFamily: "'Inter', sans-serif" }}
            className="
              test-sub
              mt-2 max-w-xl
              text-sm sm:text-base text-gray-500 leading-relaxed
            "
          >
            Real feedback from businesses trusting MegaClick for their growth.
          </p>
        </div>

        {/* =========================================
            CARDS — DESKTOP (3 per page)
        ========================================== */}
        <div
          key={animKey}
          className={`
            hidden lg:grid grid-cols-3 gap-5 items-stretch
            ${direction === "next" ? "anim-next" : "anim-prev"}
          `}
        >
          {pageCards.map((t, i) => (
            <TestimonialCard key={`${t.name}-${i}`} testimonial={t} />
          ))}
        </div>

        {/* =========================================
            CARDS — TABLET (2 per page)
        ========================================== */}
        <div
          key={`tab-${animKey}`}
          className={`
            hidden sm:grid lg:hidden grid-cols-2 gap-5 items-stretch
            ${direction === "next" ? "anim-next" : "anim-prev"}
          `}
        >
          {pageCards.slice(0, 2).map((t, i) => (
            <TestimonialCard key={`${t.name}-${i}`} testimonial={t} />
          ))}
        </div>

        {/* =========================================
            CARDS — MOBILE (1 per page)
        ========================================== */}
        <div
          key={`mob-${animKey}`}
          className={`
            block sm:hidden
            ${direction === "next" ? "anim-next" : "anim-prev"}
          `}
        >
          <TestimonialCard testimonial={pageCards[0]} />
        </div>

        {/* =========================================
            NAVIGATION — ARROWS ONLY (no dots)
        ========================================== */}
        <div className="mt-8 flex justify-center items-center gap-4">
          <button
            type="button"
            onClick={goPrev}
            disabled={page === 0}
            aria-label="Previous testimonials"
            className="
              flex items-center justify-center
              w-10 h-10 rounded-full
              border-2 border-[#0B4EA2]
              text-[#0B4EA2] bg-white
              hover:bg-[#0B4EA2] hover:text-white
              transition-all duration-200 cursor-pointer shadow-sm
              disabled:opacity-30 disabled:cursor-not-allowed
              disabled:hover:bg-white disabled:hover:text-[#0B4EA2]
            "
          >
            <ChevronLeft size={20} />
          </button>

          <button
            type="button"
            onClick={goNext}
            disabled={page === TOTAL_PAGES - 1}
            aria-label="Next testimonials"
            className="
              flex items-center justify-center
              w-10 h-10 rounded-full
              border-2 border-[#0B4EA2]
              text-[#0B4EA2] bg-white
              hover:bg-[#0B4EA2] hover:text-white
              transition-all duration-200 cursor-pointer shadow-sm
              disabled:opacity-30 disabled:cursor-not-allowed
              disabled:hover:bg-white disabled:hover:text-[#0B4EA2]
            "
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;